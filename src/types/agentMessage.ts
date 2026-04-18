import { AgentTool } from "./agentTool.js";

export interface AgentMessage {
    role: 'user' | 'system' | 'tool' | 'assistant',
    content: string,
    thinking?: boolean,
    tools_calls?: AgentTool[],
    tool_name?: string
}