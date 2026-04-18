import chalk from "chalk";
import readline from "node:readline/promises";
import ollama from "ollama";
import { handleResponseBuffer } from "../utils/response_buffer.js";
import { AgentResponse } from "../types/agentResponse.js";
import { AgentRequest } from "../types/agentRequest.js";

export class Agent {
  private interface: readline.Interface;
  private isRunning: boolean;
  private model: string;
  private reserveWords: string[];
  constructor(model: string) {
    this.interface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.isRunning = false;
    this.model = model;
    this.reserveWords = ["exit"];
  }

  private async input(question: string = " "): Promise<string> {
    const response = await this.interface.question(chalk.green(question));
    return response;
  }

  private handleReserveWord(word: string) {
    if (word === "exit") {
      this.isRunning = false;
    }
  }

  public async askModel(question: string) {
    const response = await ollama.chat({
      model: this.model,
      messages: [{ role: "user", content: question }],
      think: 'medium',
      tools: [
        {
          type: "function",
          function: {
            name: "get_weather",
            description: "get country weather from its coordinates",
            parameters: {
              type: "object",
              properties: {
                x: {
                  type: "number",
                  description: "value of the x coordnate",
                },
                y: {
                  type: "number",
                  description: "value of the y coordnate",
                },
              },
              required: ["x", "y"],
            },
          },
        },
      ],
      stream: true,
    });
    for await (const part of response) {
        if(part.message.tool_calls) {
            // process.stdout.write(part.message.tool_calls);
            console.log(part.message.tool_calls);
        }
    }
    return response;
    // const payload: AgentRequest = {
    //   model: this.model,
    //   messages: [
    //     {
    //       role: "user",
    //       content: question,
    //     },
    //   ],
    //   stream: false,
    //   tools: [
    //     {
    //       type: "function",
    //       function: {
    //         name: "get_weather",
    //         description: "get country weather from its coordinates",
    //         parameters: {
    //           type: "object",
    //           properties: {
    //             x: {
    //               type: "number",
    //               description: "value of the x coordnate",
    //             },
    //             y: {
    //               type: "number",
    //               description: "value of the y coordnate",
    //             },
    //           },
    //           required: ["x", "y"],
    //         },
    //       },
    //     },
    //   ],
    // };
    // const response = await ollama.post<AgentResponse>("/chat", payload, {
    // //   responseType: "stream",
    // });
    // return response;
    // return handleResponseBuffer(response.data);
  }

  //   private async internalQuestion(
  //     payload: AgentRequest,
  //   ): Promise<AgentResponse> {
  //     const response = await ollama.post<AgentResponse>("/chat", payload);
  //     return response.data;
  //   }

  public async AgentLoop() {
    this.isRunning = true;

    while (this.isRunning) {
      const aiQuestion = await this.input();
      if (
        this.reserveWords.find(
          (el) => el.toLowerCase() === aiQuestion.toLocaleLowerCase(),
        )
      ) {
        this.handleReserveWord(aiQuestion.toLocaleLowerCase());
      } else {
        // const r = await this.internalQuestion({
        //   model: this.model,
        //   messages: [
        //     {
        //       role: "user",
        //       content: aiQuestion,
        //     },
        //   ],
        //   stream: false,
        //   tools: [
        //     {
        //       type: "function",
        //       function: {
        //         name: "get_weather",
        //         description: "get country weather from its coordinates",
        //         parameters: {
        //           type: "object",
        //           properties: {
        //             x: {
        //               type: "number",
        //               description: "value of the x coordnate",
        //             },
        //             y: {
        //               type: "number",
        //               description: "value of the y coordnate",
        //             },
        //           },
        //           required: ["x", "y"],
        //         },
        //       },
        //     },
        //   ],
        // });
        // console.log(r)
        const aiResponse = await this.askModel(aiQuestion);
        // console.log(aiResponse);
      }
      // logger.info(aiResponse.)
    }
  }
}
