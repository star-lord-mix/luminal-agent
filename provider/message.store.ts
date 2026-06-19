/*
el sigueinte provider contiene la informacion necesaria
para la administracion de un currrentChat basados en la
funcion generadora principal
*/
import { create } from 'zustand';
import type { Message } from 'ollama';
import { generateMessage } from '@/functions/generateMessage';


// definimos la estrcutra de nuestro store
type MessageStore = {
  model: string
  think: boolean
  messages: Message[]
  onStream: boolean
  onThinking: boolean
  sendMessage: (newMessage: Message) => void
}

// incializamos el store
export const useMessageStore = create<MessageStore>()((set, get) => ({
  // variables de configuracion del chat
  model: "gemma4:e4b-it-qat",
  think: true,
  messages: [],
  onStream: false,
  onThinking: false,

  // funcion principal para la incersion de mensages al store
  sendMessage: async (newMessage) => {
    // seteamos el mensaje del user y los valores del stream
    set((state) => ({messages: [...state.messages, newMessage], onStream: true, onThinking: true}))

    // obtenemos el history
    const history: Message[] = get().messages
    let response = "", think = ""
    set((state) => ({
      messages: [...state.messages, {role: "assistant", content: "", ...(get().think && { thinking: "" })}]
    }))

    // iterador principal del messages generator
    for await (const chunk of generateMessage(history, get().model, get().think)){
      // manejo del think
      if (chunk.type === "think" && get().think){
        think += chunk.content
        // actualizamos al nuevo valor
        set((state) => {
          const updated = [...state.messages]
          updated[updated.length - 1] = {...updated[updated.length - 1]!, thinking: think}
          return {messages: updated}
        })
      }

      // manejo del message
      if (chunk.type === "message"){
        // apagamos el think
        if (get().onThinking) set(() => ({onThinking: false}))
        // recuperamos el response
        response += chunk.content
        // actualizamos al nuevo valor
        set((state) => {
          const updated = [...state.messages]
          updated[updated.length - 1] = {...updated[updated.length - 1]!, content: response}
          return {messages: updated}
        })
      }
    }

    // apagamos el streming
    set(() => ({onStream: false}))
  }
}))
