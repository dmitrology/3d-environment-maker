"use client"

import { useState } from "react"
import ClientOnlyScene from "@/components/ClientOnlyScene"

export default function Home() {
  const [sceneType, setSceneType] = useState("fantasy")
  const [lighting, setLighting] = useState("day")
  const [isGenerating, setIsGenerating] = useState(false)
  const [modelUrl, setModelUrl] = useState("/models/duck.glb")

  // Handle scene generation
  const handleGenerateScene = () => {
    setIsGenerating(true)

    // Simulate API call or processing time
    setTimeout(() => {
      setIsGenerating(false)
    }, 1000)
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
                <label className="block text-sm mb-1">Scene Type</label>
                <select
                  className="w-full bg-gray-800 rounded p-2 text-sm"
                  value={sceneType}
                  onChange={(e) => setSceneType(e.target.value)}
                >
                  <option value="abstract">Abstract</option>
                  <option value="nature">Nature</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="fantasy">Fantasy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-1">Lighting</label>
                <select
                  className="w-full bg-gray-800 rounded p-2 text-sm"
                  value={lighting}
                  onChange={(e) => setLighting(e.target.value)}
                >
                  <option value="sunset">Sunset</option>
                  <option value="studio">Studio</option>
                  <option value="night">Night</option>
                  <option value="day">Day</option>
                </select>
              </div>

              <button
                className={`w-full py-2 px-4 rounded text-white ${
                  isGenerating ? "bg-blue-800 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                }`}
                onClick={handleGenerateScene}
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : "Generate Scene"}
              </button>
            </div>
          </div>

          {/* Right panel for 3D canvas */}
          <div className="flex-1 h-full">
            <ClientOnlyScene sceneType={sceneType} lighting={lighting} modelUrl={modelUrl} />
          </div>
        </div>
      </div>
    </div>
  )
}
