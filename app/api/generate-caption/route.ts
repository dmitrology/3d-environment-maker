import { NextResponse } from "next/server"
import { generateText } from "ai"
import { getGroqModel } from "@/lib/groq-client"

export async function POST(request: Request) {
  try {
    const { elements, brief } = await request.json()

    if (!elements || !brief) {
      return NextResponse.json({ error: "Elements and brief are required" }, { status: 400 })
    }

    // Use Groq to generate a creative caption
    const { text } = await generateText({
      model: getGroqModel("caption"),
      prompt: `Create an engaging, creative Instagram caption for a 3D scene with the following elements:
               
               Title: ${brief.title}
               Scene Description: ${brief.scene_description}
               Style Tags: ${brief.style_tags.join(", ")}
               
               The caption should be 2-3 sentences long, include 3-5 relevant hashtags, and 2-3 appropriate emojis.
               Make it sound artistic, slightly mysterious, and engaging.
               
               Return only the caption text, no explanations.`,
      temperature: 0.8,
      maxTokens: 200,
    })

    return NextResponse.json({
      caption: text.trim(),
      success: true,
    })
  } catch (error) {
    console.error("Error generating caption:", error)
    return NextResponse.json({
      error: "Failed to generate caption",
      caption:
        "✨ Digital dreamscape in motion. A glimpse into the virtual unknown. #generativeart #3dart #digitalcreation",
      success: false,
    })
  }
}
