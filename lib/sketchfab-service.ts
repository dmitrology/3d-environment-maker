"use server"

import { kv } from "@vercel/kv"

// Types for Sketchfab API responses
export interface SketchfabModel {
  uid: string
  name: string
  description: string
  thumbnails: {
    images: {
      url: string
      width: number
      height: number
    }[]
  }
  viewerUrl: string
  embedUrl: string
  downloadUrl?: string
  isDownloadable: boolean
  license: {
    slug: string
    label: string
  }
  tags: string[]
  categories: {
    name: string
  }[]
  user: {
    username: string
    displayName: string
    profileUrl: string
  }
}

export interface SketchfabSearchResponse {
  results: SketchfabModel[]
  next: string | null
  previous: string | null
  count: number
}

// Cache TTL in seconds
const CACHE_TTL = 3600 // 1 hour

// Get Sketchfab API token from environment variables
const getApiToken = () => {
  const token = process.env.SKETCHFAB_API_TOKEN
  if (!token) {
    throw new Error("SKETCHFAB_API_TOKEN is not defined in environment variables")
  }
  return token
}

// Search for models on Sketchfab
//import type { SketchfabModel } from './types'

// Search for models on Sketchfab
export async function searchSketchfabModels(query: string): Promise<SketchfabModel[]> {
  try {
    // Get API token from environment variables
    const token = process.env.SKETCHFAB_API_TOKEN

    if (!token) {
      console.warn("SKETCHFAB_API_TOKEN is not defined in environment variables")
      return getMockModels(query)
    }

    // Search for models
    const searchResponse = await fetch(
      `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(query)}&downloadable=true&archives_flavours=gltf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000), // 15 second timeout
      },
    )

    if (!searchResponse.ok) {
      throw new Error(`Sketchfab search API error: ${searchResponse.status} ${searchResponse.statusText}`)
    }

    const data = await searchResponse.json()
    const results = data.results || []

    if (results.length === 0) {
      console.warn(`No models found for query: "${query}"`)
      return getMockModels(query)
    }

    // Get download URLs for each model (limited to first 3 to avoid rate limits)
    const models: SketchfabModel[] = []
    const modelsToProcess = results.slice(0, 3)

    for (const model of modelsToProcess) {
      try {
        const downloadResponse = await fetch(`https://api.sketchfab.com/v3/models/${model.uid}/download`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: AbortSignal.timeout(10000), // 10 second timeout
        })

        if (!downloadResponse.ok) {
          console.warn(`Couldn't get download URL for model ${model.uid}: ${downloadResponse.status}`)
          continue
        }

        const downloadData = await downloadResponse.json()

        if (downloadData.gltf?.url) {
          models.push({
            uid: model.uid,
            name: model.name,
            thumbnailUrl: model.thumbnails.images[0]?.url || "/placeholder.svg",
            downloadUrl: downloadData.gltf.url,
            categories: model.categories?.map((cat) => cat.name) || [],
            tags: model.tags || [],
          })
        }
      } catch (error) {
        console.error(`Error getting download URL for model ${model.uid}:`, error)
      }
    }

    return models.length > 0 ? models : getMockModels(query)
  } catch (error) {
    console.error("Error searching Sketchfab models:", error)
    return getMockModels(query)
  }
}

// Get mock models when API fails or is not configured
function getMockModels(query: string): SketchfabModel[] {
  // Generate some mock models based on the query
  const mockModels: SketchfabModel[] = [
    {
      uid: "mock1",
      name: `${query} model 1`,
      thumbnailUrl: `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(query)} 1`,
      downloadUrl: "/models/cube.glb",
      categories: ["Props"],
      tags: [query, "mock"],
    },
    {
      uid: "mock2",
      name: `${query} model 2`,
      thumbnailUrl: `/placeholder.svg?height=300&width=300&query=${encodeURIComponent(query)} 2`,
      downloadUrl: "/models/sphere.glb",
      categories: ["Characters"],
      tags: [query, "mock"],
    },
  ]

  return mockModels
}

// Get download URL for a model
export async function getModelDownloadUrl(uid: string): Promise<string | null> {
  try {
    // Check cache first
    const cacheKey = `sketchfab:download:${uid}`
    const cachedUrl = await kv.get<string>(cacheKey)

    if (cachedUrl) {
      return cachedUrl
    }

    // Make API request
    const response = await fetch(`https://api.sketchfab.com/v3/models/${uid}/download`, {
      headers: {
        Authorization: `Bearer ${getApiToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get download URL: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    const downloadUrl = data.gltf?.url

    if (!downloadUrl) {
      throw new Error("No glTF download URL available")
    }

    // Cache the download URL
    await kv.set(cacheKey, downloadUrl, { ex: CACHE_TTL })

    return downloadUrl
  } catch (error) {
    console.error(`Error getting download URL for model ${uid}:`, error)
    return null
  }
}

// Get model details
export async function getModelDetails(uid: string): Promise<SketchfabModel | null> {
  try {
    // Check cache first
    const cacheKey = `sketchfab:model:${uid}`
    const cachedModel = await kv.get<SketchfabModel>(cacheKey)

    if (cachedModel) {
      return cachedModel
    }

    // Make API request
    const response = await fetch(`https://api.sketchfab.com/v3/models/${uid}`, {
      headers: {
        Authorization: `Bearer ${getApiToken()}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get model details: ${response.status} ${response.statusText}`)
    }

    const model = (await response.json()) as SketchfabModel

    // Cache the model details
    await kv.set(cacheKey, model, { ex: CACHE_TTL })

    return model
  } catch (error) {
    console.error(`Error getting details for model ${uid}:`, error)
    return null
  }
}
