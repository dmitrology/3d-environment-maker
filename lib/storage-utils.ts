"use client"

import type { SceneElements, CreativeBrief } from "./types"

const STORAGE_KEY_ELEMENTS = "visual-alchemy-elements"

interface SavedScene {
  elements: SceneElements
  brief: CreativeBrief
  timestamp: number
  id: string
}

export function saveGeneratedScene(elements: SceneElements, brief: CreativeBrief): string {
  if (typeof window === "undefined") return ""

  try {
    // Get existing scenes
    const existingScenesJson = localStorage.getItem(STORAGE_KEY_ELEMENTS)
    const existingScenes: SavedScene[] = existingScenesJson ? JSON.parse(existingScenesJson) : []

    // Create a unique ID for this scene
    const id = `scene-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

    // Create the new scene object
    const newScene: SavedScene = {
      elements,
      brief,
      timestamp: Date.now(),
      id,
    }

    // Add new scene to the beginning of the array
    const updatedScenes = [newScene, ...existingScenes.slice(0, 9)] // Keep only the 10 most recent scenes

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY_ELEMENTS, JSON.stringify(updatedScenes))

    return id
  } catch (error) {
    console.error("Error saving scene to localStorage:", error)
    return ""
  }
}

export function getSavedScenes(): SavedScene[] {
  if (typeof window === "undefined") return []

  try {
    const scenesJson = localStorage.getItem(STORAGE_KEY_ELEMENTS)
    return scenesJson ? JSON.parse(scenesJson) : []
  } catch (error) {
    console.error("Error getting scenes from localStorage:", error)
    return []
  }
}

export function getSavedSceneById(id: string): SavedScene | null {
  if (typeof window === "undefined") return null

  try {
    const scenes = getSavedScenes()
    return scenes.find((scene) => scene.id === id) || null
  } catch (error) {
    console.error("Error getting scene by ID:", error)
    return null
  }
}

export function deleteSavedScene(id: string): boolean {
  if (typeof window === "undefined") return false

  try {
    const scenes = getSavedScenes()
    const filteredScenes = scenes.filter((scene) => scene.id !== id)
    localStorage.setItem(STORAGE_KEY_ELEMENTS, JSON.stringify(filteredScenes))
    return true
  } catch (error) {
    console.error("Error deleting scene:", error)
    return false
  }
}
