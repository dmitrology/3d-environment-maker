"use client"

import { CanvasHtml } from "./canvas-safe-zone"

type Props = {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
  error: Error | null
}

export function ModelFallback({ position, rotation, scale, error }: Props) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Error cube */}
      <mesh castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" wireframe />
      </mesh>

      {/* Error message */}
      {error && (
        <CanvasHtml position={[0, 1.5, 0]}>
          <div className="bg-red-900/80 text-white p-2 rounded text-xs whitespace-nowrap">{error.message}</div>
        </CanvasHtml>
      )}
    </group>
  )
}
