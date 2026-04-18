import { Command } from './command.js';
import { logger } from '../utils/logger.js';
import { parseArgs } from '../utils/args-parser.js';

export class HelloCommand implements Command {
  readonly name = 'hello';
  readonly description = 'Prints a greeting message';

  async execute(args: string[]): Promise<void> {
    const options = parseArgs(args);
    const name = options.name || 'World';
    
    logger.info(`Hello, ${name}!`);
  }
}
