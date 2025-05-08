import { getModelUrl } from "./model-config"

// Cache for loaded models to avoid duplicate fetches
const modelCache = new Map<string, string>()

/**
 * Dynamically load a model from a remote source
 * This could be expanded to fetch from Sketchfab, etc.
 */
export async function loadRemoteModel(modelType: string): Promise<string> {
  // Check cache first
  if (modelCache.has(modelType)) {
    return modelCache.get(modelType)!
  }

  try {
    // In a real implementation, this would fetch from Sketchfab or another source
    // For now, we'll just return the fallback URL
    const modelUrl = getModelUrl(modelType)

    // Cache the result
    modelCache.set(modelType, modelUrl)
    return modelUrl
  } catch (error) {
    console.error(`Error loading remote model for ${modelType}:`, error)
    return "/fallback-cube.glb"
  }
}

/**
 * Preload a set of models
 */
export async function preloadModels(modelTypes: string[]): Promise<void> {
  await Promise.all(modelTypes.map((type) => loadRemoteModel(type)))
}
