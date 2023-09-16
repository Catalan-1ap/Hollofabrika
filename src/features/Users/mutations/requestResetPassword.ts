import {
    GqlErrorCode,
    GqlErrors,
    GqlMutationResolvers,
    GqlSuccessCode
} from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbPasswordResetToken, DbUser } from "../../../infrastructure/types/dbTypes.js";
import { aql } from "arangojs";
import { getPasswordResetTokensCollection, getUsersCollection } from "../users.setup.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { mailSender } from "../../../infrastructure/mailSender.js";


export const requestResetPasswordMutation: GqlMutationResolvers<HollofabrikaContext>["requestResetPassword"] =
    async (_, args, context) => {
        const usersCollection = getUsersCollection(context.db);

        const user = await querySingle<Document<DbUser>>(context.db, aql`
			for doc in ${usersCollection}
			filter doc.email == ${args.email}
			return doc
		`);
        if (!user)
            throw makeApplicationError(GqlErrors.RequestResetPasswordWrongEmailError, GqlErrorCode.BadRequest);

        const passwordResetTokensCollection = getPasswordResetTokensCollection(context.db);
        const token: DbPasswordResetToken = {
            payload: {
                email: user.email
            }
        };

        return await transaction(context.db, {
            write: [passwordResetTokensCollection]
        }, async trx => {
            const createdToken = trx.step(() => querySingle<Document<DbPasswordResetToken>>(context.db, aql`
			    insert ${token} into ${passwordResetTokensCollection}
			    return NEW
		    `));

            if (process.env.NODE_ENV === "production") {
                try {
                    await mailSender.sendMail({
                        subject: "Reset Password",
                        to: args.email,
                        text: `
Hello, ${user.username}!
				    
To reset your password, please use this key
				    
${createdToken._key}`
                    });
                } catch (e) {
                    console.error(e);
                    throw makeApplicationError(GqlErrors.RequestResetEmailSendingError, GqlErrorCode.InternalError);
                }
            }

            return {
                data: {
                    code: GqlSuccessCode.Oke
                }
            };
        });
    };