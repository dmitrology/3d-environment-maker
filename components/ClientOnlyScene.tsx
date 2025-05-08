"use client"

import React from "react"

import dynamic from "next/dynamic"
import { Suspense } from "react"

// Error boundary for R3F components
class R3FErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("3D Scene Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-white bg-red-900/20 p-4 rounded-lg max-w-md">
            <h3 className="font-bold text-lg mb-2">3D Rendering Error</h3>
            <p className="text-sm opacity-80">{this.state.error?.message || "Failed to render 3D scene"}</p>
            <button
              className="mt-4 px-3 py-1 bg-red-600 rounded text-sm"
              onClick={() => this.setState({ hasError: false })}
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Dynamic import of the scene component with SSR disabled
const Scene = dynamic(() => import("./YourScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-900">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  ),
})

export default function ClientOnlyScene(props) {
  return (
    <div className="w-full h-[600px]">
      <R3FErrorBoundary>
        <Suspense
          fallback={
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <div className="text-white">Loading 3D Scene...</div>
            </div>
          }
        >
          <Scene {...props} />
        </Suspense>
      </R3FErrorBoundary>
    </div>
  )
}
