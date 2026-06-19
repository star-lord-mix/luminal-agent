/*
este archivo contiene la funcion principal que exporta los chunks
uno a uno del response generado por ollama en un formato dict por
medio de yields entre tipos "think" y "message"
*/
import { Ollama } from 'ollama';
import type { Message, ToolCall } from 'ollama';
import { tools, executeTool } from '@/functions/tools.index';

const ollama = new Ollama()

// funciona generadora de fragments en yields
// del response en think y messsage
export async function* generateMessage(history: Message[], model: string, think: boolean){
  // enviamos los valores de la generacion del message
  while (true){
    const response = await ollama.chat({
      model,
      messages: history,
      tools,
      stream: true,
      think
    });

    // acumulamos los chunks para el history interno
    let thinking = "", content = ""
    const toolCalls: ToolCall[] = []

    // iteramos en las partes del response y las enviamos
    // en un formato mas limpio para el provider
    for await (const part of response){
      // manejo del envio type think
      if (part.message.thinking){
        thinking += part.message.thinking
        yield {type: "thinking", content: part.message.thinking}
      }
      // manejo del envio type message
      if (part.message.content){
        content += part.message.content
        yield {type: "message", content: part.message.content}
      }
      // manejo del envio de tools
      if (part.message.tool_calls?.length) {
        toolCalls.push(...part.message.tool_calls)
        yield {type: "toolCall", content: part.message.tool_calls}
      }
    }

    // manejamos el cumulado para el historial del mensaje interno
    if (thinking || content || toolCalls.length) {
      history.push({ role: 'assistant', thinking, content, tool_calls: toolCalls } as any)
    }

    // si no hay ningun tool podemos cerrar el loop
    if (!toolCalls.length) break

    // ejecutamos cada tool y pusheamos el resultado al history
    for (const call of toolCalls) {
      const result = await executeTool(call.function.name, call.function.arguments as Record<string, any>)
      history.push({ role: 'tool', tool_name: call.function.name, content: result } as any)
    }
  }
}
