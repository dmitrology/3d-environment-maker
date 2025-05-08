"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "@/hooks/use-toast"
import { Download, ExternalLink } from "lucide-react"

// Fallback models when Sketchfab API is not available
const FALLBACK_MODELS = [
  {
    id: "1",
    name: "Low Poly Tree",
    thumbnail: "/low-poly-tree.png",
    tags: ["nature", "tree", "low-poly"],
  },
  {
    id: "2",
    name: "Sci-Fi Character",
    thumbnail: "/futuristic-explorer.png",
    tags: ["character", "sci-fi", "humanoid"],
  },
  {
    id: "3",
    name: "Crystal Formation",
    thumbnail: "/crystal-formation.png",
    tags: ["crystal", "mineral", "decoration"],
  },
  {
    id: "4",
    name: "Futuristic Building",
    thumbnail: "/placeholder.svg?key=up3hz",
    tags: ["architecture", "sci-fi", "building"],
  },
  {
    id: "5",
    name: "Fantasy Sword",
    thumbnail: "/fantasy-sword.png",
    tags: ["weapon", "fantasy", "prop"],
  },
  {
    id: "6",
    name: "Alien Plant",
    thumbnail: "/placeholder.svg?height=200&width=200&query=alien+plant",
    tags: ["nature", "alien", "plant"],
  },
]

interface FallbackModelsProps {
  type: "background" | "character" | "prop"
  onSelectModel: (model: any, url: string) => void
}

export function FallbackModels({ type, onSelectModel }: FallbackModelsProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  const handleSelectModel = (model: any) => {
    setSelectedModel(model.id)

    // Create a fallback URL based on the model name
    const fallbackUrl = `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(model.name)}`

    // Call the onSelectModel callback with the model and fallback URL
    onSelectModel(model, fallbackUrl)

    toast({
      title: "Fallback model selected",
      description: "Using a placeholder for this model since the Sketchfab API is not available.",
    })

    // Reset the selected model after a short delay
    setTimeout(() => setSelectedModel(null), 1000)
  }

  return (
    <div className="space-y-4">
      <div className="bg-amber-900/30 border border-amber-800 rounded-md p-3 mb-4">
        <p className="text-sm text-amber-200">
          Sketchfab API is not available. Using fallback models instead. To use real 3D models, please configure the
          SKETCHFAB_API_TOKEN environment variable.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FALLBACK_MODELS.map((model) => (
          <Card key={model.id} className="bg-gray-900 border-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium truncate" title={model.name}>
                {model.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div className="aspect-square bg-gray-800 rounded-md overflow-hidden">
                <img
                  src={model.thumbnail || "/placeholder.svg"}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {model.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 bg-gray-800 rounded-full text-xs text-gray-300">
                    {tag}
                  </span>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex gap-2 pt-0">
              <Button
                variant="default"
                size="sm"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={() => handleSelectModel(model)}
                disabled={selectedModel === model.id}
              >
                <Download className="h-3 w-3 mr-1" />
                Select
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://example.com/${model.id}`, "_blank")}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
