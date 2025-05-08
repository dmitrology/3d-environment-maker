"use client"

import { useState } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei"
import SafeR3FWrapper, { createSafeR3fComponent } from "@/components/safe-r3f-wrapper"
import SafeModelLoader from "@/components/safe-model-loader"

// Create a safe version of your scene component
const SceneContent = ({ sceneType = "abstract", lighting = "studio", modelUrl = "/models/duck.glb" }) => {
  // Get environment preset based on lighting setting
  const getEnvironmentPreset = () => {
    switch (lighting.toLowerCase()) {
      case "day":
        return "park"
      case "night":
        return "night"
      case "sunset":
        return "sunset"
      case "studio":
      default:
        return "studio"
    }
  }

  const environmentPreset = getEnvironmentPreset()

  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={lighting === "day" ? 1 : 0.5} castShadow />

      {/* Environment based on lighting setting */}
      <Environment preset={environmentPreset} />

      {/* Safely load the model with a fallback cube */}
      <SafeModelLoader
        url={modelUrl}
        scale={2}
        position={[0, 0, 0]}
        fallback={
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#801650" />
          </mesh>
        }
      />

      {/* Ground with shadows */}
      <ContactShadows position={[0, -0.5, 0]} opacity={0.4} scale={10} blur={1.5} />

      {/* Camera controls */}
      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={10} />
    </Canvas>
  )
}

// Create a safe version of the scene that won't break during SSR
const SafeScene = createSafeR3fComponent(SceneContent)

export default function SceneGeneratorPage() {
  const [sceneType, setSceneType] = useState("fantasy")
  const [lighting, setLighting] = useState("day")
  const [isGenerating, setIsGenerating] = useState(false)

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
            <SafeR3FWrapper>
              <SafeScene sceneType={sceneType} lighting={lighting} modelUrl="/models/duck.glb" />
            </SafeR3FWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
