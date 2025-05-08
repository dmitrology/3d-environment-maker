"use client"

import { Html } from "@react-three/drei"
import type { ReactNode } from "react"

// Always use this instead of direct Html from drei
export function SafeHtml({
  children,
  center = true,
  className = "",
  position,
}: {
  children: ReactNode
  center?: boolean
  className?: string
  position?: [number, number, number]
}) {
  return (
    <Html center={center} className={className} position={position}>
      {children}
    </Html>
  )
}

// Use for loading states
export function SafeLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <SafeHtml>
      <div className="bg-black/70 text-white p-2 rounded text-sm">{message}</div>
    </SafeHtml>
  )
}

// Use for error states
export function SafeError({ error }: { error: Error | null }) {
  return (
    <SafeHtml>
      <div className="bg-red-900/80 text-white p-2 rounded text-xs max-w-xs">
        <strong>Error:</strong> {error?.message || "Unknown error"}
      </div>
    </SafeHtml>
  )
}
