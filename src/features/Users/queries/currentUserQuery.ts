import { anonymousGuard } from "../../../infrastructure/guards/authGuards.js";
import { GqlQueryResolvers } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getUsersCollection } from "../users.setup.js";


export const currentUserQuery: GqlQueryResolvers<HollofabrikaContext>["currentUser"] =
	async (_, args, context) => {
		anonymousGuard(context);

		const usersCollection = getUsersCollection(context.db);

		return await usersCollection.document(context.user.userId);
	};