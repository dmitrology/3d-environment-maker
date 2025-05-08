// Types for Sketchfab API responses
export interface SketchfabModel {
  uid: string
  name: string
  thumbnails: {
    images: {
      url: string
      width: number
      height: number
    }[]
  }
  viewerUrl: string
  downloadUrl?: string
  isDownloadable: boolean
}

/**
 * Search for downloadable GLTF models on Sketchfab based on a prompt
 */
export async function searchSketchfabModels(prompt: string): Promise<string[]> {
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
    )

    if (!searchResponse.ok) {
      throw new Error(`Sketchfab search API error: ${searchResponse.status} ${searchResponse.statusText}`)
    }

    const data = await searchResponse.json()
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
        })

        if (!downloadResponse.ok) {
          console.warn(`Couldn't get download URL for model ${model.uid}: ${downloadResponse.status}`)
          continue
        }

        const data = await downloadResponse.json()

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
