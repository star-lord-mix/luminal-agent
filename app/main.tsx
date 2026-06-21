import React from 'react';
import { render, Box, Text } from 'ink';
import UserInput from '@/app/content/input';
import MessagesPanel from '@/app/content/messages';


function App(){
  return (
    <Box flexDirection="column" gap={1}>
      <MessagesPanel />
      <UserInput />
    </Box>
  )
}

render(<App />, {alternateScreen: true})
