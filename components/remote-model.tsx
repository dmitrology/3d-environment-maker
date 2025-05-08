"use client"

import { useGLTF } from "@react-three/drei"
import { useEffect, useState } from "react"
import * as THREE from "three"
import { withCanvasCheck } from "./canvas-context"

type Props = {
  url: string
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
}

// Base component that will be wrapped with Canvas check
function RemoteModelBase({ url, position, rotation, scale = 1 }: Props) {
  const [modelScale, setModelScale] = useState(scale)
  const { scene } = useGLTF(url)

  useEffect(() => {
    if (scene) {
      // Auto-scale the model based on its bounding box
      const box = new THREE.Box3().setFromObject(scene)
      const size = box.getSize(new THREE.Vector3())
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 0) {
        setModelScale(scale / maxDim)
      }
    }
  }, [scene, scale])

  return (
    <primitive object={scene} position={position} rotation={rotation} scale={[modelScale, modelScale, modelScale]} />
  )
}

// Export the wrapped version that's safe to use
export const RemoteModel = withCanvasCheck(RemoteModelBase)
