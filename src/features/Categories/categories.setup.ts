import { Database } from "arangojs";
import { DbCategory } from "../../infrastructure/types/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getCategoriesCollection = (db: Database) =>
    db.collection<DbCategory>("categories");


const setup: SetupHandler = async (db) => {
    const categoriesCollection = getCategoriesCollection(db);
    if (!await categoriesCollection.exists())
        await categoriesCollection.create();
};

export default setup;