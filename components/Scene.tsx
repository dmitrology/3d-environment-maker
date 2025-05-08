"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import ModelLoader from "./ModelLoader"
import { useState, useEffect } from "react"

type Props = {
  prompt: string
}

export default function Scene({ prompt }: Props) {
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!prompt) return

    const fetchModel = async () => {
      setLoading(true)
      setError(null)

      try {
        // First, search for a model based on the prompt
        const searchResponse = await fetch(`/api/poly?query=${encodeURIComponent(prompt)}`)
        const searchData = await searchResponse.json()

        if (!searchResponse.ok) {
          throw new Error(searchData.error || "Failed to search for models")
        }

        if (!searchData.url) {
          throw new Error("No models found for that prompt")
        }

        // Use our proxy to avoid CORS issues
        setModelUrl(`/api/model-proxy?url=${encodeURIComponent(searchData.url)}`)
      } catch (err: any) {
        console.error("Error fetching model:", err)
        setError(err.message || "Failed to load model")
      } finally {
        setLoading(false)
      }
    }

    fetchModel()
  }, [prompt])

  return (
    <div className="w-full h-[500px] relative">
      {error && <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-md z-10">{error}</div>}

      {loading && (
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-md z-10">
          Searching for models...
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <Environment preset="city" />

        {modelUrl && <ModelLoader modelUrl={modelUrl} />}

        <OrbitControls />
      </Canvas>
    </div>
  )
}
