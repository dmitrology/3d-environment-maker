"use client"

import { useState, useEffect, useCallback } from "react"
import dynamic from "next/dynamic"
import { extractKeywords } from "@/utils/keyword-extractor"

// Import PromptModelLoader with SSR disabled
const PromptModelLoader = dynamic(() => import("@/components/PromptModelLoader"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-white">Loading 3D engine...</div>
    </div>
  ),
})

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
    <div className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <header className="border-b border-gray-800 p-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-white">3D Scene Generator</h1>
          <div className="text-sm text-gray-400">Powered by Poly Pizza & React Three Fiber</div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel for controls */}
          <div className="w-80 border-r border-gray-800 p-4 text-white overflow-y-auto">
            <h2 className="font-medium mb-4">Scene Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Prompt</label>
                <textarea
                  className="w-full bg-gray-800 rounded p-2 text-sm h-24"
                  placeholder="Enter a description of what you want to see..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />

                {/* Example prompts */}
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-1">Try these examples:</p>
                  <div className="flex flex-wrap gap-1">
                    {examplePrompts.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => useExamplePrompt(example)}
                        className="text-xs bg-gray-700 hover:bg-gray-600 rounded px-2 py-1 truncate max-w-[120px]"
                        title={example}
                      >
                        {example.length > 15 ? example.substring(0, 15) + "..." : example}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-1">Lighting</label>
                <select
                  className="w-full bg-gray-800 rounded p-2 text-sm"
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                >
                  <option value="studio">Studio</option>
                  <option value="sunset">Sunset</option>
                  <option value="dawn">Dawn</option>
                  <option value="night">Night</option>
                  <option value="warehouse">Warehouse</option>
                  <option value="forest">Forest</option>
                  <option value="apartment">Apartment</option>
                  <option value="park">Park</option>
                  <option value="lobby">Lobby</option>
                </select>
              </div>

              <button
                className={`w-full py-2 px-4 rounded text-white ${
                  isGenerating ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleGenerateScene}
                disabled={isGenerating || !prompt.trim()}
              >
                {isGenerating ? "Generating..." : "Generate Scene"}
              </button>
            </div>

            {activePrompt && (
              <div className="mt-6 p-3 bg-gray-800/50 rounded">
                <h3 className="text-sm font-medium mb-1">Current Prompt:</h3>
                <p className="text-xs text-gray-300">{activePrompt}</p>

                {extractedInfo.keywords && (
                  <div className="mt-2 space-y-1">
                    <p className="text-xs text-gray-400">
                      <span className="font-medium">Keywords:</span> {extractedInfo.keywords}
                    </p>

                    {extractedInfo.category && (
                      <p className="text-xs text-gray-400">
                        <span className="font-medium">Category:</span> {extractedInfo.category}
                      </p>
                    )}

                    {extractedInfo.animated && (
                      <p className="text-xs text-gray-400">
                        <span className="font-medium">Animated:</span> Yes
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Stats section */}
            <div className="mt-6 p-3 bg-gray-800/30 rounded">
              <h3 className="text-sm font-medium mb-2">Stats</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Scenes Generated</p>
                  <p className="text-lg font-bold">{generatedCount}</p>
                </div>
                <div className="bg-gray-800/50 p-2 rounded">
                  <p className="text-xs text-gray-400">Current Environment</p>
                  <p className="text-lg font-bold capitalize">{lighting}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel for 3D canvas */}
          <div className="flex-1 h-full relative">
            <PromptModelLoader prompt={activePrompt} lighting={lighting} />
          </div>
        </div>
      </div>
    </div>
  )
}
