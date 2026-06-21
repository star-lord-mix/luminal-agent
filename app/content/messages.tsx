/*
messages contiene el messages panel, el cual es el encargado
de renderizar todos los messages del store y renederizar los
chunks de la generacion del send message
*/
import React from 'react';
import { Box, Text } from 'ink';
import type { Message } from 'ollama';
import { useMessageStore } from '@/provider/message.store';
import { ShinyText } from '@/components/ShinyText';


// ui para los assistant message
function AssistantMessage({message, current}: {message: Message, current: boolean}){
  const {onThinking} = useMessageStore();
  // variables para el manejo del thinking y enable de las
  // animaciones
  const enabled = onThinking && current
  const doneThinking = (!onThinking && current) || !current

  return (
    <Box flexDirection="row" gap={1}>
      <Text>{"✻"}</Text>
      <Box flexDirection="column" gap={1}>
        {message.thinking && (
          <Box flexDirection="column">
            <ShinyText text="Thinking..." enabled={enabled} base="#b2b2b2" bold/>
            <Text color="#808080">{message.thinking}</Text>
            {doneThinking && <Text color="#b2b2b2">...Done Thinking</Text>}
          </Box>
        )}
        <Box flexDirection="column">
          {message.content && <Text>{message.content}</Text>}
        </Box>
      </Box>
    </Box>
  );
}

// ui para los user messages
function UserMessage({message}: {message: Message}){
  return (
    <Box flexDirection="row" gap={1}>
      <Text>{">"}</Text>
      <Text>{message.content}</Text>
    </Box>
  );
}

// panel principal para la renderizacion del map
// de los messages
export default function MessagesPanel(){
  const {messages} = useMessageStore();

  return (
    <Box flexDirection="column" gap={1} paddingX={1}>
      {messages.map((message, index) => {
        if (message.role === "user"){
          return (
            <UserMessage key={index} message={message}/>
          );
        }
        if (message.role === "assistant"){
          const current = messages.length - 1 === index
          return (
            <AssistantMessage key={index} message={message} current={current}/>
          );
        }
      })}
    </Box>
  );
}
