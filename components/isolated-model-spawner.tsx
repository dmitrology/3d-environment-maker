"use client"

import SafeModelLoader from "./safe-model-loader"

export function IsolatedModelSpawner({ models = [] }) {
  return (
    <group>
      {models.map((model, index) => (
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
    </group>
  )
}
