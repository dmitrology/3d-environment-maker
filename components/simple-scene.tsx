"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from "@react-three/drei"
import { Suspense, useState, useEffect } from "react"
import { SafeLoading } from "./html-wrapper"
import { CanvasContextProvider } from "./canvas-context"
import dynamic from "next/dynamic"

// Dynamically import components that use R3F hooks
const DynamicModelSpawner = dynamic(() => import("./model-spawner").then((mod) => ({ default: mod.ModelSpawner })), {
  ssr: false,
  loading: () => null, // This won't render outside Canvas
})

interface SimpleSceneProps {
  prompt?: string
}

export function SimpleScene({ prompt = "An empty scene" }: SimpleSceneProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center bg-gray-900 text-white">
        Loading 3D scene...
      </div>
    )
  }

  return (
    <div className="w-full h-[500px] relative">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }} gl={{ antialias: true }}>
        <CanvasContextProvider>
          <color attach="background" args={["#101010"]} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />

          <Suspense fallback={<SafeLoading message="Loading scene..." />}>
            <Environment preset="sunset" />
            <Grid
              infiniteGrid
              cellSize={1}
              cellThickness={0.5}
              cellColor="#555"
              sectionSize={5}
              sectionThickness={1}
              sectionColor="#888"
              fadeDistance={50}
            />

            <DynamicModelSpawner prompt={prompt} />
          </Suspense>

          <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={20} />
        </CanvasContextProvider>
      </Canvas>

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        Prompt: {prompt}
      </div>
    </div>
  )
}
