"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, Sun, Moon, Sparkles, Layers } from "lucide-react"

export function SceneControls() {
  const [isPlaying, setIsPlaying] = useState(true)
  const [lightIntensity, setLightIntensity] = useState(50)
  const [effectIntensity, setEffectIntensity] = useState(30)

  return (
    <div className="bg-gray-900/80 backdrop-blur-sm p-3 border-t border-gray-800 flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => {
            // Reset camera position
          }}
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex items-center gap-2 min-w-[140px]">
        <Sun className="h-4 w-4 text-amber-500" />
        <Slider
          value={[lightIntensity]}
          max={100}
          step={1}
          onValueChange={(value) => setLightIntensity(value[0])}
          className="flex-1"
        />
      </div>

      <div className="flex items-center gap-2 min-w-[140px]">
        <Sparkles className="h-4 w-4 text-purple-500" />
        <Slider
          value={[effectIntensity]}
          max={100}
          step={1}
          onValueChange={(value) => setEffectIntensity(value[0])}
          className="flex-1"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" className="h-8">
          <Layers className="h-4 w-4 mr-1" />
          Layers
        </Button>

        <Button variant="outline" size="sm" className="h-8">
          <Moon className="h-4 w-4 mr-1" />
          Night Mode
        </Button>
      </div>
    </div>
  )
}
