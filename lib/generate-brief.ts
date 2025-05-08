import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import type { CreativeBrief } from "./types"

const SYSTEM_PROMPT = `You are the creative brain of a generative art system that produces looping Instagram-ready videos inspired by 3D video games, anime, and surrealist visual art.

Your goal is to help transform raw ideas, vibes, or inspirations into multi-layered audiovisual content. These outputs should feel like living visual poems: short, stylized, emotionally resonant, and technically rich.

Generate a structured creative brief with the following sections:
1. A catchy title for the concept
2. Core concept description (2-3 sentences)
3. Technical build path (list of tools and techniques)
4. Video prompt for text-to-video models (detailed paragraph)
5. Motion & loop design specifications (list of camera movements, animations)
6. Style tags (list of aesthetic elements)
7. Audio suggestions (list of sound elements)
8. Instagram optimization tips (list of format considerations)
9. Caption with hashtags

Your tone should be creative, slightly experimental, but highly efficient — like a mix of a technical artist, a motion designer, and an indie game developer.`

export async function generateBrief(input: string, inputType: string): Promise<CreativeBrief> {
  let prompt = ""

  switch (inputType) {
    case "vibe":
      prompt = `Create a creative brief based on these vibe words: ${input}`
      break
    case "scene":
      prompt = `Create a creative brief based on this scene description: ${input}`
      break
    case "reference":
      prompt = `Create a creative brief based on these references: ${input}`
      break
    default:
      prompt = `Create a creative brief based on this input: ${input}`
  }

  try {
    // Get the API key from environment variables
    const apiKey = process.env.OPENAI_API_KEY

    // Check if API key exists
    if (!apiKey) {
      console.error("OpenAI API key is missing in environment variables")
      throw new Error("API configuration error")
    }

    const { text } = await generateText({
      model: openai("gpt-4o", { apiKey }), // Explicitly pass the API key here
      system: SYSTEM_PROMPT,
      prompt,
    })

    // Parse the generated text into structured format
    return parseGeneratedBrief(text)
  } catch (error) {
    console.error("Error generating brief:", error)
    throw new Error("Failed to generate creative brief")
  }
}

function parseGeneratedBrief(text: string): CreativeBrief {
  // This is a simplified parser - in production you might want a more robust solution
  // or structure the AI output more explicitly

  const sections = text.split(/#{1,3} /)

  let title = "Untitled Creative Brief"
  let concept = ""
  let technicalPath: string[] = []
  let videoPrompt = ""
  let motionDesign: string[] = []
  let styleTags: string[] = []
  let audioSuggestions: string[] = []
  let instagramOptimization: string[] = []
  let caption = ""

  for (const section of sections) {
    if (!section.trim()) continue

    const lines = section.trim().split("\n")
    const heading = lines[0].trim().toLowerCase()
    const content = lines.slice(1).join("\n").trim()

    if (heading.includes("title") || sections.indexOf(section) === 1) {
      title = lines[0].trim()
    } else if (heading.includes("core concept") || heading.includes("concept")) {
      concept = content
    } else if (heading.includes("technical") || heading.includes("build path")) {
      technicalPath = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(1).trim())
    } else if (heading.includes("video prompt") || heading.includes("prompt")) {
      videoPrompt = content.replace(/```/g, "").trim()
    } else if (heading.includes("motion") || heading.includes("loop design")) {
      motionDesign = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(1).trim())
    } else if (heading.includes("style") || heading.includes("tags")) {
      styleTags = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(1).trim())
      if (styleTags.length === 0 && content.includes(",")) {
        styleTags = content.split(",").map((tag) => tag.trim())
      }
    } else if (heading.includes("audio")) {
      audioSuggestions = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(1).trim())
    } else if (heading.includes("instagram") || heading.includes("optimization")) {
      instagramOptimization = content
        .split("\n")
        .filter((line) => line.trim().startsWith("-"))
        .map((line) => line.trim().substring(1).trim())
    } else if (heading.includes("caption")) {
      caption = content.replace(/```/g, "").trim()
    }
  }

  // Ensure we have at least empty arrays for list items
  if (technicalPath.length === 0) technicalPath = ["Tool selection to be determined"]
  if (motionDesign.length === 0) motionDesign = ["Motion design to be specified"]
  if (styleTags.length === 0) styleTags = ["Style to be determined"]
  if (audioSuggestions.length === 0) audioSuggestions = ["Audio suggestions to be added"]
  if (instagramOptimization.length === 0) instagramOptimization = ["Instagram optimization to be specified"]

  // Convert to the expected format
  return {
    title,
    concept,
    technicalPath,
    videoPrompt,
    motionDesign,
    styleTags,
    audioSuggestions,
    instagramOptimization,
    caption,

    // Map to API response fields
    scene_description: concept,
    camera_motion: motionDesign[0] || "Static camera",
    background_prompt: videoPrompt,
    character_prompt: "Character to be determined",
    motion_fx_prompt: motionDesign.join(", "),
    filter_type: styleTags.join(", "),
    audio_style: audioSuggestions.join(", "),
    style_tags: styleTags,
  }
}
