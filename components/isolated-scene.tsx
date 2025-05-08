"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Grid } from "@react-three/drei"
import { Suspense } from "react"
import { StrictLoading } from "./strict-html"
import { CanvasDetector } from "./r3f-debug"
import dynamic from "next/dynamic"

// Dynamically import components that use R3F hooks with SSR disabled
const DynamicModelSpawner = dynamic(() => import("./isolated-model-spawner"), {
  ssr: false,
  loading: () => <div className="text-white">Loading model spawner...</div>,
})

interface IsolatedSceneProps {
  prompt?: string
}

function IsolatedSceneContent({ prompt = "An empty scene" }: IsolatedSceneProps) {
  return (
    <div className="w-full h-[500px] relative">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }} gl={{ antialias: true }}>
        {/* Debug component to verify Canvas context */}
        <CanvasDetector />

        <color attach="background" args={["#101010"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow shadow-mapSize={[2048, 2048]} />

        <Suspense fallback={<StrictLoading message="Loading scene..." />}>
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
      </Canvas>

      <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded text-sm">
        Prompt: {prompt}
      </div>
    </div>
  )
}

// Export a dynamic component with SSR disabled to ensure it only runs on client
export default dynamic(() => Promise.resolve(IsolatedSceneContent), {
  ssr: false,
})
