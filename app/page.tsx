"use client"

import { useState } from "react"
import PromptToModel from "@/components/prompt-to-model"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [activePrompt, setActivePrompt] = useState("")
  const [lighting, setLighting] = useState("studio")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateScene = () => {
    if (!prompt.trim()) return

    setIsGenerating(true)

    // Set the active prompt that will be used for model search
    setActivePrompt(prompt)

    // Simulate processing time
    setTimeout(() => {
      setIsGenerating(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <header className="border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold text-white">3D Scene Generator</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel for controls */}
          <div className="w-64 border-r border-gray-800 p-4 text-white">
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
              </div>
            )}
          </div>

          {/* Right panel for 3D canvas */}
          <div className="flex-1 h-full">
            <PromptToModel prompt={activePrompt} lighting={lighting} />
          </div>
        </div>
      </div>
    </div>
  )
}
