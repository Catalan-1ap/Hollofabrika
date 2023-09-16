import { GqlOrder, GqlQueryResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getAllProductsView } from "../../Products/products.setup.js";
import { defaultPageSize } from "../../../infrastructure/constants.js";
import { aql } from "arangojs";
import { getCategoriesCollection } from "../../Categories/categories.setup.js";
import { queryAll } from "../../../infrastructure/utils/arangoUtils.js";
import { makeCoversUrls } from "../../Products/products.services.js";
import { getAllOrdersView } from "../orders.setup.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import ms from "ms";
import { millisecondsToSeconds } from "../../../infrastructure/utils/dateTime.js";
import { getUsersCollection } from "../../Users/users.setup.js";


export const ordersQuery: GqlQueryResolvers<HollofabrikaContext>["orders"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Standalone);

        args.input ||= {};
        args.input.pageData ||= {
            page: 1,
            pageSize: defaultPageSize
        };

        const isAdminRequestAllOrdersFilter = context.user.role === GqlRole.Admin && args.input.isAdmin
            ? aql``
            : aql`filter order.userId == ${context.user.userId}`;

        const usersCollection = getUsersCollection(context.db);
        const returnUserDataForAdmin = context.user.role === GqlRole.Admin && args.input.isAdmin
            ? aql``
            : aql`user: (
                for user in ${usersCollection}
                filter user.id == order.userId
                return {
                    username: user.username,
                    email: user.email
                }
            ),`;

        const onlyMyOrdersWhenIAmStandaloneFilter = context.user.role === GqlRole.Standalone
            ? aql`filter order.userId == ${context.user.userId}`
            : aql``;

        const onlyWithSelectedOrdersTokensFilter = args.input.orderTokens?.length! > 0
            ? aql`filter order._key in ${args.input.orderTokens}`
            : aql``;

        const onlyWithSelectedOrdersIdsFilter = args.input.orderIds?.length! > 0
            ? aql`filter order._id in ${args.input.orderIds}`
            : aql``;

        const onlyWithSelectedUsersIdsFilter = args.input.usersIds?.length! > 0
            ? aql`filter order.userId in ${args.input.usersIds}`
            : aql``;

        const onlyWithSelectedProductsIdsFilter = args.input.productsIds?.length! > 0
            ? aql`filter order.products[* return CURRENT.id] all in ${args.input.productsIds}`
            : aql``;

        const dateFilter = Object.keys(args.input.datePeriod ?? {}).length > 0
            ? aql`filter 
                ${args.input.datePeriod?.from ? aql`DATE_DIFF(order.date, ${args.input.datePeriod?.from}, "s") < 0` : aql``}
                ${args.input.datePeriod?.from && args.input.datePeriod?.to ? aql` and ` : aql``}
                ${args.input.datePeriod?.to ? aql`DATE_DIFF(order.date, ${args.input.datePeriod?.to}, "s") > 0` : aql``}`
            : aql``;

        const isCompletedFilter = args.input.isCompleted !== undefined
            ? aql`filter isCompleted == ${args.input.isCompleted}`
            : aql``;

        const allProductsView = getAllProductsView(context.db);
        const categoriesCollection = getCategoriesCollection(context.db);
        const allOrdersView = getAllOrdersView(context.db);

        const query = aql`
            for doc in ${allOrdersView}
            let order = doc.payload ? MERGE(doc.payload, {
                _key: doc._key, 
                _id: doc._id, 
                createdAt: doc.createdAt
            }) : doc
            let isCompleted = doc.payload ? false : true
            ${isCompletedFilter}
            ${isAdminRequestAllOrdersFilter}
            ${onlyMyOrdersWhenIAmStandaloneFilter}
            ${onlyWithSelectedOrdersTokensFilter}
            ${onlyWithSelectedOrdersIdsFilter}
            ${dateFilter}
            ${onlyWithSelectedUsersIdsFilter}
            ${onlyWithSelectedProductsIdsFilter}
            let products = (
                for orderProduct in order.products
                for product in ${allProductsView}
                filter orderProduct.id == product._id
                return MERGE(product, { 
                    buyedWithPrice: orderProduct.price, 
                    quantity : orderProduct.quantity
                })
            )
            limit ${args.input.pageData.pageSize * (args.input.pageData.page - 1)}, ${args.input.pageData.pageSize}
            sort order.date desc
            return {
                id: order._id,
                isCompleted: isCompleted,
                confirmCode: doc.payload ? order._key : null,
                expiresIn: doc.payload ? DATE_ISO8601((doc.createdAt + ${millisecondsToSeconds(ms(process.env.MAKEORDER_TOKEN_EXPIRE!))}) * 1000) : null,
                ${returnUserDataForAdmin}
                totalSum: order.totalSum,
                date: order.date,
                createdIn: order.createdIn,
                products: (
                    for product in products
                    for category in ${categoriesCollection}
                    filter parse_identifier(product._id).collection == category.collectionName
                    return {
                        id: product._id,
                        covers: ${makeCoversUrls(context)},
                        category: category.name,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        buyedWithPrice: product.buyedWithPrice,
                        quantity: product.quantity,
                        attributes: product.attributes
                    }
                )
            }
        `;
        console.log(`OrderQuery — `, query);
        const { items, depletedCursor } = await queryAll<GqlOrder>(context.db, query, {});

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