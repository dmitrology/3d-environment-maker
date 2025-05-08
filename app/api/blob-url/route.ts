import { NextResponse } from "next/server"
import { getBlobModelURL } from "@/lib/blob-storage"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const fileName = searchParams.get("fileName")

    if (!fileName) {
      return NextResponse.json({ error: "fileName is required" }, { status: 400 })
    }

    const url = await getBlobModelURL(fileName)

    return NextResponse.json({ url })
  } catch (error) {
    console.error("Error in blob-url route:", error)
    return NextResponse.json({ error: "Failed to get blob URL" }, { status: 500 })
  }
}
