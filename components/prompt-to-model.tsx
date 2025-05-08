"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { Suspense } from "react"
import dynamic from "next/dynamic"

// Types for Poly Pizza models
interface PolyPizzaModel {
  ID: string
  Title: string
  Attribution: string
  Thumbnail: string
  Download: string
  "Tri Count": number
  Creator: {
    Username: string
    DPURL: string
  }
  Category: string
  Tags: string[]
  Licence: string
  Animated: boolean
}

// Dynamic import for the model component to avoid SSR issues
const DynamicModel = dynamic(() => import("./poly-pizza-model"), {
  ssr: false,
  loading: () => <ModelLoading />,
})

// Loading component
function ModelLoading() {
  return (
    <Html center>
      <div className="bg-black/50 text-white p-4 rounded-md">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto mb-2"></div>
        <p>Loading model...</p>
      </div>
    </Html>
  )
}

// Error component
function ModelError({ message }: { message: string }) {
  return (
    <Html center>
      <div className="bg-red-900/50 text-white p-4 rounded-md max-w-xs">
        <h3 className="font-bold text-lg mb-2">3D Rendering Error</h3>
        <p className="text-sm">{message}</p>
      </div>
    </Html>
  )
}

// Fallback model when no models are found
function FallbackModel() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" />
    </mesh>
  )
}

// Main component
export default function PromptToModel({ prompt, lighting = "studio" }: { prompt: string; lighting?: string }) {
  const [model, setModel] = useState<PolyPizzaModel | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!prompt) return

    const searchPolyPizza = async () => {
      try {
        setLoading(true)
        setError(null)

        // Extract keywords from prompt
        const keywords = prompt
          .toLowerCase()
          .split(/\s+/)
          .filter((word) => word.length > 3)
          .filter((word) => !["and", "the", "with", "for", "from"].includes(word))
          .slice(0, 1) // Just use the first keyword for simplicity
          .join(" ")

        if (!keywords) {
          setError("Couldn't extract meaningful keywords from prompt")
          setLoading(false)
          return
        }

        console.log("Searching for:", keywords)

        // Query the Poly Pizza API through our backend proxy
        const response = await fetch(`/api/poly-pizza/search?q=${encodeURIComponent(keywords)}&limit=1`)

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()

        if (data.results && data.results.length > 0) {
          setModel(data.results[0])
          console.log("Found model:", data.results[0].Title)
        } else {
          setError(`No models found for "${keywords}"`)
        }
      } catch (err) {
        console.error("Error searching for models:", err)
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    searchPolyPizza()
  }, [prompt])

  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <color attach="background" args={["#101010"]} />

        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

        <Suspense fallback={<ModelLoading />}>
          <Environment preset={(lighting as any) || "studio"} />

          {loading ? (
            <ModelLoading />
          ) : error ? (
            <ModelError message={error} />
          ) : model ? (
            <DynamicModel model={model} />
          ) : (
            <FallbackModel />
          )}
        </Suspense>

        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} autoRotate={true} autoRotateSpeed={1} />
      </Canvas>
    </div>
  )
}
