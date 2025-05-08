"use client"

import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, useProgress, Html } from "@react-three/drei"
import { GltfModel } from "@/components/gltf-model"
import type { SceneDescription } from "@/components/scene-renderer"

// Loading indicator component
function Loader() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="h-8 w-8 animate-spin text-purple-500 mb-2 border-2 border-purple-500 border-t-transparent rounded-full" />
        <p className="text-white text-sm">Loading {progress.toFixed(0)}%</p>
      </div>
    </Html>
  )
}

interface ThreeCanvasProps {
  scene: SceneDescription
  autoRotate: boolean
}

export default function ThreeCanvas({ scene, autoRotate }: ThreeCanvasProps) {
  return (
    <Canvas shadows>
      <PerspectiveCamera makeDefault position={scene.cameraPosition || [0, 2, 5]} fov={50} />

      <Suspense fallback={<Loader />}>
        {/* Environment lighting */}
        <Environment preset={scene.environment || "studio"} />

        {/* Background model if available */}
        {scene.background && <GltfModel url={scene.background} position={[0, 0, -2]} scale={2} />}

        {/* Character model if available */}
        {scene.character && <GltfModel url={scene.character} position={[0, 0, 0]} animate={true} />}

        {/* Props if available */}
        {scene.props?.map((propUrl, index) => {
          // Position props in a circle around the center
          const angle = (index / (scene.props?.length || 1)) * Math.PI * 2
          const radius = 2
          const x = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius

          return <GltfModel key={index} url={propUrl} position={[x, 0, z]} scale={0.5} rotation={[0, -angle, 0]} />
        })}

        {/* Fallback cube if no models are provided */}
        {!scene.background && !scene.character && (!scene.props || scene.props.length === 0) && (
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="purple" />
          </mesh>
        )}

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#111" roughness={0.8} metalness={0.2} />
        </mesh>

        {/* Ambient light */}
        <ambientLight intensity={0.5} />

        {/* Directional light with shadow */}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
      </Suspense>

      {/* Camera controls */}
      <OrbitControls
        autoRotate={autoRotate}
        autoRotateSpeed={1}
        enableZoom={true}
        enablePan={true}
        minDistance={2}
        maxDistance={10}
      />
    </Canvas>
  )
}
