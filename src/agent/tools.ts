import { tool, ToolSet, zodSchema } from "ai";
import { CreateDirectory } from "./tools/createDirectory.tool.js";
import { CreateFile } from "./tools/createFile.tool.js";
import { FindFile } from "./tools/findFIle.tool.js";
import { ReadDirectory } from "./tools/listDirectory.tool.js";
import { ReadFile } from "./tools/readFile.tool.js";
import { RemoveDirectory } from "./tools/removeDirectory.tool.js";
import { RemoveFile } from "./tools/removeFile.tool.js";
import { ITool } from "./tools/tool.js";
import { UpdateFile } from "./tools/updateFile.tool.js";
import { RunCommand } from "./tools/rundCommand.tool.js";

export class Tools {
    private tools: ITool[]

    constructor() {
        this.tools = [
            new FindFile(),
            new ReadFile(),
            new CreateFile(),
            new RemoveFile(),
            new UpdateFile(),
            new ReadDirectory(),
            new CreateDirectory(),
            new RemoveDirectory(),
            new RunCommand(),
        ]
    }

    public toolsDefs(): ToolSet {
        const ts1: ToolSet = {}
        this.tools.forEach(el => {
            ts1[el.name] = tool({
                description: el.description,
                inputSchema: zodSchema(el.params as any),
                execute: el.execute
            })
        })
        return ts1
    }

    public toolsString():string {
        let toolString:string = ""
        this.tools.forEach((tool, index) => {
            if(index > 0) {
                toolString+='\n'
            }
            toolString+=`- ${tool.name} => ${tool.description}`
        })
        return toolString
    }
}
