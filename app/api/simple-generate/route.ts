import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

const SYSTEM_PROMPT = `You are an expert visual art director specializing in creating looping Instagram-ready videos inspired by 3D video games, anime, and surrealist visual art.

Based on the user's input, generate a structured creative brief with the following fields:

1. title: A catchy, evocative title for the scene (15-30 characters)
2. scene_description: A detailed description of the scene (1-2 sentences, 30-60 words)
3. camera_motion: Specific camera movement instructions (e.g., "slow dolly forward", "gentle orbit")
4. background_prompt: Detailed prompt for generating the background environment (30-50 words)
5. character_prompt: Detailed prompt for generating the main character or subject (30-50 words)
6. motion_fx_prompt: Detailed prompt for generating motion effects or overlays (20-40 words)
7. filter_type: Specific visual filter to apply (e.g., "cyberpunk neon bloom", "analog film grain")
8. audio_style: Detailed description of audio to accompany the scene (20-40 words)
9. style_tags: Array of 5-7 specific style descriptors (e.g., "vaporwave", "brutalist", "ethereal")
10. caption: Instagram-ready caption with emojis and 3-5 hashtags (100-150 characters)

Your tone should be creative, slightly experimental, but highly efficient.

IMPORTANT: Return ONLY valid JSON with these exact field names. Do not include any explanatory text outside the JSON.`

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Use OpenAI for brief generation
    try {
      const { text } = await generateText({
        model: openai("gpt-4o"),
        system: SYSTEM_PROMPT,
        prompt: `Create a detailed creative brief for this scene idea: ${prompt}`,
        temperature: 0.7,
        maxTokens: 1000,
      })

      // Parse the JSON response
      let result
      try {
        // Extract JSON if it's wrapped in markdown code blocks
        const jsonMatch = text.match(/```(?:json)?([\s\S]*?)```/) || text.match(/({[\s\S]*})/)
        const jsonString = jsonMatch ? jsonMatch[1] : text
        result = JSON.parse(jsonString.trim())
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError)
        console.log("Raw response:", text)

        // Return the raw text if we can't parse it as JSON
        result = {
          title: "Parsing Error",
          scene_description: "Could not parse the AI response as JSON. Here's the raw text:",
          raw_text: text,
        }
      }

      return NextResponse.json({ result })
    } catch (aiError) {
      console.error("Error generating with AI:", aiError)
      return NextResponse.json({ error: "AI generation failed" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in simple-generate route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
