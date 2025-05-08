import { NextResponse } from "next/server"
import { getModelDownloadUrl } from "@/lib/sketchfab-service"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const uid = searchParams.get("uid")

    if (!uid) {
      return NextResponse.json({ error: "UID parameter is required" }, { status: 400 })
    }

    const downloadUrl = await getModelDownloadUrl(uid)

    if (!downloadUrl) {
      return NextResponse.json({ error: "Failed to get download URL" }, { status: 404 })
    }

    return NextResponse.json({ downloadUrl })
  } catch (error) {
    console.error("Error in download API route:", error)
    return NextResponse.json(
      { error: "Failed to get download URL", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
