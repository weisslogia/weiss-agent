import { AgentResponse } from "../types/agentResponse.js";

export const handleResponseBuffer = async(stream: any) => {
    return new Promise((resolve) => {
        console.log('hgere')
      let allText:string = ''
      stream.on("data", (data: any) => {
        const utf8Decoder = new TextDecoder("UTF-8");
        const decodedData = utf8Decoder.decode(data);
        const parsedData: AgentResponse = JSON.parse(decodedData)
        allText+=parsedData.message.content
        // process.stdout.write(parsedData.message.content)
        if(parsedData.message.tools_calls)
        console.log(parsedData)
      });
      stream.on('end', () => resolve(allText))
    });
}