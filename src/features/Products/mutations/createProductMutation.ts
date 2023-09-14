import {
    GqlErrorCode,
    GqlErrors,
    GqlMutationResolvers,
    GqlRole,
    Scalars
} from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { queryCategory } from "../../Categories/categories.services.js";
import { DbCategory, DbProduct, DbProductAttribute } from "../../../infrastructure/types/dbTypes.js";
import { aql } from "arangojs";
import { querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { TransactionRecovery } from "../../../infrastructure/transactionRecovery.js";
import { Document } from "arangojs/documents.js";
import { nanoid } from "nanoid";
import path from "path";
import { productsCoversPath } from "../productsConstants.js";
import fs from "fs";
import { catcherDeleteFile, finalizeWritableStream } from "../../../infrastructure/utils/filesUtils.js";
import { pipeline } from "stream/promises";


export const createProductMutation: GqlMutationResolvers<HollofabrikaContext>["createProduct"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            category,
            categoriesCollection,
            isCategoryExists
        } = await queryCategory(context.db, args.category);
        if (!isCategoryExists)
            throw makeApplicationError(GqlErrors.CreateProductCategoryNotExists, GqlErrorCode.NotFound);

        const productToInsert: Required<DbProduct> = {
            name: args.product.name,
            price: args.product.price,
            description: args.product.description,
            attributes: args.product.attributes,
            isSafeDeleted: false,
            coversFileNames: []
        };
        addAttributes(category, productToInsert.attributes);
        const productsCollection = context.db.collection<DbProduct>(category.collectionName);

        const saveCoversResult = await saveCovers(args.product.covers ?? []);
        productToInsert.coversFileNames.push(...saveCoversResult.coversFileNames);

        return await transaction(context.db, {
            write: [productsCollection],
            exclusive: [categoriesCollection]
        }, async trx => {
            const newProduct = await trx.step(() =>
                querySingle<Document<DbProduct>>(context.db, aql`
                    insert ${productToInsert} in ${productsCollection}
                    options { ignoreErrors: true }
                    return NEW
                `)
            );

            await trx.step(() => context.db.query(aql`
                update ${category}
                with ${category} in ${categoriesCollection}
                options { ignoreRevs: false }
            `));

            return {
                data: {
                    id: newProduct._id,
                    covers: newProduct.coversFileNames,
                    category: category.name,
                    description: newProduct.description,
                    name: newProduct.name,
                    price: newProduct.price,
                    isSafeDeleted: newProduct.isSafeDeleted,
                    attributes: newProduct.attributes
                },
                recoveryActions: new TransactionRecovery().mergeAll([
                    saveCoversResult.transactionRecovery
                ])
            };
        });
    };


export function addAttributes(category: DbCategory, attributes: DbProductAttribute[]) {
    for (let attribute of attributes) {
        const categoryAttribute = category.attributes
            .find(x => x.name === attribute.name && x.value === attribute.value);

        if (categoryAttribute) {
            categoryAttribute.count++;
            continue;
        }

        category.attributes.push({
            ...attribute,
            count: 1
        });
    }
}


export async function saveCovers(covers: Scalars["Upload"][]) {
    const transactionRecovery = new TransactionRecovery();
    const coversFileNames: string[] = [];

    for (const cover of covers) {
        const result = await saveProductCover(cover.file);

        coversFileNames.push(result.coverName);

        transactionRecovery.merge(result.transactionRecovery);
    }

    return {
        coversFileNames,
        transactionRecovery
    };
}


async function saveProductCover(file: Scalars["Upload"]["file"], coverName?: string) {
    const coverFile = await file;

    coverName ??= `${nanoid()}${path.extname(coverFile?.filename ?? "somethingwentwrong")}`;
    const transactionRecovery = new TransactionRecovery();

    const coverPath = path.join(productsCoversPath, coverName);
    const localCoverStream = fs.createWriteStream(coverPath);

    transactionRecovery.merge(new TransactionRecovery({
        finalizers: [finalizeWritableStream(localCoverStream)],
        catchers: [catcherDeleteFile(coverPath)]
    }));

    await pipeline(coverFile.createReadStream(), localCoverStream);

    return {
        coverName: coverName,
        transactionRecovery
    };
}