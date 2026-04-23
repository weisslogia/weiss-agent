import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import path from "node:path";
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class CreateDirectory extends ITool {
    constructor() {
        super('createDirectory', 'given a path and a name create a folder if not exists', z.object({ path: z.string(), name: z.string() }))
    }
    public async execute(params: { path: string, name: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: createDirectory with params: ${JSON.stringify(params)}`)
            return await fs.mkdir(path.join(params.path, params.name))
        } catch (err) {
            return err;
        }
    }
}