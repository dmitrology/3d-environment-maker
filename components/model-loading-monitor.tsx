"use client"

import { useProgress } from "@react-three/drei"
import { useEffect, useState } from "react"

export function ModelLoadingMonitor() {
  const { active, progress, errors, item, loaded, total } = useProgress()
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    if (errors.length > 0) {
      console.error("Model loading errors:", errors)
    }
  }, [errors])

  if (!active && loaded === total) return null

  return (
    <div className="absolute bottom-4 left-4 bg-black/70 text-white p-2 rounded text-sm">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <div>
          Loading: {Math.round(progress)}% ({loaded}/{total})
        </div>
        <button onClick={() => setShowDetails(!showDetails)} className="text-xs text-blue-300 hover:text-blue-200">
          {showDetails ? "Hide" : "Details"}
        </button>
      </div>

      {showDetails && (
        <div className="mt-2 text-xs max-w-md">
          <div className="truncate">Current: {item}</div>
          {errors.length > 0 && <div className="mt-1 text-red-300">Errors: {errors.length}</div>}
        </div>
      )}
    </div>
  )
}
