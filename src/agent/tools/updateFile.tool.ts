import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class UpdateFile extends ITool {
    constructor() {
        super('updateFile', 'given a file path a text and old content update its content', { path: z.string(), content: z.string() })
    }
    public async execute(params: { content: string, path: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: updateFile with params: ${JSON.stringify(params)}`)
            const _file = await fs.readFile(params.path, { encoding: 'utf-8' })
            return await fs.writeFile(params.path, params.content)
        } catch (err) {
            return 'the file does not exist';
        }
    }
}