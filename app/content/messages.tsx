/*
messages contiene el messages panel, el cual es el encargado
de renderizar todos los messages del store y renederizar los
chunks de la generacion del send message
*/
import React, { useEffect, useRef, useState } from 'react';
import { Box, Text, measureElement } from 'ink';
import type { DOMElement } from 'ink';
import type { Message } from 'ollama';
import { useMessageStore } from '@/provider/message.store';
import { ShinyText } from '@/components/ShinyText';


// ui para los assistant message
function AssistantMessage({message, current}: {message: Message, current: boolean}){
  const {onStream, onThinking} = useMessageStore();
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
        {message.content && <Text>{message.content}</Text>}
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

// panel principal: viewport que windowiza los messages dentro del
// alternate screen. el box externo fija la altura disponible y recorta;
// el box interno se desplaza hacia arriba para mantener pegada la cola
export default function MessagesPanel(){
  const {messages} = useMessageStore();
  const viewportRef = useRef<DOMElement>(null)
  const contentRef = useRef<DOMElement>(null)
  const [offset, setOffset] = useState(0)

  // tras cada render medimos cuanto sobresale el contenido respecto
  // del viewport y lo subimos esa diferencia para ver siempre el final
  useEffect(() => {
    if (!viewportRef.current || !contentRef.current) return
    const viewport = measureElement(viewportRef.current).height
    const content = measureElement(contentRef.current).height
    setOffset(Math.max(0, content - viewport))
  })

  return (
    <Box ref={viewportRef} flexGrow={1} flexDirection="column" overflow="hidden">
      <Box ref={contentRef} flexDirection="column" flexShrink={0} gap={1} paddingX={1} marginTop={-offset}>
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
    </Box>
  );
}
