"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, useGLTF, Environment, ContactShadows } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Mesh, Group } from "three"

// Model component that loads and displays a GLTF model
function Model({ url, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) {
  const groupRef = useRef<Group>(null)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load the model with error handling
  const { scene, animations } = useGLTF(
    url,
    true,
    // Success callback
    () => setModelLoaded(true),
    // Error callback
    (e) => {
      console.error("Error loading model:", e)
      setError(e.message || "Failed to load model")
    },
  )

  // Simple rotation animation
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.2
    }
  })

  // If there was an error loading the model, show a fallback cube
  if (error) {
    return <FallbackCube position={position} />
  }

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <primitive object={scene.clone()} />
    </group>
  )
}

// Fallback cube component
function FallbackCube({ color = "#801650", position = [0, 0, 0] }) {
  const meshRef = useRef<Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Main scene component
export default function YourScene({ sceneType = "abstract", lighting = "studio", modelUrl = "/models/duck.glb" }) {
  // Convert scene type to model configuration
  const getModelConfig = () => {
    switch (sceneType.toLowerCase()) {
      case "fantasy":
        return {
          url: modelUrl,
          scale: 2,
          position: [0, 0, 0],
        }
      case "sci-fi":
        return {
          url: modelUrl,
          scale: 1.5,
          position: [0, 0.5, 0],
        }
      case "nature":
        return {
          url: modelUrl,
          scale: 2.5,
          position: [0, -0.5, 0],
        }
      case "abstract":
      default:
        return {
          url: modelUrl,
          scale: 2,
          position: [0, 0, 0],
        }
    }
  }

  // Get environment preset based on lighting setting
  const getEnvironmentPreset = () => {
    switch (lighting.toLowerCase()) {
      case "day":
        return "park"
      case "night":
        return "night"
      case "sunset":
        return "sunset"
      case "studio":
      default:
        return "studio"
    }
  }

  const modelConfig = getModelConfig()
  const environmentPreset = getEnvironmentPreset()

  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={lighting === "day" ? 1 : 0.5} castShadow />

      {/* Environment based on lighting setting */}
      <Environment preset={environmentPreset} />

      {/* Main model with fallback */}
      <Model url={modelConfig.url} scale={modelConfig.scale} position={modelConfig.position} />

      {/* Ground with shadows */}
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={1.5} />

      {/* Camera controls */}
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={10} />
    </Canvas>
  )
}
