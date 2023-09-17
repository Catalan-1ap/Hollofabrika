import {
    GqlErrorCode,
    GqlErrors,
    GqlMutationResolvers,
    GqlSuccessCode
} from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getPasswordResetTokensCollection, getUsersCollection } from "../users.setup.js";
import { querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbPasswordResetToken, DbUser } from "../../../infrastructure/types/dbTypes.js";
import { aql } from "arangojs";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { hashPassword } from "../users.services.js";


export const confirmResetPasswordMutation: GqlMutationResolvers<HollofabrikaContext>["confirmResetPassword"] =
    async (_, args, context) => {
        const passwordResetTokensCollection = getPasswordResetTokensCollection(context.db);

        const passwordResetRequest = await querySingle<Document<DbPasswordResetToken>>(context.db, aql`
			for doc in ${passwordResetTokensCollection}
			filter doc._key == ${args.token}
			return doc
		`);
        if (!passwordResetRequest)
            throw makeApplicationError(GqlErrors.RequestResetPasswordWrongToken, GqlErrorCode.BadRequest);

        const usersCollection = getUsersCollection(context.db);

        return await transaction(context.db, {
            write: [passwordResetTokensCollection, usersCollection]
        }, async trx => {
            const updatedPassword: Pick<DbUser, "passwordHash"> = {
                passwordHash: await hashPassword(args.password)
            };

            await trx.step(() =>
                querySingle(context.db, aql`
                    for doc in ${usersCollection}
                    filter doc.email == ${passwordResetRequest.payload.email}
                    update doc with ${updatedPassword} in ${usersCollection}
                `)
            );
            await trx.step(() =>
                querySingle<Document<DbPasswordResetToken>>(context.db, aql`
			        for doc in ${passwordResetTokensCollection}
			        filter doc.payload.email == ${passwordResetRequest.payload.email}
			        remove doc in ${passwordResetTokensCollection}
		        `)
            );

            return {
                data: {
                    code: GqlSuccessCode.Oke
                }
            };
        });
    };