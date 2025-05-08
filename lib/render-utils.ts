/**
 * Checks if a value is a plain object (not an array, function, or other non-object)
 */
export function isPlainObject(value: any): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date) &&
    !(value instanceof RegExp) &&
    !(value instanceof Map) &&
    !(value instanceof Set)
  )
}

/**
 * Safely converts any value to a string representation
 */
export function safeToString(value: any): string {
  if (value === null || value === undefined) {
    return ""
  }

  if (typeof value === "string") {
    return value
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value)
  }

  if (Array.isArray(value)) {
    return JSON.stringify(value)
  }

  if (isPlainObject(value)) {
    return JSON.stringify(value)
  }

  return String(value)
}
