import { NextResponse } from "next/server"
import { searchSketchfabModels } from "@/lib/sketchfab-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Please provide a search query" }, { status: 400 })
    }

    const models = await searchSketchfabModels(query)

    return NextResponse.json({ models })
  } catch (error) {
    console.error("Error searching models:", error)
    return NextResponse.json({ error: "Failed to search models" }, { status: 500 })
  }
}
