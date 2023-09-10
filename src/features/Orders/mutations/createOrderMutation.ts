import { GqlMutationResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { queryAll, querySingle } from "../../../infrastructure/utils/arangoUtils.js";
import { aql } from "arangojs";
import { getAllProductsView } from "../../Products/products.setup.js";
import { DbMakeOrderToken, DbOrderProduct } from "../../../infrastructure/types/dbTypes.js";
import { getMakeOrderTokensCollection } from "../orders.setup.js";
import { millisecondsToSeconds } from "../../../infrastructure/utils/dateTime.js";
import ms from "ms";
import { Document } from "arangojs/documents.js";


export const createOrderMutation: GqlMutationResolvers<HollofabrikaContext>["createOrder"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Standalone);

        const allProductsView = getAllProductsView(context.db);
        const { items: orderedProducts } = await queryAll<DbOrderProduct>(context.db, aql`
            for product in ${args.products}
            for productView in ${allProductsView}
            filter product.id == productView._id
            return {
                id: productView._id,
                price: productView.price,
                quantity: product.quantity
            }
        `);

        const makeOrderTokensCollection = getMakeOrderTokensCollection(context.db);
        const dbMakeOrderToken: DbMakeOrderToken = {
            payload: {
                userId: context.user.userId,
                totalSum: orderedProducts.reduce((prev, curr) => prev + (curr.price * curr.quantity), 0),
                date: new Date().toISOString(),
                products: orderedProducts
            }
        };
        const token = await querySingle<Document<DbMakeOrderToken> & { createdAt: number }>(context.db, aql`
            insert ${dbMakeOrderToken} into ${makeOrderTokensCollection}
            return NEW
        `);

        return {
            token: token._key,
            expiresIn: new Date((token.createdAt + millisecondsToSeconds(ms(process.env.MAKEORDER_TOKEN_EXPIRE!))) * 1000).toISOString()
        };
    };