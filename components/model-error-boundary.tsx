"use client"

import type React from "react"
import { Component, type ReactNode } from "react"
import { CanvasHtml } from "./canvas-safe-zone"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by ModelErrorBoundary:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <group>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="red" wireframe />
          </mesh>
          <CanvasHtml>
            <div className="bg-red-900/80 text-white p-2 rounded text-xs max-w-xs">
              <strong>3D Model Error:</strong> {this.state.error?.message || "Unknown error"}
            </div>
          </CanvasHtml>
        </group>
      )
    }

    return this.props.children
  }
}
