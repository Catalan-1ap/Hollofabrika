import { Database } from "arangojs";
import { DbMakeOrderToken, DbOrder } from "../../infrastructure/types/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";
import { millisecondsToSeconds } from "../../infrastructure/utils/dateTime.js";
import ms from "ms";


export const getOrdersCollection = (db: Database) => db.collection<DbOrder>(`orders`);
export const getMakeOrderTokensCollection = (db: Database) => db.collection<DbMakeOrderToken>(`makeOrderTokens`);
export const getAllOrdersView = (db: Database) => db.view("allOrdersView");


const setup: SetupHandler = async (db) => {
    await ordersCollectionSetup(db);
    await makeOrderTokenCollectionSetup(db);
    await allOrdersViewSetup(db);
};

export default setup;


async function ordersCollectionSetup(db: Database) {
    const ordersCollection = getOrdersCollection(db);

    if (!await ordersCollection.exists())
        await ordersCollection.create();
}


async function makeOrderTokenCollectionSetup(db: Database) {
    const makeOrderTokensCollection = getMakeOrderTokensCollection(db);

    if (!await makeOrderTokensCollection.exists())
        await makeOrderTokensCollection.create({
            computedValues: [
                {
                    name: "createdAt",
                    computeOn: ["insert"],
                    overwrite: true,
                    expression: "RETURN DATE_NOW() / 1000"
                }
            ]
        });

    if (process.env.NODE_ENV === "production") {
        await makeOrderTokensCollection.ensureIndex({
            type: "ttl",
            fields: ["createdAt"],
            expireAfter: millisecondsToSeconds(ms(process.env.MAKEORDER_TOKEN_EXPIRE!))
        });
    }
}


async function allOrdersViewSetup(db: Database) {
    const allOrdersView = getAllOrdersView(db);

    if (!await allOrdersView.exists())
        await allOrdersView.create({
            type: "arangosearch",
            links: {
                [getOrdersCollection(db).name]: {
                    analyzers: ["identity"],
                    includeAllFields: true
                },
                [getMakeOrderTokensCollection(db).name]: {
                    analyzers: ["identity"],
                    includeAllFields: true
                }
            }
        });
}