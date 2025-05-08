import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const SYSTEM_PROMPT = `You are a creative director specializing in generating detailed creative briefs for 3D scenes and short videos. 
Your task is to create a comprehensive creative brief based on the user's input.

The brief should include:
- concept: The core idea or theme
- visual_style: The artistic direction and visual approach
- scene_description: A detailed description of what the scene contains
- color_palette: The main colors to be used
- mood: The emotional tone and feeling
- technical_elements: Specific technical aspects like lighting, camera movements, etc.
- references: Similar works or inspirations (if applicable)

Format the response as a JSON object with these fields. Make the brief detailed, creative, and visually descriptive.`

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    try {
      // Use the AI SDK to generate text
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: SYSTEM_PROMPT,
        prompt: prompt,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // Parse the JSON response
      let brief
      try {
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/) || text.match(/({[\s\S]*})/)
        const jsonString = jsonMatch ? jsonMatch[1] : text
        brief = JSON.parse(jsonString.trim())

        // Add a videoPrompt field if it doesn't exist
        if (!brief.videoPrompt) {
          brief.videoPrompt = brief.scene_description
        }

        return NextResponse.json({ brief })
      } catch (parseError) {
        console.error("Failed to parse JSON response:", parseError)
        console.log("Raw response:", text)

        // Fallback with a default brief
        brief = {
          concept: "Generated from your prompt",
          visual_style: "Modern digital art",
          scene_description: prompt,
          color_palette: "Vibrant colors",
          mood: "Atmospheric",
          technical_elements: "Standard lighting and camera",
          references: "Contemporary digital art",
          videoPrompt: prompt,
        }

        return NextResponse.json({ brief })
      }
    } catch (aiError) {
      console.error("Error generating text with AI SDK:", aiError)

      // Return a more specific error
      return NextResponse.json(
        {
          error: "Failed to generate brief with AI",
          details: aiError instanceof Error ? aiError.message : "Unknown error",
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in generate-brief API route:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
