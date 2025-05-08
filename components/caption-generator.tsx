"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Sparkles, Copy, Check } from "lucide-react"
import type { CreativeBrief, SceneElements } from "@/lib/types"

interface CaptionGeneratorProps {
  brief: CreativeBrief | null
  elements: SceneElements
  className?: string
}

export function CaptionGenerator({ brief, elements, className = "" }: CaptionGeneratorProps) {
  const [caption, setCaption] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleGenerateCaption = async () => {
    if (!brief) return

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch("/api/generate-caption", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ elements, brief }),
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error)
        if (data.caption) {
          setCaption(data.caption)
        }
      } else {
        setCaption(data.caption)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate caption")
      console.error("Error generating caption:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCaption = () => {
    if (!caption) return

    navigator.clipboard
      .writeText(caption)
      .then(() => {
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000)
      })
      .catch((err) => {
        console.error("Failed to copy caption:", err)
      })
  }

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Instagram Caption</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-gray-400 mb-3">
          Generate a creative caption for your scene with hashtags and emojis
        </p>

        {error && <div className="mb-3 p-2 bg-red-900/30 text-red-300 rounded-md text-xs">{error}</div>}

        {caption ? (
          <div className="space-y-3">
            <div className="bg-black rounded-md p-3 text-sm text-gray-300 whitespace-pre-wrap">{caption}</div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="w-full" onClick={handleCopyCaption} disabled={isCopied}>
                {isCopied ? (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3 mr-1" />
                    Copy Caption
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleGenerateCaption}
                disabled={isGenerating}
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Regenerate
              </Button>
            </div>
          </div>
        ) : (
          <Button
            variant="default"
            size="sm"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={handleGenerateCaption}
            disabled={isGenerating || !brief}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-3 w-3 mr-1" />
                Generate Caption with AI
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
