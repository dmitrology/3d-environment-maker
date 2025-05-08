"use client"

import { useState, useEffect, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import { useThree } from "@react-three/fiber"
import SafeFallbackModel from "./safe-fallback-model"

interface SafeModelLoaderProps {
  url: string
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number | [number, number, number]
  fallbackType?: "cube" | "sphere" | "torus" | "cylinder" | "random"
  fallbackColor?: string
}

export default function SafeModelLoader({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  fallbackType = "cube",
  fallbackColor = "#ff00ff",
}: SafeModelLoaderProps) {
  const [error, setError] = useState<Error | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { invalidate } = useThree()
  const modelRef = useRef<any>(null)

  // Load the model (useGLTF must be called unconditionally)
  const gltf = useGLTF(url)

  useEffect(() => {
    if (gltf) {
      modelRef.current = gltf
      setIsLoading(false)
      invalidate() // Force a re-render
    }
  }, [gltf, invalidate])

  useEffect(() => {
    if (!isLoading && !modelRef.current) {
      console.error("Error loading model:", url)
      setError(new Error(`Failed to load model from ${url}`))
    }
  }, [isLoading, url])

  // If there's an error or we're still loading, show the fallback
  if (error || isLoading) {
    return (
      <SafeFallbackModel
        type={fallbackType}
        position={position}
        rotation={rotation}
        scale={scale}
        color={fallbackColor}
      />
    )
  }

  // If the model loaded successfully, show it
  return <primitive object={modelRef.current.scene} position={position} rotation={rotation} scale={scale} />
}
