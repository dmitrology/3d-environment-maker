"use client"

import { useEffect, useState } from "react"
import { StrictLoading, StrictError } from "./strict-html"
import dynamic from "next/dynamic"

// Dynamically import components that use R3F hooks with SSR disabled
const DynamicIsolatedModel = dynamic(() => import("./isolated-model"), {
  ssr: false,
  loading: () => <StrictLoading message="Loading model component..." />,
})

// Simple keyword extraction
function extractKeywords(prompt: string): string[] {
  const commonWords = ["a", "an", "the", "and", "or", "but", "in", "on", "at", "to", "for", "with"]
  const words = prompt.toLowerCase().split(/\s+/)
  return words.filter((word) => !commonWords.includes(word) && word.length > 2)
}

// Map keywords to model types
const keywordMap: Record<string, string> = {
  tree: "tree",
  forest: "tree",
  plant: "tree",
  car: "car",
  vehicle: "car",
  house: "house",
  building: "house",
  castle: "castle",
  dog: "dog",
  cat: "cat",
  dragon: "dragon",
  robot: "robot",
}

// Direct GLB URLs for common models
const modelUrls: Record<string, string> = {
  tree: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/tree-spruce/model.gltf",
  car: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/low-poly-car/model.gltf",
  house: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/simple-house/model.gltf",
  dog: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dog/model.gltf",
  cat: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/cat-lowpoly/model.gltf",
  robot: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/robot-playground/model.gltf",
}

interface ModelSpawnerProps {
  prompt: string
}

function IsolatedModelSpawner({ prompt }: ModelSpawnerProps) {
  const [models, setModels] = useState<Array<{ type: string; position: [number, number, number]; url?: string }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    try {
      console.log("ModelSpawner: Processing prompt:", prompt)

      // Extract keywords from the prompt
      const keywords = extractKeywords(prompt)

      // Map keywords to model types
      const modelTypes = keywords
        .map((keyword) => keywordMap[keyword])
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

      if (modelTypes.length === 0) {
        // If no valid keywords found, add a default model
        modelTypes.push("tree")
      }

      // Position models in a circle
      const radius = Math.max(2, modelTypes.length * 0.5)
      const newModels = modelTypes.map((type, index) => {
        const angle = (index / modelTypes.length) * Math.PI * 2
        const x = Math.sin(angle) * radius
        const z = Math.cos(angle) * radius
        return {
          type,
          position: [x, 0, z] as [number, number, number],
          url: modelUrls[type] || undefined,
        }
      })

      console.log("ModelSpawner: Created models:", newModels)
      setModels(newModels)
    } catch (err) {
      console.error("Error processing prompt:", err)
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }, [prompt])

  if (loading) {
    return <StrictLoading message="Analyzing prompt..." />
  }

  if (error) {
    return <StrictError message={error.message || "Unknown error"} />
  }

  if (models.length === 0) {
    return <StrictError message="No models to display. Try a different prompt." />
  }

  return (
    <group>
      {models.map((model, index) => (
        <DynamicIsolatedModel
          key={index}
          type={model.type}
          modelUrl={model.url}
          position={model.position}
          rotation={[0, Math.random() * Math.PI * 2, 0]}
          scale={1}
        />
      ))}
    </group>
  )
}

// Export as default for dynamic import
export default IsolatedModelSpawner
