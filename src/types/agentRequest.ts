import { AgentMessage } from "./agentMessage.js";
import { AgentTool } from "./agentTool.js";

export interface AgentRequest {
  model: string;
  messages: AgentMessage[];
  stream: boolean;
  tools: AgentTool[];
}
