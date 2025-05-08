"use client"

import { useEffect, useState, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { Box, Html } from "@react-three/drei"

interface GltfModelProps {
  url: string
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export default function GltfModel({ url, position = [0, 0, 0], scale = 1, rotation = [0, 0, 0] }: GltfModelProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { scene, animations } = useGLTF(url)
  const isPlaceholder = url.includes("placeholder")
  const errorRef = useRef<string | null>(null)

  useEffect(() => {
    if (scene) {
      setLoading(false)
    }
  }, [scene])

  useEffect(() => {
    if (scene === null) {
      if (!isPlaceholder) {
        setError("Failed to load model")
        setLoading(false)
      }
    }
  }, [scene, isPlaceholder])

  // Handle placeholder URLs
  if (isPlaceholder) {
    return (
      <group position={position} rotation={rotation}>
        <Box args={[1, 1, 1]} scale={scale}>
          <meshStandardMaterial color="#666" />
        </Box>
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-black/80 text-white p-2 rounded text-xs">Placeholder model</div>
        </Html>
      </group>
    )
  }

  // Render error state
  if (error) {
    return (
      <group position={position} rotation={rotation}>
        <Box args={[1, 1, 1]} scale={scale}>
          <meshStandardMaterial color="red" />
        </Box>
        <Html position={[0, 1.5, 0]} center>
          <div className="bg-red-900/80 text-white p-2 rounded text-xs">Error: {error}</div>
        </Html>
      </group>
    )
  }

  // Render loading state
  if (loading) {
    return (
      <group position={position} rotation={rotation}>
        <Box args={[1, 1, 1]} scale={scale}>
          <meshStandardMaterial color="blue" wireframe />
        </Box>
      </group>
    )
  }

  // Render the model
  return scene ? <primitive object={scene.clone()} position={position} rotation={rotation} scale={scale} /> : null
}
