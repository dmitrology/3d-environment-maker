import { groq } from "@ai-sdk/groq"

// Initialize the Groq client with the API key from environment variables
export const getGroqModel = (task: "brief" | "scene" | "caption" = "brief") => {
  // For more creative tasks like brief generation, use Llama 3
  if (task === "brief" || task === "caption") {
    return groq("llama-3-70b-8192")
  }

  // For more structured tasks like scene generation, use Mixtral
  return groq("mixtral-8x7b-32768")
}
