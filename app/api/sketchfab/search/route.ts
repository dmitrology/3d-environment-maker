import { NextResponse } from "next/server"
import { searchSketchfabModels } from "@/lib/sketchfab-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    // Parse options
    const options = {
      downloadable: searchParams.get("downloadable") === "true",
      animated: searchParams.get("animated") === "true",
      staffpicked: searchParams.get("staffpicked") === "true",
      count: searchParams.has("count") ? Number.parseInt(searchParams.get("count") as string, 10) : undefined,
      categories: searchParams.has("categories") ? (searchParams.get("categories") as string).split(",") : undefined,
    }

    const models = await searchSketchfabModels(query, options)

    return NextResponse.json({ models })
  } catch (error) {
    console.error("Error in search API route:", error)
    return NextResponse.json(
      { error: "Failed to search models", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
