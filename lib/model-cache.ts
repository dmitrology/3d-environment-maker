"use server"

import type { ModelMetadata, ModelCategory } from "@/lib/model-types"

// Constants
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

// Mock data for testing
const MOCK_MODELS: ModelMetadata[] = [
  {
    id: "model1",
    name: "Crystal",
    category: "props",
    tags: ["crystal", "gem", "magic", "fantasy"],
    url: "/sparkling-crystal.png",
    thumbnailUrl: "/placeholder.svg?key=46dda",
    author: "Test Author",
    sourceUrl: "https://example.com/model1",
    createdAt: new Date(),
  },
  {
    id: "model2",
    name: "Low Poly Tree",
    category: "props",
    tags: ["tree", "nature", "forest", "plant"],
    url: "/solitary-oak.png",
    thumbnailUrl: "/placeholder.svg?key=ymqgp",
    author: "Test Author",
    sourceUrl: "https://example.com/model2",
    createdAt: new Date(),
  },
  {
    id: "model3",
    name: "Stylized Planet",
    category: "backgrounds",
    tags: ["planet", "space", "sci-fi", "cosmic"],
    url: "/serene-blue-planet.png",
    thumbnailUrl: "/placeholder.svg?key=q8pia",
    author: "Test Author",
    sourceUrl: "https://example.com/model3",
    createdAt: new Date(),
  },
  {
    id: "model4",
    name: "Robot Toy",
    category: "characters",
    tags: ["robot", "toy", "sci-fi", "character"],
    url: "/futuristic-helper-robot.png",
    thumbnailUrl: "/placeholder.svg?key=6v59s",
    author: "Test Author",
    sourceUrl: "https://example.com/model4",
    createdAt: new Date(),
  },
]

// Function to get all models
export async function getModels(): Promise<ModelMetadata[]> {
  try {
    // For now, just return mock data
    // In a real implementation, this would fetch from KV or other storage
    return MOCK_MODELS
  } catch (error) {
    console.error("Error getting models:", error)
    return []
  }
}

// Function to get models by category
export async function getModelsByCategory(category: ModelCategory): Promise<ModelMetadata[]> {
  try {
    // Filter mock data by category
    return MOCK_MODELS.filter((model) => model.category === category)
  } catch (error) {
    console.error(`Error getting models for category ${category}:`, error)
    return []
  }
}

// Function to get a model by ID
export async function getModelById(id: string): Promise<ModelMetadata | null> {
  try {
    // Find model by ID in mock data
    return MOCK_MODELS.find((model) => model.id === id) || null
  } catch (error) {
    console.error(`Error getting model ${id}:`, error)
    return null
  }
}
