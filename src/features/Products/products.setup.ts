import { Database } from "arangojs";
import { DbProduct } from "../../infrastructure/types/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";


export const getProductsCollection = (db: Database, name: string) =>
    db.collection<DbProduct>(`products-${name}`);


export const getAllProductsView = (db: Database) => db.view("allProductsView");


const setup: SetupHandler = async (db) => {
    await allProductsViewSetup(db);
};

export default setup;


async function allProductsViewSetup(db: Database) {
    const allProductsView = getAllProductsView(db);

    if (!await allProductsView.exists())
        await allProductsView.create({
            type: "arangosearch"
        });
}