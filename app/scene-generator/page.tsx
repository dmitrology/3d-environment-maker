"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PromptInput } from "@/components/prompt-input"
import ClientOnlyScene from "@/components/ClientOnlyScene"
import type { SceneConfig } from "@/app/api/generate-scene/route"

export default function SceneGeneratorPage() {
  const [scene, setScene] = useState<SceneConfig | null>(null)

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            VISUAL ALCHEMY - 3D Scene Generator
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 space-y-8">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle>Generate a 3D Scene</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Enter a description of the scene you want to generate. The AI will search for relevant 3D models and
              create a scene for you.
            </p>
            <PromptInput onSceneGenerated={setScene} />
          </CardContent>
        </Card>

        {scene ? (
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle>Your 3D Scene</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[500px]">
                <ClientOnlyScene scene={scene} />
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-800">
            <h2 className="text-xl font-bold mb-2">No Scene Generated Yet</h2>
            <p className="text-gray-400">Enter a prompt above to generate your first 3D scene.</p>
          </div>
        )}
      </main>
    </div>
  )
}
