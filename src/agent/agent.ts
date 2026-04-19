import chalk from "chalk";
import readline from "node:readline/promises";
import { handleResponseBuffer } from "../utils/response_buffer.js";
import { AgentResponse } from "../types/agentResponse.js";
import { AgentRequest } from "../types/agentRequest.js";
import { LLM, LMStudioClient, Chat, tool } from "@lmstudio/sdk";
import { z } from "zod";
import { Tools } from "./tools.js";
import cliMd from "cli-markdown";
import { Logger, logger } from "../utils/logger.js";
import { ReadDirectory } from "./tools/listDirectory.tool.js";
export class Agent {
  private interface: readline.Interface;
  private isRunning: boolean;
  private reserveWords: string[];
  private client: LMStudioClient;
  private model: LLM | undefined
  private history: Chat
  private tools: Tools
  constructor(model: string) {
    this.interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.isRunning = false;
    this.client = new LMStudioClient()
    this.setup(model)
    this.reserveWords = ["exit", "clean", "test"];
    this.history = Chat.from([
      { role: 'system', content: this.generateSystemtPrompt() }
    ])
    this.tools = new Tools()
  }

  private generateSystemtPrompt(): string {
    return `You are a helpful assistant, before any operation create a todo and execute all the steps in that todo, if searching for a file or a folder always search inside of all folders and subfolders starting from the current directory, to performe a search if the path was not provide start in the directory . for windows or ./ for linux or mac, avoid folder containing project dependencies or builds`
  }

  private async setup(model: string) {
    this.model = await this.client.llm.model(model)
  }

  private async input(question: string = " "): Promise<string> {
    const response = await this.interface.question(chalk.green(question));
    return response;
  }

  private async handleReserveWord(word: string) {
    if (word === "exit") {
      return this.isRunning = false;
    }
    if (word === "clean") {
      return this.history = Chat.from([
        { role: 'system', content: this.generateSystemtPrompt() }
      ])
    } else if (word === 'test') {
      const f = new ReadDirectory()
      const a = await f.execute({ path: '.' })
      console.log(a)
      return a
    }
  }

  public async askModel(question: string) {
    if (this.model) {
      this.history.append({
        role: 'user', content: question
      })
      let isThinking = true
      const response = this.model.act(this.history, this.tools.toolsDefs(), {
        onPredictionFragment: (({ content, reasoningType }) => {
          if (reasoningType === 'reasoningStartTag') {
            process.stdout.write('\n')
          }
          if (reasoningType === 'reasoningStartTag' || reasoningType === 'reasoningEndTag') {
            process.stdout.write(chalk.magenta(content))
          }
          else if (reasoningType === 'reasoning') {
            process.stdout.write(chalk.italic(chalk.dim(content)))
          } else {
            process.stdout.write(content)
          }
        }),
        onMessage: (message) => {
          this.history.append(message)
        },
        maxPredictionRounds: 100,
        allowParallelToolExecution: true
      })
      return response
    }
    return null
  }





  public async AgentLoop() {
    this.isRunning = true;

    while (this.isRunning) {
      const aiQuestion = await this.input();
      if (
        this.reserveWords.find(
          (el) => el.toLowerCase() === aiQuestion.toLocaleLowerCase(),
        )
      ) {
        await this.handleReserveWord(aiQuestion.toLocaleLowerCase());
      } else {
        const aiResponse = await this.askModel(aiQuestion);
      }
      // logger.info(aiResponse.)
    }
  }
}
