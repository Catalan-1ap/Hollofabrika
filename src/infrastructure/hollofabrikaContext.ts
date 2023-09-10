import { ContextFunction } from "@apollo/server";
import { KoaContextFunctionArgument } from "@as-integrations/koa/src";
import { Database } from "arangojs";
import { tryAuthorizeWithJwtBearer } from "../features/JwtAuth/tryAuthorizeWithJwtBearer.js";
import { JwtPayload } from "../features/Users/users.services.js";
import { connectToDb } from "./setups.js";
import { Context } from "koa";


export interface HollofabrikaContext {
    db: Database,
    user?: JwtPayload,
    koaContext: Context
}

export const contextHandler: ContextFunction<[KoaContextFunctionArgument], HollofabrikaContext> =
    async ({ ctx }): Promise<HollofabrikaContext> => {
        const contextValue: HollofabrikaContext = {
            db: await connectToDb(),
            koaContext: ctx
        };

        const authorizationHeader = ctx.headers.authorization;

        if (authorizationHeader) {
            const [authType, authToken] = authorizationHeader.split(" ");

            switch (authType) {
                case "Bearer":
                    contextValue.user = await tryAuthorizeWithJwtBearer(authToken);
                    break;
            }
        }

        return contextValue;
    };