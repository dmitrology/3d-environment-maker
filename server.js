const express = require("express")
const path = require("path")
const fetch = require("node-fetch")
const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static(path.join(__dirname, ".")))

// API endpoint to generate a scene
app.post("/api/generate-scene", async (req, res) => {
  try {
    const { prompt } = req.body

    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ error: "Please provide a text prompt" })
    }

    console.log(`Received prompt: "${prompt}"`)

    // Search for models on Sketchfab
    const modelUrls = await searchSketchfabModels(prompt)

    // If no models found, return a fallback scene
    if (!modelUrls || modelUrls.length === 0) {
      console.log(`No models found for prompt: "${prompt}". Using fallback.`)

      return res.json({
        objects: [
          {
            type: "fallback",
            modelUrl: `/fallback-cube.glb`,
            position: [0, 0, -5],
            scale: 1.5,
          },
        ],
        message: "No 3D models found for your prompt. Using a placeholder instead.",
      })
    }

    // Create scene configuration
    const scene = {
      objects: modelUrls.map((url, i) => ({
        type: "external",
        modelUrl: url,
        position: [i * 3 - (modelUrls.length * 3) / 2, 0, -5],
        scale: 1.5,
      })),
    }

    res.json(scene)
  } catch (error) {
    console.error("Error in generate-scene route:", error)

    res.status(500).json({
      error: "Failed to generate scene",
      message: error.message || "Unknown error",
    })
  }
})

// Function to search for models on Sketchfab
async function searchSketchfabModels(prompt) {
  try {
    // Get API token from environment variables
    const token = process.env.SKETCHFAB_API_TOKEN

    if (!token) {
      console.warn("SKETCHFAB_API_TOKEN is not defined in environment variables")
      return []
    }

    console.log(`Searching Sketchfab for models matching: "${prompt}"`)

    // Search for models
    const searchResponse = await fetch(
      `https://api.sketchfab.com/v3/search?type=models&q=${encodeURIComponent(prompt)}&downloadable=true&archives_flavours=gltf`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 15000, // 15 second timeout
      },
    )

    if (!searchResponse.ok) {
      throw new Error(`Sketchfab search API error: ${searchResponse.status} ${searchResponse.statusText}`)
    }

    const data = await searchResponse.json()
    const results = data.results || []

    if (results.length === 0) {
      console.warn(`No models found for prompt: "${prompt}"`)
      return []
    }

    console.log(`Found ${results.length} models, fetching download URLs...`)

    // Get download URLs for each model (limited to first 3 to avoid rate limits)
    const modelUrls = []
    const modelsToProcess = results.slice(0, 3)

    for (const model of modelsToProcess) {
      try {
        console.log(`Fetching download URL for model: ${model.uid} (${model.name})`)

        const downloadResponse = await fetch(`https://api.sketchfab.com/v3/models/${model.uid}/download`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000, // 10 second timeout
        })

        if (!downloadResponse.ok) {
          console.warn(`Couldn't get download URL for model ${model.uid}: ${downloadResponse.status}`)
          continue
        }

        const data = await downloadResponse.json()

        if (data.gltf?.url) {
          console.log(`Got download URL for model ${model.uid}`)
          modelUrls.push(data.gltf.url)
        } else {
          console.warn(`No glTF URL found for model ${model.uid}`)
        }
      } catch (error) {
        console.error(`Error getting download URL for model ${model.uid}:`, error)
      }
    }

    console.log(`Successfully retrieved ${modelUrls.length} model URLs`)
    return modelUrls
  } catch (error) {
    console.error("Error searching Sketchfab models:", error)
    return []
  }
}

// Serve the main HTML file for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
