"use client"

import { Html } from "@react-three/drei"

interface ThreeLoadingProps {
  message?: string
  position?: [number, number, number]
}

export function ThreeLoading({ message = "Loading...", position = [0, 0, 0] }: ThreeLoadingProps) {
  return (
    <Html center position={position}>
      <div className="bg-black/70 text-white p-2 rounded text-sm animate-pulse">{message}</div>
    </Html>
  )
}
