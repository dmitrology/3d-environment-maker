import { type NextRequest, NextResponse } from "next/server"
import { generateBrief } from "@/lib/generate-brief"

export async function POST(request: NextRequest) {
  try {
    const { input, inputType } = await request.json()

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 })
    }

    const brief = await generateBrief(input, inputType || "vibe")

    return NextResponse.json({ brief })
  } catch (error) {
    console.error("Error in generate route:", error)
    return NextResponse.json({ error: "Failed to generate brief" }, { status: 500 })
  }
}
