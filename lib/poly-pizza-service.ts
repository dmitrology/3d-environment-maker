"use server"

// Poly Pizza API service
const API_KEY = "56f6b045336c41e8af2557cc4e0f8645"
const API_BASE_URL = "https://api.poly.pizza/v1"

export interface PolyPizzaModel {
  id: string
  name: string
  description: string
  url: string
  thumbnailUrl: string
  downloadUrl: string
  author: {
    name: string
    url: string
  }
  license: string
  tags: string[]
}

/**
 * Search for models on Poly Pizza
 */
export async function searchPolyPizzaModels(query: string, limit = 10): Promise<PolyPizzaModel[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/search?key=${API_KEY}&q=${encodeURIComponent(query)}&limit=${limit}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "force-cache", // Cache the results
      },
    )

    if (!response.ok) {
      throw new Error(`Poly Pizza API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    // Map the response to our model interface
    return data.assets.map((asset: any) => ({
      id: asset.id,
      name: asset.name,
      description: asset.description || "",
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
      downloadUrl: asset.downloadUrl,
      author: {
        name: asset.author.name,
        url: asset.author.url,
      },
      license: asset.license,
      tags: asset.tags || [],
    }))
  } catch (error) {
    console.error("Error searching Poly Pizza models:", error)
    return []
  }
}

/**
 * Get a model by ID from Poly Pizza
 */
export async function getPolyPizzaModelById(id: string): Promise<PolyPizzaModel | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/asset/${id}?key=${API_KEY}`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: "force-cache", // Cache the results
    })

    if (!response.ok) {
      throw new Error(`Poly Pizza API error: ${response.status} ${response.statusText}`)
    }

    const asset = await response.json()

    return {
      id: asset.id,
      name: asset.name,
      description: asset.description || "",
      url: asset.url,
      thumbnailUrl: asset.thumbnailUrl,
      downloadUrl: asset.downloadUrl,
      author: {
        name: asset.author.name,
        url: asset.author.url,
      },
      license: asset.license,
      tags: asset.tags || [],
    }
  } catch (error) {
    console.error(`Error getting Poly Pizza model ${id}:`, error)
    return null
  }
}

/**
 * Get a random model for a keyword from Poly Pizza
 */
export async function getRandomModelForKeyword(keyword: string): Promise<PolyPizzaModel | null> {
  try {
    const models = await searchPolyPizzaModels(keyword, 5)

    if (models.length === 0) {
      return null
    }

    // Return a random model from the results
    return models[Math.floor(Math.random() * models.length)]
  } catch (error) {
    console.error(`Error getting random model for keyword ${keyword}:`, error)
    return null
  }
}
