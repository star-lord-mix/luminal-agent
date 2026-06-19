/*
este archivo contiene la funcion principal que exporta los chunks
uno a uno del response generado por ollama en un formato dict por
medio de yields entre tipos "think" y "message"
*/
import { Ollama } from 'ollama';
import type { Message } from 'ollama';


// incializamos el cliente de ollama
const ollama = new Ollama()

// funciona generadora de fragments en yields
// del response en think y messsage
export async function* generateMessage(history: Message[], model: string, think: boolean){
  // enviamos los valores de la generacion del message
  const response = await ollama.chat({
    model,
    messages: history,
    stream: true,
    think
  });

  // iteramos en las partes del response y las enviamos
  // en un formato mas limpio para el provider
  for await (const part of response){
    // manejo del envio type think
    if (part.message.thinking){
      yield {type: "thinking", content: part.message.thinking}
    }
    // manejo del envio type message
    if (part.message.content){
      yield {type: "message", content: part.message.thinking}
    }
  }
}
