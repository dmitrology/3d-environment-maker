/**
 * Simple in-memory cache for 3D models to avoid repeated API calls
 */

interface CachedModel {
  data: any
  timestamp: number
}

class ModelCache {
  private cache: Map<string, CachedModel>
  private maxCacheSize: number
  private cacheDuration: number // in milliseconds

  constructor(maxSize = 20, cacheDurationMinutes = 30) {
    this.cache = new Map()
    this.maxCacheSize = maxSize
    this.cacheDuration = cacheDurationMinutes * 60 * 1000
  }

  /**
   * Get a model from the cache
   */
  get(key: string): any | null {
    const cached = this.cache.get(key)

    if (!cached) return null

    // Check if the cached item has expired
    if (Date.now() - cached.timestamp > this.cacheDuration) {
      this.cache.delete(key)
      return null
    }

    return cached.data
  }

  /**
   * Store a model in the cache
   */
  set(key: string, data: any): void {
    // If cache is full, remove the oldest entry
    if (this.cache.size >= this.maxCacheSize) {
      const oldestKey = this.getOldestKey()
      if (oldestKey) this.cache.delete(oldestKey)
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    })
  }

  /**
   * Find the oldest entry in the cache
   */
  private getOldestKey(): string | null {
    let oldestKey: string | null = null
    let oldestTime = Number.POSITIVE_INFINITY

    for (const [key, value] of this.cache.entries()) {
      if (value.timestamp < oldestTime) {
        oldestTime = value.timestamp
        oldestKey = key
      }
    }

    return oldestKey
  }

  /**
   * Clear expired items from the cache
   */
  cleanup(): void {
    const now = Date.now()

    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp > this.cacheDuration) {
        this.cache.delete(key)
      }
    }
  }

  /**
   * Get the current cache size
   */
  size(): number {
    return this.cache.size
  }

  /**
   * Clear the entire cache
   */
  clear(): void {
    this.cache.clear()
  }
}

// Create a singleton instance
const modelCache = new ModelCache()

export default modelCache
