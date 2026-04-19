import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import path from "node:path";
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class RemoveDirectory extends ITool {
    constructor() {
        super('removeDirectory', 'given a directory path remove it', { path: z.string() })
    }
    public async execute(params: { path: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: removeDirectory with params: ${JSON.stringify(params)}`)
            const _file = await fs.readdir(params.path, { encoding: 'utf-8' })
            return await fs.rmdir(params.path)
        } catch (err) {
            return 'the folder does not exists'
        }
    }
}