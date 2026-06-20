/*
input contiene el ui para la renderizacion del prompt
del user, manejo de los cases para las activity keys.
*/
import React, { useState } from 'react';
import { Box, Text, useInput } from 'ink';
import { useMessageStore } from '@/provider/message.store';
import os from 'os';

export default function UserInput(){
  const [value, setValue] = useState<string>("");
  const {sendMessage, onStream, model, think} = useMessageStore();

  useInput((input, key) => {
    if (onStream) return

    switch (true){
      case key.return: {
        // manejo del shift + enter
        if (key.shift){ 
          setValue(prev => prev + "\n") 
          return
        }
        // limpiamos el prompt del user
        const prompt = value.trim()
        if (prompt === "/exit") process.exit(0)
        if (!prompt) return
        
        // enviamos el prompt del user como message
        // al manejador del sendMessgae en store
        sendMessage({role: "user", content: prompt})
        setValue("")
        return
      }
      case key.backspace || key.delete: {
        // manejamos el caso cuando el user borre
        // el input
        setValue(prev => prev.slice(0, -1))
        return
      }
      case input.length > 0: {
        // actualizacion del prompt value
        setValue(prev => prev + input)
        break
      }
    }
  });

  return (
    <Box flexDirection="column">
      <Box borderStyle="round" borderColor="#eeeeee" borderRight={false} borderLeft={false} paddingX={1}>
        <Text color="#808080">{"> "}</Text>
        <Text>{value}</Text>
      </Box>
      <Box flexDirection="row" justifyContent="space-between">
        <Text color="#808080">{process.cwd().replace(os.homedir(), '@')}</Text>
        <Text color="#808080">{"· "}{model}{think && " - Thinking Activate"}</Text>
      </Box>
    </Box>
  );
}
