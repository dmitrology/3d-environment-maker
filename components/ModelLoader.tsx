"use client"

import { Suspense, useEffect, useState, useRef } from "react"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { Html, useProgress } from "@react-three/drei"
import { Box, Sphere } from "@react-three/drei"
import type * as THREE from "three"

interface ModelLoaderProps {
  url: string
  position?: [number, number, number]
  scale?: number | [number, number, number]
  rotation?: [number, number, number]
  fallbackType?: "box" | "sphere" | "none"
  fallbackColor?: string
}

function LoadingIndicator() {
  const { progress } = useProgress()
  return (
    <Html center>
      <div className="bg-black/80 text-white px-3 py-2 rounded-md text-sm">Loading... {Math.round(progress)}%</div>
    </Html>
  )
}

function ErrorDisplay({ error }: { error: Error }) {
  return (
    <Html center>
      <div className="bg-black/80 text-red-500 px-3 py-2 rounded-md text-sm max-w-xs text-center">
        Failed to load model: {error.message}
      </div>
    </Html>
  )
}

function FallbackModel({
  type = "box",
  color = "#ff0000",
  scale = 1,
}: { type?: "box" | "sphere"; color?: string; scale?: number | [number, number, number] }) {
  const scaleFactor = typeof scale === "number" ? [scale, scale, scale] : scale

  return type === "sphere" ? (
    <Sphere args={[1, 16, 16]} scale={scaleFactor}>
      <meshStandardMaterial color={color} />
    </Sphere>
  ) : (
    <Box args={[1, 1, 1]} scale={scaleFactor}>
      <meshStandardMaterial color={color} />
    </Box>
  )
}

export default function ModelLoader({
  url,
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
  fallbackType = "box",
  fallbackColor = "#ff4488",
}: ModelLoaderProps) {
  const [error, setError] = useState<Error | null>(null)
  const [gltf, setGltf] = useState<THREE.Group | null>(null)
  const gltfLoaderRef = useRef<GLTFLoader>(null)

  useEffect(() => {
    const loader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.6/")
    loader.setDRACOLoader(dracoLoader)
    gltfLoaderRef.current = loader

    loader.load(
      url,
      (gltf) => {
        setGltf(gltf.scene)
      },
      undefined,
      (error) => {
        setError(new Error(`Failed to load model: ${error.message}`))
      },
    )

    return () => {
      // Cleanup function: Dispose of the loader and its resources
      if (gltfLoaderRef.current) {
        gltfLoaderRef.current.manager.dispose()
        gltfLoaderRef.current = null
      }
    }
  }, [url])

  // If we have an error, show fallback
  if (error) {
    return (
      <>
        <ErrorDisplay error={error} />
        {fallbackType !== "none" && <FallbackModel type={fallbackType} color={fallbackColor} scale={scale} />}
      </>
    )
  }

  // If we have a model, show it
  return (
    <Suspense fallback={<LoadingIndicator />}>
      {gltf ? (
        <primitive
          object={gltf}
          position={position}
          scale={typeof scale === "number" ? [scale, scale, scale] : scale}
          rotation={rotation}
        />
      ) : (
        <FallbackModel type={fallbackType} color={fallbackColor} scale={scale} />
      )}
    </Suspense>
  )
}
