"use server"

import { put, list, del } from "@vercel/blob"
import { nanoid } from "nanoid"

// Define model categories
export type ModelCategory = "backgrounds" | "characters" | "props" | "effects"

// Interface for model metadata
export interface ModelMetadata {
  id: string
  name: string
  category: ModelCategory
  tags: string[]
  url: string
  thumbnailUrl?: string
  createdAt: Date
  prompt?: string
}

// Function to get a model URL from Vercel Blob
export async function getBlobModelURL(fileName: string): Promise<string> {
  // In a real implementation, this would use your Vercel Blob URL
  return `/models/${fileName}`
}

// Function to upload a model file to Vercel Blob
export async function uploadModelToBlob(
  file: File,
  category: ModelCategory,
  name: string,
  tags: string[] = [],
  prompt?: string,
): Promise<ModelMetadata> {
  try {
    // Generate a unique ID for the model
    const id = nanoid()

    // Create a path based on category and ID
    const path = `models/${category}/${id}/${file.name}`

    // Upload the file to Vercel Blob
    const blob = await put(path, file, {
      access: "public",
      addRandomSuffix: false,
      contentType: file.type,
      metadata: {
        category,
        name,
        tags: JSON.stringify(tags),
        prompt: prompt || "",
      },
    })

    // Create and return metadata
    const metadata: ModelMetadata = {
      id,
      name,
      category,
      tags,
      url: blob.url,
      createdAt: new Date(),
      prompt,
    }

    return metadata
  } catch (error) {
    console.error("Error uploading model to Blob:", error)
    throw new Error("Failed to upload model")
  }
}

// Function to list models by category
export async function listModelsByCategory(category: ModelCategory): Promise<ModelMetadata[]> {
  try {
    // List blobs with the specified prefix
    const { blobs } = await list({ prefix: `models/${category}/` })

    // Map blobs to model metadata
    return blobs.map((blob) => {
      const id = blob.pathname.split("/")[2] // Extract ID from path
      const metadata = blob.metadata as any

      return {
        id,
        name: metadata?.name || "Unnamed Model",
        category: category,
        tags: metadata?.tags ? JSON.parse(metadata.tags) : [],
        url: blob.url,
        createdAt: new Date(blob.uploadedAt),
        prompt: metadata?.prompt || undefined,
      }
    })
  } catch (error) {
    console.error("Error listing models:", error)
    return []
  }
}

// Function to delete a model
export async function deleteModel(url: string): Promise<boolean> {
  try {
    await del(url)
    return true
  } catch (error) {
    console.error("Error deleting model:", error)
    return false
  }
}
