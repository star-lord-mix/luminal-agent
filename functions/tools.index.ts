/*
el tools index funge como un repositorio en donde
podemos rabar cada una de las funciones que puede
usar nuestro agente de ollama de forma Agent loop
*/
import type { Tool } from 'ollama'


// type para agent tools
type ToolFuncion = (args: Record<string, any>) => string | Promise<string>

interface RegisteredTool {
  definition: Tool
  execute: ToolFuncion
}

// registro de toools continias para ollama
const registry: RegisteredTool[] = [
// {
//   definition: {
//     type: 'function',
//     function: {
//       name: 'get_temperature',
//       description: 'Get the current temperature for a city',
//       parameters: {
//         type: 'object',
//         required: ['city'],
//         properties: {
//           city: { type: 'string', description: 'The name of the city' },
//         },
//       },
//     },
//   },
//   execute: (args) => {
//     const temps: Record<string, string> = { 'New York': '22°C', 'London': '15°C' }
//     return temps[args.city] ?? 'Unknown'
//   },
// },
]

// exportamos el map de Tools
export const tools: Tool[] = registry.map(t => t.definition)

// obtenemos el register tool para acceder al execute
export async function executeTool(name: string, args: Record<string, any>): Promise<string> {
  const tool = registry.find(t => t.definition.function.name === name)
  if (!tool) return 'Unknown tool'
  return String(await tool.execute(args))
}
