// lib/model-config.ts
export type ModelConfig = {
  type: "procedural" | "glb"
  url?: string
}

export const MODEL_CONFIG: Record<string, ModelConfig> = {
  // Procedural models
  tree: { type: "procedural" },
  forest: { type: "procedural" },
  woods: { type: "procedural" },
  woodland: { type: "procedural" },
  dog: { type: "procedural" },
  puppy: { type: "procedural" },
  canine: { type: "procedural" },
  cat: { type: "procedural" },
  feline: { type: "procedural" },
  house: { type: "procedural" },
  building: { type: "procedural" },
  mountain: { type: "procedural" },
  hill: { type: "procedural" },
  water: { type: "procedural" },
  lake: { type: "procedural" },
  river: { type: "procedural" },
  ocean: { type: "procedural" },

  // GLB-based models - using fallback cube for now
  car: { type: "glb", url: "/fallback-cube.glb" },
  vehicle: { type: "glb", url: "/fallback-cube.glb" },
  airplane: { type: "glb", url: "/fallback-cube.glb" },
  plane: { type: "glb", url: "/fallback-cube.glb" },
  castle: { type: "glb", url: "/fallback-cube.glb" },
  fortress: { type: "glb", url: "/fallback-cube.glb" },
  spaceship: { type: "glb", url: "/fallback-cube.glb" },
  robot: { type: "glb", url: "/fallback-cube.glb" },
  dragon: { type: "glb", url: "/fallback-cube.glb" },
}

// Helper function to get model type from keyword
export function getModelTypeFromKeyword(keyword: string): string | null {
  const lowerKeyword = keyword.toLowerCase()

  // Direct match
  if (MODEL_CONFIG[lowerKeyword]) {
    return lowerKeyword
  }

  // Check for partial matches (e.g., "forest trees" should match "tree")
  for (const [key, _] of Object.entries(MODEL_CONFIG)) {
    if (lowerKeyword.includes(key)) {
      return key
    }
  }

  return null
}

// Helper function to safely get model URL with fallback
export function getModelUrl(modelType: string): string {
  const config = MODEL_CONFIG[modelType]

  if (config?.type === "glb" && config.url) {
    return config.url
  }

  // Return fallback model if the requested model is not found
  return "/fallback-cube.glb"
}
