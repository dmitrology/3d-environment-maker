import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  try {
    // Fetch from Poly Pizza API
    const response = await fetch(`https://api.poly.pizza/v1.1/search/${encodeURIComponent(query)}?Limit=5`, {
      headers: {
        "x-auth-token": process.env.POLY_PIZZA_API_KEY || "",
      },
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch from Poly Pizza API" }, { status: response.status })
    }

    const data = await response.json()

    if (!data.results || data.results.length === 0) {
      return NextResponse.json({ error: "No models found for that query" }, { status: 404 })
    }

    // Get the first model's download URL
    const modelUrl = data.results[0].Download

    return NextResponse.json({ url: modelUrl })
  } catch (error) {
    console.error("Error fetching model:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
