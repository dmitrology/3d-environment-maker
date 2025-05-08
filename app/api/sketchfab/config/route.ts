import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasToken: !!process.env.SKETCHFAB_API_TOKEN,
    message: process.env.SKETCHFAB_API_TOKEN
      ? "Sketchfab API token is configured"
      : "Sketchfab API token is not configured. Please add SKETCHFAB_API_TOKEN to your environment variables.",
  })
}
