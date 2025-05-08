"use client"

import { Component, type ErrorInfo, type ReactNode } from "react"
import { Html } from "@react-three/drei"

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // Check if we're inside a Canvas context
      const isInsideCanvas = typeof window !== "undefined" && window.document.querySelector("canvas")

      if (isInsideCanvas) {
        return (
          <Html center>
            <div className="bg-red-900/80 text-white p-4 rounded-lg max-w-md">
              <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
              <p className="mb-4">{this.state.error?.message}</p>
              <p className="text-sm opacity-80">
                This is likely an issue with the 3D rendering. Try refreshing the page.
              </p>
            </div>
          </Html>
        )
      }

      // Regular HTML error display for outside Canvas
      return (
        <div className="bg-red-900/80 text-white p-4 rounded-lg max-w-md mx-auto my-8">
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="mb-4">{this.state.error?.message}</p>
          <p className="text-sm opacity-80">Try refreshing the page.</p>
        </div>
      )
    }

    return this.props.children
  }
}
