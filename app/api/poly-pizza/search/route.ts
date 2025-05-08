import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const limit = searchParams.get("limit") || "5"

    if (!query) {
      return NextResponse.json({ error: "Missing query parameter" }, { status: 400 })
    }

    // For now, we'll use a mock response to avoid API key requirements
    // In a real implementation, you would call the Poly Pizza API with your API key

    console.log(`Searching Poly Pizza for: ${query} (limit: ${limit})`)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data based on common queries
    const mockData = getMockDataForQuery(query)

    return NextResponse.json(mockData)
  } catch (error) {
    console.error("Error in Poly Pizza search API:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 })
  }
}

// Mock data function to simulate different responses based on query
function getMockDataForQuery(query: string) {
  const lowerQuery = query.toLowerCase()

  // Common 3D model URLs that are publicly available
  const modelUrls = {
    tree: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/tree-spruce/model.gltf",
    car: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/low-poly-car/model.gltf",
    house: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/simple-house/model.gltf",
    dog: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dog/model.gltf",
    cat: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/cat-lowpoly/model.gltf",
    robot: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/robot-playground/model.gltf",
    sword: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/sword-1/model.gltf",
    chair: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/chair-wooden/model.gltf",
    table: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/table-medium/model.gltf",
    plant: "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/potted-plant-1/model.gltf",
  }

  // Find the best match
  const matchedKey = Object.keys(modelUrls).find((key) => lowerQuery.includes(key)) || "tree"
  const modelUrl = modelUrls[matchedKey as keyof typeof modelUrls]

  return {
    total: 1,
    results: [
      {
        ID: `mock-${matchedKey}`,
        Title: `${matchedKey.charAt(0).toUpperCase() + matchedKey.slice(1)}`,
        Attribution: `Mock ${matchedKey} model for demonstration`,
        Thumbnail: `https://via.placeholder.com/200x200?text=${matchedKey}`,
        Download: modelUrl,
        "Tri Count": 1000,
        Creator: {
          Username: "MockCreator",
          DPURL: "https://via.placeholder.com/50x50",
        },
        Category: "Objects",
        Tags: [matchedKey],
        Licence: "CC0",
        Animated: false,
      },
    ],
  }
}
