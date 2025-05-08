"use client"

import { useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { CanvasDetector, HtmlDetector, HookDetector } from "@/components/r3f-diagnostics"
import { StrictHtml } from "@/components/strict-html"

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Override console methods to capture logs
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args) => {
      setLogs((prev) => [...prev, `LOG: ${args.join(" ")}`])
      originalLog.apply(console, args)
    }

    console.error = (...args) => {
      setLogs((prev) => [...prev, `ERROR: ${args.join(" ")}`])
      originalError.apply(console, args)
    }

    console.warn = (...args) => {
      setLogs((prev) => [...prev, `WARN: ${args.join(" ")}`])
      originalWarn.apply(console, args)
    }

    return () => {
      console.log = originalLog
      console.error = originalError
      console.warn = originalWarn
    }
  }, [])

  if (!isClient) {
    return <div>Loading debug page...</div>
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">R3F Debug Page</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Canvas Test</h2>
        <div className="w-full h-[300px] bg-gray-900 mb-4">
          <Canvas>
            <CanvasDetector />
            <HtmlDetector />
            <HookDetector />
            <ambientLight />
            <StrictHtml>
              <div className="bg-black/70 text-white p-2 rounded">This HTML is properly wrapped</div>
            </StrictHtml>
            <mesh>
              <boxGeometry />
              <meshStandardMaterial color="hotpink" />
            </mesh>
          </Canvas>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Console Logs</h2>
        <div className="bg-gray-900 text-white p-4 rounded h-[300px] overflow-y-auto">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`mb-1 ${log.startsWith("ERROR") ? "text-red-400" : log.startsWith("WARN") ? "text-yellow-400" : "text-green-400"}`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
