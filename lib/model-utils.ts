/**
 * Checks if a URL is a valid model URL (ends with .glb or .gltf)
 */
export function isValidModelUrl(url: string): boolean {
  if (!url) return false

  // Check if it's a valid model URL
  return url.match(/\.(glb|gltf)$/i) !== null && !url.includes("placeholder") && !url.startsWith("/placeholder")
}

/**
 * Returns a safe fallback model URL if the provided URL is invalid
 */
export function getSafeModelUrl(url: string): string {
  if (isValidModelUrl(url)) {
    return url
  }

  // Return a fallback model URL
  return "/fallback-cube.glb"
}
