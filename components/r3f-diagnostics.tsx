"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useThree, useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"

// This component will help us detect if we're inside a Canvas context
export function CanvasDetector() {
  const [isInsideCanvas, setIsInsideCanvas] = useState<boolean | null>(null)
  const three = useRef<any>(null)

  useEffect(() => {
    try {
      // This will throw if not inside Canvas
      three.current = useThree()

      // If we get here, we're inside Canvas
      console.log("✅ CanvasDetector: Inside Canvas context")
      setIsInsideCanvas(true)
    } catch (error) {
      // If we get here, we're NOT inside Canvas
      console.error("❌ CanvasDetector: NOT inside Canvas context")
      setIsInsideCanvas(false)
    }
  }, [])

  if (isInsideCanvas === null) return null

  return isInsideCanvas ? (
    <Html>
      <div className="hidden">Canvas context detected</div>
    </Html>
  ) : null
}

// This HOC ensures a component is only rendered inside Canvas
export function withCanvasCheck<P extends object>(Component: React.ComponentType<P>, fallback: React.ReactNode = null) {
  return function CanvasCheckedComponent(props: P) {
    const three = useRef<any>(null)
    const [isInside, setIsInside] = useState(false)

    useEffect(() => {
      try {
        // This will throw if not inside Canvas
        three.current = useThree()
        setIsInside(true)
      } catch (error) {
        console.error(`❌ Component ${Component.name} rendered outside Canvas!`)
        setIsInside(false)
      }
    }, [])

    return isInside ? <Component {...props} /> : fallback
  }
}

// This component will help us detect any raw HTML inside Canvas
export function HtmlDetector() {
  useEffect(() => {
    // Find all direct children of Canvas that are HTML elements
    const canvas = document.querySelector("canvas")
    if (!canvas) return

    const parent = canvas.parentElement
    if (!parent) return

    const htmlElements = Array.from(parent.children).filter(
      (el) => el.tagName !== "CANVAS" && !el.className?.includes("r3f-html"),
    )

    if (htmlElements.length > 0) {
      console.error("❌ Raw HTML elements detected inside Canvas:", htmlElements)
    } else {
      console.log("✅ No raw HTML elements detected inside Canvas")
    }
  }, [])

  return null
}

// This component will help us detect if hooks are being used correctly
export function HookDetector() {
  const [frameCount, setFrameCount] = useState(0)

  // This will only work inside Canvas
  useFrame(() => {
    setFrameCount((prev) => prev + 1)
  })

  useEffect(() => {
    if (frameCount > 0) {
      console.log(`✅ HookDetector: useFrame is working (${frameCount} frames)`)
    }
  }, [frameCount])

  return null
}
