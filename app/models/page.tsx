"use client"
import { ModelUploader } from "@/components/model-uploader"
import { ModelGallery } from "@/components/model-gallery"
import { CacheStatus } from "@/components/cache-status"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { initializeModels } from "@/lib/client-model-service"
import { Loader2 } from "lucide-react"

export default function ModelsPage() {
  const [isInitializing, setIsInitializing] = useState(true)

  // Initialize models on page load
  useEffect(() => {
    async function init() {
      try {
        setIsInitializing(true)
        await initializeModels()
      } catch (error) {
        console.error("Error initializing models:", error)
        toast({
          title: "Initialization error",
          description: "Failed to initialize models. Some features may not work correctly.",
          variant: "destructive",
        })
      } finally {
        setIsInitializing(false)
      }
    }

    init()
  }, [])

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            VISUAL ALCHEMY - 3D Models
          </h1>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {isInitializing ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-purple-500 mb-4" />
            <p className="text-lg">Initializing model library...</p>
            <p className="text-sm text-gray-400 mt-2">This may take a moment on first load</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="md:col-span-2">
                <ModelGallery />
              </div>
              <div>
                <CacheStatus />
              </div>
            </div>

            <Tabs defaultValue="gallery" className="space-y-8">
              <TabsList className="grid grid-cols-2 max-w-md mx-auto">
                <TabsTrigger value="gallery">Model Gallery</TabsTrigger>
                <TabsTrigger value="upload">Upload Model</TabsTrigger>
              </TabsList>

              <TabsContent value="gallery" className="space-y-8">
                <ModelGallery />
              </TabsContent>

              <TabsContent value="upload" className="max-w-md mx-auto">
                <ModelUploader />
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  )
}
