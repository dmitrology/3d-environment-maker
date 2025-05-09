/**
 * Extracts the most relevant keywords from a prompt for better 3D model search
 */
export function extractKeywords(prompt: string): {
  keywords: string
  category?: string
  animated?: boolean
} {
  if (!prompt || prompt.trim() === "") return { keywords: "" }

  // Common words to filter out
  const stopWords = new Set([
    "a",
    "an",
    "the",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "with",
    "by",
    "about",
    "like",
    "as",
    "of",
    "from",
    "that",
    "this",
    "these",
    "those",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "shall",
    "should",
    "may",
    "might",
    "must",
    "can",
    "could",
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "me",
    "him",
    "her",
    "us",
    "them",
    "my",
    "your",
    "his",
    "its",
    "our",
    "their",
  ])

  // Category detection keywords
  const categoryKeywords: Record<string, string[]> = {
    food: ["food", "fruit", "vegetable", "meal", "drink", "beverage", "dish", "cuisine"],
    weapons: ["weapon", "sword", "gun", "rifle", "knife", "blade", "axe", "bow", "arrow"],
    transport: ["car", "vehicle", "truck", "bus", "train", "plane", "boat", "ship", "bicycle"],
    furniture: ["furniture", "chair", "table", "desk", "sofa", "bed", "cabinet", "shelf"],
    nature: ["tree", "plant", "flower", "rock", "mountain", "river", "lake", "ocean", "forest"],
    animals: ["animal", "dog", "cat", "bird", "fish", "horse", "cow", "lion", "tiger", "bear"],
    buildings: ["building", "house", "skyscraper", "tower", "castle", "temple", "church", "office"],
    characters: ["character", "person", "human", "man", "woman", "boy", "girl", "hero", "villain"],
    scenes: ["scene", "landscape", "environment", "world", "room", "interior", "exterior"],
  }

  // Animation detection keywords
  const animationKeywords = ["animated", "moving", "animation", "motion", "walking", "running", "flying"]

  // Split the prompt into words
  const words = prompt
    .toLowerCase()
    .replace(/[^\w\s]/g, "") // Remove punctuation
    .split(/\s+/) // Split by whitespace
    .filter((word) => word.length > 2 && !stopWords.has(word)) // Filter out stop words

  // Detect category
  let detectedCategory: string | undefined
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some((keyword) => words.includes(keyword) || prompt.toLowerCase().includes(keyword))) {
      detectedCategory = category
      break
    }
  }

  // Detect if animation is requested
  const isAnimated = animationKeywords.some(
    (keyword) => words.includes(keyword) || prompt.toLowerCase().includes(keyword),
  )

  // Extract the most important keywords
  // First, look for nouns that might represent 3D objects
  const importantWords = words.filter((word) => {
    // Check if the word is likely to be a noun representing a physical object
    return !word.endsWith("ing") && !word.endsWith("ly") && word.length > 3
  })

  // If we have important words, use them, otherwise use all filtered words
  const finalKeywords = importantWords.length > 0 ? importantWords.slice(0, 3).join(" ") : words.slice(0, 3).join(" ")

  return {
    keywords: finalKeywords,
    category: detectedCategory,
    animated: isAnimated,
  }
}
