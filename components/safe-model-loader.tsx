"use client"

import { useGLTF } from "@react-three/drei"
import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import type { Group } from "three"

export default function SafeModelLoader({
  url,
  scale = 1,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  animate = true,
  fallback = null,
  onLoad = () => {},
  onError = () => {},
}) {
  const groupRef = useRef<Group>(null)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  // Load the model with error handling
  const { scene, animations } = useGLTF(
    url,
    true,
    // Success callback
    () => {
      setLoaded(true)
      onLoad({ scene, animations })
    },
    // Error callback
    (e) => {
      console.error(`Error loading model ${url}:`, e)
      setError(e.message || "Failed to load model")
      onError(e)
    },
  )

  // Simple rotation animation if animate is true
  useFrame((state) => {
    if (animate && groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  // If there was an error loading the model, show the fallback
  if (error) {
    return fallback
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      {loaded && <primitive object={scene.clone()} />}
    </group>
  )
}
