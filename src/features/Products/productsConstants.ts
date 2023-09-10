import path from "path";
import fs from "fs";


export const productsCoversWebPath = path.join(
    process.env.SERVER_STATIC_ROOT_SEGMENT!,
    "products",
    process.env.SERVER_STATIC_COVERS_SEGMENT!
);

export const productsCoversPath = path.join(path.resolve(), productsCoversWebPath);

if (!fs.existsSync(productsCoversPath)) {
    fs.mkdirSync(productsCoversPath, { recursive: true });
}