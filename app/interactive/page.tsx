"use client"

import type React from "react"

import { useState } from "react"
import dynamic from "next/dynamic"
import ClientOnly from "@/components/ClientOnly"

// Import the Scene component with SSR disabled
const Scene = dynamic(() => import("@/components/Scene"), { ssr: false })

export default function InteractivePage() {
  const [prompt, setPrompt] = useState("")
  const [activePrompt, setActivePrompt] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setActivePrompt(prompt)
  }

  return (
    <main className="min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Interactive 3D Scene Generator</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt (e.g., cute cat, spaceship)"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md"
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
            Generate
          </button>
        </div>
      </form>

      <ClientOnly>
        <Scene prompt={activePrompt || "cute animated cat"} />
      </ClientOnly>

      <div className="mt-4 text-sm text-gray-600">
        <p>Powered by Poly Pizza & React Three Fiber</p>
      </div>
    </main>
  )
}
