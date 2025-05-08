"use client"

import type { ModelMetadata, ModelCategory } from "@/lib/model-types"
import { getSafeModelUrl } from "@/lib/model-utils"

export interface ModelSearchResult {
  id: string
  name: string
  thumbnailUrl: string
  downloadUrl: string
}

export async function searchModels(query: string): Promise<ModelSearchResult[]> {
  try {
    const response = await fetch(`/api/search-models?q=${encodeURIComponent(query)}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()

    // Ensure all model URLs are safe
    return data.map((model: ModelSearchResult) => ({
      ...model,
      downloadUrl: getSafeModelUrl(model.downloadUrl),
    }))
  } catch (error) {
    console.error("Error searching models:", error)
    return []
  }
}

// Function to fetch all models
export async function fetchModels(): Promise<ModelMetadata[]> {
  try {
    const response = await fetch("/api/models")

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.models
  } catch (error) {
    console.error("Error fetching models:", error)
    return []
  }
}

// Function to fetch models by category
export async function fetchModelsByCategory(category: ModelCategory): Promise<ModelMetadata[]> {
  try {
    const response = await fetch(`/api/models?category=${category}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.models
  } catch (error) {
    console.error(`Error fetching models for category ${category}:`, error)
    return []
  }
}

// Function to fetch a model by ID
export async function fetchModelById(id: string): Promise<ModelMetadata | null> {
  try {
    const response = await fetch(`/api/models?id=${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch model: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.model
  } catch (error) {
    console.error(`Error fetching model with ID ${id}:`, error)
    return null
  }
}

// Function to get model stats
export async function fetchModelStats(): Promise<{
  totalModels: number
  categoryCounts: Record<string, number>
  cacheAge: number | null
} | null> {
  try {
    const response = await fetch("/api/models/stats")

    if (!response.ok) {
      throw new Error(`Failed to fetch model stats: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.stats
  } catch (error) {
    console.error("Error fetching model stats:", error)
    return null
  }
}

// Function to clear model cache
export async function clearModelCache(): Promise<boolean> {
  try {
    const response = await fetch("/api/models/stats", {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error(`Failed to clear model cache: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error clearing model cache:", error)
    return false
  }
}

// Function to initialize models
export async function initializeModels(): Promise<boolean> {
  try {
    const response = await fetch("/api/init-models")

    if (!response.ok) {
      throw new Error(`Failed to initialize models: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.success
  } catch (error) {
    console.error("Error initializing models:", error)
    return false
  }
}

// Helper function to get a safe placeholder URL
export function getPlaceholderUrl(query: string): string {
  // Return a simple static image instead of a dynamic SVG with query parameters
  return "/placeholder-cube.png"
}

export async function getPlaceholderModelUrl(query: string): Promise<string> {
  // Always return our fallback model
  return "/fallback-cube.glb"
}
