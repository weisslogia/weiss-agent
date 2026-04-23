import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class RemoveFile extends ITool {
    constructor() {
        super('removeFile', 'given a file path remove it', z.object({ path: z.string() }))
    }
    public async execute(params: { path: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: removeFile with params: ${JSON.stringify(params)}`)
            await fs.readFile(params.path, { encoding: 'utf-8' })
            return await fs.rm(params.path)
        } catch (err) {
            return 'the file does not exists'
        }
    }
}