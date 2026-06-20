import React, { useEffect, useState } from 'react';
import { render, Box, useStdout } from 'ink';
import UserInput from '@/app/content/input';
import MessagesPanel from '@/app/content/messages';


function App(){
  // tomamos la altura real del terminal y la mantenemos
  // sincronizada ante cualquier resize de la ventana
  const { stdout } = useStdout()
  const [rows, setRows] = useState(stdout.rows)
  useEffect(() => {
    const onResize = () => setRows(stdout.rows)
    stdout.on('resize', onResize)
    return () => { stdout.off('resize', onResize) }
  }, [stdout])

  // fijamos la altura para que el MessagesPanel windowice su
  // contenido y el input quede siempre pegado abajo
  return (
    <Box flexDirection="column" gap={1} height={rows}>
      <MessagesPanel />
      <UserInput />
    </Box>
  )
}

// montamos la app a pantalla completa sobre el alternate screen;
// el MessagesPanel se encarga de que nada desborde la pantalla
render(<App />, { alternateScreen: true })
