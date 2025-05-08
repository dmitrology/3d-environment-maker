"use client"

// Utility for caching generated images in localStorage

const CACHE_PREFIX = "visual-alchemy-image-"
const MAX_CACHE_SIZE = 20 // Maximum number of cached images
const CACHE_INDEX_KEY = "visual-alchemy-image-index"

// Save a generated image to localStorage
export const saveGeneratedImage = (key: string, imageData: string): void => {
  if (typeof window === "undefined") return

  try {
    // Get the current cache index
    const indexJson = localStorage.getItem(CACHE_INDEX_KEY)
    const index: string[] = indexJson ? JSON.parse(indexJson) : []

    // Add the new key to the index
    if (!index.includes(key)) {
      // If we're at the max cache size, remove the oldest entry
      if (index.length >= MAX_CACHE_SIZE) {
        const oldestKey = index.shift()
        if (oldestKey) {
          localStorage.removeItem(CACHE_PREFIX + oldestKey)
        }
      }

      // Add the new key to the end of the index
      index.push(key)
      localStorage.setItem(CACHE_INDEX_KEY, JSON.stringify(index))
    }

    // Save the image data
    localStorage.setItem(CACHE_PREFIX + key, imageData)
  } catch (error) {
    console.error("Error saving image to cache:", error)
  }
}

// Get a cached image from localStorage
export const getGeneratedImage = async (key: string): Promise<string | null> => {
  if (typeof window === "undefined") return null

  try {
    const cachedImage = localStorage.getItem(CACHE_PREFIX + key)
    return cachedImage
  } catch (error) {
    console.error("Error getting image from cache:", error)
    return null
  }
}

// Clear all cached images
export const clearImageCache = (): void => {
  if (typeof window === "undefined") return

  try {
    // Get the current cache index
    const indexJson = localStorage.getItem(CACHE_INDEX_KEY)
    const index: string[] = indexJson ? JSON.parse(indexJson) : []

    // Remove all cached images
    index.forEach((key) => {
      localStorage.removeItem(CACHE_PREFIX + key)
    })

    // Clear the index
    localStorage.removeItem(CACHE_INDEX_KEY)
  } catch (error) {
    console.error("Error clearing image cache:", error)
  }
}

// Get cache stats
export const getCacheStats = (): { count: number; size: number } => {
  if (typeof window === "undefined") return { count: 0, size: 0 }

  try {
    // Get the current cache index
    const indexJson = localStorage.getItem(CACHE_INDEX_KEY)
    const index: string[] = indexJson ? JSON.parse(indexJson) : []

    // Calculate total size
    let totalSize = 0
    index.forEach((key) => {
      const item = localStorage.getItem(CACHE_PREFIX + key)
      if (item) {
        totalSize += item.length * 2 // Approximate size in bytes (2 bytes per character)
      }
    })

    return {
      count: index.length,
      size: totalSize,
    }
  } catch (error) {
    console.error("Error getting cache stats:", error)
    return { count: 0, size: 0 }
  }
}
