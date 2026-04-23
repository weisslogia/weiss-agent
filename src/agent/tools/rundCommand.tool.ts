import { ITool } from "./tool.js";
import z from "zod";
import { logger } from "../../utils/logger.js";
import { stdout } from "node:process";
import { promisify } from "node:util";
import { exec } from "node:child_process";

export class RunCommand extends ITool {
  constructor() {
    super(
      "runCommand",
      "run a shell command",
      z.object({ command: z.string() }),
    );
  }
  public async execute(params: { command: string }) {
    try {
      stdout.write("\n\n");
      logger.info(`Tool: findFile with params: ${JSON.stringify(params)}`);
      const allowComands: string[] = [
        "ls",
        "grep",
        "npm",
        "yarn",
        "cd",
        "echo",
        "find",
        "less",
        "pwd",
        "kill",
        "ps",
        "netstat",
        "ss",
        "sudo",
      ];
      const splitted = params.command.split(" ");
      if (!allowComands.find((cmd) => cmd === splitted[0])) {
        return `these are the only commands allow ${allowComands}`;
      }
      const execAsync = promisify(exec);
      return await execAsync(params.command);
    } catch (err) {
      return err;
    }
  }
}
