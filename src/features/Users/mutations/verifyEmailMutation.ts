import { aql } from "arangojs";
import { DbRegisterToken } from "../../../infrastructure/types/dbTypes.js";
import { querySingle } from "../../../infrastructure/utils/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import {
    GqlErrorCode,
    GqlErrors,
    GqlMutationResolvers,
    GqlRole,
    GqlSuccessCode
} from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getRegisterTokensCollection, getUsersCollection } from "../users.setup.js";


export const verifyEmailMutation: GqlMutationResolvers<HollofabrikaContext>["verifyEmail"] =
    async (_, args, context) => {
        const registerTokensCollection = getRegisterTokensCollection(context.db);

        const registerToken = await querySingle<DbRegisterToken>(context.db, aql`
			for doc in ${registerTokensCollection}
			filter doc._key == ${args.emailToken}
			remove doc in ${registerTokensCollection}
			return OLD
		`);
        if (!registerToken)
            throw makeApplicationError(GqlErrors.VerifyEmailWrongToken, GqlErrorCode.BadRequest);

        const usersCollection = getUsersCollection(context.db);

        await usersCollection.save({
            ...registerToken.payload,
            role: GqlRole.Standalone
        });

        return {
            code: GqlSuccessCode.Oke
        };
    };