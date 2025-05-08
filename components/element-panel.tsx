"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, Upload, X, Sparkles, AlertTriangle, Info, Zap } from "lucide-react"
import type { CreativeBrief, SceneElements } from "@/lib/types"
import { generateClientSideFallback } from "@/lib/client-fallback"
import { saveGeneratedImage, getGeneratedImage } from "@/lib/image-cache"

interface ElementPanelProps {
  elements: SceneElements
  onElementUpdate: (type: keyof SceneElements, value: { type: string; value: string; metadata?: any } | null) => void
  brief: CreativeBrief | null
  className?: string
}

export function ElementPanel({ elements, onElementUpdate, brief, className = "" }: ElementPanelProps) {
  const [activeTab, setActiveTab] = useState<keyof SceneElements>("background")
  const [isGenerating, setIsGenerating] = useState<Record<string, boolean>>({
    background: false,
    character: false,
    motionFx: false,
    filter: false,
    audio: false,
  })
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generationLogs, setGenerationLogs] = useState<Record<string, string[]>>({
    background: [],
    character: [],
    motionFx: [],
    filter: [],
    audio: [],
  })
  const [generationProgress, setGenerationProgress] = useState<Record<string, number>>({
    background: 0,
    character: 0,
    motionFx: 0,
    filter: 0,
    audio: 0,
  })
  const [isGeneratingAll, setIsGeneratingAll] = useState(false)
  const [generationQueue, setGenerationQueue] = useState<Array<keyof SceneElements>>([])

  const [generationDialog, setGenerationDialog] = useState<{
    open: boolean
    type: keyof SceneElements | null
    retryCount: number
  }>({ open: false, type: null, retryCount: 0 })

  const elementLabels: Record<keyof SceneElements, string> = {
    background: "Background",
    character: "Character",
    motionFx: "Motion Effects",
    filter: "Visual Filter",
    audio: "Audio",
  }

  const elementDescriptions: Record<keyof SceneElements, string> = {
    background: "The scene environment or setting",
    character: "Main subject or character in the scene",
    motionFx: "Special effects and motion overlays",
    filter: "Color grading and visual style",
    audio: "Background music and sound effects",
  }

  // Process the generation queue
  useEffect(() => {
    const processQueue = async () => {
      if (generationQueue.length > 0 && !isGenerating[generationQueue[0]]) {
        const nextType = generationQueue[0]
        setGenerationQueue((prev) => prev.slice(1))
        await handleGenerateElement(nextType)
      }
    }

    processQueue()
  }, [generationQueue, isGenerating])

  // Update overall generation status
  useEffect(() => {
    const anyGenerating = Object.values(isGenerating).some((value) => value)
    setIsGeneratingAll(anyGenerating || generationQueue.length > 0)
  }, [isGenerating, generationQueue])

  const handleFileUpload = (type: keyof SceneElements, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload this file to a storage service
    // For now, we'll just use a local URL
    const url = URL.createObjectURL(file)
    onElementUpdate(type, { type: "file", value: url })
  }

  const handleGenerateAll = async () => {
    if (!brief) return

    // Reset all errors and progress
    setGenerationError(null)
    Object.keys(elements).forEach((type) => {
      setGenerationLogs((prev) => ({ ...prev, [type]: [] }))
      setGenerationProgress((prev) => ({ ...prev, [type]: 0 }))
    })

    // Add all elements to the generation queue
    const types: Array<keyof SceneElements> = ["background", "character", "motionFx", "filter", "audio"]
    setGenerationQueue(types)
  }

  const handleGenerateElement = async (type: keyof SceneElements) => {
    if (!brief) return

    // Reset error state and logs
    setGenerationError(null)
    setGenerationLogs((prev) => ({ ...prev, [type]: [] }))
    setGenerationProgress((prev) => ({ ...prev, [type]: 0 }))

    // Get the appropriate prompt based on element type
    let prompt = ""
    switch (type) {
      case "background":
        prompt = brief.background_prompt
        break
      case "character":
        prompt = brief.character_prompt
        break
      case "motionFx":
        prompt = brief.motion_fx_prompt
        break
      case "filter":
        prompt = brief.filter_type
        break
      case "audio":
        prompt = brief.audio_style
        break
    }

    // Check cache first
    const cacheKey = `${type}-${prompt}`
    const cachedImage = await getGeneratedImage(cacheKey)

    if (cachedImage) {
      addToGenerationLog(type, `Found cached image for ${type}`)
      setGenerationProgress((prev) => ({ ...prev, [type]: 100 }))

      onElementUpdate(type, {
        type: "generated",
        value: cachedImage,
        metadata: {
          prompt,
          type,
          isBase64: cachedImage.startsWith("data:"),
          isCached: true,
        },
      })

      return
    }

    // Add to generation logs
    addToGenerationLog(type, `Starting generation for ${type} with prompt: "${prompt}"`)
    setGenerationProgress((prev) => ({ ...prev, [type]: 10 }))

    // Open the generation dialog if not generating all
    if (generationQueue.length === 0) {
      setGenerationDialog({ open: true, type, retryCount: 0 })
    }

    setIsGenerating((prev) => ({ ...prev, [type]: true }))

    try {
      // Call the API to generate the element
      addToGenerationLog(type, `Calling API...`)
      setGenerationProgress((prev) => ({ ...prev, [type]: 30 }))

      const response = await fetch("/api/generate-element", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type, prompt }),
      })

      addToGenerationLog(type, `API response status: ${response.status}`)
      setGenerationProgress((prev) => ({ ...prev, [type]: 60 }))

      const data = await response.json()
      setGenerationProgress((prev) => ({ ...prev, [type]: 80 }))

      if (!response.ok) {
        // Check if the model is still loading (cold start)
        if (data.isLoading) {
          const message = "Model is still loading. Please wait a moment and try again."
          setGenerationError(message)
          addToGenerationLog(type, message)

          setTimeout(() => {
            // Auto-retry after a delay if it's a cold start issue
            if (generationDialog.retryCount < 3) {
              addToGenerationLog(type, `Auto-retrying (attempt ${generationDialog.retryCount + 1}/3)...`)
              setGenerationDialog((prev) => ({ ...prev, retryCount: prev.retryCount + 1 }))
              handleGenerateElement(type)
            }
          }, 5000)
          return
        }

        throw new Error(data.error || `Failed to generate ${type}`)
      }

      // Check if there's an error in the response even if status is 200
      if (data.error) {
        console.warn(`Warning in generation response:`, data.error)
        const message = `${data.error}. Using fallback.`
        setGenerationError(message)
        addToGenerationLog(type, message)
      }

      // Log success
      addToGenerationLog(
        type,
        `Generation successful. Response type: ${data.isBase64 ? "base64 image" : data.isFallback ? "fallback" : "url"}`,
      )
      setGenerationProgress((prev) => ({ ...prev, [type]: 100 }))

      // Cache the generated image if it's not a fallback
      if (data.url && !data.isFallback) {
        saveGeneratedImage(cacheKey, data.url)
        addToGenerationLog(type, `Saved to cache with key: ${cacheKey}`)
      }

      // Update the element with the generated result
      onElementUpdate(type, {
        type: "generated",
        value: data.url,
        metadata: {
          prompt: data.prompt,
          type: data.type,
          filterType: data.filterType,
          isBase64: data.isBase64,
          isFallback: data.isFallback,
        },
      })
    } catch (error) {
      console.error(`Error generating ${type}:`, error)
      const errorMessage = error instanceof Error ? error.message : `Failed to generate ${type}`
      setGenerationError(errorMessage)
      addToGenerationLog(type, `Error: ${errorMessage}`)
      setGenerationProgress((prev) => ({ ...prev, [type]: 90 }))

      // Generate client-side fallback
      addToGenerationLog(type, `Generating client-side fallback...`)
      const fallbackImage = await generateClientSideFallback(type, prompt)
      setGenerationProgress((prev) => ({ ...prev, [type]: 100 }))

      onElementUpdate(type, {
        type: "generated",
        value: fallbackImage,
        metadata: {
          prompt,
          type,
          isBase64: true,
          isFallback: true,
          isClientFallback: true,
        },
      })
    } finally {
      setIsGenerating((prev) => ({ ...prev, [type]: false }))
      // Keep the dialog open to show the result or error
    }
  }

  // Function to add a log entry
  const addToGenerationLog = (type: keyof SceneElements, message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setGenerationLogs((prev) => ({
      ...prev,
      [type]: [...prev[type], `[${timestamp}] ${message}`],
    }))
  }

  // Function to render an element preview with proper error handling
  const renderElementPreview = (element: { type: string; value: string; metadata?: any } | null, type: string) => {
    if (!element || type === "audio") return null

    return (
      <div className="aspect-video bg-gray-800 rounded-md overflow-hidden relative">
        <img
          src={element.value || "/placeholder.svg"}
          alt={`${element.type === "file" ? "Uploaded" : "Generated"} ${type}`}
          className="w-full h-full object-cover"
        />

        {element.metadata?.isFallback && (
          <div className="absolute bottom-2 right-2 bg-red-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {element.metadata?.isClientFallback ? "Client Fallback" : "Fallback"}
          </div>
        )}

        {element.metadata?.isCached && (
          <div className="absolute bottom-2 right-2 bg-green-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
            <Info className="h-3 w-3 mr-1" />
            Cached
          </div>
        )}

        <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded-md">
          {element.type === "file" ? "Uploaded" : element.type === "prompt" ? "Prompt" : "Generated"}
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-gray-950 p-4 overflow-y-auto ${className}`}>
      {brief ? (
        <>
          <h2 className="text-xl font-bold mb-4">{brief.title}</h2>
          <p className="text-gray-400 mb-6 text-sm">{brief.scene_description}</p>

          {generationError && (
            <div className="mb-4 p-3 bg-red-900/80 text-white rounded-md flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm">{generationError}</p>
                <button className="text-xs underline mt-1" onClick={() => setGenerationError(null)}>
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Generate All Button */}
          <Button
            variant="default"
            size="sm"
            className="w-full mb-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={handleGenerateAll}
            disabled={isGeneratingAll}
          >
            {isGeneratingAll ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating All Elements...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Generate All Elements
              </>
            )}
          </Button>

          {isGeneratingAll && (
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Generation Progress</span>
                <span>
                  {Object.values(generationProgress).reduce((a, b) => a + b, 0) /
                    Object.values(generationProgress).length}
                  %
                </span>
              </div>
              <Progress
                value={
                  Object.values(generationProgress).reduce((a, b) => a + b, 0) /
                  Object.values(generationProgress).length
                }
                className="h-2"
              />
            </div>
          )}

          <Tabs defaultValue="background" onValueChange={(value) => setActiveTab(value as keyof SceneElements)}>
            <TabsList className="grid grid-cols-5 mb-4">
              {Object.keys(elements).map((type) => (
                <TabsTrigger key={type} value={type} className="text-xs">
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(elements).map(([type, element]) => (
              <TabsContent key={type} value={type} className="space-y-4">
                <Card className="bg-gray-900 border-gray-800">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{elementLabels[type as keyof SceneElements]}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-gray-400 mb-3">{elementDescriptions[type as keyof SceneElements]}</p>

                    {isGenerating[type] && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Generating...</span>
                          <span>{generationProgress[type]}%</span>
                        </div>
                        <Progress value={generationProgress[type]} className="h-2" />
                      </div>
                    )}

                    {element ? (
                      <div className="space-y-3">
                        <div className="bg-black rounded-md p-2 text-xs text-gray-300 break-words">
                          {element.type === "prompt" ? element.value : element.metadata?.prompt || "Generated content"}
                        </div>

                        {element.type === "generated" && type !== "audio" && renderElementPreview(element, type)}
                        {element.type === "file" && type !== "audio" && renderElementPreview(element, type)}

                        {element.type === "generated" && type === "audio" && (
                          <div className="bg-gray-800 rounded-md p-2">
                            <audio controls className="w-full">
                              <source src={element.value} type="audio/mpeg" />
                              Your browser does not support the audio element.
                            </audio>
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => handleGenerateElement(type as keyof SceneElements)}
                            disabled={isGenerating[type]}
                          >
                            {isGenerating[type] ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 mr-1" />
                                Regenerate
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={() => onElementUpdate(type as keyof SceneElements, null)}
                          >
                            Reset
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            onClick={() => handleGenerateElement(type as keyof SceneElements)}
                            disabled={isGenerating[type]}
                          >
                            {isGenerating[type] ? (
                              <>
                                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <Sparkles className="h-3 w-3 mr-1" />
                                Generate with AI
                              </>
                            )}
                          </Button>

                          <div className="relative">
                            <Input
                              type="file"
                              id={`file-${type}`}
                              className="absolute inset-0 opacity-0 w-full cursor-pointer"
                              onChange={(e) => handleFileUpload(type as keyof SceneElements, e)}
                              accept={type === "audio" ? "audio/*" : "image/*"}
                            />
                            <Button variant="outline" size="sm" className="w-full">
                              <Upload className="h-3 w-3 mr-1" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {brief && (
                  <Card className="bg-gray-900 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xs font-medium">Suggested Prompt</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black rounded-md p-2 text-xs text-gray-300">
                        {type === "background" && brief.background_prompt}
                        {type === "character" && brief.character_prompt}
                        {type === "motionFx" && brief.motion_fx_prompt}
                        {type === "filter" && brief.filter_type}
                        {type === "audio" && brief.audio_style}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </>
      ) : (
        <div className="h-full flex items-center justify-center">
          <p className="text-gray-500 text-center">Enter a prompt to generate a creative brief</p>
        </div>
      )}
      {/* Generation Dialog */}
      <Dialog
        open={generationDialog.open}
        onOpenChange={(open) => setGenerationDialog({ open, type: null, retryCount: 0 })}
      >
        <DialogContent className="bg-gray-900 border-gray-800 text-white">
          <DialogHeader>
            <DialogTitle>{generationDialog.type && `Generating ${elementLabels[generationDialog.type]}`}</DialogTitle>
            <DialogDescription className="text-gray-400">
              {isGenerating[generationDialog.type || "background"]
                ? "Creating your element with AI..."
                : generationError
                  ? "There was an error generating your element"
                  : "Your element has been generated"}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {isGenerating[generationDialog.type || "background"] ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mb-4" />
                <p className="text-sm text-gray-400">
                  {generationDialog.type && `Generating ${elementLabels[generationDialog.type].toLowerCase()}...`}
                </p>
                {generationDialog.retryCount > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Retry attempt {generationDialog.retryCount}/3 (model is warming up)
                  </p>
                )}

                {generationDialog.type && (
                  <div className="w-full mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Progress</span>
                      <span>{generationProgress[generationDialog.type]}%</span>
                    </div>
                    <Progress value={generationProgress[generationDialog.type]} className="h-2" />
                  </div>
                )}
              </div>
            ) : generationError ? (
              <div className="bg-red-900/50 p-4 rounded-md">
                <p className="text-sm">{generationError}</p>
                <p className="text-xs mt-2">
                  This could be due to:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>HuggingFace API rate limits</li>
                    <li>Model still loading (cold start)</li>
                    <li>Content policy restrictions</li>
                    <li>Network connectivity issues</li>
                  </ul>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                {generationDialog.type && elements[generationDialog.type] && (
                  <>
                    {elements[generationDialog.type]?.type === "generated" && generationDialog.type !== "audio" && (
                      <div className="aspect-video w-full max-h-[300px] bg-gray-800 rounded-md overflow-hidden relative">
                        <img
                          src={elements[generationDialog.type]?.value || "/placeholder.svg"}
                          alt={`Generated ${generationDialog.type}`}
                          className="w-full h-full object-contain"
                        />

                        {elements[generationDialog.type]?.metadata?.isFallback && (
                          <div className="absolute bottom-2 right-2 bg-red-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            {elements[generationDialog.type]?.metadata?.isClientFallback
                              ? "Client Fallback"
                              : "Fallback"}
                          </div>
                        )}

                        {elements[generationDialog.type]?.metadata?.isCached && (
                          <div className="absolute bottom-2 right-2 bg-green-900/80 text-white text-xs px-2 py-1 rounded-md flex items-center">
                            <Info className="h-3 w-3 mr-1" />
                            Cached
                          </div>
                        )}
                      </div>
                    )}

                    {elements[generationDialog.type]?.type === "generated" && generationDialog.type === "audio" && (
                      <div className="w-full bg-gray-800 rounded-md p-4">
                        <audio controls className="w-full">
                          <source src={elements[generationDialog.type]?.value} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Generation Logs */}
          {generationDialog.type && generationLogs[generationDialog.type].length > 0 && (
            <div className="mt-4 border-t border-gray-800 pt-4">
              <div className="flex items-center mb-2">
                <Info className="h-4 w-4 mr-2 text-gray-400" />
                <h4 className="text-sm font-medium">Generation Logs</h4>
              </div>
              <div className="bg-black/50 p-2 rounded-md max-h-40 overflow-y-auto">
                {generationLogs[generationDialog.type].map((log, index) => (
                  <div key={index} className="text-xs text-gray-400 font-mono">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGenerationDialog({ open: false, type: null, retryCount: 0 })}
              className="w-full"
            >
              {isGenerating[generationDialog.type || "background"] ? <X className="h-4 w-4 mr-2" /> : "Close"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
