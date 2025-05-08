import { NextResponse } from "next/server"
import { getModelDetails } from "@/lib/sketchfab-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "UID parameter is required" }, { status: 400 })
    }

    const model = await getModelDetails(uid)

    if (!model) {
      return NextResponse.json({ error: "Model not found" }, { status: 404 })
    }

    return NextResponse.json({ model })
  } catch (error) {
    console.error("Error in model API route:", error)
    return NextResponse.json(
      { error: "Failed to get model details", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
