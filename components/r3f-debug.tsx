"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Html } from "@react-three/drei"

// This component will help identify where HTML is being used incorrectly inside Canvas
export function DebugHtml({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log("DebugHtml mounted")
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <Html>
      <div className="bg-black/80 text-white p-2 rounded text-xs max-w-xs">
        <div className="font-bold text-green-400">Debug HTML Content:</div>
        <div className="mt-1">{children}</div>
      </div>
    </Html>
  )
}

// This component will help identify where hooks are being used outside Canvas
export function CanvasDetector() {
  const [isDetected, setIsDetected] = useState(false)

  useEffect(() => {
    console.log("✅ Canvas context detected")
    setIsDetected(true)

    return () => {
      console.log("❌ Canvas context unmounted")
    }
  }, [])

  return isDetected ? (
    <Html>
      <div className="bg-green-900/80 text-white p-1 rounded text-xs">Canvas context active</div>
    </Html>
  ) : null
}
