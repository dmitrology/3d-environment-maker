"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SceneRenderer } from "./scene-renderer"
import type { CreativeBrief } from "@/lib/types"
import { Loader2, Wand2 } from "lucide-react"

interface SceneGeneratorProps {
  brief: CreativeBrief | null
}

export function SceneGenerator({ brief }: SceneGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [scenePrompt, setScenePrompt] = useState<string>("")
  const [sceneGenerated, setSceneGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (brief) {
      setScenePrompt(brief.scene_description || brief.videoPrompt || "")
    }
  }, [brief])

  const generateScene = async () => {
    if (!brief) return

    setIsGenerating(true)
    setError(null)

    try {
      // For now, we'll just simulate scene generation
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSceneGenerated(true)
    } catch (err) {
      console.error("Failed to generate scene:", err)
      setError("Failed to generate scene. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  if (!brief) {
    return (
      <div className="p-6 bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-bold text-purple-400 mb-4">3D Scene Generator</h2>
        <p className="text-gray-400">Generate a creative brief first to create a 3D scene.</p>
      </div>
    )
  }

  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <h2 className="text-2xl font-bold text-purple-400 mb-4">3D Scene Generator</h2>

      <div className="bg-gray-800 p-4 rounded-md mb-6">
        <p className="text-gray-300 mb-4">
          {sceneGenerated
            ? "Here's your generated scene based on the creative brief:"
            : "Here's the prompt we would use to generate your scene:"}
        </p>
        <pre className="bg-gray-900 p-4 rounded text-gray-300 whitespace-pre-wrap">{scenePrompt}</pre>
      </div>

      {!sceneGenerated ? (
        <Button
          onClick={generateScene}
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Scene...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate 3D Scene
            </>
          )}
        </Button>
      ) : (
        <div className="mt-4 border border-gray-700 rounded-lg overflow-hidden aspect-video">
          <SceneRenderer prompt={scenePrompt} />
        </div>
      )}

      {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">{error}</div>}
    </div>
  )
}
