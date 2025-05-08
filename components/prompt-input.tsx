"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2, Wand2, Sparkles } from "lucide-react"

interface PromptInputProps {
  onGenerate: (prompt: string) => void
  isGenerating: boolean
}

export function PromptInput({ onGenerate, isGenerating }: PromptInputProps) {
  const [prompt, setPrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (prompt.trim() && !isGenerating) {
      onGenerate(prompt)
    }
  }

  const examplePrompts = [
    "dreamy cyberpunk ramen stand in the snow",
    "vaporwave sunset beach with ancient statues",
    "cozy witch's cottage in an autumn forest",
    "floating islands with waterfalls and crystals",
  ]

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium">
              Scene Prompt
            </label>
            <Input
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your scene..."
              className="bg-gray-900 border-gray-700"
              disabled={isGenerating}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
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
        </form>

        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {examplePrompts.map((examplePrompt) => (
              <Button
                key={examplePrompt}
                variant="outline"
                size="sm"
                className="bg-gray-900/50 border-gray-700"
                onClick={() => {
                  setPrompt(examplePrompt)
                }}
                disabled={isGenerating}
              >
                <Sparkles className="mr-1 h-3 w-3" />
                {examplePrompt}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
