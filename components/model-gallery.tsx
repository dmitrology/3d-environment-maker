"use client"

import { useState, useEffect } from "react"
import { fetchModelsByCategory } from "@/lib/client-model-service"
import type { ModelMetadata, ModelCategory } from "@/lib/model-types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Loader2, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ModelGallery() {
  const [activeCategory, setActiveCategory] = useState<ModelCategory>("props")
  const [models, setModels] = useState<ModelMetadata[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadModels(activeCategory)
  }, [activeCategory])

  const loadModels = async (category: ModelCategory) => {
    setIsLoading(true)
    try {
      const modelList = await fetchModelsByCategory(category)
      setModels(modelList)
    } catch (error) {
      console.error("Error loading models:", error)
      toast({
        title: "Failed to load models",
        description: "There was an error loading the models",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({
      title: "URL copied",
      description: "Model URL copied to clipboard",
    })
  }

  const handlePreview = (model: ModelMetadata) => {
    // Open the model in a new tab
    window.open(model.url, "_blank")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">3D Model Gallery</h2>
      <p className="text-gray-400">
        These models are automatically fetched from public repositories and cached in Vercel Blob.
      </p>

      <Tabs defaultValue="props" onValueChange={(value) => setActiveCategory(value as ModelCategory)}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="backgrounds">Backgrounds</TabsTrigger>
          <TabsTrigger value="characters">Characters</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="effects">Effects</TabsTrigger>
        </TabsList>

        <TabsContent value={activeCategory}>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
            </div>
          ) : models.length === 0 ? (
            <div className="text-center py-10 bg-gray-900 rounded-lg border border-gray-800">
              <p className="text-gray-400">No models found in this category</p>
              <p className="text-sm text-gray-500 mt-2">Models will be automatically fetched on first use</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model) => (
                <Card key={model.id} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gray-800 rounded-md flex items-center justify-center mb-2 overflow-hidden">
                      {model.thumbnailUrl ? (
                        <img
                          src={model.thumbnailUrl || "/placeholder.svg"}
                          alt={model.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src = `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(model.name)}`
                          }}
                        />
                      ) : (
                        <div className="text-6xl">🧊</div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {model.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-800 rounded-full text-xs text-gray-300">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2 truncate">{model.author && `By: ${model.author}`}</p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleCopyUrl(model.url)}>
                      Copy URL
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handlePreview(model)}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
