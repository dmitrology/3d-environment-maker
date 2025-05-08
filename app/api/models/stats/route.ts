import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Mock stats for testing
    const stats = {
      totalModels: 10,
      categoryCounts: {
        backgrounds: 2,
        characters: 3,
        props: 4,
        effects: 1,
      },
      cacheAge: 3600000, // 1 hour in milliseconds
    }

    return NextResponse.json({ stats })
  } catch (error) {
    console.error("Error getting model stats:", error)
    return NextResponse.json({ error: "Failed to get model stats" }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    // Mock successful cache clear
    return NextResponse.json({ success: true, message: "Model cache cleared successfully" })
  } catch (error) {
    console.error("Error clearing model cache:", error)
    return NextResponse.json({ error: "Failed to clear model cache" }, { status: 500 })
  }
}
