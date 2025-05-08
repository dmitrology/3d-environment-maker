"use client"

import type React from "react"

import { useEffect } from "react"

// This component helps identify if we're inside a Canvas context
export function DebugCanvasContext() {
  useEffect(() => {
    console.log("DebugCanvasContext: Component mounted")
    return () => {
      console.log("DebugCanvasContext: Component unmounted")
    }
  }, [])

  return null
}

// Use this to wrap any component that might be using R3F hooks
export function SafeR3FComponent({ children }: { children: React.ReactNode }) {
  // This is a client component that doesn't use any R3F hooks
  return <>{children}</>
}
