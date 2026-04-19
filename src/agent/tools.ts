import { CreateDirectory } from "./tools/createDirectory.tool.js";
import { CreateFile } from "./tools/createFile.tool.js";
import { FindFile } from "./tools/findFIle.tool.js";
import { ReadDirectory } from "./tools/listDirectory.tool.js";
import { ReadFile } from "./tools/readFile.tool.js";
import { RemoveDirectory } from "./tools/removeDirectory.tool.js";
import { RemoveFile } from "./tools/removeFile.tool.js";
import { ITool } from "./tools/tool.js";
import { UpdateFile } from "./tools/updateFile.tool.js";

export class Tools {
    private tools: ITool[]

    constructor() {
        this.tools = [
            new ReadFile(),
            new ReadDirectory(),
            new CreateDirectory(),
            new FindFile(),
            new CreateFile(),
            new RemoveFile(),
            new RemoveDirectory(),
            new UpdateFile()
        ]
    }

    public toolsDefs() {
        return this.tools.map(tool => tool.getDefinition())
    }
}