// Types for Poly Pizza API responses
export interface PolyPizzaModel {
  ID: string
  Title: string
  Attribution: string
  Thumbnail: string
  Download: string
  "Tri Count": number
  Creator: {
    Username: string
    DPURL: string
  }
  Category: string
  Tags: string[]
  Licence: string
  Animated: boolean
}

export interface PolyPizzaSearchResponse {
  total: number
  results: PolyPizzaModel[]
}

// Cache for model search results
const modelCache = new Map<string, PolyPizzaModel>()

/**
 * Searches for models on Poly Pizza
 */
export async function searchModels(keyword: string, limit = 5): Promise<PolyPizzaSearchResponse> {
  try {
    console.log(`Searching for models with keyword: ${keyword}`)
    const response = await fetch(`/api/poly-pizza/search?q=${encodeURIComponent(keyword)}&limit=${limit}`)

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Error searching models:", errorData)
      throw new Error(errorData.error || "Failed to search models")
    }

    const data: PolyPizzaSearchResponse = await response.json()

    // Cache the results
    if (data.results && data.results.length > 0) {
      data.results.forEach((model) => {
        modelCache.set(model.ID, model)
      })
    }

    return data
  } catch (error) {
    console.error("Error in searchModels:", error)
    return { total: 0, results: [] }
  }
}

/**
 * Gets a model for a specific keyword
 */
export async function getModelForKeyword(keyword: string): Promise<PolyPizzaModel | null> {
  try {
    const searchResponse = await searchModels(keyword, 1)

    if (searchResponse.results && searchResponse.results.length > 0) {
      const model = searchResponse.results[0]
      console.log(`Found model for keyword "${keyword}": ${model.Title} (${model.Download})`)
      return model
    }

    console.log(`No models found for keyword: ${keyword}`)
    return null
  } catch (error) {
    console.error(`Error getting model for keyword "${keyword}":`, error)
    return null
  }
}

/**
 * Gets a model by ID (from cache or API)
 */
export async function getModelById(id: string): Promise<PolyPizzaModel | null> {
  // Check cache first
  if (modelCache.has(id)) {
    return modelCache.get(id) || null
  }

  try {
    const response = await fetch(`/api/poly-pizza/model?id=${id}`)

    if (!response.ok) {
      throw new Error(`Failed to get model with ID ${id}`)
    }

    const model: PolyPizzaModel = await response.json()

    // Cache the result
    modelCache.set(id, model)

    return model
  } catch (error) {
    console.error(`Error getting model with ID ${id}:`, error)
    return null
  }
}
