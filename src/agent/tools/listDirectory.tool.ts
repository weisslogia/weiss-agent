import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import path from "node:path";
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class ReadDirectory extends ITool {
    constructor() {
        super('readDirectory', 'given a folder file path return the content of the folder', z.object({ path: z.string() }))
    }
    public async execute(params: { path: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: readDirectory with params: ${JSON.stringify(params)}`)
            const data = await fs.readdir(params.path);
            const return_data: { name: string, type: "file" | "folder" }[] = []
            for (const file of data) {
                const n_path = path.join(params.path, file)
                const tmp = await fs.stat(n_path)
                return_data.push({
                    name: file,
                    type: tmp.isFile() ? 'file' : 'folder'
                })
            }
            logger.debug(`Tool: readFile return: ${JSON.stringify(return_data)}`)
            return return_data
        } catch (err) {
            return err;
        }
    }
}