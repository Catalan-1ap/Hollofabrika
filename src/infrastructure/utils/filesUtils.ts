import path from "path";
import * as fs from "fs/promises";
import { Writable } from "stream";


export async function findInDir(name: string, dirPath: string) {
    const files = await fs.readdir(dirPath);
    const file = files.find(file => name === file);

    if (!file)
        return null;

    return path.join(dirPath, file);
}


export function finalizeWritableStream(stream: Writable) {
    return async () => {
        stream.destroy();
    };
}


export function catcherDeleteFile(path: string) {
    return async () => {
        await fs.rm(path, { force: true });
    };
}