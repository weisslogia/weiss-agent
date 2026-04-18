#!/usr/bin/env node

import { AgentCommand } from "./commands/agent.command.js";
import { CheckCommand } from "./commands/check.command.js";
import { Command } from "./commands/command.js";
import { HelloCommand } from "./commands/hello.command.js";
import { initLogger, logger } from "./utils/logger.js";

class CLI {
  private commands: Map<string, Command> = new Map();

  constructor() {
    this.registerCommands();
  }

  private registerCommands(): void {
    this.register("hello", new HelloCommand());
    this.register("check", new CheckCommand());
    this.register("agent", new AgentCommand());
    // Register more commands here
  }

  private register(name: string, command: Command): void {
    this.commands.set(name, command);
  }

  public async run(args: string[]): Promise<void> {
    const [commandName, ...commandArgs] = args.slice(2); // Skip 'node' and script name

    if (!commandName) {
      this.printHelp();
      return;
    }

    const command = this.commands.get(commandName);

    if (!command) {
      logger.error(`Unknown command: ${commandName}`);
      this.printHelp();
      process.exit(1);
    }

    try {
      return await command.execute(commandArgs);
    } catch (error) {
      logger.error(`Command failed: ${(error as Error).message}`);
      process.exit(1);
    }
  }

  private printHelp(): void {
    logger.info("Available commands:");
    this.commands.forEach((cmd, name) => {
      logger.info(`  ${name} - ${cmd.description}`);
    });
  }
}

const init = async () => {
  // Initialize logger
  initLogger();
  // Main entry point
  const cli = new CLI();
  await cli.run(process.argv);
  process.exit(0)
};

init();
