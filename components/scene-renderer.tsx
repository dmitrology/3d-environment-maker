"use client"

import { createSafeR3fComponent } from "./safe-r3f-wrapper"
import SafeModelLoader from "./safe-model-loader"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"

// Your original scene content
function SceneContent({ scene }) {
  if (!scene) return null

  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <Environment preset="sunset" />

      {/* Use SafeModelLoader for each model in the scene */}
      {scene.models?.map((model, index) => (
        <SafeModelLoader
          key={index}
          url={model.url || "/models/duck.glb"}
          position={model.position || [0, 0, 0]}
          scale={model.scale || 1}
          fallback={
            <mesh position={model.position || [0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#801650" />
            </mesh>
          }
        />
      ))}

      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={1.5} />
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  )
}

// Create a safe version of the scene
const SafeSceneRenderer = createSafeR3fComponent(SceneContent)

// Export the wrapped component
export function SceneRenderer({ scene }) {
  return <SafeSceneRenderer scene={scene} />
}
