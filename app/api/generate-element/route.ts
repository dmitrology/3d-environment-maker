import { NextResponse } from "next/server"
import { generateText } from "ai"
import { getGroqModel } from "@/lib/groq-client"

// Fallback images for different types
const FALLBACK_IMAGES = {
  background: "/abstract-geometric-shapes.png",
  character: "/diverse-group-characters.png",
  motionFx: "/abstract-geometric.png",
  filter: "/abstract-geometric-sculpture.png",
  audio: "/static/ambient-synth.mp3",
}

export async function POST(request: Request) {
  try {
    const { type, prompt } = await request.json()

    if (!type || !prompt) {
      return NextResponse.json({ error: "Type and prompt are required" }, { status: 400 })
    }

    console.log(`Generating ${type} with prompt: "${prompt}"`)

    // For now, we'll use Groq to enhance the prompt, but still return fallback images
    // In a real implementation, we would use the enhanced prompt with image generation APIs
    try {
      const { text } = await generateText({
        model: getGroqModel("scene"),
        prompt: `Enhance this ${type} prompt for a 3D scene: "${prompt}". 
                 Make it more detailed and visually descriptive. 
                 Focus on colors, textures, lighting, and mood.
                 Return only the enhanced prompt, no explanations.`,
        temperature: 0.7,
        maxTokens: 200,
      })

      const enhancedPrompt = text.trim()
      console.log(`Enhanced prompt: "${enhancedPrompt}"`)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return NextResponse.json({
        type,
        url:
          FALLBACK_IMAGES[type as keyof typeof FALLBACK_IMAGES] ||
          `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(enhancedPrompt)}`,
        prompt: enhancedPrompt,
        originalPrompt: prompt,
        isFallback: true,
        status: "enhanced",
      })
    } catch (error) {
      console.error("Error enhancing prompt with Groq:", error)

      // Fall back to the original prompt and image
      return NextResponse.json({
        type,
        url:
          FALLBACK_IMAGES[type as keyof typeof FALLBACK_IMAGES] ||
          `/placeholder.svg?height=512&width=512&query=${encodeURIComponent(prompt)}`,
        prompt,
        isFallback: true,
        status: "fallback",
      })
    }
  } catch (error) {
    console.error("Error in generate-element route:", error)
    return NextResponse.json(
      {
        error: "Failed to generate element",
        details: error instanceof Error ? error.message : String(error),
        url: "/system-error-screen.png",
        isFallback: true,
        status: "error",
      },
      { status: 200 }, // Return 200 with fallback to keep UI working
    )
  }
}
