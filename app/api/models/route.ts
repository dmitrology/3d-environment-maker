import { NextResponse } from "next/server"

// Mock data for testing
const mockModels = [
  {
    id: "model1",
    name: "Test Model 1",
    category: "props",
    tags: ["test", "cube", "simple"],
    url: "/placeholder.svg?key=95rqy",
    thumbnailUrl: "/placeholder.svg?key=rgufw",
    createdAt: new Date().toISOString(),
  },
  {
    id: "model2",
    name: "Test Model 2",
    category: "characters",
    tags: ["test", "character", "humanoid"],
    url: "/placeholder.svg?key=x8b07",
    thumbnailUrl: "/placeholder.svg?key=9me3b",
    createdAt: new Date().toISOString(),
  },
]

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const id = searchParams.get("id")

    // If ID is provided, return a specific model
    if (id) {
      const model = mockModels.find((m) => m.id === id)
      if (!model) {
        return NextResponse.json({ error: "Model not found" }, { status: 404 })
      }
      return NextResponse.json({ model })
    }

    // If category is provided, filter models by category
    if (category) {
      const filteredModels = mockModels.filter((m) => m.category === category)
      return NextResponse.json({ models: filteredModels })
    }

    // Otherwise, return all models
    return NextResponse.json({ models: mockModels })
  } catch (error) {
    console.error("Error in models API route:", error)
    return NextResponse.json({ error: "Failed to fetch models" }, { status: 500 })
  }
}
