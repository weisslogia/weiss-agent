import { Tool, tool } from "@lmstudio/sdk"

export abstract class ITool {
    protected _name: string
    protected _description: string
    protected _params: unknown

    constructor(name: string, description: string, params: unknown) {
        this._name = name
        this._description = description
        this._params = params
    }

    public abstract execute(params: unknown): any;

    public getDefinition(): Tool {
        return tool({
            name: this._name,
            description: this._description,
            parameters: this._params as any,
            implementation: this.execute
        })
    }

    public get name() {
        return this._name
    }
    public get description() {
        return this._description
    }

    public get params() {
        return this._params
    }

}