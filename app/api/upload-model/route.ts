import { NextResponse } from "next/server"
import { uploadModelToBlob, type ModelCategory } from "@/lib/blob-storage"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const category = formData.get("category") as ModelCategory
    const name = formData.get("name") as string
    const tagsJson = formData.get("tags") as string
    const prompt = formData.get("prompt") as string | undefined

    if (!file || !category || !name) {
      return NextResponse.json({ error: "File, category, and name are required" }, { status: 400 })
    }

    const tags = tagsJson ? JSON.parse(tagsJson) : []

    const model = await uploadModelToBlob(file, category, name, tags, prompt)

    return NextResponse.json({ success: true, model })
  } catch (error) {
    console.error("Error in upload-model route:", error)
    return NextResponse.json(
      {
        error: "Failed to upload model",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
