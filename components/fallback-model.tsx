"use client"

import { Box, Html } from "@react-three/drei"

interface FallbackModelProps {
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
  label?: string
}

export function FallbackModel({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#666666",
  label = "Fallback Model",
}: FallbackModelProps) {
  const scaleArray = Array.isArray(scale) ? scale : [scale, scale, scale]

  return (
    <group position={position} rotation={rotation} scale={scaleArray}>
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-black/80 text-white p-2 rounded text-xs">{label}</div>
      </Html>
    </group>
  )
}
