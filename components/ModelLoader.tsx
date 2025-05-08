"use client"

import { useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader"
import { Suspense, useEffect, useState } from "react"
import { Box, Html } from "@react-three/drei"

type Props = {
  modelUrl: string
  scale?: number | [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
}

function Fallback() {
  return (
    <Html center>
      <div style={{ color: "white", fontSize: "1rem" }}>Loading 3D model...</div>
    </Html>
  )
}

function ErrorModel() {
  return (
    <Box args={[1, 1, 1]}>
      <meshStandardMaterial color="red" />
    </Box>
  )
}

function GLTFModel({ modelUrl, scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }: Props) {
  const [loadError, setLoadError] = useState(false)
  const gltf = useLoader(GLTFLoader, modelUrl, (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath("/draco/") // Make sure decoder files are placed here!
    loader.setDRACOLoader(dracoLoader)
  })

  useEffect(() => {
    if (!gltf?.scene) setLoadError(true)
  }, [gltf])

  if (!gltf?.scene) return <ErrorModel />

  return (
    <primitive
      object={gltf.scene}
      dispose={null}
      scale={typeof scale === "number" ? [scale, scale, scale] : scale}
      position={position}
      rotation={rotation}
    />
  )
}

export default function ModelLoader(props: Props) {
  return (
    <Suspense fallback={<Fallback />}>
      <GLTFModel {...props} />
    </Suspense>
  )
}
