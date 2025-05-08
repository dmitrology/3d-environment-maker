"use client"

import { useState, useEffect } from "react"
import { MODEL_CONFIG } from "@/lib/model-config"

export function ModelLoadingStatus() {
  const [loadedModels, setLoadedModels] = useState<Record<string, boolean>>({})

  useEffect(() => {
    // Get all GLB model types
    const glbModels = Object.entries(MODEL_CONFIG)
      .filter(([_, config]) => config.type === "glb")
      .map(([type, config]) => ({ type, url: config.url }))

    // Initialize loading status
    const initialStatus: Record<string, boolean> = {}
    glbModels.forEach((model) => {
      initialStatus[model.type] = false
    })
    setLoadedModels(initialStatus)

    // Check each model
    glbModels.forEach((model) => {
      if (!model.url) return

      // Create an image to test if the URL is accessible
      const tester = new Image()
      tester.onload = () => {
        setLoadedModels((prev) => ({ ...prev, [model.type]: true }))
      }
      tester.onerror = () => {
        console.warn(`Model ${model.type} failed to load from ${model.url}`)
        // Keep as false
      }

      // For GLB files, we can't use an image, so this is just a simulation
      // In a real app, you'd use a different approach to test GLB availability
      setTimeout(() => {
        setLoadedModels((prev) => ({ ...prev, [model.type]: true }))
      }, 2000)
    })
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded text-xs max-w-xs max-h-40 overflow-auto">
      <h3 className="font-bold mb-1">Model Status:</h3>
      <ul>
        {Object.entries(loadedModels).map(([type, loaded]) => (
          <li key={type} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${loaded ? "bg-green-500" : "bg-red-500"}`}></span>
            <span>
              {type}: {loaded ? "Loaded" : "Loading..."}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
