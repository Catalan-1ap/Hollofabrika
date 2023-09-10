import { loadFiles as toolsLoadFiles } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { arangojs, Database } from "arangojs";
import url, { fileURLToPath } from "url";
import path from "path";


export type SetupHandler = (db: Database) => Promise<void> | void


export async function reflectionSetup() {
	const dirname = path.dirname(fileURLToPath(import.meta.url));
	const ext = process.env.NODE_ENV === "development" ? "ts" : "js";

	const [typeDefs, resolvers] = await Promise.all([
		loadFilesSync(path.join(dirname, "../features/**/*.schema.graphql")).then(mergeTypeDefs),
		Promise.all([
			loadFilesSync(path.join(dirname, `../features/**/*.queries.${ext}`)),
			loadFilesSync(path.join(dirname, `../features/**/*.mutations.${ext}`))
		]).then(z => z.flat()).then(mergeResolvers),
		loadFilesSync(path.join(dirname, `../features/**/*.setup.${ext}`)).then(setup)
	]);

	return {
		typeDefs,
		resolvers
	};
}


export async function connectToDb() {
	const db = arangojs({
		url: process.env.ARANGO_URL!,
		databaseName: process.env.ARANGO_DB!,
		auth: {
			username: process.env.ARANGO_USER!,
			password: process.env.ARANGO_PASSWORD!,
		}
	});

	if (!await db.exists())
		throw new Error("Database connection failed");

	return db;
}


async function setup(setups: SetupHandler[]) {
	const db = await connectToDb();

	await Promise.all(setups.map(z => z?.(db)));
}


function loadFilesSync(pattern: string) {
	return toolsLoadFiles(pattern, {
		requireMethod: async (path: string) => {
			return await import(url.pathToFileURL(path).toString());
		}
	});
}