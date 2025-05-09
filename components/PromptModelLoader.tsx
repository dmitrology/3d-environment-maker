"use client"

import { useEffect, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, Html, Stars, Cloud } from "@react-three/drei"
import ModelLoader from "./ModelLoader"
import { extractKeywords } from "@/utils/keyword-extractor"

interface PromptModelLoaderProps {
  prompt: string
  lighting?: string
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export default function PromptModelLoader({
  prompt,
  lighting = "studio",
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: PromptModelLoaderProps) {
  const [models, setModels] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [searchParams, setSearchParams] = useState<{
    keywords: string
    category?: string
    animated?: boolean
  }>({ keywords: "" })

  useEffect(() => {
    if (!prompt || prompt.trim() === "") {
      setSearchParams({ keywords: "" })
      return
    }

    // Extract keywords and metadata for better search results
    const extracted = extractKeywords(prompt)
    setSearchParams(extracted)
    setSearchQuery(extracted.keywords)
  }, [prompt])

  useEffect(() => {
    const fetchModels = async () => {
      if (!searchParams.keywords) {
        setModels([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        // Build the query URL with all parameters
        let queryUrl = `/api/poly?query=${encodeURIComponent(searchParams.keywords)}`

        if (searchParams.category) {
          queryUrl += `&category=${encodeURIComponent(searchParams.category)}`
        }

        if (searchParams.animated) {
          queryUrl += "&animated=true"
        }

        const response = await fetch(queryUrl)
        const data = await response.json()

        if (response.ok && data.models && data.models.length > 0) {
          setModels(data.models)
        } else {
          throw new Error(data.error || "No models found")
        }
      } catch (err: any) {
        console.error("Error fetching models:", err)
        setError(err.message || "Failed to load models")
        setModels([])
      } finally {
        setLoading(false)
      }
    }

    if (searchParams.keywords) {
      fetchModels()
    }
  }, [searchParams])

  // Calculate positions for multiple models
  const getModelPosition = (index: number, total: number): [number, number, number] => {
    if (total === 1) return [0, 0, 0]

    // Arrange models in a circle
    const radius = 2
    const angle = (index / total) * Math.PI * 2
    return [Math.sin(angle) * radius, 0, Math.cos(angle) * radius]
  }

  return (
    <div className="w-full h-full">
      {error && <div className="absolute top-4 right-4 bg-red-500/80 text-white p-2 rounded z-10">Error: {error}</div>}

      {loading && (
        <div className="absolute top-4 right-4 bg-blue-500/80 text-white p-2 rounded z-10">
          Searching for "{searchQuery}"...
        </div>
      )}

      {models.length > 0 && (
        <div className="absolute top-4 left-4 bg-black/70 text-white p-2 rounded z-10 max-w-xs">
          <h3 className="text-sm font-bold">Found {models.length} models</h3>
          <p className="text-xs mt-1">Use mouse to rotate, scroll to zoom</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <color attach="background" args={["#000000"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

        <Environment preset={lighting as any} />

        {/* Add stars for certain lighting conditions */}
        {(lighting === "night" || lighting === "sunset") && (
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        )}

        {/* Add clouds for certain environments */}
        {(lighting === "dawn" || lighting === "park" || lighting === "forest") && (
          <Cloud position={[0, 5, -10]} speed={0.2} opacity={0.5} />
        )}

        {models.length > 0 ? (
          <>
            {models.map((model, index) => (
              <group key={model.id} position={getModelPosition(index, models.length)}>
                <ModelLoader
                  url={model.downloadUrl}
                  scale={scale}
                  rotation={rotation}
                  fallbackType="box"
                  fallbackColor="#ff4488"
                />
                <Html position={[0, -1.5, 0]} center className="pointer-events-none">
                  <div className="bg-black/70 text-white p-2 rounded text-xs max-w-xs text-center">
                    {model.title} by {model.creator}
                  </div>
                </Html>
              </group>
            ))}
          </>
        ) : (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#444444" />
            </mesh>
            {!loading && !error && prompt && (
              <Html position={[0, -1.5, 0]} center>
                <div className="bg-black/70 text-white p-2 rounded text-xs">Enter a prompt to search for 3D models</div>
              </Html>
            )}
          </group>
        )}

        <OrbitControls enableDamping dampingFactor={0.05} />
      </Canvas>
    </div>
  )
}
