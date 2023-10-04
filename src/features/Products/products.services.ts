import { aql } from "arangojs";
import { HollofabrikaContext } from "../../infrastructure/hollofabrikaContext.js";
import { productsCoversPath, productsCoversWebPath } from "./productsConstants.js";
import { DbCategory, DbProductAttribute } from "../../infrastructure/types/dbTypes.js";
import path from "path";
import fs from "fs/promises";


export function makeCoversUrlsArango(context: HollofabrikaContext) {
    return aql`
        length(product.coversFileNames) > 0 
        ? reverse(product.coversFileNames)[* return concat_separator("/", 
            ${context.koaContext.origin}, 
            ${productsCoversWebPath}, 
            CURRENT
          )]
        : [concat_separator("/", 
            ${context.koaContext.origin}, 
            ${productsCoversWebPath}, 
            ${process.env.SERVER_STATIC_FALLBACK_FILENAME}
        )]
    `;
}


export function makeCoversUrlsLocal(coversFileNames: string[], context: HollofabrikaContext) {
    const results: string[] = [];

    for (const coversFileName of coversFileNames) {
        results.push(`${context.koaContext.origin}/${productsCoversWebPath}/${coversFileName}`);
    }

    return results;
}


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