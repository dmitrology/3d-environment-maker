"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Download, Film, ImageIcon } from "lucide-react"
import type { CreativeBrief, SceneElements } from "@/lib/types"

interface ExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  elements: SceneElements
  brief: CreativeBrief | null
}

export function ExportDialog({ open, onOpenChange, elements, brief }: ExportDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [exportType, setExportType] = useState<"video" | "image">("image")
  const [exportFormat, setExportFormat] = useState<"mp4" | "gif" | "png" | "jpg">("png")
  const [duration, setDuration] = useState(5)
  const [fps, setFps] = useState(24)
  const [exportUrl, setExportUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false)

  // Load FFmpeg on component mount
  useEffect(() => {
    if (open && !ffmpegLoaded) {
      setProgress(10)

      // Simulate loading FFmpeg (in a real app, you would actually load FFmpeg.wasm here)
      const timer = setTimeout(() => {
        setFfmpegLoaded(true)
        setProgress(20)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [open, ffmpegLoaded])

  const handleExport = async () => {
    if (!brief) return

    setIsLoading(true)
    setProgress(0)
    setError(null)
    setExportUrl(null)

    try {
      // Simulate export process
      await simulateExport()

      // In a real implementation, you would:
      // 1. Render frames using canvas
      // 2. Use FFmpeg.wasm to encode frames into video
      // 3. For images, just use canvas.toDataURL()

      // For now, we'll just return a mock URL
      if (exportType === "video") {
        setExportUrl("/demo-video.mp4")
      } else {
        // For image export, use a placeholder image
        setExportUrl("/demo-image.png")
      }

      setProgress(100)
    } catch (error) {
      console.error("Export error:", error)
      setError("Failed to export. Please try again.")
      setProgress(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Simulate the export process with progress updates
  const simulateExport = async () => {
    const steps = exportType === "video" ? 10 : 5
    const stepTime = exportType === "video" ? 500 : 300

    for (let i = 1; i <= steps; i++) {
      await new Promise((resolve) => setTimeout(resolve, stepTime))
      setProgress(Math.floor(20 + (i / steps) * 80))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-gray-900 border-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Export Your Creation</DialogTitle>
          <DialogDescription className="text-gray-400">Export your scene as a video or image</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="export-type">Export Type</Label>
            <Select value={exportType} onValueChange={(value) => setExportType(value as "video" | "image")}>
              <SelectTrigger id="export-type" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select export type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="image">
                  <div className="flex items-center">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    <span>Still Image</span>
                  </div>
                </SelectItem>
                <SelectItem value="video">
                  <div className="flex items-center">
                    <Film className="h-4 w-4 mr-2" />
                    <span>Video Loop</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="export-format">Format</Label>
            <Select
              value={exportFormat}
              onValueChange={(value) => setExportFormat(value as "mp4" | "gif" | "png" | "jpg")}
            >
              <SelectTrigger id="export-format" className="bg-gray-800 border-gray-700">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {exportType === "video" ? (
                  <>
                    <SelectItem value="mp4">MP4 Video</SelectItem>
                    <SelectItem value="gif">Animated GIF</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="png">PNG Image</SelectItem>
                    <SelectItem value="jpg">JPEG Image</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>

          {exportType === "video" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (seconds)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={1}
                  max={15}
                  value={duration}
                  onChange={(e) => setDuration(Number.parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fps">Frame Rate (FPS)</Label>
                <Input
                  id="fps"
                  type="number"
                  min={15}
                  max={60}
                  value={fps}
                  onChange={(e) => setFps(Number.parseInt(e.target.value))}
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </>
          )}

          {isLoading && (
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-xs text-gray-400">
                <span>Export Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {error && <div className="bg-red-900/50 p-3 rounded-md text-sm">{error}</div>}

          {exportUrl && (
            <div className="bg-green-900/50 p-3 rounded-md text-sm flex flex-col items-center">
              <p className="mb-2">Export complete!</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(exportUrl, "_blank")}
                className="flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download {exportType === "video" ? "Video" : "Image"}
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleExport}
            disabled={isLoading || !ffmpegLoaded}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Exporting...
              </>
            ) : (
              "Export"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
