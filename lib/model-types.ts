// Define model categories
export type ModelCategory = "backgrounds" | "characters" | "props" | "effects"

// Interface for model metadata
export interface ModelMetadata {
  id: string
  name: string
  category: ModelCategory
  tags: string[]
  url: string
  thumbnailUrl?: string
  author?: string
  sourceUrl?: string
  createdAt: Date
}
