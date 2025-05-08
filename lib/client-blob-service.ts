"use client"

import type { ModelCategory, ModelMetadata } from "./model-types"

// Client-side function to get model URL
export async function getModelURL(fileName: string): Promise<string> {
  try {
    const response = await fetch(`/api/blob-url?fileName=${encodeURIComponent(fileName)}`)

    if (!response.ok) {
      throw new Error(`Failed to get model URL: ${response.status}`)
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error getting model URL:", error)
    return `/models/${fileName}` // Fallback
  }
}

// Client-side function to upload a model
export async function uploadModel(
  file: File,
  category: ModelCategory,
  name: string,
  tags: string[] = [],
  prompt?: string,
): Promise<ModelMetadata | null> {
  try {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("category", category)
    formData.append("name", name)
    formData.append("tags", JSON.stringify(tags))
    if (prompt) formData.append("prompt", prompt)

    const response = await fetch("/api/upload-model", {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      throw new Error(`Failed to upload model: ${response.status}`)
    }

    const data = await response.json()
    return data.model
  } catch (error) {
    console.error("Error uploading model:", error)
    return null
  }
}

// Client-side function to list models by category
export async function getModelsByCategory(category: ModelCategory): Promise<ModelMetadata[]> {
  try {
    const response = await fetch(`/api/models?category=${category}`)

    if (!response.ok) {
      throw new Error(`Failed to get models: ${response.status}`)
    }

    const data = await response.json()
    return data.models
  } catch (error) {
    console.error(`Error getting models for category ${category}:`, error)
    return []
  }
}
