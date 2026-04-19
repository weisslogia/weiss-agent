import { logger } from "../utils/logger.js";
import { Command } from "./command.js";
import { Agent } from "../agent/agent.js";

export class AgentCommand implements Command {
  readonly name = 'agent';
  readonly description = 'Init the agent';

  async execute(): Promise<void> {
    const agent = new Agent('essentialai/rnj-1')
    logger.info('Starting loop');
    await agent.AgentLoop()
    logger.info('Loop ended');
    return;
  }
}