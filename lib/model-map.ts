import { getModelForKeyword } from "./client-poly-pizza-service"

// Keywords that should use procedural models instead of remote models
export const PROCEDURAL_KEYWORDS = new Set(["mountain", "water", "lake", "river", "ocean", "hill"])

// Mapping of keywords to search terms for Poly Pizza
export const KEYWORD_TO_SEARCH_TERM: Record<string, string> = {
  // Vehicles
  car: "car low poly",
  vehicle: "car low poly",
  automobile: "car low poly",

  // Buildings
  house: "house low poly",
  home: "house low poly",
  building: "building low poly",
  castle: "castle low poly",
  fortress: "castle low poly",

  // Animals
  dog: "dog low poly",
  puppy: "dog low poly",
  canine: "dog low poly",
  cat: "cat low poly",
  feline: "cat low poly",

  // Fantasy
  dragon: "dragon low poly",
  drake: "dragon low poly",

  // Technology
  robot: "robot low poly",
  android: "robot low poly",
  mech: "robot low poly",

  // Nature
  tree: "tree low poly",
  plant: "plant low poly",

  // Fallback
  default: "cube low poly",
}

// Hardcoded direct GLB URLs for common models
export const KEYWORD_TO_MODEL_URL: Record<string, string> = {
  car: "https://static.poly.pizza/179e43ce-b9e0-40cf-8b99-641693d3207e.glb", // Police Car
  robot: "https://static.poly.pizza/f1d12388-e39b-4157-b32a-646a1d089fc4.glb", // Wolf (temporary)
  dragon: "https://static.poly.pizza/f1d12388-e39b-4157-b32a-646a1d089fc4.glb", // Wolf (temporary)
  castle: "https://static.poly.pizza/44e4f447-5ba2-4ab9-ab5d-33d3b3c1f5de.glb", // Metal Door (temporary)
  house: "https://static.poly.pizza/44e4f447-5ba2-4ab9-ab5d-33d3b3c1f5de.glb", // Metal Door (temporary)
  dog: "https://static.poly.pizza/611d25c7-430f-4bb5-ab2c-d8f5f3cb9712.glb", // Husky
  cat: "https://static.poly.pizza/ba6d0ee3-bcc0-4ef0-9d3c-a3e245b41c77.glb", // Shiba Inu (close enough)
  tree: "https://static.poly.pizza/2e6df40d-305c-4ebe-b61a-dcb2df03fb03.glb", // Fish (temporary)
}

// Cache for model URLs
const modelUrlCache = new Map<string, string>()

/**
 * Determines if a keyword should use a procedural model
 */
export function shouldUseProceduralModel(keyword: string): boolean {
  return PROCEDURAL_KEYWORDS.has(keyword.toLowerCase())
}

/**
 * Gets the search term for a keyword
 */
export function getSearchTermForKeyword(keyword: string): string {
  const lowerKeyword = keyword.toLowerCase()
  return KEYWORD_TO_SEARCH_TERM[lowerKeyword] || lowerKeyword
}

/**
 * Gets the remote model URL for a keyword, or returns undefined if no match
 */
export async function getRemoteModelUrl(keyword: string): Promise<string | undefined> {
  const lowerKeyword = keyword.toLowerCase()

  // Check if this keyword should use a procedural model
  if (shouldUseProceduralModel(lowerKeyword)) {
    return undefined
  }

  // Check cache first
  if (modelUrlCache.has(lowerKeyword)) {
    return modelUrlCache.get(lowerKeyword)
  }

  // Check hardcoded URLs first
  if (KEYWORD_TO_MODEL_URL[lowerKeyword]) {
    const url = KEYWORD_TO_MODEL_URL[lowerKeyword]
    modelUrlCache.set(lowerKeyword, url)
    console.log(`Using hardcoded URL for "${keyword}": ${url}`)
    return url
  }

  try {
    // Get the search term for this keyword
    const searchTerm = getSearchTermForKeyword(lowerKeyword)

    // Get a model for this search term
    const model = await getModelForKeyword(searchTerm)

    if (model && model.Download) {
      // Cache the URL
      modelUrlCache.set(lowerKeyword, model.Download)
      console.log(`Found model URL for "${keyword}": ${model.Download}`)
      return model.Download
    }
  } catch (error) {
    console.error(`Error getting model for keyword ${keyword}:`, error)
  }

  console.log(`No model found for keyword "${keyword}", using fallback`)
  return getFallbackModelUrl()
}

/**
 * Gets the fallback model URL
 */
export async function getFallbackModelUrl(): Promise<string> {
  // Check cache first
  if (modelUrlCache.has("default")) {
    return modelUrlCache.get("default") || "/fallback-cube.glb"
  }

  // Check hardcoded fallback
  if (KEYWORD_TO_MODEL_URL.default) {
    modelUrlCache.set("default", KEYWORD_TO_MODEL_URL.default)
    return KEYWORD_TO_MODEL_URL.default
  }

  try {
    // Get a fallback model
    const model = await getModelForKeyword(KEYWORD_TO_SEARCH_TERM.default)

    if (model && model.Download) {
      // Cache the URL
      modelUrlCache.set("default", model.Download)
      return model.Download
    }
  } catch (error) {
    console.error("Error getting fallback model:", error)
  }

  return "/fallback-cube.glb"
}
