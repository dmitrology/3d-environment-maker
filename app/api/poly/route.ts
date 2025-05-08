import { type NextRequest, NextResponse } from "next/server"
import modelCache from "@/lib/model-cache"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")
  const limit = Number.parseInt(searchParams.get("limit") || "5", 10)
  const category = searchParams.get("category")
  const animated = searchParams.get("animated")

  if (!query) {
    return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
  }

  // Create a cache key based on all parameters
  const cacheKey = `${query}-${limit}-${category || "none"}-${animated || "false"}`

  // Check if we have this query cached
  const cachedResult = modelCache.get(cacheKey)
  if (cachedResult) {
    console.log(`Using cached result for: ${cacheKey}`)
    return NextResponse.json(cachedResult)
  }

  try {
    // Build the Poly Pizza API URL with parameters
    let apiUrl = `https://api.poly.pizza/v1.1/search/${encodeURIComponent(query)}?Limit=${limit}`

    // Add optional parameters if provided
    if (category) {
      const categoryMap: Record<string, number> = {
        food: 0,
        clutter: 1,
        weapons: 2,
        transport: 3,
        furniture: 4,
        objects: 5,
        nature: 6,
        animals: 7,
        buildings: 8,
        characters: 9,
        scenes: 10,
        other: 11,
      }

      const categoryId = categoryMap[category.toLowerCase()]
      if (categoryId !== undefined) {
        apiUrl += `&Category=${categoryId}`
      }
    }

    if (animated === "true") {
      apiUrl += "&Animated=1"
    }

    console.log(`Fetching from Poly Pizza: ${apiUrl}`)

    const response = await fetch(apiUrl, {
      headers: {
        "x-auth-token": process.env.POLY_PIZZA_API_KEY || "",
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Poly Pizza API responded with status: ${response.status}`)
    }

    const data = await response.json()

    // Check if we have results
    if (!data.results || data.results.length === 0) {
      return NextResponse.json(
        {
          error: "No models found for that query",
          searchQuery: query,
        },
        { status: 404 },
      )
    }

    // Prepare the response data
    const responseData = {
      models: data.results.map((model: any) => ({
        id: model.ID,
        title: model.Title,
        thumbnail: model.Thumbnail,
        downloadUrl: model.Download,
        attribution: model.Attribution,
        creator: model.Creator?.Username || "Unknown",
        triCount: model["Tri Count"] || 0,
        category: model.Category || "Unknown",
        tags: model.Tags || [],
        animated: model.Animated || false,
      })),
      total: data.total || data.results.length,
      searchQuery: query,
    }

    // Cache the result
    modelCache.set(cacheKey, responseData)

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("Error fetching from Poly Pizza:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch models from Poly Pizza",
        searchQuery: query,
      },
      { status: 500 },
    )
  }
}
