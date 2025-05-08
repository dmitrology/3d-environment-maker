"use server"

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

/**
 * Search for downloadable GLTF models on Sketchfab based on a prompt
 */
export async function searchSketchfabGLTFModels(prompt: string): Promise<string[]> {
  try {
    // Get API token from environment variables
    const token = process.env.SKETCHFAB_API_TOKEN
    if (!token) {
      console.warn("SKETCHFAB_API_TOKEN is not defined in environment variables")
      return []
    }

    console.log(`Searching Sketchfab for models matching: "${prompt}"`)

    // Search for models
    const searchResponse = await fetch(
      `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(
        prompt,
      )}&downloadable=true&archives_flavours=gltf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(15000), // 15 second timeout
      },
    ).catch((error) => {
      console.error("Error fetching from Sketchfab search API:", error)
      return null
    })

    if (!searchResponse || !searchResponse.ok) {
      console.error(`Sketchfab search API error: ${searchResponse?.status} ${searchResponse?.statusText}`)
      return []
    }

    const data = await searchResponse.json().catch((error) => {
      console.error("Error parsing Sketchfab search response:", error)
      return { results: [] }
    })

    const results = data.results || []

    if (results.length === 0) {
      console.warn(`No models found for prompt: "${prompt}"`)
      return []
    }

    console.log(`Found ${results.length} models, fetching download URLs...`)

    // Get download URLs for each model (limited to first 3 to avoid rate limits)
    const modelUrls: string[] = []
    const modelsToProcess = results.slice(0, 3)

    for (const model of modelsToProcess) {
      try {
        console.log(`Fetching download URL for model: ${model.uid} (${model.name})`)

        const downloadResponse = await fetch(`https://api.sketchfab.com/v3/models/${model.uid}/download`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          // Add timeout to prevent hanging requests
          signal: AbortSignal.timeout(10000), // 10 second timeout
        }).catch((error) => {
          console.warn(`Error fetching download URL for model ${model.uid}:`, error)
          return null
        })

        if (!downloadResponse || !downloadResponse.ok) {
          console.warn(`Couldn't get download URL for model ${model.uid}: ${downloadResponse?.status}`)
          continue
        }

        const data = await downloadResponse.json().catch((error) => {
          console.warn(`Error parsing download response for model ${model.uid}:`, error)
          return null
        })

        if (!data) continue

        if (data.gltf?.url) {
          console.log(`Got download URL for model ${model.uid}`)
          modelUrls.push(data.gltf.url)
        } else {
          console.warn(`No glTF URL found for model ${model.uid}`)
        }
      } catch (error) {
        console.error(`Error getting download URL for model ${model.uid}:`, error)
      }
    }

    console.log(`Successfully retrieved ${modelUrls.length} model URLs`)
    return modelUrls
  } catch (error) {
    console.error("Error searching Sketchfab models:", error)
    return []
  }
}

/**
 * Get model details from Sketchfab
 */
export async function getSketchfabModelDetails(uid: string): Promise<SketchfabModel | null> {
  try {
    const token = process.env.SKETCHFAB_API_TOKEN
    if (!token) {
      throw new Error("SKETCHFAB_API_TOKEN is not defined in environment variables")
    }

    const response = await fetch(`https://api.sketchfab.com/v3/models/${uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to get model details: ${response.status} ${response.statusText}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`Error getting details for model ${uid}:`, error)
    return null
  }
}
