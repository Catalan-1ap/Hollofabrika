import { GqlErrorCode, GqlErrors, GqlMutationResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { aql } from "arangojs";
import { DbMakeOrderToken } from "../../../infrastructure/types/dbTypes.js";
import { getMakeOrderTokensCollection, getOrdersCollection } from "../orders.setup.js";
import { Document } from "arangojs/documents.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";


export const confirmOrderMutation: GqlMutationResolvers<HollofabrikaContext>["confirmOrder"] =
    async (_, args, context) => {
        if (process.env.NODE_ENV === "production")
            roleGuard(context, GqlRole.Admin);

        const makeOrderTokensCollection = getMakeOrderTokensCollection(context.db);
        const makeOrderRequest = await querySingle<Document<DbMakeOrderToken & { createdAt: number }>>(context.db, aql`
            for doc in ${makeOrderTokensCollection} 
            filter doc._key == ${args.token}
            return doc
        `);

        if (!makeOrderRequest) {
            throw makeApplicationError(GqlErrors.ConfirmOrderOrderRequestNotExists, GqlErrorCode.NotFound);
        }

        const ordersCollection = getOrdersCollection(context.db);

        return await transaction(context.db, {
            write: [ordersCollection, makeOrderTokensCollection]
        }, async trx => {
            const newOrderId = await trx.step(() =>
                querySingle<string>(context.db,
                    aql`
                    insert ${{
                        ...makeOrderRequest.payload,
                        createdAt: makeOrderRequest.createdAt
                    }} in ${ordersCollection}
                    return NEW._id
                `)
            );
            await trx.step(() => querySingle<string>(context.db, aql`
                remove ${makeOrderRequest._key} in ${makeOrderTokensCollection}
            `));

            return {
                data: {
                    id: newOrderId
                }
            };
        });
    };