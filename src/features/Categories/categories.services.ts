import { getCategoriesCollection } from "./categories.setup.js";
import { querySingle } from "../../infrastructure/utils/arangoUtils.js";
import { Document } from "arangojs/documents.js";
import { DbCategory } from "../../infrastructure/types/dbTypes.js";
import { aql, Database } from "arangojs";


export async function queryCategory(db: Database, categoryName: string) {
    const categoriesCollection = getCategoriesCollection(db);
    const category = await querySingle<Document<DbCategory>>(db, aql`
			for doc in ${categoriesCollection}
			filter doc.name == ${categoryName}
			return doc
	`);

    return {
        category,
        categoriesCollection,
        isCategoryExists: !!category
    };
}