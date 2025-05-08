import { NextResponse } from "next/server"

const POLY_PIZZA_API_KEY = process.env.SKETCHFAB_API_TOKEN || ""

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const keyword = searchParams.get("q")
    const limit = searchParams.get("limit") || "5"

    if (!keyword) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    console.log(`Searching Poly Pizza for: ${keyword} with limit: ${limit}`)

    const response = await fetch(`https://api.poly.pizza/v1.1/search/${encodeURIComponent(keyword)}?Limit=${limit}`, {
      headers: {
        "x-auth-token": POLY_PIZZA_API_KEY,
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      console.error(`Poly Pizza API error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Failed to fetch from Poly Pizza API: ${response.statusText}` },
        { status: response.status },
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in Poly Pizza search API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
