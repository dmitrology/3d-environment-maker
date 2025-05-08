"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export function ApiStatus() {
  const [status, setStatus] = useState<{
    sketchfab: boolean
    openai: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkStatus() {
      try {
        const [sketchfabResponse, testResponse] = await Promise.all([
          fetch("/api/sketchfab/config"),
          fetch("/api/test-generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ input: "test", inputType: "vibe" }),
          }),
        ])

        const sketchfabData = await sketchfabResponse.json()
        const testData = await testResponse.json()

        // Parse environment variables status from test response
        const envStatus = testData.result
          ? Object.fromEntries(
              testData.result
                .split("\n")
                .filter((line: string) => line.includes(":"))
                .map((line: string) => {
                  const [key, value] = line.split(":")
                  return [key.trim().toLowerCase(), value.trim() === "✅"]
                }),
            )
          : {}

        setStatus({
          sketchfab: sketchfabData.hasToken,
          openai: envStatus.openai_api_key || false,
        })
      } catch (error) {
        console.error("Error checking API status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle>API Status</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-4">
            <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
          </div>
        ) : status ? (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>Sketchfab API</span>
              <Badge variant={status.sketchfab ? "default" : "destructive"}>
                {status.sketchfab ? "Available" : "Not Configured"}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span>OpenAI API</span>
              <Badge variant={status.openai ? "default" : "destructive"}>
                {status.openai ? "Available" : "Not Configured"}
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-400">Failed to check API status</div>
        )}
      </CardContent>
    </Card>
  )
}
