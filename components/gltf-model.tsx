"use client"

import { useEffect, useState } from "react"
import { Box, Html } from "@react-three/drei"

interface GltfModelProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  animate?: boolean
}

// Simple fallback model component
function FallbackBox({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  color = "#666666",
  label = "Fallback Model",
}) {
  const scaleArray = Array.isArray(scale) ? scale : [scale, scale, scale]

  return (
    <group position={position} rotation={rotation} scale={scaleArray}>
      <Box args={[1, 1, 1]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Html position={[0, 1.5, 0]} center>
        <div className="bg-black/80 text-white p-2 rounded text-xs">{label}</div>
      </Html>
    </group>
  )
}

export function GltfModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animate = false,
}: GltfModelProps) {
  // Always initialize state at the top level
  const [modelState, setModelState] = useState({
    scene: null,
    error: null,
    loading: true,
  })

  // Convert scale to array if it's a number
  const scaleArray = Array.isArray(scale) ? scale : [scale, scale, scale]

  // Check if this is a valid model URL
  const isValidUrl =
    url && !url.includes("placeholder") && !url.startsWith("/placeholder") && url.match(/\.(glb|gltf)$/i) !== null

  // Use effect to load the model
  useEffect(() => {
    if (!isValidUrl) {
      setModelState({
        scene: null,
        error: "Invalid model URL",
        loading: false,
      })
      return
    }

    // In a real implementation, we would load the model here
    // For now, just simulate loading
    const timer = setTimeout(() => {
      setModelState({
        scene: null,
        error: null,
        loading: false,
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [url, isValidUrl])

  // If the URL is not valid or there was an error loading the model, render a fallback
  if (!isValidUrl || modelState.error) {
    return (
      <FallbackBox
        position={position}
        rotation={rotation}
        scale={scale}
        color={modelState.error ? "#ff4444" : "#666666"}
        label={modelState.error ? `Error: ${modelState.error}` : "Fallback Model"}
      />
    )
  }

  // If the model is still loading, render a loading indicator
  if (modelState.loading) {
    return <FallbackBox position={position} rotation={rotation} scale={scale} color="#3366ff" label="Loading..." />
  }

  // For now, always render a fallback since we're not actually loading models
  return <FallbackBox position={position} rotation={rotation} scale={scale} color="#44aa44" label="Model Placeholder" />
}
