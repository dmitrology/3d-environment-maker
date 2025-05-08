import { NextResponse } from "next/server"
import { searchSketchfabModels } from "@/lib/sketchfab-service"
import type { SceneConfig } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Please provide a valid prompt" }, { status: 400 })
    }

    console.log(`Generating scene for prompt: "${prompt}"`)

    // Search for models based on the prompt
    const models = await searchSketchfabModels(prompt)

    // Create a scene configuration
    const sceneConfig: SceneConfig = {
      objects: models.map((model, index) => ({
        type: "external",
        modelUrl: model.downloadUrl,
        position: [index * 3 - (models.length * 3) / 2, 0, 0],
        rotation: [0, 0, 0],
        scale: 1,
      })),
      camera: {
        position: [0, 5, 10],
        target: [0, 0, 0],
        motion: "orbit",
        speed: 0.3,
      },
      lighting: {
        type: "ambient",
        intensity: 0.5,
        color: "#ffffff",
      },
      environment: {
        type: "sky",
        color: "#1a1a2e",
        fog: false,
      },
    }

    // If no models found, add a fallback cube
    if (models.length === 0) {
      sceneConfig.objects = [
        {
          type: "external",
          modelUrl: "/fallback-cube.glb", // Use our actual fallback GLB model
          position: [0, 0, 0],
          rotation: [0, 0, 0],
          scale: 1,
        },
      ]
    }

    return NextResponse.json(sceneConfig)
  } catch (error) {
    console.error("Error generating scene:", error)
    return NextResponse.json({ error: "Failed to generate scene" }, { status: 500 })
  }
}
