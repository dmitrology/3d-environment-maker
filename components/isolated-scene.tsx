"use client"

import { createSafeR3fComponent } from "./safe-r3f-wrapper"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { IsolatedModelSpawner } from "./isolated-model-spawner"

// Your original isolated scene content
function IsolatedSceneContent({ models = [], environment = "sunset" }) {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      <Environment preset={environment} />

      <IsolatedModelSpawner models={models} />

      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  )
}

// Create a safe version of the isolated scene
const SafeIsolatedScene = createSafeR3fComponent(IsolatedSceneContent)

// Export the wrapped component
export function IsolatedScene(props) {
  return <SafeIsolatedScene {...props} />
}
