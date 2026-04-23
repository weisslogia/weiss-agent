import { logger } from "../utils/logger.js";
import { Command } from "./command.js";
import { Agent } from "../agent/agent.js";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import { ensureFileExists, loadConfig } from "../utils/config.js";

export class AgentCommand implements Command {
  readonly name = "agent";
  readonly description = "Init the agent";

  async execute(): Promise<void> {
    const execAsync = promisify(exec);
    const user = await execAsync("echo $USER");

    const CONFIG_PATH = `/home/${user.stdout.trim()}/.agent.json`;
    ensureFileExists(CONFIG_PATH);

    const ogConf = loadConfig(CONFIG_PATH);
    const agent = new Agent(ogConf);
    logger.info("Starting loop");
    await agent.AgentLoop();
    logger.info("Loop ended");
    return;
  }
}
