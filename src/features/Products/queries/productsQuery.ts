import { GqlFilterLogic, GqlProduct, GqlQueryResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { queryAll } from "../../../infrastructure/utils/arangoUtils.js";
import { aql } from "arangojs";
import { defaultPageSize } from "../../../infrastructure/constants.js";
import { makeCoversUrls } from "../products.services.js";
import { getAllProductsView } from "../products.setup.js";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";


export const productsQuery: GqlQueryResolvers<HollofabrikaContext>["products"] =
    async (_, args, context) => {
        const allProductsView = getAllProductsView(context.db);

        args.input ||= {};
        args.input.pageData ||= {
            page: 1,
            pageSize: defaultPageSize
        };

        const isAdminRequestAllProductsFilter = context.user?.role === GqlRole.Admin && args.input.isAdmin
            ? aql``
            : aql`filter product.isSafeDeleted == false`;

        const filterByIds = args.input.ids?.length! > 0
            ? aql`filter product._id in ${args.input.ids}`
            : aql``;

        const categoriesCollection = getCategoriesCollection(context.db);
        const joinCategory = args.input.categories?.length! > 0
            ? aql`
                for category in ${categoriesCollection} 
                filter category.name in ${args.input.categories}`
            : aql`
                for category in ${categoriesCollection}`;

        const filterWithFilters = args.input.filter?.attributes && args.input.filter?.logic
            ? aql`filter product.attributes ${
                args.input.filter.logic === GqlFilterLogic.Or
                    ? aql`any`
                    : aql`all`
            } in ${args.input.filter.attributes}`
            : aql``;

        const { items, depletedCursor } = await queryAll<GqlProduct>(context.db, aql`
            for product in ${allProductsView}
            ${joinCategory}
            filter parse_identifier(product._id).collection == category.collectionName
            ${isAdminRequestAllProductsFilter}
            ${filterByIds}
            ${filterWithFilters}
            limit ${args.input.pageData.pageSize * (args.input.pageData.page - 1)}, ${args.input.pageData.pageSize}
            return {
                id: product._id,
                covers: ${makeCoversUrls(context)},
                category: category.name,
                name: product.name,
                isSafeDeleted: product.isSafeDeleted,
                description: product.description,
                price: product.price,
                attributes: product.attributes
            }
        `, { fullCount: true });

        return {
            pageData: {
                ...args.input.pageData,
                totalPages: depletedCursor.extra.stats?.fullCount! > args.input.pageData.pageSize
                    ? Math.ceil(depletedCursor.extra.stats?.fullCount! / args.input.pageData.pageSize)
                    : 1
            },
            items: items
        };
    };