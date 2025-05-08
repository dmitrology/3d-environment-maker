"use client"

import { useState, useEffect, useCallback } from "react"
import { searchModels, getModelDownloadUrl, cacheModelUrl, getCachedModelUrl } from "@/lib/client-sketchfab-service"
import type { SketchfabModel } from "@/lib/sketchfab-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Loader2, Search, Download, ExternalLink } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { FallbackModels } from "@/components/fallback-models"

interface ModelSearchProps {
  initialQuery?: string
  onSelectModel?: (model: SketchfabModel, downloadUrl: string) => void
  className?: string
  type?: "background" | "character" | "prop"
}

export function ModelSearch({
  initialQuery = "",
  onSelectModel,
  className = "",
  type = "background",
}: ModelSearchProps) {
  const [query, setQuery] = useState(initialQuery)
  const [isSearching, setIsSearching] = useState(false)
  const [models, setModels] = useState<SketchfabModel[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [downloadingModel, setDownloadingModel] = useState<string | null>(null)
  const [apiAvailable, setApiAvailable] = useState<boolean | null>(null)
  const [isCheckingApi, setIsCheckingApi] = useState(true)

  // Check if the Sketchfab API is available
  const checkApiAvailability = useCallback(async () => {
    try {
      const response = await fetch("/api/sketchfab/config")
      const data = await response.json()
      setApiAvailable(data.hasToken)
    } catch (error) {
      console.error("Error checking API availability:", error)
      setApiAvailable(false)
    } finally {
      setIsCheckingApi(false)
    }
  }, [])

  useEffect(() => {
    checkApiAvailability()
  }, [checkApiAvailability])

  // If the API is not available, render the fallback models
  if (apiAvailable === false) {
    return <FallbackModels type={type} onSelectModel={onSelectModel || (() => {})} />
  }

  // If still checking API availability, show loading state
  if (isCheckingApi) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500 mr-2" />
        <span>Checking API availability...</span>
      </div>
    )
  }

  // Search for models when the component mounts if initialQuery is provided
  useEffect(() => {
    if (initialQuery) {
      try {
        handleSearch()
      } catch (error) {
        console.error("Error in initial search:", error)
        toast({
          title: "Search failed",
          description: "Failed to perform initial search. Please try manually.",
          variant: "destructive",
        })
      }
    }
  }, [initialQuery])

  const handleSearch = async () => {
    if (!query || !query.trim()) {
      // If no query, use a default query based on the type
      const defaultQueries = {
        background: "environment scene",
        character: "character figure",
        prop: "prop object",
      }

      // Get the default query based on the component's purpose
      const defaultQuery = defaultQueries[type || "background"]

      setQuery(defaultQuery)
      toast({
        title: "Using default search",
        description: `Searching for "${defaultQuery}" as no specific query was provided.`,
      })

      // Continue with the search using the default query
      performSearch(defaultQuery)
      return
    }

    // Perform the search with the provided query
    performSearch(query.trim())
  }

  // Extract the search logic to a separate function
  const performSearch = async (searchQuery: string) => {
    setIsSearching(true)
    try {
      const results = await searchModels(searchQuery, {
        downloadable: true,
        count: 20,
        staffpicked: true,
      })
      setModels(results)

      if (results.length === 0) {
        toast({
          title: "No results found",
          description: `No models found for "${searchQuery}". Try a different search term.`,
        })
      }
    } catch (error) {
      console.error("Error searching models:", error)
      toast({
        title: "Search failed",
        description: "Failed to search for models. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleDownload = async (model: SketchfabModel) => {
    setDownloadingModel(model.uid)
    try {
      // Check cache first
      let downloadUrl = getCachedModelUrl(model.uid)

      if (!downloadUrl) {
        // Get download URL from API
        downloadUrl = await getModelDownloadUrl(model.uid)

        if (!downloadUrl) {
          throw new Error("Failed to get download URL")
        }

        // Cache the URL
        cacheModelUrl(model.uid, downloadUrl)
      }

      // Call the onSelectModel callback with the model and download URL
      if (onSelectModel) {
        onSelectModel(model, downloadUrl)
      }

      toast({
        title: "Model selected",
        description: `${model.name} has been selected`,
      })
    } catch (error) {
      console.error("Error downloading model:", error)
      toast({
        title: "Download failed",
        description: "Failed to download the model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDownloadingModel(null)
    }
  }

  // Filter models by category
  const filteredModels =
    selectedCategory === "all"
      ? models
      : models.filter((model) =>
          model.categories.some((category) => category.name.toLowerCase() === selectedCategory.toLowerCase()),
        )

  // Extract unique categories from models
  const categories = [
    "all",
    ...new Set(models.flatMap((model) => model.categories.map((category) => category.name.toLowerCase()))),
  ].sort()

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for 3D models..."
          className="bg-gray-800 border-gray-700"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
        </Button>
      </div>

      {models.length > 0 && (
        <Tabs defaultValue="all" value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList className="mb-4 flex flex-wrap h-auto">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value={selectedCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredModels.map((model) => (
                <Card key={model.uid} className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium truncate" title={model.name}>
                      {model.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-2">
                    <div className="aspect-square bg-gray-800 rounded-md overflow-hidden">
                      <img
                        src={model.thumbnails.images[0]?.url || "/placeholder.svg"}
                        alt={model.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {model.tags.slice(0, 3).map((tag, i) => (
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
                      onClick={() => handleDownload(model)}
                      disabled={downloadingModel === model.uid}
                    >
                      {downloadingModel === model.uid ? (
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      ) : (
                        <Download className="h-3 w-3 mr-1" />
                      )}
                      Select
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => window.open(model.viewerUrl, "_blank")}>
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      )}

      {isSearching && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
        </div>
      )}

      {!isSearching && models.length === 0 && query && (
        <div className="text-center py-8 bg-gray-900 rounded-lg">
          <p className="text-gray-400">No models found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">Try a different search term</p>
        </div>
      )}
    </div>
  )
}
