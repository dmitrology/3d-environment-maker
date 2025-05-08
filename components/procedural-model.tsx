"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { withCanvasCheck } from "./canvas-context"
import type * as THREE from "three"

type Props = {
  type: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

// Base component that will be wrapped with Canvas check
function ProceduralModelBase({ type, position, rotation = [0, 0, 0], scale = 1 }: Props) {
  const meshRef = useRef<THREE.Mesh>(null)

  // Simple animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01
    }
  })

  // Choose geometry based on type
  const getGeometry = () => {
    switch (type) {
      case "tree":
        return <coneGeometry args={[0.5, 2, 8]} />
      case "car":
        return <boxGeometry args={[1, 0.5, 2]} />
      case "house":
        return <boxGeometry args={[1, 1, 1]} />
      case "dog":
      case "cat":
        return <sphereGeometry args={[0.7, 16, 16]} />
      case "robot":
        return <cylinderGeometry args={[0.5, 0.5, 1.5, 16]} />
      default:
        return <boxGeometry args={[1, 1, 1]} />
    }
  }

  // Choose color based on type
  const getColor = () => {
    switch (type) {
      case "tree":
        return "#2d6a4f"
      case "car":
        return "#e63946"
      case "house":
        return "#457b9d"
      case "dog":
        return "#a8dadc"
      case "cat":
        return "#f4a261"
      case "robot":
        return "#adb5bd"
      default:
        return "#6c757d"
    }
  }

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} castShadow receiveShadow scale={scale}>
        {getGeometry()}
        <meshStandardMaterial color={getColor()} />
      </mesh>
    </group>
  )
}

// Export the wrapped version that's safe to use
export const ProceduralModel = withCanvasCheck(ProceduralModelBase)
