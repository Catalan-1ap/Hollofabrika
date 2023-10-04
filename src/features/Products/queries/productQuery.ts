import { GqlErrorCode, GqlErrors, GqlProduct, GqlQueryResolvers } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/utils/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { makeCoversUrlsArango } from "../products.services.js";
import { getAllProductsView } from "../products.setup.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";


export const productQuery: GqlQueryResolvers<HollofabrikaContext>["product"] =
    async (_, args, context) => {
        const allProductsView = getAllProductsView(context.db);

        const categoriesCollection = getCategoriesCollection(context.db);
        const item = await querySingle<GqlProduct>(context.db, aql`
            for product in ${allProductsView}
            for category in ${categoriesCollection} 
            filter parse_identifier(product._id).collection == category.collectionName
            filter product._id == ${args.id}
            return {
                id: product._id,
                covers: ${makeCoversUrlsArango(context)},
                category: category.name,
                name: product.name,
                isSafeDeleted: product.isSafeDeleted,
                description: product.description,
                price: product.price,
                attributes: product.attributes
            }
        `);

        if (!item)
            throw makeApplicationError(GqlErrors.ProductProductNotExists, GqlErrorCode.NotFound);

        return item;
    };