"use client"

// Client-side fallback generator for when API calls fail
// This creates abstract patterns based on the element type and prompt

// Helper to generate a random color
const getRandomColor = (seed: string) => {
  // Simple hash function to get a deterministic value from a string
  const hash = seed.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Use the hash to generate HSL colors
  const h = Math.abs(hash % 360)
  const s = 70 + (hash % 30) // 70-100%
  const l = 40 + (hash % 30) // 40-70%

  return `hsl(${h}, ${s}%, ${l}%)`
}

// Generate a pattern based on the type and prompt
export const generateClientSideFallback = async (type: string, prompt: string): Promise<string> => {
  return new Promise((resolve) => {
    // Create a canvas element
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    // Set canvas size
    canvas.width = 512
    canvas.height = 512

    if (!ctx) {
      // Fallback if canvas is not supported
      resolve(`/placeholder.svg?height=512&width=512&query=${encodeURIComponent(prompt)}`)
      return
    }

    // Fill background
    ctx.fillStyle = "#111"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Generate different patterns based on element type
    switch (type) {
      case "background":
        generateBackgroundPattern(ctx, canvas.width, canvas.height, prompt)
        break
      case "character":
        generateCharacterPattern(ctx, canvas.width, canvas.height, prompt)
        break
      case "motionFx":
        generateMotionFxPattern(ctx, canvas.width, canvas.height, prompt)
        break
      case "filter":
        generateFilterPattern(ctx, canvas.width, canvas.height, prompt)
        break
      default:
        generateDefaultPattern(ctx, canvas.width, canvas.height, prompt)
    }

    // Convert canvas to base64 image
    try {
      const dataUrl = canvas.toDataURL("image/png")
      resolve(dataUrl)
    } catch (error) {
      console.error("Error generating client-side fallback:", error)
      resolve(`/placeholder.svg?height=512&width=512&query=${encodeURIComponent(prompt)}`)
    }
  })
}

// Background pattern generator
const generateBackgroundPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  // Extract colors from prompt
  const words = prompt.toLowerCase().split(" ")
  const colorWords = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "pink",
    "orange",
    "black",
    "white",
    "gray",
    "cyan",
    "magenta",
  ]
  const foundColors = colorWords.filter((color) => words.includes(color))

  // Use found colors or generate from prompt
  const colors =
    foundColors.length > 0
      ? foundColors.map((color) => {
          switch (color) {
            case "red":
              return "#ff0000"
            case "blue":
              return "#0000ff"
            case "green":
              return "#00ff00"
            case "yellow":
              return "#ffff00"
            case "purple":
              return "#800080"
            case "pink":
              return "#ffc0cb"
            case "orange":
              return "#ffa500"
            case "black":
              return "#000000"
            case "white":
              return "#ffffff"
            case "gray":
              return "#808080"
            case "cyan":
              return "#00ffff"
            case "magenta":
              return "#ff00ff"
            default:
              return getRandomColor(color)
          }
        })
      : [getRandomColor(prompt + "1"), getRandomColor(prompt + "2"), getRandomColor(prompt + "3")]

  // Draw gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  colors.forEach((color, index) => {
    gradient.addColorStop(index / (colors.length - 1 || 1), color)
  })

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add some noise/texture
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = Math.random() * 3

    ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.1})`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }

  // Add some geometric shapes based on the prompt
  const promptHash = prompt.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  const shapeCount = 5 + (Math.abs(promptHash) % 10)

  for (let i = 0; i < shapeCount; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = 50 + Math.random() * 100

    ctx.fillStyle = colors[i % colors.length] + "40" // 40 is hex for 25% opacity

    // Different shapes based on the hash
    if ((promptHash + i) % 3 === 0) {
      // Circle
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if ((promptHash + i) % 3 === 1) {
      // Rectangle
      ctx.beginPath()
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    } else {
      // Triangle
      ctx.beginPath()
      ctx.moveTo(x, y - size / 2)
      ctx.lineTo(x - size / 2, y + size / 2)
      ctx.lineTo(x + size / 2, y + size / 2)
      ctx.closePath()
      ctx.fill()
    }
  }
}

// Character pattern generator
const generateCharacterPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  // Fill background with transparent
  ctx.clearRect(0, 0, width, height)

  // Create a silhouette in the center
  const centerX = width / 2
  const centerY = height / 2

  // Generate a color from the prompt
  const mainColor = getRandomColor(prompt)

  // Draw a basic character silhouette
  ctx.fillStyle = mainColor

  // Head
  const headSize = width * 0.2
  ctx.beginPath()
  ctx.arc(centerX, centerY - headSize * 0.7, headSize, 0, Math.PI * 2)
  ctx.fill()

  // Body
  ctx.beginPath()
  ctx.moveTo(centerX - headSize * 0.5, centerY)
  ctx.lineTo(centerX + headSize * 0.5, centerY)
  ctx.lineTo(centerX + headSize * 0.7, centerY + headSize * 2)
  ctx.lineTo(centerX - headSize * 0.7, centerY + headSize * 2)
  ctx.closePath()
  ctx.fill()

  // Add some details based on the prompt
  const words = prompt.toLowerCase().split(" ")

  // Check for specific character types in the prompt
  const isRobot = words.some((word) => ["robot", "mechanical", "android", "cyborg"].includes(word))
  const isAnimal = words.some((word) => ["animal", "creature", "beast", "monster"].includes(word))
  const isEthereal = words.some((word) => ["ghost", "spirit", "ethereal", "magical"].includes(word))

  if (isRobot) {
    // Add robot details
    ctx.fillStyle = getRandomColor(prompt + "detail")
    ctx.fillRect(centerX - headSize * 0.3, centerY - headSize * 0.9, headSize * 0.6, headSize * 0.2)
    ctx.fillRect(centerX - headSize * 0.4, centerY - headSize * 0.4, headSize * 0.8, headSize * 0.1)

    // Robot eyes
    ctx.fillStyle = "#00ffff"
    ctx.beginPath()
    ctx.arc(centerX - headSize * 0.2, centerY - headSize * 0.7, headSize * 0.1, 0, Math.PI * 2)
    ctx.arc(centerX + headSize * 0.2, centerY - headSize * 0.7, headSize * 0.1, 0, Math.PI * 2)
    ctx.fill()
  } else if (isAnimal) {
    // Add animal details
    ctx.fillStyle = getRandomColor(prompt + "detail")

    // Ears
    ctx.beginPath()
    ctx.moveTo(centerX - headSize * 0.3, centerY - headSize * 1.1)
    ctx.lineTo(centerX - headSize * 0.6, centerY - headSize * 1.5)
    ctx.lineTo(centerX - headSize * 0.1, centerY - headSize * 1.2)
    ctx.closePath()
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(centerX + headSize * 0.3, centerY - headSize * 1.1)
    ctx.lineTo(centerX + headSize * 0.6, centerY - headSize * 1.5)
    ctx.lineTo(centerX + headSize * 0.1, centerY - headSize * 1.2)
    ctx.closePath()
    ctx.fill()

    // Animal eyes
    ctx.fillStyle = "#ffff00"
    ctx.beginPath()
    ctx.arc(centerX - headSize * 0.15, centerY - headSize * 0.7, headSize * 0.08, 0, Math.PI * 2)
    ctx.arc(centerX + headSize * 0.15, centerY - headSize * 0.7, headSize * 0.08, 0, Math.PI * 2)
    ctx.fill()
  } else if (isEthereal) {
    // Add ethereal details
    ctx.globalAlpha = 0.6

    // Glowing aura
    const gradient = ctx.createRadialGradient(centerX, centerY, headSize * 0.5, centerX, centerY, headSize * 3)
    gradient.addColorStop(0, mainColor)
    gradient.addColorStop(1, "transparent")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(centerX, centerY, headSize * 3, 0, Math.PI * 2)
    ctx.fill()

    ctx.globalAlpha = 1
  } else {
    // Generic character details
    // Eyes
    ctx.fillStyle = "#ffffff"
    ctx.beginPath()
    ctx.arc(centerX - headSize * 0.2, centerY - headSize * 0.7, headSize * 0.1, 0, Math.PI * 2)
    ctx.arc(centerX + headSize * 0.2, centerY - headSize * 0.7, headSize * 0.1, 0, Math.PI * 2)
    ctx.fill()

    // Pupils
    ctx.fillStyle = "#000000"
    ctx.beginPath()
    ctx.arc(centerX - headSize * 0.2, centerY - headSize * 0.7, headSize * 0.05, 0, Math.PI * 2)
    ctx.arc(centerX + headSize * 0.2, centerY - headSize * 0.7, headSize * 0.05, 0, Math.PI * 2)
    ctx.fill()
  }

  // Add some random details based on the prompt hash
  const promptHash = prompt.split("").reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
  }, 0)

  // Add some particles or details around the character
  const detailColor = getRandomColor(prompt + "particles")
  const particleCount = 50 + (Math.abs(promptHash) % 100)

  for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = headSize * (1 + Math.random() * 2)
    const x = centerX + Math.cos(angle) * distance
    const y = centerY + Math.sin(angle) * distance
    const size = 1 + Math.random() * 3

    ctx.fillStyle = `${detailColor}${Math.floor(Math.random() * 99 + 1)
      .toString(16)
      .padStart(2, "0")}`
    ctx.beginPath()
    ctx.arc(x, y, size, 0, Math.PI * 2)
    ctx.fill()
  }
}

// Motion effects pattern generator
const generateMotionFxPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  // Clear canvas
  ctx.clearRect(0, 0, width, height)

  // Generate colors from prompt
  const baseColor = getRandomColor(prompt)
  const secondaryColor = getRandomColor(prompt + "secondary")

  // Check for specific effect types in the prompt
  const words = prompt.toLowerCase().split(" ")
  const isParticles = words.some((word) => ["particle", "dust", "sparkle", "glitter"].includes(word))
  const isWaves = words.some((word) => ["wave", "ripple", "water", "flow"].includes(word))
  const isFire = words.some((word) => ["fire", "flame", "burn", "hot"].includes(word))

  // Create a radial gradient for the base
  const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7)

  gradient.addColorStop(0, `${baseColor}10`)
  gradient.addColorStop(0.7, `${baseColor}05`)
  gradient.addColorStop(1, "transparent")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  if (isParticles) {
    // Generate particle effect
    const particleCount = 200

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 1 + Math.random() * 4

      // Distance from center affects opacity
      const dx = x - width / 2
      const dy = y - height / 2
      const distance = Math.sqrt(dx * dx + dy * dy)
      const maxDistance = Math.sqrt(width * width + height * height) / 2
      const opacity = 0.2 + 0.8 * (1 - distance / maxDistance)

      ctx.fillStyle = `${baseColor}${Math.floor(opacity * 255)
        .toString(16)
        .padStart(2, "0")}`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  } else if (isWaves) {
    // Generate wave effect
    const waveCount = 5

    for (let w = 0; w < waveCount; w++) {
      ctx.strokeStyle = `${baseColor}${Math.floor((0.3 + 0.7 * (w / waveCount)) * 255)
        .toString(16)
        .padStart(2, "0")}`
      ctx.lineWidth = 2 + w

      ctx.beginPath()

      for (let x = 0; x < width; x += 5) {
        const frequency = 0.01 + w * 0.005
        const amplitude = 20 + w * 10
        const phase = w * 30

        const y = height / 2 + Math.sin(x * frequency + phase) * amplitude

        if (x === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }

      ctx.stroke()
    }
  } else if (isFire) {
    // Generate fire effect
    const fireHeight = height * 0.7
    const segments = 20

    for (let layer = 0; layer < 5; layer++) {
      const layerOpacity = 0.2 + 0.8 * (1 - layer / 5)

      ctx.fillStyle =
        layer % 2 === 0
          ? `${baseColor}${Math.floor(layerOpacity * 255)
              .toString(16)
              .padStart(2, "0")}`
          : `${secondaryColor}${Math.floor(layerOpacity * 255)
              .toString(16)
              .padStart(2, "0")}`

      ctx.beginPath()
      ctx.moveTo(0, height)

      for (let i = 0; i <= segments; i++) {
        const x = width * (i / segments)
        const randomHeight = Math.random() * fireHeight * 0.4
        const y = height - Math.sin((i / segments) * Math.PI) * fireHeight - randomHeight - layer * 20

        if (i === 0) {
          ctx.lineTo(x, height)
        } else {
          ctx.lineTo(x, Math.max(y, 0))
        }
      }

      ctx.lineTo(width, height)
      ctx.closePath()
      ctx.fill()
    }
  } else {
    // Generic motion effect - swirls
    const swirls = 3

    for (let s = 0; s < swirls; s++) {
      const centerX = width * (0.3 + Math.random() * 0.4)
      const centerY = height * (0.3 + Math.random() * 0.4)
      const maxRadius = width * 0.3

      for (let r = 0; r < maxRadius; r += 5) {
        const opacity = 0.1 + 0.2 * (1 - r / maxRadius)
        ctx.strokeStyle = `${baseColor}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
        ctx.lineWidth = 2

        ctx.beginPath()

        for (let angle = 0; angle < Math.PI * 8; angle += 0.1) {
          const radius = r * (1 + 0.2 * Math.sin(angle * 3))
          const x = centerX + radius * Math.cos(angle)
          const y = centerY + radius * Math.sin(angle)

          if (angle === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      }
    }
  }
}

// Filter pattern generator
const generateFilterPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  // For filters, we'll create a semi-transparent overlay
  ctx.clearRect(0, 0, width, height)

  // Check for specific filter types in the prompt
  const words = prompt.toLowerCase().split(" ")

  const isVintage = words.some((word) => ["vintage", "retro", "old", "film"].includes(word))
  const isNeon = words.some((word) => ["neon", "glow", "cyberpunk", "synthwave"].includes(word))
  const isDream = words.some((word) => ["dream", "ethereal", "soft", "hazy"].includes(word))

  if (isVintage) {
    // Vintage film grain effect
    ctx.fillStyle = "rgba(255, 240, 220, 0.2)" // Slight sepia tone
    ctx.fillRect(0, 0, width, height)

    // Add film grain
    for (let i = 0; i < 20000; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * 2
      const opacity = Math.random() * 0.1

      ctx.fillStyle = Math.random() > 0.5 ? `rgba(0, 0, 0, ${opacity})` : `rgba(255, 255, 255, ${opacity})`

      ctx.fillRect(x, y, size, size)
    }

    // Add some scratches
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
    ctx.lineWidth = 1

    for (let i = 0; i < 20; i++) {
      const x = Math.random() * width
      const length = 20 + Math.random() * 100

      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, length)
      ctx.stroke()
    }

    // Vignette effect
    const gradient = ctx.createRadialGradient(width / 2, height / 2, width * 0.3, width / 2, height / 2, width * 0.7)

    gradient.addColorStop(0, "rgba(0, 0, 0, 0)")
    gradient.addColorStop(1, "rgba(0, 0, 0, 0.3)")

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  } else if (isNeon) {
    // Neon glow effect
    const neonColor = getRandomColor(prompt)

    // Add bloom effect
    const bloomGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7)

    bloomGradient.addColorStop(0, `${neonColor}30`)
    bloomGradient.addColorStop(1, "transparent")

    ctx.fillStyle = bloomGradient
    ctx.fillRect(0, 0, width, height)

    // Add scanlines
    ctx.fillStyle = "rgba(0, 0, 0, 0.2)"

    for (let y = 0; y < height; y += 4) {
      ctx.fillRect(0, y, width, 2)
    }

    // Add some glitch effects
    for (let i = 0; i < 10; i++) {
      const y = Math.random() * height
      const h = 2 + Math.random() * 10
      const offset = -10 + Math.random() * 20

      ctx.fillStyle = `${neonColor}40`
      ctx.fillRect(0, y, width, h)

      // Offset duplicate
      ctx.fillStyle = `${neonColor}20`
      ctx.fillRect(offset, y, width, h)
    }
  } else if (isDream) {
    // Dreamy soft focus effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)"
    ctx.fillRect(0, 0, width, height)

    // Add soft glow
    const glowGradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7)

    const dreamColor = getRandomColor(prompt)

    glowGradient.addColorStop(0, `${dreamColor}20`)
    glowGradient.addColorStop(1, "transparent")

    ctx.fillStyle = glowGradient
    ctx.fillRect(0, 0, width, height)

    // Add some floating particles
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = 1 + Math.random() * 3
      const opacity = 0.1 + Math.random() * 0.3

      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`
      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    // Default filter - color grading
    const overlayColor = getRandomColor(prompt)

    // Color overlay
    ctx.fillStyle = `${overlayColor}20`
    ctx.fillRect(0, 0, width, height)

    // Add vignette
    const vignetteGradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      width * 0.3,
      width / 2,
      height / 2,
      width * 0.7,
    )

    vignetteGradient.addColorStop(0, "rgba(0, 0, 0, 0)")
    vignetteGradient.addColorStop(1, "rgba(0, 0, 0, 0.3)")

    ctx.fillStyle = vignetteGradient
    ctx.fillRect(0, 0, width, "rgba(0, 0, 0, 0.3)")

    ctx.fillStyle = vignetteGradient
    ctx.fillRect(0, 0, width, height)
  }
}

// Default pattern generator
const generateDefaultPattern = (ctx: CanvasRenderingContext2D, width: number, height: number, prompt: string) => {
  // Generate a simple abstract pattern
  const color1 = getRandomColor(prompt + "1")
  const color2 = getRandomColor(prompt + "2")

  // Create gradient background
  const gradient = ctx.createLinearGradient(0, 0, width, height)
  gradient.addColorStop(0, color1)
  gradient.addColorStop(1, color2)

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)

  // Add some shapes
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * width
    const y = Math.random() * height
    const size = 20 + Math.random() * 60

    ctx.fillStyle = `${getRandomColor(prompt + i)}40`

    if (i % 3 === 0) {
      // Circle
      ctx.beginPath()
      ctx.arc(x, y, size / 2, 0, Math.PI * 2)
      ctx.fill()
    } else if (i % 3 === 1) {
      // Square
      ctx.fillRect(x - size / 2, y - size / 2, size, size)
    } else {
      // Triangle
      ctx.beginPath()
      ctx.moveTo(x, y - size / 2)
      ctx.lineTo(x - size / 2, y + size / 2)
      ctx.lineTo(x + size / 2, y + size / 2)
      ctx.closePath()
      ctx.fill()
    }
  }
}
