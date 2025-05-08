"use client"

import { Html } from "@react-three/drei"
import type { ReactNode } from "react"
import { useThree } from "@react-three/fiber"

// This component safely wraps HTML content inside Canvas
export function HtmlWrapper({
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
  // This will throw if not inside Canvas, preventing the component from rendering
  useThree()

  return (
    <Html center={center} className={className} position={position} prepend>
      <div className="r3f-html-content">{children}</div>
    </Html>
  )
}

// Safe loading indicator for use inside Canvas
export function SafeLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <HtmlWrapper>
      <div className="bg-black/70 text-white p-2 rounded text-sm flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
        {message}
      </div>
    </HtmlWrapper>
  )
}

// Safe error display for use inside Canvas
export function SafeError({ message }: { message: string }) {
  return (
    <HtmlWrapper>
      <div className="bg-red-900/80 text-white p-2 rounded text-sm max-w-xs">
        <strong>Error:</strong> {message}
      </div>
    </HtmlWrapper>
  )
}
