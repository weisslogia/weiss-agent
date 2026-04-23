import chalk from "chalk";
import readline from "node:readline/promises";
import { Tools } from "./tools.js";
import {
  createOpenAICompatible,
  OpenAICompatibleProvider,
} from "@ai-sdk/openai-compatible";
import { AppConfig } from "../types/config.js";
import { ensureFileExists, loadConfig, updateConfig } from "../utils/config.js";
import { promisify } from "node:util";
import { exec } from "node:child_process";
import { logger } from "../utils/logger.js";
import { ModelMessage, stepCountIs, streamText, ToolSet } from "ai";
import cliMd from "cli-markdown";
export class Agent {
  private interface: readline.Interface;
  private isRunning: boolean;
  private reserveWords: string[];
  private opencode: OpenAICompatibleProvider | undefined;
  private history: ModelMessage[];
  private tools: Tools;
  private CONFIG_PATH: string | undefined;
  private config: AppConfig | null;
  constructor(config: AppConfig | null) {
    this.interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.isRunning = false;
    this.reserveWords = [
      "exit",
      "clean",
      "config set api_key",
      "config set model",
      "config set exa_api_key",
      "config set provider",
      "config set editor",
      "config",
      "reload config",
      "editor",
      "test"
    ];
    this.tools = new Tools();
    this.history = [{ role: "system", content: this.generateSystemtPrompt() }];
    this.setup();
    this.config = config;
    this.loadConf(config);
  }

  private async setup() {
    const execAsync = promisify(exec);
    const user = await execAsync("echo $USER");
    this.CONFIG_PATH = `/home/${user.stdout.trim()}/.agent.json`;
    await ensureFileExists(this.CONFIG_PATH);
  }

  private generateSystemtPrompt(): string {
    return `You are an expert coding assistant operating inside weiss coding agent, a coding agent harness. You help users by reading files, executing commands, editing code, and writing new files.
        Guidelines:
        - Before do anything always make a plan a present to the user and update that plan acording the task are complete
        - Write testeable functions and always write test for your code
        - Before write any code into a file tested in a isoleted enviroment and fix any error encounter
        - Before finish try to compile the project for errors and fix it
        - Prefer grep/find/ls tools over bash for file exploration (faster, respects .gitignore)
        - Be concise in your responses
        - Show file paths clearly when working with files
        - if present on the root of the project a file called .agentignore read its content and do not perform any operation with the files and folder listed in
        - Only use web search once per turn and limit those search to the minimun and generate information based on the return
        Tools:
        ${this.tools.toolsString()}`;
  }

  private async input(question: string = " "): Promise<string> {
    const response = await this.interface.question(chalk.green(question));
    return response;
  }

  private async handleReserveWord(action: string) {
    if (action === "exit") {
      return (this.isRunning = false);
    } else if (action === "clean") {
      console.clear();
      return (this.history = [
        { role: "system", content: this.generateSystemtPrompt() },
      ]);
    } else if (action === "config set api_key") {
      const value = await this.input("Api key ");
      updateConfig(this.CONFIG_PATH || "", { API_KEY: value });
    } else if (action === "config set exa_api_key") {
      const value = await this.input("Exa api key ");
      updateConfig(this.CONFIG_PATH || "", { EXA_API_KEY: value });
    } else if (action === "config set model") {
      const value = await this.input("Model ");
      updateConfig(this.CONFIG_PATH || "", { MODEL: value });
    } else if (action === "config set provider") {
      const value = await this.input("Provider url ");
      updateConfig(this.CONFIG_PATH || "", { PROVIDER_URL: value });
    } else if (action === "config set editor") {
      const value = await this.input("Editor ");
      updateConfig(this.CONFIG_PATH || "", { EDITOR: value });
    } else if (action === "config") {
      const conf = loadConfig(this.CONFIG_PATH);
      console.log(chalk.blue(JSON.stringify(conf)));
    } else if (action === "reload config") {
      const conf = loadConfig(this.CONFIG_PATH);
      this.loadConf(conf);
    } else if (action === "editor") {
      const conf = loadConfig(this.CONFIG_PATH);
      if (!conf || !conf.EDITOR) {
        this.askModel(
          "open the current folder in a code editor do not outpout",
        );
      } else {
        this.askModel(
          `open the current folder in the ${conf.EDITOR} code editor do not output`,
        );
      }
    } else if (action === 'test') {
      const tools = new Tools()
      console.log(tools.toolsDefs())
    }
  }

  public async askModel(question: string): Promise<any> {
    if (!this.opencode || !this.config) {
      return logger.error(
        `Connection with the provider has not been initialized yet.`,
      );
    }
    this.history.push({ role: "user", content: question });
    // const ls = new ReadDirectory()
    const result = streamText({
      model: this.opencode.chatModel(this.config.MODEL),
      messages: this.history,
      tools: this.tools.toolsDefs() as ToolSet,
      stopWhen: stepCountIs(50),
      onStepFinish: async ({ toolResults }) => {
        if (toolResults.length) {
          toolResults.map((el) => {
            if(el && el.output) {
              logger.info(Array.isArray(el.output) ? el.output : JSON.stringify(el.output))
            }
          });
        }
      },
    });
    let responseText = "";
    let lastWhiteSpace: boolean = false
    for await (const chunk of result.fullStream) {
      if (chunk.type === "reasoning-start") {
        process.stdout.write(`\n${chalk.magenta("Thought: ")}`);
      } else if (chunk.type === "reasoning-delta") {
        process.stdout.write(chalk.italic(chalk.dim(chunk.text)));
      } else if (chunk.type === "text-start") {
        process.stdout.write(`\n${chalk.cyanBright("Response:")}\n`);
      } else if (chunk.type === "text-delta") {
        if(!lastWhiteSpace || (lastWhiteSpace && chunk.text !== ' ')) {
        process.stdout.write(cliMd(chunk.text));
        responseText += chunk.text;
        }
        lastWhiteSpace = chunk.text === ' '
      }
    }
    this.history.push({role: 'assistant', content: responseText})
    return result    
  }

  public loadConf(config: AppConfig | null) {
    if (!config) {
      return;
    }
    this.opencode = createOpenAICompatible({
      baseURL: config.PROVIDER_URL,
      apiKey: config.API_KEY,
      name: "opencode-zen",
    });
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
