import { Database } from "arangojs";
import { DbPasswordResetToken, DbRefreshToken, DbRegisterToken, DbUser } from "../../infrastructure/types/dbTypes.js";
import { SetupHandler } from "../../infrastructure/setups.js";
import { millisecondsToSeconds } from "../../infrastructure/utils/dateTime.js";
import ms from "ms";


export const getUsersCollection = (db: Database) => db.collection<DbUser>("users");
export const getRegisterTokensCollection = (db: Database) => db.collection<DbRegisterToken>("registerTokens");
export const getRefreshTokensCollection = (db: Database) => db.collection<DbRefreshToken>("refreshTokens");
export const getPasswordResetTokensCollection = (db: Database) => db.collection<DbPasswordResetToken>("passwordResetTokens");


const setup: SetupHandler = async (db) => {
    await usersCollectionSetup(db);
    await registerTokensCollectionSetup(db);
    await passwordResetTokensCollectionSetup(db);
    await refreshTokensCollectionSetup(db);
};

export default setup;


async function usersCollectionSetup(db: Database) {
    const usersCollection = getUsersCollection(db);

    if (!await usersCollection.exists())
        await usersCollection.create();
}


async function registerTokensCollectionSetup(db: Database) {
    const registerTokensCollection = getRegisterTokensCollection(db);

    if (!await registerTokensCollection.exists())
        await registerTokensCollection.create({
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
        await registerTokensCollection.ensureIndex({
            type: "ttl",
            fields: ["createdAt"],
            expireAfter: millisecondsToSeconds(ms(process.env.REGISTER_TOKEN_EXPIRE!))
        });
    }
}


async function passwordResetTokensCollectionSetup(db: Database) {
    const passwordResetTokensCollection = getPasswordResetTokensCollection(db);

    if (!await passwordResetTokensCollection.exists())
        await passwordResetTokensCollection.create({
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
        await passwordResetTokensCollection.ensureIndex({
            type: "ttl",
            fields: ["createdAt"],
            expireAfter: millisecondsToSeconds(ms(process.env.PASSWORDRESET_TOKEN_EXPIRE!))
        });
    }
}


async function refreshTokensCollectionSetup(db: Database) {
    const refreshTokensCollection = getRefreshTokensCollection(db);

    if (!await refreshTokensCollection.exists())
        await refreshTokensCollection.create();

    await refreshTokensCollection.ensureIndex({
        type: "ttl",
        fields: ["expireAt"],
        expireAfter: 0
    });
}