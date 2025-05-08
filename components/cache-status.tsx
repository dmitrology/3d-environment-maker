"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { fetchModelStats, clearModelCache } from "@/lib/client-model-service"

interface CacheStats {
  totalModels: number
  categoryCounts: Record<string, number>
  cacheAge: number | null
}

export function CacheStatus() {
  const [stats, setStats] = useState<CacheStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isClearing, setIsClearing] = useState(false)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const data = await fetchModelStats()
      setStats(data)
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast({
        title: "Error",
        description: "Failed to fetch cache statistics",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCache = async () => {
    setIsClearing(true)
    try {
      const success = await clearModelCache()

      if (success) {
        toast({
          title: "Success",
          description: "Model cache cleared successfully",
        })
        // Refresh stats
        fetchStats()
      } else {
        throw new Error("Failed to clear cache")
      }
    } catch (error) {
      console.error("Error clearing cache:", error)
      toast({
        title: "Error",
        description: "Failed to clear model cache",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  // Format cache age
  const formatCacheAge = (ageMs: number | null): string => {
    if (ageMs === null) return "Unknown"

    const seconds = Math.floor(ageMs / 1000)
    if (seconds < 60) return `${seconds} seconds`

    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} minutes`

    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} hours`

    const days = Math.floor(hours / 24)
    return `${days} days`
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>Cache Status</span>
          <Button variant="ghost" size="sm" onClick={fetchStats} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : stats ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 p-3 rounded-md">
                <div className="text-sm text-gray-400">Total Models</div>
                <div className="text-2xl font-bold">{stats.totalModels}</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-md">
                <div className="text-sm text-gray-400">Cache Age</div>
                <div className="text-lg font-bold">{formatCacheAge(stats.cacheAge)}</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Models by Category</div>
              {Object.entries(stats.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center text-sm">
                  <span className="capitalize">{category}</span>
                  <span className="bg-gray-800 px-2 py-1 rounded-md">{count}</span>
                </div>
              ))}
            </div>

            <Button variant="destructive" size="sm" className="w-full" onClick={handleClearCache} disabled={isClearing}>
              {isClearing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Clearing...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Model Cache
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-400">No cache statistics available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
