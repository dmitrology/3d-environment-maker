"use client"

import { Suspense } from "react"
import { SafeLoading } from "./html-wrapper"
import { withCanvasCheck } from "./canvas-context"
import dynamic from "next/dynamic"

// Dynamically import components that use R3F hooks
const DynamicRemoteModel = dynamic(() => import("./remote-model").then((mod) => ({ default: mod.RemoteModel })), {
  ssr: false,
  loading: () => <SafeLoading message="Loading remote model..." />,
})

const DynamicProceduralModel = dynamic(
  () => import("./procedural-model").then((mod) => ({ default: mod.ProceduralModel })),
  {
    ssr: false,
    loading: () => <SafeLoading message="Loading procedural model..." />,
  },
)

type Props = {
  modelUrl?: string
  type: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}

// Base component that will be wrapped with Canvas check
function HybridModelBase({ modelUrl, type, position, rotation = [0, 0, 0], scale = 1 }: Props) {
  return (
    <Suspense fallback={<SafeLoading message={`Loading ${type}...`} />}>
      {modelUrl ? (
        <DynamicRemoteModel url={modelUrl} position={position} rotation={rotation} scale={scale} />
      ) : (
        <DynamicProceduralModel type={type} position={position} rotation={rotation} scale={scale} />
      )}
    </Suspense>
  )
}

// Export the wrapped version that's safe to use
export const HybridModel = withCanvasCheck(HybridModelBase)
