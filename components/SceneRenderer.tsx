"use client"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Loader, Html } from "@react-three/drei"
import GltfModel from "./GltfModel"
import { Suspense, useState } from "react"

interface SceneObject {
  type: string
  modelUrl: string
  position: [number, number, number]
  scale: number | [number, number, number]
  rotation?: [number, number, number]
}

interface SceneRendererProps {
  objects: SceneObject[]
}

export function SceneRenderer({ objects }: SceneRendererProps) {
  const [canvasError, setCanvasError] = useState<string | null>(null)

  // Handle errors and edge cases
  if (!objects) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No scene data available</p>
      </div>
    )
  }

  if (!Array.isArray(objects) || objects.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-gray-500">No objects to display</p>
      </div>
    )
  }

  // Error boundary for the Canvas
  const handleCanvasError = (error: Error) => {
    console.error("Canvas error:", error)
    setCanvasError(error.message || "An error occurred in the 3D renderer")
  }

  // If there was a Canvas error, show a fallback
  if (canvasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-red-900/20">
        <div className="text-center p-4">
          <h3 className="text-red-500 font-bold mb-2">Rendering Error</h3>
          <p className="text-gray-300">{canvasError}</p>
          <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded" onClick={() => setCanvasError(null)}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      <Canvas shadows onError={handleCanvasError}>
        <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />
        <Suspense
          fallback={
            <Html center>
              <div className="bg-black/80 text-white p-4 rounded">
                <div className="animate-spin h-6 w-6 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                <p>Loading scene...</p>
              </div>
            </Html>
          }
        >
          <Environment preset="sunset" />
          <ambientLight intensity={1} />
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />

          {objects.map((obj, idx) => (
            <GltfModel key={idx} url={obj.modelUrl} position={obj.position} scale={obj.scale} rotation={obj.rotation} />
          ))}

          {/* Ground plane */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
            <planeGeometry args={[100, 100]} />
            <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
          </mesh>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={0.5} />
      </Canvas>
      <Loader />
    </>
  )
}
