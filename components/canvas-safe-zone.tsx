"use client"

import type { ReactNode } from "react"
import { Html } from "@react-three/drei"
import { useThree } from "@react-three/fiber"

// This component ensures it's only rendered inside a Canvas
export function CanvasSafeZone({ children }: { children: ReactNode }) {
  // This will throw the appropriate error if used outside Canvas
  // but will work fine inside Canvas
  const state = useThree()

  return <>{children}</>
}

// This component safely wraps HTML content for Canvas
export function CanvasHtml({
  children,
  center = true,
  position = [0, 0, 0],
  className = "",
}: {
  children: ReactNode
  center?: boolean
  position?: [number, number, number]
  className?: string
}) {
  return (
    <CanvasSafeZone>
      <Html center={center} position={position} className={className}>
        {children}
      </Html>
    </CanvasSafeZone>
  )
}

// This component provides a loading indicator
export function CanvasLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <CanvasHtml>
      <div className="bg-black/70 text-white p-2 rounded text-sm animate-pulse">{message}</div>
    </CanvasHtml>
  )
}

// This component provides an error display
export function CanvasError({ error }: { error: Error | null }) {
  return (
    <CanvasHtml>
      <div className="bg-red-900/80 text-white p-2 rounded text-xs max-w-xs">
        <strong>Error:</strong> {error?.message || "Unknown error"}
      </div>
    </CanvasHtml>
  )
}
