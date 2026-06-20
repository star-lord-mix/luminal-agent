import { Text } from "ink"
import React, { useEffect, useState } from "react"

function mix(hexA: string, hexB: string, t: number) {
  const a = parseInt(hexA.slice(1), 16), b = parseInt(hexB.slice(1), 16)
  const ar=(a>>16)&255, ag=(a>>8)&255, ab=a&255
  const br=(b>>16)&255, bg=(b>>8)&255, bb=b&255
  const r = Math.round(ar + (br-ar)*t), g = Math.round(ag + (bg-ag)*t), bl = Math.round(ab + (bb-ab)*t)
  return `#${[r,g,bl].map(n => n.toString(16).padStart(2,'0')).join('')}`
}

type ShinyTextProps = {
  text: string
  base?: string
  shine?: string
  speed?: number
  bandWidth?: number
  enabled?: boolean
  bold?: boolean
}

export function ShinyText({text, base='#808080', shine='#ffffff', speed=60, bandWidth=3, enabled=true, bold=false}: ShinyTextProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    if (!enabled) return
    const id = setInterval(() => setOffset(o => (o + 1) % (text.length + bandWidth * 2)), speed)
    return () => clearInterval(id)
  }, [text, speed, enabled, bandWidth])

  if (!enabled) {
    return <Text color={base} bold={bold}>{text}</Text>
  }

  return (
    <Text bold={bold}>
      {text.split('').map((char, i) => {
        const t = Math.max(0, 1 - Math.abs(i - offset) / bandWidth)
        return <Text key={i} color={mix(base, shine, t)} bold={bold}>{char}</Text>
      })}
    </Text>
  )
}
