import { NextResponse } from "next/server"

const POLY_PIZZA_API_KEY = process.env.SKETCHFAB_API_TOKEN || ""

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: 'Query parameter "id" is required' }, { status: 400 })
    }

    console.log(`Fetching Poly Pizza model with ID: ${id}`)

    const response = await fetch(`https://api.poly.pizza/v1.1/model/${id}`, {
      headers: {
        "x-auth-token": POLY_PIZZA_API_KEY,
      },
      next: { revalidate: 86400 }, // Cache for 24 hours
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
    console.error("Error in Poly Pizza model API route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
