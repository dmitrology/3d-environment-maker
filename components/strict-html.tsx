"use client"

import { Html } from "@react-three/drei"
import { type ReactNode, useEffect, useState } from "react"

// This component ensures HTML is properly wrapped and only used inside Canvas
export function StrictHtml({ children, className = "" }: { children: ReactNode; className?: string }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Html>
      <div className={className}>{children}</div>
    </Html>
  )
}

// Safe loading indicator for use inside Canvas
export function StrictLoading({ message = "Loading..." }: { message?: string }) {
  return (
    <StrictHtml className="bg-black/70 text-white p-2 rounded text-sm flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-t-white border-white/30 rounded-full animate-spin"></div>
      {message}
    </StrictHtml>
  )
}

// Safe error display for use inside Canvas
export function StrictError({ message }: { message: string }) {
  return (
    <StrictHtml className="bg-red-900/80 text-white p-2 rounded text-sm max-w-xs">
      <strong>Error:</strong> {message}
    </StrictHtml>
  )
}
