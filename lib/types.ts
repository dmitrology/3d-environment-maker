export interface CreativeBrief {
  concept: string
  visual_style: string
  scene_description: string
  color_palette: string
  mood: string
  technical_elements: string
  references?: string
  videoPrompt?: string
  // Add any additional fields that might be coming from the API
  lighting?: string | Record<string, any>
  camera_movements?: string | Record<string, any>
  depth_of_field?: string | Record<string, any>
  [key: string]: any // Allow for additional properties
}

export interface SceneConfig {
  name: string
  description: string
  camera?: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
    autoRotate?: boolean
    rotationSpeed?: number
  }
  lighting?: {
    ambient: {
      intensity: number
      color: string
    }
    directional: {
      intensity: number
      color: string
      position: [number, number, number]
    }
  }
  objects: SceneObject[]
}

export interface SceneObject {
  name: string
  modelUrl: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number | [number, number, number]
  animate?: boolean
}
