import type { ModelMetadata, ModelCategory } from "@/lib/model-types"

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

// Function to get a random model from a category
export async function getRandomModel(category: ModelCategory): Promise<ModelMetadata | null> {
  const models = await fetchModelsByCategory(category)

  if (models.length === 0) {
    return null
  }

  const randomIndex = Math.floor(Math.random() * models.length)
  return models[randomIndex]
}

// Function to get models matching tags
export async function getModelsByTags(tags: string[], category?: ModelCategory): Promise<ModelMetadata[]> {
  const models = category ? await fetchModelsByCategory(category) : await fetchModels()

  if (tags.length === 0) {
    return models
  }

  // Filter models that have at least one matching tag
  return models.filter((model) =>
    model.tags.some((tag) => tags.some((searchTag) => tag.toLowerCase().includes(searchTag.toLowerCase()))),
  )
}
