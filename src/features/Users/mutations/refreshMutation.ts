import { aql } from "arangojs";
import { querySingle } from "../../../infrastructure/utils/arangoUtils.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { GqlErrorCode, GqlErrors, GqlMutationResolvers } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { decodeToken, generateRefreshTokenExpirationDate, generateTokens } from "../users.services.js";
import { getRefreshTokensCollection } from "../users.setup.js";


export const refreshMutation: GqlMutationResolvers<HollofabrikaContext>["refresh"] =
	async (_, args, context) => {
		const payload = decodeToken(args.token);

		if (!payload)
			throw makeApplicationError(GqlErrors.RefreshWrongTokenError, GqlErrorCode.BadRequest);

		const refreshTokensCollection = getRefreshTokensCollection(context.db);

		const isTokenDeleted = await querySingle<boolean>(context.db, aql`
			for doc in ${refreshTokensCollection}
			filter doc.token == ${args.token}
			remove doc in ${refreshTokensCollection}
			return true
		`);
		if (!isTokenDeleted)
			throw makeApplicationError(GqlErrors.RefreshUsedTokenError, GqlErrorCode.BadRequest);

		const tokens = generateTokens({
			userId: payload.userId,
			role: payload.role
		});

		await refreshTokensCollection.save({
			token: tokens.refresh,
			userId: payload.userId,
			expireAt: generateRefreshTokenExpirationDate()
		});

		return {
			access: tokens.access,
			refresh: tokens.refresh
		};
	};