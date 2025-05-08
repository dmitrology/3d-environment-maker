"use client"

import type { SketchfabModel } from "./sketchfab-service"

// Search for models
export async function searchModels(
  query: string,
  options: {
    downloadable?: boolean
    animated?: boolean
    staffpicked?: boolean
    count?: number
    categories?: string[]
  } = {},
): Promise<SketchfabModel[]> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      query,
      ...(options.downloadable ? { downloadable: "true" } : {}),
      ...(options.animated ? { animated: "true" } : {}),
      ...(options.staffpicked ? { staffpicked: "true" } : {}),
      ...(options.count ? { count: options.count.toString() } : {}),
      ...(options.categories ? { categories: options.categories.join(",") } : {}),
    })

    const response = await fetch(`/api/sketchfab/search?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.models
  } catch (error) {
    console.error("Error searching models:", error)
    return []
  }
}

// Get download URL for a model
export async function getModelDownloadUrl(uid: string): Promise<string | null> {
  try {
    const response = await fetch(`/api/sketchfab/download?uid=${uid}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.downloadUrl
  } catch (error) {
    console.error(`Error getting download URL for model ${uid}:`, error)
    return null
  }
}

// Get model details
export async function getModelDetails(uid: string): Promise<SketchfabModel | null> {
  try {
    const response = await fetch(`/api/sketchfab/model?uid=${uid}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.model
  } catch (error) {
    console.error(`Error getting details for model ${uid}:`, error)
    return null
  }
}

// Cache downloaded models in localStorage
export function cacheModelUrl(uid: string, url: string): void {
  try {
    const cache = JSON.parse(localStorage.getItem("sketchfab-model-cache") || "{}")
    cache[uid] = {
      url,
      timestamp: Date.now(),
    }
    localStorage.setItem("sketchfab-model-cache", JSON.stringify(cache))
  } catch (error) {
    console.error("Error caching model URL:", error)
  }
}

// Get cached model URL
export function getCachedModelUrl(uid: string): string | null {
  try {
    const cache = JSON.parse(localStorage.getItem("sketchfab-model-cache") || "{}")
    const entry = cache[uid]

    if (entry && Date.now() - entry.timestamp < 24 * 60 * 60 * 1000) {
      // 24 hours
      return entry.url
    }

    return null
  } catch (error) {
    console.error("Error getting cached model URL:", error)
    return null
  }
}
