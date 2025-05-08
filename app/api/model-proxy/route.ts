import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const url = searchParams.get("url")

  if (!url || typeof url !== "string" || !url.startsWith("https://static.poly.pizza/")) {
    return NextResponse.json({ error: "Invalid model URL" }, { status: 400 })
  }

  try {
    const response = await fetch(url)

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch model from source" }, { status: response.status })
    }

    const buffer = await response.arrayBuffer()

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "model/gltf-binary",
        "Cache-Control": "s-maxage=86400, stale-while-revalidate",
      },
    })
  } catch (err) {
    console.error("Proxy fetch failed:", err)
    return NextResponse.json({ error: "Proxy server error" }, { status: 500 })
  }
}
