"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Play, Pause, RefreshCw, Download, Share2, AlertTriangle, Bug } from "lucide-react"
import type { CreativeBrief, SceneElements } from "@/lib/types"
import { ExportDialog } from "@/components/export-dialog"

interface CanvasPreviewProps {
  elements: SceneElements
  brief: CreativeBrief | null
}

export function CanvasPreview({ elements, brief }: CanvasPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLooping, setIsLooping] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [aspectRatio, setAspectRatio] = useState<"portrait" | "landscape">("portrait")
  const [error, setError] = useState<string | null>(null)
  const [hasScanlinesFilter, setHasScanlinesFilter] = useState(false)
  const [debugMode, setDebugMode] = useState(false)
  const [exportDialogOpen, setExportDialogOpen] = useState(false)

  // Check if filter is scanlines
  useEffect(() => {
    if (elements.filter?.metadata?.filterType === "scanlines") {
      setHasScanlinesFilter(true)
    } else {
      setHasScanlinesFilter(false)
    }
  }, [elements.filter])

  // Toggle aspect ratio between portrait (9:16) and landscape (16:9)
  const toggleAspectRatio = () => {
    setAspectRatio((prev) => (prev === "portrait" ? "landscape" : "portrait"))
  }

  // Function to get display URL for an element
  const getElementUrl = (element: { type: string; value: string; metadata?: any } | null, defaultQuery: string) => {
    if (!element) return `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(defaultQuery)}`

    if (element.type === "prompt") {
      return `/placeholder.svg?height=600&width=800&query=${encodeURIComponent(element.value)}`
    }

    return element.value
  }

  // Function to determine if an element is a video
  const isVideo = (element: { type: string; value: string; metadata?: any } | null) => {
    if (!element) return false
    if (element.metadata?.type === "video") return true
    return element.value?.endsWith(".mp4") || element.value?.endsWith(".webm")
  }

  // Function to get CSS filter string
  const getFilterStyle = () => {
    if (!elements.filter?.metadata?.filter) return {}

    return {
      filter: elements.filter.metadata.filter,
    }
  }

  // Handle errors in media loading
  const handleMediaError = (elementType: string) => {
    setError(`Failed to load ${elementType}. Please try regenerating or using a different prompt.`)
  }

  // Function to render an element with proper error handling
  const renderElement = (
    element: { type: string; value: string; metadata?: any } | null,
    type: string,
    defaultQuery: string,
  ) => {
    if (!element) {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-4">
            <p className="text-gray-400 mb-2">No {type} generated yet</p>
            <p className="text-xs text-gray-500">Generate or upload a {type}</p>
          </div>
        </div>
      )
    }

    if (element.type === "prompt") {
      return (
        <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
          <div className="text-center p-4">
            <p className="text-gray-400 mb-2">Prompt ready for generation:</p>
            <p className="text-xs text-gray-300 bg-gray-800 p-2 rounded max-w-md">{element.value}</p>
          </div>
        </div>
      )
    }

    if (isVideo(element)) {
      return (
        <div className="relative w-full h-full">
          <video
            src={element.value}
            autoPlay={isPlaying}
            loop={isLooping}
            muted
            playsInline
            className="w-full h-full object-cover"
            onError={() => handleMediaError(`${type} video`)}
          />
          {debugMode && (
            <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-1 rounded">{type}: video</div>
          )}
        </div>
      )
    }

    // Check if this is a base64 image
    const isBase64 = element.value?.startsWith("data:image/")

    return (
      <div className="relative w-full h-full">
        <img
          src={element.value || "/placeholder.svg"}
          alt={`Generated ${type}`}
          className="w-full h-full object-cover"
          onError={() => handleMediaError(`${type} image`)}
        />

        {debugMode && (
          <div className="absolute top-2 left-2 bg-black/70 text-white text-xs p-1 rounded">
            {type}: {isBase64 ? "base64" : element.type}
          </div>
        )}

        {element.metadata?.isFallback && (
          <div className="absolute bottom-2 right-2 bg-red-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {element.metadata?.isClientFallback ? "Client Fallback" : "Fallback"}
          </div>
        )}

        {element.metadata?.isCached && (
          <div className="absolute bottom-2 right-2 bg-green-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Cached
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center bg-gray-950 p-6">
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-900/80 text-white p-3 rounded-md z-50">
            {error}
            <button className="ml-2 underline" onClick={() => setError(null)}>
              Dismiss
            </button>
          </div>
        )}

        <div
          ref={containerRef}
          className={`relative rounded-lg overflow-hidden ${
            aspectRatio === "portrait" ? "w-full max-w-md aspect-[9/16]" : "w-full max-w-2xl aspect-[16/9]"
          } ${hasScanlinesFilter ? "scanlines" : ""}`}
        >
          {/* Background Layer */}
          <div className="absolute inset-0">
            {renderElement(elements.background, "background", brief?.background_prompt || "Abstract background")}
          </div>

          {/* Character Layer */}
          {elements.character && (
            <div className="absolute inset-0 flex items-center justify-center">
              {renderElement(elements.character, "character", brief?.character_prompt || "Character")}
            </div>
          )}

          {/* Motion Effects Layer */}
          {elements.motionFx && (
            <div className="absolute inset-0 pointer-events-none mix-blend-screen">
              {renderElement(elements.motionFx, "motion effects", brief?.motion_fx_prompt || "Motion effects")}
            </div>
          )}

          {/* Filter Layer - Applied as CSS filter to the entire container */}
          <div className="absolute inset-0 pointer-events-none" style={getFilterStyle()}></div>

          {/* Audio Element (not visible) */}
          {elements.audio && elements.audio.type === "generated" && (
            <audio
              src={elements.audio.value}
              loop={isLooping}
              autoPlay={isPlaying}
              className="hidden"
              onError={() => handleMediaError("audio")}
            />
          )}

          {/* Camera Motion Indicator */}
          {brief && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              Camera: {brief.camera_motion}
            </div>
          )}

          {/* Debug overlay */}
          {debugMode && (
            <div className="absolute top-4 right-4 bg-black/70 text-white text-xs p-2 rounded max-w-xs">
              <h4 className="font-bold mb-1">Debug Info:</h4>
              <ul className="space-y-1">
                <li>Background: {elements.background ? elements.background.type : "none"}</li>
                <li>Character: {elements.character ? elements.character.type : "none"}</li>
                <li>Motion FX: {elements.motionFx ? elements.motionFx.type : "none"}</li>
                <li>Filter: {elements.filter ? elements.filter.type : "none"}</li>
                <li>Audio: {elements.audio ? elements.audio.type : "none"}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button variant={isLooping ? "default" : "outline"} size="sm" onClick={() => setIsLooping(!isLooping)}>
                <RefreshCw className="h-4 w-4 mr-1" />
                Loop
              </Button>
              <Button variant="outline" size="sm" onClick={toggleAspectRatio}>
                {aspectRatio === "portrait" ? "9:16" : "16:9"}
              </Button>
              <Button variant={debugMode ? "default" : "outline"} size="sm" onClick={() => setDebugMode(!debugMode)}>
                <Bug className="h-4 w-4 mr-1" />
                Debug
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!brief} onClick={() => setExportDialogOpen(true)}>
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
              <Button variant="outline" size="sm" disabled={!brief}>
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>

          {brief && (
            <div className="mt-4 flex flex-wrap gap-2">
              {brief.style_tags.map((tag, index) => (
                <span key={index} className="bg-gray-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {brief && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-1">Caption</h3>
              <p className="text-gray-400 text-sm">{brief.caption}</p>
            </div>
          )}
        </div>
      </div>

      {/* Export Dialog */}
      <ExportDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} elements={elements} brief={brief} />
    </div>
  )
}
