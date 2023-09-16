import {
    GqlErrorCode,
    GqlErrors,
    GqlMutationResolvers,
    GqlRole,
    Scalars
} from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { parseIdentifier, querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory, DbProduct } from "../../../infrastructure/types/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { addAttributes, saveCovers } from "./createProductMutation.js";
import { TransactionRecovery } from "../../../infrastructure/transactionRecovery.js";
import { removeAttributes, removeCovers } from "../products.services.js";


export const updateProductMutation: GqlMutationResolvers<HollofabrikaContext>["updateProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const { collection, key } = parseIdentifier(args.id);
        const productToInsert: Partial<DbProduct> = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes,
            coversFileNames: [],
            isSafeDeleted: args.product.isSafeDeleted
        };
        const productsCollection = context.db.collection(collection);
        const categoriesCollection = getCategoriesCollection(context.db);

        const oldProduct = await querySingle<Document<DbProduct>>(context.db, aql`
            for doc in ${productsCollection}
            filter doc._key == ${key}
            return doc
        `);

        if (!oldProduct)
            throw makeApplicationError(GqlErrors.UpdateProductProductNotExists, GqlErrorCode.NotFound);

        const category = await querySingle<Document<DbCategory>>(context.db, aql`
            for doc in ${categoriesCollection}
            filter doc.collectionName == ${collection}
            return doc
        `);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const { updatedCovers, updateCoversResult } = await updateCovers(
                oldProduct,
                args.product.covers ?? [],
                args.product.coversNamesToDelete
            );
            productToInsert.coversFileNames = updatedCovers;

            const result = await trx.step(() =>
                querySingle<{
                    beforeUpdate: Document<DbProduct>,
                    afterUpdate: Document<DbProduct>
                }>(context.db, aql`
                    update ${key} with ${productToInsert} in ${productsCollection}
                    options { ignoreErrors: true, waitForSync: true }
                    return { beforeUpdate: OLD, afterUpdate: NEW }
                `)
            );

            if (productToInsert.attributes) {
                removeAttributes(category, result.beforeUpdate.attributes);
                addAttributes(category, result.afterUpdate.attributes);

                await trx.step(() => context.db.query(aql`
                    update ${category}
                    with ${category} in ${categoriesCollection}
                    options { ignoreRevs: false, waitForSync: true }
                `));
            }

            return {
                data: {
                    id: result.afterUpdate._id,
                    covers: result.afterUpdate.coversFileNames,
                    category: category.name,
                    description: result.afterUpdate.description,
                    name: result.afterUpdate.name,
                    price: result.afterUpdate.price,
                    isSafeDeleted: result.afterUpdate.isSafeDeleted,
                    attributes: result.afterUpdate.attributes
                },
                recoveryActions: new TransactionRecovery().mergeAll([
                    updateCoversResult.transactionRecovery
                ])
            };
        });
    };


async function updateCovers(
    oldProduct: DbProduct,
    newCovers: Scalars["Upload"][],
    coversNamesToDelete?: string[]
) {
    await removeCovers(oldProduct
        .coversFileNames
        .filter(x => coversNamesToDelete?.includes(x))
    );

    const saveCoversResult = await saveCovers(newCovers);
    const updatedCovers: string[] = [];

    updatedCovers.push(...saveCoversResult.coversFileNames);

    const untouchedExistedCovers = oldProduct
        .coversFileNames
        .filter(x => !coversNamesToDelete?.includes(x));
    updatedCovers.push(...untouchedExistedCovers);

    return {
        updatedCovers,
        updateCoversResult: saveCoversResult
    };
}