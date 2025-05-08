"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import SafeFallbackModel from "./safe-fallback-model"
import SafeModelLoader from "./safe-model-loader"

interface YourSceneProps {
  sceneType?: string
  lighting?: string
}

export default function YourScene({ sceneType = "fantasy", lighting = "day" }: YourSceneProps) {
  // Map scene type to model properties
  const getModelProps = () => {
    switch (sceneType) {
      case "fantasy":
        return {
          models: [
            { type: "cube", position: [-2, 0, 0], color: "#8844ff" },
            { type: "sphere", position: [0, 0, 0], color: "#44ff88" },
            { type: "torus", position: [2, 0, 0], color: "#ff4488" },
          ],
        }
      case "sci-fi":
        return {
          models: [
            { type: "cylinder", position: [-2, 0, 0], color: "#44aaff" },
            { type: "cube", position: [0, 0, 0], color: "#ffaa44" },
            { type: "sphere", position: [2, 0, 0], color: "#ff44aa" },
          ],
        }
      default:
        return {
          models: [{ type: "cube", position: [0, 0, 0], color: "#ff00ff" }],
        }
    }
  }

  // Map lighting to environment and light properties
  const getLightingProps = () => {
    switch (lighting) {
      case "day":
        return {
          environment: "park",
          intensity: 1,
          ambientIntensity: 0.5,
        }
      case "night":
        return {
          environment: "night",
          intensity: 0.5,
          ambientIntensity: 0.2,
        }
      case "studio":
        return {
          environment: "studio",
          intensity: 1.5,
          ambientIntensity: 0.8,
        }
      default:
        return {
          environment: "sunset",
          intensity: 1,
          ambientIntensity: 0.5,
        }
    }
  }

  const { models } = getModelProps()
  const { environment, intensity, ambientIntensity } = getLightingProps()

  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <color attach="background" args={["#000000"]} />

      {/* Lighting */}
      <ambientLight intensity={ambientIntensity} />
      <directionalLight position={[10, 10, 5]} intensity={intensity} castShadow />

      {/* Environment */}
      <Environment preset={environment} />

      {/* Models */}
      {models.map((model, index) => (
        <SafeFallbackModel
          key={index}
          type={model.type as any}
          position={model.position as [number, number, number]}
          color={model.color}
          animate
        />
      ))}

      {/* Try to load a remote model but fall back gracefully */}
      <SafeModelLoader
        url="/models/duck.glb"
        position={[0, 1, 0]}
        scale={0.5}
        fallbackType="random"
        fallbackColor="#ffaa00"
      />

      {/* Ground */}
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={1.5} />

      {/* Controls */}
      <OrbitControls enableDamping dampingFactor={0.05} />
    </Canvas>
  )
}
