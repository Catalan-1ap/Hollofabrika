import { GqlErrorCode, GqlErrors, GqlMutationResolvers, GqlRole } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { roleGuard } from "../../../infrastructure/guards/authGuards.js";
import { makeApplicationError } from "../../../infrastructure/formatErrorHandler.js";
import { queryCategory } from "../categories.services.js";
import { querySingle, transaction } from "../../../infrastructure/utils/arangoUtils.js";
import { aql } from "arangojs";
import { DbCategory } from "../../../infrastructure/types/dbTypes.js";


export const updateCategoryMutation: GqlMutationResolvers<HollofabrikaContext>["updateCategory"] =
    async (_, args, context) => {
        roleGuard(context, GqlRole.Admin);

        const {
            categoriesCollection,
            category,
            isCategoryExists
        } = await queryCategory(context.db, args.originalName);
        if (!isCategoryExists)
            throw makeApplicationError(GqlErrors.UpdateCategoryCategoryNotExists, GqlErrorCode.NotFound);

        const categoryToUpdate: Partial<DbCategory> = {
            name: args.newName
        };

        return await transaction(context.db, {
            exclusive: [categoriesCollection]
        }, async trx => {
            const afterUpdate = await trx.step(() =>
                querySingle(context.db, aql`
                    update ${category}
                    with ${categoryToUpdate} in ${categoriesCollection}
                    options { ignoreRevs: false }
                    return NEW
                `)
            );

            return {
                data: {
                    name: afterUpdate.name,
                    attributes: afterUpdate.attributes
                }
            };
        });
    };