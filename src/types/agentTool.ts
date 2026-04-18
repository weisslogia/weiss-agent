export interface AgentTool {
    type: 'function',
    function: {
        name: string,
        description: string,
        parameters: {
            type: "object",
            properties: {
                [x: string]: {
                    type: "string" | "number"
                    description?: string
                }
            },
            required: string[]
        }
    }
}