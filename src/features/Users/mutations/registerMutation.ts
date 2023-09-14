import { aql } from "arangojs";
import { DbRegisterToken, DbUser } from "../../../infrastructure/types/dbTypes.js";
import { querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import {
    GqlErrorCode,
    GqlErrors,
    GqlMutationRegisterArgs,
    GqlMutationResolvers,
    GqlSuccessCode,
    GqlUser
} from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { mailSender } from "../../../infrastructure/mailSender.js";
import { hashPassword } from "../users.services.js";
import { getRegisterTokensCollection, getUsersCollection } from "../users.setup.js";
import { Document } from "arangojs/documents.js";


export const registerMutation: GqlMutationResolvers<HollofabrikaContext>["register"] =
    async (_, args, context) => {
        const usersCollection = getUsersCollection(context.db);
        const registerTokensCollection = getRegisterTokensCollection(context.db);

        const existedUser = await querySingle<DbUser>(context.db, aql`
			for doc in ${usersCollection}
			filter doc.username == ${args.username} or doc.email == ${args.email}
			return doc
		`);

        if (existedUser)
            throwIfFieldsAreDuplicated(existedUser, args);

        const hash = await hashPassword(args.password);

        const registerTemporalToken: DbRegisterToken = {
            ...(process.env.NODE_ENV === "development" && { _key: "111111" }),
            payload: {
                username: args.username,
                email: args.email,
                passwordHash: hash
            },
        };

        return await transaction(context.db, {
            write: [registerTokensCollection]
        }, async trx => {
            const createdToken = await trx.step(() =>
                querySingle<Document<DbRegisterToken>>(context.db, aql`
		    	    upsert ${{ payload: { username: args.username, email: args.email } }}
		    	    insert ${registerTemporalToken}
		    	    update ${registerTemporalToken} IN ${registerTokensCollection}
		    	    return NEW
		        `)
            );

            if (process.env.NODE_ENV === "production") {
                try {
                    await mailSender.sendMail({
                        subject: "Email Confirmation",
                        to: args.email,
                        text: `
Hello, ${args.username}!
				    
To verify your e-mail address, please use this key
				    
${createdToken._key}`
                    });
                } catch (e) {
                    console.error(e);
                    throw makeApplicationError(GqlErrors.RegisterEmailWrong, GqlErrorCode.InternalError);
                }
            }

            return {
                data: {
                    code: GqlSuccessCode.Oke
                }
            };
        });
    };


function throwIfFieldsAreDuplicated(user: DbUser, args: GqlMutationRegisterArgs) {
    const fieldsToCheck = [
        { name: "username", message: GqlErrors.RegisterUsernameInUseError },
        { name: "email", message: GqlErrors.RegisterEmailInUseError }
    ] satisfies {
        name: keyof GqlUser,
        message: string
    }[];

    for (let field of fieldsToCheck) {
        const origin = user[field.name];

        if (origin === args[field.name])
            throw makeApplicationError(field.message, GqlErrorCode.BadRequest);
    }
}