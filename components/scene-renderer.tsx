"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Html } from "@react-three/drei"
import { SimpleScene } from "./simple-scene"
import { ErrorBoundary } from "./error-boundary"

// Loading component that uses Html from drei
function Loader() {
  return (
    <Html center>
      <div className="bg-black/80 text-white p-6 rounded-lg text-center">
        <div className="text-2xl font-bold mb-2">Loading Scene</div>
        <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full w-1/2"></div>
        </div>
        <div className="mt-2">Loading models...</div>
      </div>
    </Html>
  )
}

// Fallback component for errors that uses Html from drei
function ThreeErrorFallback({ error }: { error: Error }) {
  return (
    <Html center>
      <div className="bg-red-900/80 text-white p-6 rounded-lg max-w-md">
        <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
        <p className="mb-4">{error.message}</p>
        <p className="text-sm opacity-80">Try refreshing the page or using a different prompt.</p>
      </div>
    </Html>
  )
}

interface SceneRendererProps {
  prompt: string
}

export function SceneRenderer({ prompt }: SceneRendererProps) {
  return (
    <div className="w-full h-[600px] relative">
      <ErrorBoundary>
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 5, 15]} fov={50} />
          <Suspense fallback={<Loader />}>
            <SimpleScene prompt={prompt} />
            <Environment preset="city" />
            <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={5} maxDistance={50} />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      <div className="absolute bottom-2 right-2 text-xs text-white/50">Visual Alchemy Engine</div>
    </div>
  )
}
