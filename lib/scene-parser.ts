import { searchSketchfabGLTFModels } from "@/utils/sketchfab"
import type { SceneConfig } from "@/app/api/generate-scene/route"

/**
 * Parse any text prompt into a scene configuration
 */
export async function parseScenePrompt(prompt: string): Promise<SceneConfig> {
  try {
    console.log(`Parsing scene prompt: "${prompt}"`)

    // Search for models based on the prompt
    const modelUrls = await searchSketchfabGLTFModels(prompt)
    console.log(`Found ${modelUrls.length} models for prompt: "${prompt}"`)

    // If no models found, return a fallback scene
    if (!modelUrls || modelUrls.length === 0) {
      console.log(`No models found for prompt: "${prompt}". Using fallback scene.`)
      return createFallbackScene(prompt)
    }

    // Create a scene configuration
    const scene: SceneConfig = {
      objects: modelUrls.map((url, i) => ({
        type: "external",
        modelUrl: url,
        position: [i * 3 - (modelUrls.length * 3) / 2, 0, -5], // Distribute models horizontally
        scale: 1.5,
      })),
      camera: {
        position: [0, 5, 10],
        target: [0, 0, 0],
        motion: "orbit",
        speed: 0.3,
      },
      lighting: {
        type: "ambient",
        color: "#ffffff",
        intensity: 1,
      },
      environment: {
        type: "sky",
        color: "#1a1a2e",
        fog: false,
      },
    }

    return scene
  } catch (error) {
    console.error("Error parsing scene prompt:", error)

    // Return a fallback scene if there's an error
    return createFallbackScene(prompt)
  }
}

/**
 * Create a fallback scene when model loading fails
 */
function createFallbackScene(prompt: string): SceneConfig {
  // Create a simple scene with a cube and a plane
  return {
    objects: [
      {
        type: "fallback",
        modelUrl: `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(prompt)}`,
        position: [0, 0, -5],
        scale: 1.5,
      },
    ],
    camera: {
      position: [0, 5, 10],
      target: [0, 0, 0],
      motion: "orbit",
      speed: 0.3,
    },
    lighting: {
      type: "ambient",
      color: "#ffffff",
      intensity: 1,
    },
    environment: {
      type: "sky",
      color: "#1a1a2e",
      fog: false,
    },
  }
}
