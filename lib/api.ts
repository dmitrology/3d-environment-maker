import type { CreativeBrief } from "./types"

export async function generateBrief(prompt: string): Promise<CreativeBrief> {
  try {
    const response = await fetch("/api/generate-brief", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    if (!response.ok) {
      throw new Error("Failed to generate brief")
    }

    const data = await response.json()
    return data.brief
  } catch (error) {
    console.error("Error generating brief:", error)
    throw error
  }
}

export async function renderFinal(elements: any): Promise<string> {
  try {
    const response = await fetch("/api/render-final", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ elements }),
    })

    if (!response.ok) {
      throw new Error("Failed to render final video")
    }

    const data = await response.json()
    return data.videoUrl
  } catch (error) {
    console.error("Error rendering final video:", error)
    throw error
  }
}
