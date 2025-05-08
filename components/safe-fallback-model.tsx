"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Sphere, Torus, Cylinder } from "@react-three/drei"
import type * as THREE from "three"

// Types of procedural models we can generate
type FallbackType = "cube" | "sphere" | "torus" | "cylinder" | "random"

interface SafeFallbackModelProps {
  type?: FallbackType
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  color?: string
  wireframe?: boolean
  animate?: boolean
}

export default function SafeFallbackModel({
  type = "cube",
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#ff00ff",
  wireframe = false,
  animate = true,
}: SafeFallbackModelProps) {
  const ref = useRef<THREE.Mesh>(null)

  // Random rotation for animation
  const rotationSpeed = useRef({
    x: Math.random() * 0.01,
    y: Math.random() * 0.01 + 0.005,
    z: Math.random() * 0.005,
  })

  // Animate the model
  useFrame(() => {
    if (animate && ref.current) {
      ref.current.rotation.x += rotationSpeed.current.x
      ref.current.rotation.y += rotationSpeed.current.y
      ref.current.rotation.z += rotationSpeed.current.z
    }
  })

  // Choose a random type if "random" is specified
  const actualType =
    type === "random" ? (["cube", "sphere", "torus", "cylinder"][Math.floor(Math.random() * 4)] as FallbackType) : type

  // Common material props
  const materialProps = {
    color,
    wireframe,
  }

  // Render the appropriate geometry based on type
  return (
    <mesh ref={ref} position={position} rotation={rotation} scale={scale}>
      {actualType === "cube" && (
        <Box args={[1, 1, 1]}>
          <meshStandardMaterial {...materialProps} />
        </Box>
      )}
      {actualType === "sphere" && (
        <Sphere args={[0.5, 32, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Sphere>
      )}
      {actualType === "torus" && (
        <Torus args={[0.3, 0.15, 16, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Torus>
      )}
      {actualType === "cylinder" && (
        <Cylinder args={[0.3, 0.3, 1, 32]}>
          <meshStandardMaterial {...materialProps} />
        </Cylinder>
      )}
    </mesh>
  )
}
