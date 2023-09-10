import { GqlQueryCategory, GqlQueryResolvers } from "../../../infrastructure/types/gqlTypes.js";
import { HollofabrikaContext } from "../../../infrastructure/hollofabrikaContext.js";
import { getCategoriesCollection } from "../categories.setup.js";
import { queryAll } from "../../../infrastructure/utils/arangoUtils.js";
import { aql } from "arangojs";


export const categoriesQuery: GqlQueryResolvers<HollofabrikaContext>["categories"] =
    async (_, args, context) => {
        const categoriesCollection = getCategoriesCollection(context.db);

        const { items } = await queryAll<GqlQueryCategory>(context.db, aql`
            for doc in ${categoriesCollection}
            let attributes = (
                for attr in doc.attributes
                collect name = attr.name into groups = {
                    value: attr.value,
                    count: attr.count
                }
                return {
                    name: name,
                    values: groups
                }
            )
            return {
                name: doc.name,
                attributes: attributes
            }
        `);

        return items;
    };