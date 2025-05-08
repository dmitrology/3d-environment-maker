import { useGLTF } from "@react-three/drei"
import { MODEL_CONFIG } from "@/lib/model-config"
import { preloadModels } from "./model-loader"

export function preloadGLBs() {
  // Get all GLB model types
  const glbModelTypes = Object.entries(MODEL_CONFIG)
    .filter(([_, config]) => config.type === "glb")
    .map(([type, _]) => type)

  // Preload models
  preloadModels(glbModelTypes).catch((error) => {
    console.error("Error preloading models:", error)
  })

  // Also preload using drei's useGLTF for React Three Fiber integration
  Object.values(MODEL_CONFIG).forEach((config) => {
    if (config.type === "glb" && config.url) {
      try {
        useGLTF.preload(config.url)
      } catch (error) {
        console.error(`Error preloading GLB ${config.url}:`, error)
      }
    }
  })
}
