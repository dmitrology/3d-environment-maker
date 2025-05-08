import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { input, inputType } = await request.json()

    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 })
    }

    // Check if environment variables are available
    const envStatus = {
      KV_URL: !!process.env.KV_URL,
      KV_REST_API_URL: !!process.env.KV_REST_API_URL,
      REDIS_URL: !!process.env.REDIS_URL,
      BLOB_READ_WRITE_TOKEN: !!process.env.BLOB_READ_WRITE_TOKEN,
      OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
      HUGGINGFACE_API_KEY: !!process.env.HUGGINGFACE_API_KEY,
    }

    return NextResponse.json({
      success: true,
      result: `Test generation successful!\n\nInput type: ${inputType}\nInput: "${input}"\n\nEnvironment variables status:\n${Object.entries(
        envStatus,
      )
        .map(([key, value]) => `${key}: ${value ? "✅" : "❌"}`)
        .join("\n")}`,
    })
  } catch (error) {
    console.error("Error in test-generate route:", error)
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
