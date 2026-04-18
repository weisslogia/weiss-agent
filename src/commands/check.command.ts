import axios from "axios";
import { logger } from "../utils/logger.js";
import { Command } from "./command.js";

export class CheckCommand implements Command {
  readonly name = 'check';
  readonly description = 'Check the status of local ollama';

  async execute(): Promise<void> {
    const response = await axios.get('http://localhost:11434/api/tags')
    
    logger.info(response.data.models);
  }
}