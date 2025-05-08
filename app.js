// Import Three.js library
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"

// DOM Elements
const promptInput = document.getElementById("prompt-input")
const generateBtn = document.getElementById("generate-btn")
const errorMessage = document.getElementById("error-message")
const loadingElement = document.getElementById("loading")
const sceneInfo = document.getElementById("scene-info")
const canvas = document.getElementById("scene-viewer")

// Three.js variables
let scene, camera, renderer, controls
let currentModels = []

// Initialize the 3D scene
function initScene() {
  // Create scene
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x1a1a2e)

  // Create camera
  camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000)
  camera.position.set(0, 5, 10)

  // Create renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.shadowMap.enabled = true

  // Add orbit controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.target.set(0, 0, 0)
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  controls.enableDamping = true
  controls.update()

  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
  directionalLight.position.set(5, 5, 5)
  directionalLight.castShadow = true
  scene.add(directionalLight)

  // Add ground plane
  const groundGeometry = new THREE.PlaneGeometry(100, 100)
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.8,
    metalness: 0.2,
  })
  const ground = new THREE.Mesh(groundGeometry, groundMaterial)
  ground.rotation.x = -Math.PI / 2
  ground.position.y = -1
  ground.receiveShadow = true
  scene.add(ground)

  // Handle window resize
  window.addEventListener("resize", onWindowResize)

  // Start animation loop
  animate()
}

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}

// Handle window resize
function onWindowResize() {
  camera.aspect = canvas.clientWidth / canvas.clientHeight
  camera.updateProjectionMatrix()
  renderer.setSize(canvas.clientWidth, canvas.clientHeight)
}

// Load GLTF model
function loadModel(url, index) {
  return new Promise((resolve, reject) => {
    // Set up DRACO loader for compressed models
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/versioned/decoders/1.5.5/")

    // Set up GLTF loader
    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    // Load the model
    loader.load(
      url,
      (gltf) => {
        // Position the model
        const model = gltf.scene
        model.position.set(index * 3 - (currentModels.length * 3) / 2, 0, -5)
        model.scale.set(1.5, 1.5, 1.5)

        // Add the model to the scene
        scene.add(model)

        // Store the model for later removal
        currentModels.push(model)

        resolve(model)
      },
      (xhr) => {
        // Progress callback
        const percentComplete = (xhr.loaded / xhr.total) * 100
        console.log(`${Math.round(percentComplete)}% loaded`)
      },
      (error) => {
        // Error callback
        console.error("Error loading model:", error)
        reject(error)
      },
    )
  })
}

// Create a fallback cube
function createFallbackCube(index) {
  const geometry = new THREE.BoxGeometry(1, 1, 1)
  const material = new THREE.MeshStandardMaterial({ color: 0x666666 })
  const cube = new THREE.Mesh(geometry, material)

  cube.position.set(index * 3 - (currentModels.length * 3) / 2, 0, -5)
  cube.scale.set(1.5, 1.5, 1.5)

  scene.add(cube)
  currentModels.push(cube)

  return cube
}

// Clear all models from the scene
function clearModels() {
  currentModels.forEach((model) => {
    scene.remove(model)
  })

  currentModels = []
}

// Generate scene from prompt
async function generateScene(prompt) {
  try {
    // Show loading indicator
    loadingElement.style.display = "flex"
    errorMessage.style.display = "none"

    // Clear existing models
    clearModels()

    // Call the API to get model URLs
    const response = await fetch("/api/generate-scene", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    })

    const data = await response.json()

    // Check for API errors
    if (data.error) {
      throw new Error(data.error)
    }

    // Update scene info
    sceneInfo.innerHTML = `
      <p><strong>Prompt:</strong> ${prompt}</p>
      <p><strong>Models:</strong> ${data.objects ? data.objects.length : 0} found</p>
      ${data.message ? `<p><strong>Message:</strong> ${data.message}</p>` : ""}
    `

    // Load models
    if (data.objects && data.objects.length > 0) {
      const loadPromises = data.objects.map((obj, index) => {
        return loadModel(obj.modelUrl, index).catch((err) => {
          console.error(`Failed to load model ${index}:`, err)
          return createFallbackCube(index)
        })
      })

      await Promise.all(loadPromises)
    } else {
      // No models found, create a fallback cube
      createFallbackCube(0)
      sceneInfo.innerHTML += "<p><em>No models found. Displaying fallback object.</em></p>"
    }
  } catch (error) {
    // Display error message
    console.error("Error generating scene:", error)
    errorMessage.textContent = error.message || "Failed to generate scene"
    errorMessage.style.display = "block"

    // Create a fallback cube
    createFallbackCube(0)

    // Update scene info
    sceneInfo.innerHTML = `
      <p><strong>Prompt:</strong> ${prompt}</p>
      <p><strong>Error:</strong> ${error.message || "Failed to generate scene"}</p>
      <p><em>Displaying fallback object.</em></p>
    `
  } finally {
    // Hide loading indicator
    loadingElement.style.display = "none"
  }
}

// Event listeners
generateBtn.addEventListener("click", () => {
  const prompt = promptInput.value.trim()

  if (prompt) {
    generateScene(prompt)
  } else {
    errorMessage.textContent = "Please enter a prompt"
    errorMessage.style.display = "block"
  }
})

promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    generateBtn.click()
  }
})

// Initialize the scene when the page loads
window.addEventListener("load", initScene)
