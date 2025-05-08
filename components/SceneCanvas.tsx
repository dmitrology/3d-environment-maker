import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Html, Loader } from "@react-three/drei"
import GltfModel from "./GltfModel"

interface SceneCanvasProps {
  models: string[]
  isLoading?: boolean
}

export default function SceneCanvas({ models, isLoading = false }: SceneCanvasProps) {
  return (
    <div className="relative aspect-video w-full bg-gray-900 rounded-lg overflow-hidden">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-2"></div>
            <p className="text-white">Loading models...</p>
          </div>
        </div>
      ) : (
        <>
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[0, 5, 10]} fov={50} />

            <Suspense
              fallback={
                <Html center>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-t-blue-500 border-blue-200 rounded-full animate-spin mb-2"></div>
                    <p className="text-white text-sm">Loading scene...</p>
                  </div>
                </Html>
              }
            >
              <Environment preset="sunset" />

              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

              {/* Render models */}
              {models.length > 0 ? (
                models.map((url, index) => {
                  // Calculate position to space models evenly
                  const position: [number, number, number] = [
                    index * 3 - (models.length * 3) / 2, // X position
                    0, // Y position
                    0, // Z position
                  ]

                  return <GltfModel key={index} url={url} position={position} scale={1.5} />
                })
              ) : (
                // Render a placeholder if no models
                <GltfModel url="/placeholder.svg" position={[0, 0, 0]} scale={1.5} />
              )}

              {/* Ground plane */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
              </mesh>
            </Suspense>

            <OrbitControls
              autoRotate
              autoRotateSpeed={0.5}
              enableZoom={true}
              enablePan={true}
              minDistance={3}
              maxDistance={20}
            />
          </Canvas>
          <Loader />
        </>
      )}
    </div>
  )
}
