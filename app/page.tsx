"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { extractKeywords } from "@/utils/keyword-extractor"
import ClientOnly from "@/components/ClientOnly"

// Import PromptModelLoader with SSR disabled
const PromptModelLoader = dynamic(() => import("@/components/PromptModelLoader"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-white">Loading 3D engine...</div>
    </div>
  ),
})

// Import the Scene component with SSR disabled
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [activePrompt, setActivePrompt] = useState("")
  const [lighting, setLighting] = useState("studio")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCount, setGeneratedCount] = useState(0)
  const [extractedInfo, setExtractedInfo] = useState<{
    keywords: string
    category?: string
    animated?: boolean
  }>({ keywords: "" })

  // Example prompts for inspiration
  const examplePrompts = [
    "A magical forest with ancient trees",
    "Futuristic spaceship with glowing engines",
    "Cute animated cat character",
    "Medieval castle on a mountain",
    "Underwater scene with colorful fish",
    "Cyberpunk city with neon lights",
  ]

  const handleGenerateScene = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Set the active prompt that will be used for model search
    setActivePrompt(prompt)
    setGeneratedCount((prev) => prev + 1)

    // Simulate processing time
    setTimeout(() => {
      setIsGenerating(false)
    }, 500)
  }

  // Update extracted info when prompt changes
  useEffect(() => {
    if (prompt) {
      const extracted = extractKeywords(prompt)
      setExtractedInfo(extracted)
    } else {
      setExtractedInfo({ keywords: "" })
    }
  }, [prompt])

  // Handle example prompt selection
  const useExamplePrompt = useCallback(
    (example: string) => {
      setPrompt(example)
    },
    [setPrompt],
  )

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">3D Scene Generator</h1>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">
          Enter a prompt to generate a 3D scene. Try "cute cat", "spaceship", or "fantasy sword".
        </p>
      </div>

      <ClientOnly>
        <Scene prompt="cute animated cat" />
      </ClientOnly>

      <div className="mt-4 text-sm text-gray-600">
        <p>Powered by Poly Pizza & React Three Fiber</p>
      </div>
    </main>
  )
}
