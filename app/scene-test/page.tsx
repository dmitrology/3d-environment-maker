"use client"

import { useState, useEffect } from "react"
import { SceneRenderer, type SceneDescription } from "@/components/scene-renderer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Wand2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function SceneTestPage() {
  const [prompt, setPrompt] = useState("")
  const [scene, setScene] = useState<SceneDescription | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize models on page load
  useEffect(() => {
    async function initModels() {
      try {
        const response = await fetch("/api/init-models")
        const data = await response.json()

        if (data.success) {
          toast({
            title: "Models initialized",
            description: `${data.count} models available for use`,
          })
        } else {
          console.error("Error initializing models:", data.error)
          toast({
            title: "Initialization warning",
            description: "Some models may not be available yet",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error initializing models:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    initModels()
  }, [])

  const generateScene = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Prompt required",
        description: "Please enter a scene description",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-scene", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate scene")
      }

      const data = await response.json()
      setScene(data.scene)

      toast({
        title: "Scene generated",
        description: "Your 3D scene has been created",
      })
    } catch (error) {
      console.error("Error generating scene:", error)
      toast({
        title: "Generation failed",
        description: "There was an error generating your scene",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            VISUAL ALCHEMY - Scene Test
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your scene (e.g., 'A futuristic temple with glowing crystals')"
                className="bg-gray-800 border-gray-700"
                disabled={isInitializing}
              />
              <Button
                onClick={generateScene}
                disabled={isGenerating || !prompt.trim() || isInitializing}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isInitializing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Initializing...
                  </>
                ) : isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Scene
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
          <SceneRenderer scene={scene || undefined} />
        </div>

        {scene && (
          <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-4">Scene Details</h2>
            <pre className="bg-black p-4 rounded overflow-auto text-sm">{JSON.stringify(scene, null, 2)}</pre>
          </div>
        )}
      </main>
    </div>
  )
}
