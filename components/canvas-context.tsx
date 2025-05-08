"use client"

import type React from "react"

import { type ReactNode, createContext, useContext, useEffect, useState } from "react"
import { useThree } from "@react-three/fiber"

// Create a context to track if we're inside a Canvas
const CanvasContext = createContext<boolean>(false)

// Hook to check if we're inside Canvas
export function useCanvasContext() {
  return useContext(CanvasContext)
}

// Component that detects Canvas context and provides it to children
export function CanvasContextProvider({ children }: { children: ReactNode }) {
  const [isInsideCanvas, setIsInsideCanvas] = useState(false)

  // Try to use useThree to detect if we're inside Canvas
  useEffect(() => {
    try {
      // This will throw if not inside Canvas
      useThree()
      setIsInsideCanvas(true)
      console.log("✅ Component is inside Canvas context")
    } catch (error) {
      setIsInsideCanvas(false)
      console.error("❌ Component is NOT inside Canvas context")
    }
  }, [])

  return <CanvasContext.Provider value={isInsideCanvas}>{children}</CanvasContext.Provider>
}

// HOC to ensure a component only uses R3F hooks when inside Canvas
export function withCanvasCheck<P extends object>(Component: React.ComponentType<P>) {
  return function CanvasCheckedComponent(props: P) {
    const [isMounted, setIsMounted] = useState(false)
    const [isInCanvas, setIsInCanvas] = useState(false)

    // Only mount on client
    useEffect(() => {
      setIsMounted(true)
    }, [])

    useEffect(() => {
      try {
        useThree()
        setIsInCanvas(true)
      } catch (error) {
        setIsInCanvas(false)
        console.error(`Component ${Component.name} cannot be used outside Canvas!`)
      }
    }, [isMounted])

    if (!isMounted) {
      return null
    }

    if (!isInCanvas) {
      return null
    }

    return <Component {...props} />
  }
}
