"use client"

import type { CreativeBrief } from "./types"

const STORAGE_KEY = "visual-alchemy-briefs"

export function saveBrief(brief: CreativeBrief): void {
  if (typeof window === "undefined") return

  try {
    // Get existing briefs
    const existingBriefsJson = localStorage.getItem(STORAGE_KEY)
    const existingBriefs: CreativeBrief[] = existingBriefsJson ? JSON.parse(existingBriefsJson) : []

    // Add new brief to the beginning of the array
    const updatedBriefs = [brief, ...existingBriefs.slice(0, 9)] // Keep only the 10 most recent briefs

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedBriefs))
  } catch (error) {
    console.error("Error saving brief to localStorage:", error)
  }
}

export function getSavedBriefs(): CreativeBrief[] {
  if (typeof window === "undefined") return []

  try {
    const briefsJson = localStorage.getItem(STORAGE_KEY)
    return briefsJson ? JSON.parse(briefsJson) : []
  } catch (error) {
    console.error("Error getting briefs from localStorage:", error)
    return []
  }
}

export function clearSavedBriefs(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}
