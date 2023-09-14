import { GqlErrorCode, GqlErrors, GqlMutationResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { aql } from "arangojs";
import { parseIdentifier, querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { DbCategory, DbProduct, DbProductAttribute } from "../../../infrastructure/types/dbTypes.js";
import { Document } from "arangojs/documents.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import path from "path";
import fs from "fs/promises";
import { productsCoversPath } from "../productsConstants.js";


export const deleteProductMutation: GqlMutationResolvers<HollofabrikaContext>["deleteProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const identifier = parseIdentifier(args.id);
        const productsCollection = context.db.collection(identifier.collection);
        const categoriesCollection = getCategoriesCollection(context.db);

        const oldProduct = await querySingle<Document<DbProduct>>(context.db, aql`
            for doc in ${productsCollection}
            filter doc._key == ${identifier.key}
            return doc
        `);

        if (!oldProduct)
            throw makeApplicationError(GqlErrors.DeleteProductProductNotExists, GqlErrorCode.NotFound);

        const category = await querySingle<Document<DbCategory>>(context.db, aql`
            for doc in ${categoriesCollection}
            filter doc.collectionName == ${identifier.collection}
            return doc
        `);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            await trx.step(() => querySingle<Document<DbProduct>>(context.db, aql`
                remove ${oldProduct} in ${productsCollection}
                options { ignoreRevs: false }
            `));

            await removeCovers(oldProduct.coversFileNames);

            removeAttributes(category, oldProduct.attributes);

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: oldProduct._id,
                    covers: oldProduct.coversFileNames,
                    category: category.name,
                    description: oldProduct.description,
                    name: oldProduct.name,
                    price: oldProduct.price,
                    attributes: oldProduct.attributes
                }
            };
        });
    };


export function removeAttributes(category: DbCategory, attributes: DbProductAttribute[]) {
    for (let attribute of attributes) {
        const categoryAttributeIndex = category.attributes
            .findIndex(x => x.name === attribute.name && x.value === attribute.value);
        const categoryAttribute = category.attributes[categoryAttributeIndex];

        if (!categoryAttribute)
            continue;

        categoryAttribute.count--;

        if (categoryAttribute.count <= 0)
            category.attributes.splice(categoryAttributeIndex, 1);
    }
}


export async function removeCovers(coversFileNames: string[]) {
    for (const coverFileName of coversFileNames) {
        const coverPath = path.join(productsCoversPath, coverFileName);
        await fs.unlink(coverPath);
    }
}