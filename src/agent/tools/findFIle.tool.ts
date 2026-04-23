import { ITool } from "./tool.js";
import z from "zod";
import fs from 'node:fs/promises'
import path from "node:path";
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";

export class FindFile extends ITool {
    constructor() {
        super('findFile', 'given a file name return its path', z.object({ name: z.string() }))
    }
    public async execute(params: { name: string }) {
        try {
            stdout.write('\n\n')
            logger.info(`Tool: findFile with params: ${JSON.stringify(params)}`)
            const checkDirectory = async (searchPath: string, name: string): Promise<string[]> => {
                const data = await fs.readdir(searchPath);
                const restricted_path = ['node_modules', 'dist', 'build']
                let response: string[] = []
                for (const file of data) {
                    const n_path = path.join(searchPath, file)
                    const tmp = await fs.stat(n_path)
                    if (restricted_path.find(el => el === file)) {
                        continue;
                    }
                    if (file === name) {
                        response.push(n_path)
                    } else if (tmp.isDirectory()) {
                        const r = await checkDirectory(n_path, name)
                        response = response.concat(r)
                    }
                }
                logger.debug(`Tool: readFile return: ${JSON.stringify(response)}`)
                return response
            }
            return checkDirectory('./', params.name)
        } catch (err) {
            return err;
        }
    }
}