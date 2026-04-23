import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import path from "node:path";
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class CreateFile extends ITool {
    constructor() {
        super('createFile', 'given a file name and a path create if does not exist a file in that path and return an error if the file exists', z.object({ name: z.string(), path: z.string() }))
    }
    public async execute(params: { name: string, path: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: createFile with params: ${JSON.stringify(params)}`)
            await fs.readFile(path.join(params.path, params.name), { encoding: 'utf-8' })
            return 'the file already exist'
        } catch (err) {
            return await fs.writeFile(path.join(params.path, params.name), '');
        }
    }
}