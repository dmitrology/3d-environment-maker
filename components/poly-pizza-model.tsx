"use client"

import { useEffect, useRef, useState } from "react"
import { useGLTF } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

// Types for Poly Pizza models
interface PolyPizzaModel {
  ID: string
  Title: string
  Attribution: string
  Thumbnail: string
  Download: string
  "Tri Count": number
  Creator: {
    Username: string
    DPURL: string
  }
  Category: string
  Tags: string[]
  Licence: string
  Animated: boolean
}

export default function PolyPizzaModel({ model }: { model: PolyPizzaModel }) {
  const ref = useRef<THREE.Group>(null)
  const [error, setError] = useState<string | null>(null)
  const [gltf, setGltf] = useState<any>(null) // Initialize gltf as null

  useEffect(() => {
    let gltfModel: any = null
    try {
      gltfModel = useGLTF.getState().cache.get(model.Download) || useGLTF(model.Download)
      setGltf(gltfModel)
    } catch (err) {
      console.error("Error loading model:", err)
      setError(err instanceof Error ? err.message : "Unknown error")
    }
  }, [model.Download])

  // Auto-rotate the model
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3
    }
  })

  // Center and scale the model appropriately
  useEffect(() => {
    if (ref.current && gltf && gltf.scene) {
      // Create a bounding box for the model
      const box = new THREE.Box3().setFromObject(ref.current)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)

      // Scale the model to a reasonable size
      const scale = 2 / maxDim
      ref.current.scale.set(scale, scale, scale)

      // Center the model
      const center = box.getCenter(new THREE.Vector3())
      ref.current.position.x = -center.x * scale
      ref.current.position.y = -center.y * scale
      ref.current.position.z = -center.z * scale
    }
  }, [gltf])

  if (error) {
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    )
  }

  if (!gltf) {
    return (
      <mesh>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="blue" />
      </mesh>
    )
  }

  return <primitive ref={ref} object={gltf.scene} />
}
