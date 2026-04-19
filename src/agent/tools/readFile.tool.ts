import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class ReadFile extends ITool {
    constructor() {
        super('readFile', 'given a file path return the content of the file', { path: z.string() })
    }
    public async execute(params: { path: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: readFile with params: ${JSON.stringify(params)}`)
            const data = await fs.readFile(params.path, { encoding: 'utf8' });
            logger.debug(`Tool: readFile return: ${JSON.stringify(data)}`)
            return data
        } catch (err) {
            return err;
        }
    }
}