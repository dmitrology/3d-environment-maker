"use client"

import { SimpleScene } from "@/components/simple-scene"
import { useState } from "react"

export default function SceneTestPage() {
  const [prompt, setPrompt] = useState("forest with a house and a car")

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">Scene Test (Fixed)</h1>

      <div className="mb-4">
        <label className="block mb-2">Scene Prompt:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-800 rounded border border-gray-700 text-white"
          />
          <button onClick={() => setPrompt(prompt)} className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700">
            Generate
          </button>
        </div>
      </div>

      <div className="rounded-lg overflow-hidden border border-gray-700">
        <SimpleScene prompt={prompt} />
      </div>

      <div className="mt-4 text-sm text-gray-400">
        <p>Try different prompts like "robot army" or "forest with cats"</p>
      </div>
    </div>
  )
}
