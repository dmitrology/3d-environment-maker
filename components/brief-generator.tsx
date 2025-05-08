"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import { BriefDisplay } from "@/components/brief-display"
import { SceneGenerator } from "@/components/scene-generator"
import type { CreativeBrief } from "@/lib/types"

export function BriefGenerator() {
  const [input, setInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [brief, setBrief] = useState<CreativeBrief | null>(null)
  const [briefError, setBriefError] = useState<string | null>(null)
  const [inputType, setInputType] = useState("vibe")
  const [activeTab, setActiveTab] = useState<"brief" | "scene">("brief")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    setIsGenerating(true)
    setBriefError(null)

    try {
      const response = await fetch("/api/generate-brief", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `API error: ${response.status}`)
      }

      if (!data.brief) {
        throw new Error("No brief returned from API")
      }

      setBrief(data.brief)
      setActiveTab("brief")
    } catch (error) {
      console.error("Failed to generate brief:", error)
      setBriefError(error instanceof Error ? error.message : "Unknown error")
    } finally {
      setIsGenerating(false)
    }
  }

  const placeholders = {
    vibe: "Enter 3-5 vibe words (e.g., 'ethereal', 'cybernetic', 'nostalgic', 'decayed')",
    scene: "Describe a moment or space (e.g., 'A digital forest where trees grow from old computer parts')",
    reference:
      "Share references that inspire you (e.g., 'Blade Runner color palette, Björk's Utopia visuals, feeling of floating')",
  }

  return (
    <div className="space-y-8">
      <Tabs defaultValue="vibe" onValueChange={(value) => setInputType(value)}>
        <TabsList className="grid grid-cols-3 mb-2">
          <TabsTrigger value="vibe">🔮 Vibe Route</TabsTrigger>
          <TabsTrigger value="scene">🎮 Scene Prompt</TabsTrigger>
          <TabsTrigger value="reference">🌌 Reference Dump</TabsTrigger>
        </TabsList>

        <div className="text-sm text-gray-400 mb-4">
          {inputType === "vibe" && (
            <p>
              <strong>Vibe Route:</strong> Enter a few mood or aesthetic words that capture the feeling you want. This
              works best for abstract, emotional concepts.
            </p>
          )}
          {inputType === "scene" && (
            <p>
              <strong>Scene Prompt:</strong> Describe a specific scene or environment in detail. This works best when
              you have a clear visual in mind.
            </p>
          )}
          {inputType === "reference" && (
            <p>
              <strong>Reference Dump:</strong> List existing works, artists, or styles that inspire you. This works best
              when you want to combine existing aesthetics.
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={placeholders[inputType as keyof typeof placeholders]}
            className="min-h-[120px] bg-gray-900 border-gray-700 focus:border-purple-500"
          />

          <Button
            type="submit"
            disabled={isGenerating || !input.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating creative brief...
              </>
            ) : (
              "Generate Creative Brief"
            )}
          </Button>
        </form>
      </Tabs>

      {briefError && (
        <div className="p-4 bg-red-900/30 border border-red-800 rounded-md">
          <p className="text-sm text-red-300">Error: {briefError}</p>
        </div>
      )}

      {brief && !briefError && (
        <Tabs
          defaultValue="brief"
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as "brief" | "scene")}
        >
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="brief">Creative Brief</TabsTrigger>
            <TabsTrigger value="scene">3D Scene Generator</TabsTrigger>
          </TabsList>

          <TabsContent value="brief">
            <Card className="border border-gray-800 bg-black/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <BriefDisplay brief={brief} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scene">
            <SceneGenerator brief={brief} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
