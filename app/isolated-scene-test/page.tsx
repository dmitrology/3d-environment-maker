"use client"

import { useState } from "react"
import { IsolatedScene } from "@/components/isolated-scene"
import SafeR3FWrapper from "@/components/safe-r3f-wrapper"

export default function IsolatedSceneTestPage() {
  const [environment, setEnvironment] = useState("sunset")

  const testModels = [
    { url: "/models/duck.glb", position: [0, 0, 0], scale: 2 },
    { url: "/models/duck.glb", position: [-2, 0, -2], scale: 1 },
  ]

  return (
    <div className="min-h-screen bg-black">
      <div className="flex flex-col h-screen">
        <header className="border-b border-gray-800 p-4">
          <h1 className="text-xl font-bold text-white">Isolated Scene Test</h1>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* Left panel for controls */}
          <div className="w-64 border-r border-gray-800 p-4 text-white">
            <h2 className="font-medium mb-4">Scene Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Environment</label>
                <select
                  className="w-full bg-gray-800 rounded p-2 text-sm"
                  value={environment}
                  onChange={(e) => setEnvironment(e.target.value)}
                >
                  <option value="sunset">Sunset</option>
                  <option value="studio">Studio</option>
                  <option value="night">Night</option>
                  <option value="park">Park</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right panel for 3D canvas */}
          <div className="flex-1 h-full">
            <SafeR3FWrapper>
              <IsolatedScene models={testModels} environment={environment} />
            </SafeR3FWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
