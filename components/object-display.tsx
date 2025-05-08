import { isPlainObject } from "@/lib/render-utils"

interface ObjectDisplayProps {
  data: any
  label?: string
}

export function ObjectDisplay({ data, label }: ObjectDisplayProps) {
  if (data === null || data === undefined) {
    return null
  }

  // Handle simple types
  if (typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return (
      <div className="mb-4">
        {label && <h3 className="text-lg font-medium mb-1">{label}</h3>}
        <p className="text-gray-700">{String(data)}</p>
      </div>
    )
  }

  // Handle arrays
  if (Array.isArray(data)) {
    return (
      <div className="mb-4">
        {label && <h3 className="text-lg font-medium mb-1">{label}</h3>}
        <ul className="list-disc pl-5">
          {data.map((item, index) => (
            <li key={index}>{isPlainObject(item) ? <ObjectDisplay data={item} /> : String(item)}</li>
          ))}
        </ul>
      </div>
    )
  }

  // Handle objects
  if (isPlainObject(data)) {
    return (
      <div className="mb-4">
        {label && <h3 className="text-lg font-medium mb-1">{label}</h3>}
        <div className="bg-gray-100 p-3 rounded">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="mb-2">
              <div className="font-medium text-sm text-gray-600">{key}</div>
              {isPlainObject(value) || Array.isArray(value) ? (
                <ObjectDisplay data={value} />
              ) : (
                <div className="pl-2">{String(value)}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Fallback
  return (
    <div className="mb-4">
      {label && <h3 className="text-lg font-medium mb-1">{label}</h3>}
      <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">{JSON.stringify(data, null, 2)}</pre>
    </div>
  )
}
