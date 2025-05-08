"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Loader2, Download } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import type { SketchfabModel } from "@/lib/types"

export function ModelBrowser() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [models, setModels] = useState<SketchfabModel[]>([])
  const [activeCategory, setActiveCategory] = useState("all")

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)

    try {
      const response = await fetch(`/api/search-models?query=${encodeURIComponent(searchQuery)}`)

      if (!response.ok) {
        throw new Error("Failed to search models")
      }

      const data = await response.json()
      setModels(data.models || [])

      if (data.models.length === 0) {
        toast({
          title: "No models found",
          description: "Try a different search term",
        })
      }
    } catch (error) {
      console.error("Error searching models:", error)
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search models",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  // Filter models by category
  const filteredModels =
    activeCategory === "all"
      ? models
      : models.filter((model) =>
          model.categories.some((category) => category.toLowerCase() === activeCategory.toLowerCase()),
        )

  // Get unique categories from models
  const categories = ["all", ...new Set(models.flatMap((model) => model.categories))]

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardContent className="p-4 space-y-4">
        <div className="flex gap-2">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 3D models..."
            className="bg-gray-900 border-gray-700"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isSearching || !searchQuery.trim()} variant="secondary">
            {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>

        {models.length > 0 && (
          <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="bg-gray-900">
              {categories.slice(0, 5).map((category) => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-4 grid grid-cols-2 gap-2">
              {filteredModels.map((model) => (
                <div key={model.uid} className="bg-gray-900 rounded-md overflow-hidden border border-gray-800">
                  <div className="aspect-square bg-gray-950 relative">
                    <img
                      src={model.thumbnailUrl || "/placeholder.svg"}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs font-medium truncate">{model.name}</p>
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex gap-1">
                        {model.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] bg-gray-800 px-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Tabs>
        )}

        {isSearching && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        )}

        {!isSearching && models.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">Search for 3D models to add to your scene</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
