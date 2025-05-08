import type { CreativeBrief } from "@/lib/types"
import { isPlainObject } from "@/lib/render-utils"

interface BriefDisplayProps {
  brief: CreativeBrief
}

export function BriefDisplay({ brief }: BriefDisplayProps) {
  // Standard fields that we know are strings
  const standardFields = [
    { key: "concept", label: "Concept" },
    { key: "visual_style", label: "Visual Style" },
    { key: "scene_description", label: "Scene Description" },
    { key: "color_palette", label: "Color Palette" },
    { key: "mood", label: "Mood & Atmosphere" },
    { key: "technical_elements", label: "Technical Elements" },
    { key: "references", label: "References" },
    { key: "videoPrompt", label: "Video Prompt" },
  ]

  // Get all keys that aren't in standardFields
  const extraFields = Object.keys(brief).filter((key) => !standardFields.some((field) => field.key === key))

  return (
    <div className="space-y-6">
      {/* Render standard fields */}
      {standardFields.map(({ key, label }) => {
        const value = brief[key as keyof CreativeBrief]
        if (!value) return null

        return (
          <div key={key}>
            <h3 className="text-lg font-semibold text-purple-300">{label}</h3>
            <p className="mt-1 text-gray-200">{String(value)}</p>
          </div>
        )
      })}

      {/* Render extra fields that might be objects */}
      {extraFields.map((key) => {
        const value = brief[key as keyof CreativeBrief]
        if (!value) return null

        // If it's an object, format it as JSON
        if (isPlainObject(value)) {
          return (
            <div key={key}>
              <h3 className="text-lg font-semibold text-purple-300">
                {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
              </h3>
              <pre className="mt-1 text-gray-200 bg-gray-800 p-2 rounded-md overflow-auto text-sm">
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          )
        }

        // Otherwise render as string
        return (
          <div key={key}>
            <h3 className="text-lg font-semibold text-purple-300">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ")}
            </h3>
            <p className="mt-1 text-gray-200">{String(value)}</p>
          </div>
        )
      })}
    </div>
  )
}
