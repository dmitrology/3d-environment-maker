"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { uploadModelToBlob, type ModelCategory } from "@/lib/blob-storage"
import { Loader2, Upload } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export function ModelUploader() {
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [category, setCategory] = useState<ModelCategory>("props")
  const [tags, setTags] = useState("")
  const [prompt, setPrompt] = useState("")
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Check if file is a GLB or GLTF
      if (selectedFile.name.endsWith(".glb") || selectedFile.name.endsWith(".gltf")) {
        setFile(selectedFile)
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a .glb or .gltf file",
          variant: "destructive",
        })
      }
    }
  }

  const handleUpload = async () => {
    if (!file || !name || !category) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      const metadata = await uploadModelToBlob(file, category, name, tagArray, prompt)

      toast({
        title: "Upload successful",
        description: `${name} has been uploaded to ${category}`,
      })

      // Reset form
      setFile(null)
      setName("")
      setTags("")
      setPrompt("")

      // Reset file input
      const fileInput = document.getElementById("model-file") as HTMLInputElement
      if (fileInput) fileInput.value = ""
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your model",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gray-900 rounded-lg border border-gray-800">
      <h2 className="text-xl font-bold">Upload 3D Model</h2>

      <div className="space-y-2">
        <Label htmlFor="model-file">Model File (.glb or .gltf)</Label>
        <Input
          id="model-file"
          type="file"
          accept=".glb,.gltf"
          onChange={handleFileChange}
          className="bg-gray-800 border-gray-700"
        />
        {file && (
          <p className="text-sm text-gray-400">
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-name">Model Name</Label>
        <Input
          id="model-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name for your model"
          className="bg-gray-800 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-category">Category</Label>
        <Select value={category} onValueChange={(value) => setCategory(value as ModelCategory)}>
          <SelectTrigger id="model-category" className="bg-gray-800 border-gray-700">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="backgrounds">Backgrounds</SelectItem>
            <SelectItem value="characters">Characters</SelectItem>
            <SelectItem value="props">Props</SelectItem>
            <SelectItem value="effects">Effects</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-tags">Tags (comma separated)</Label>
        <Input
          id="model-tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., fantasy, sci-fi, nature"
          className="bg-gray-800 border-gray-700"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="model-prompt">Original Prompt (optional)</Label>
        <Input
          id="model-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="The prompt used to generate this model"
          className="bg-gray-800 border-gray-700"
        />
      </div>

      <Button
        onClick={handleUpload}
        disabled={isUploading || !file || !name}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Model
          </>
        )}
      </Button>
    </div>
  )
}
