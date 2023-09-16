import { GqlErrorCode, GqlErrors, GqlMutationResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { parseIdentifier, querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { Document } from "arangojs/documents.js";
import { DbCategory, DbProduct } from "../../../infrastructure/types/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { addAttributes } from "./createProductMutation.js";
import { queryCategory } from "../../Categories/categories.services.js";
import { removeAttributes } from "../products.services.js";


export const changeCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["changeCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const identifier = parseIdentifier(args.id);
        const oldCategoryProducts = context.db.collection(identifier.collection);
        const product = await querySingle<Document<DbProduct>>(context.db, aql`
            for doc in ${oldCategoryProducts}
            filter doc._key == ${identifier.key}
            return doc
        `);
        if (!product)
            throw makeApplicationError(GqlErrors.ChangeCategoryProductNotExists, GqlErrorCode.NotFound);

        const categoriesCollection = getCategoriesCollection(context.db);
        const { category: newCategory } = await queryCategory(context.db, args.category);
        if (!newCategory)
            throw makeApplicationError(GqlErrors.ChangeCategoryNewCategoryNotExists, GqlErrorCode.NotFound);

        const newCategoryProducts = context.db.collection(newCategory.collectionName);

        const oldCategory = await querySingle<Document<DbCategory>>(context.db, aql`
            for doc in ${categoriesCollection}
            filter doc.collectionName == ${identifier.collection}
            return doc
        `);

        if (newCategory.name === oldCategory.name)
            throw makeApplicationError(GqlErrors.ChangeCategoryCategoriesAreSame, GqlErrorCode.BadRequest);

        return await transaction(context.db, {
            write: [oldCategoryProducts, newCategoryProducts],
            exclusive: [categoriesCollection]
        }, async trx => {
            removeAttributes(oldCategory, product.attributes);
            addAttributes(newCategory, product.attributes);

            await trx.step(() => querySingle<Document<DbProduct>>(context.db, aql`
                remove ${product} in ${oldCategoryProducts}
                options { ignoreErrors: true, ignoreRevs: false, waitForSync: true }
            `));
            const productToInsert: Required<DbProduct> = {
                name: product.name,
                price: product.price,
                description: product.description,
                attributes: product.attributes,
                isSafeDeleted: false,
                coversFileNames: product.coversFileNames
            };
            const newProduct = await trx.step(() => querySingle<Document<DbProduct>>(context.db, aql`
                insert ${productToInsert} in ${newCategoryProducts}
                options { ignoreErrors: true, waitForSync: true }
                return NEW
            `));

            await trx.step(() => context.db.query(aql`
                update ${oldCategory}
                with ${oldCategory} in ${categoriesCollection}
                options { ignoreRevs: false, waitForSync: true }
            `));
            await trx.step(() => context.db.query(aql`
                update ${newCategory}
                with ${newCategory} in ${categoriesCollection}
                options { ignoreRevs: false, waitForSync: true }
            `));

            return {
                data: {
                    id: newProduct._id,
                    covers: newProduct.coversFileNames,
                    category: newCategory.name,
                    description: newProduct.description,
                    name: newProduct.name,
                    price: newProduct.price,
                    isSafeDeleted: newProduct.isSafeDeleted,
                    attributes: newProduct.attributes
                }
            };
        });
    };