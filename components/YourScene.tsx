"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef, useState } from "react"
import type { Mesh } from "three"

// Simple cube component with animation
function AnimatedCube({ color = "#801650", position = [0, 0, 0] }) {
  const meshRef = useRef<Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? "#ff2080" : color} />
    </mesh>
  )
}

export default function YourScene() {
  return (
    <Canvas shadows camera={{ position: [0, 2, 5], fov: 50 }}>
      <color attach="background" args={["#050505"]} />

      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />

      {/* Simple scene with multiple cubes */}
      <AnimatedCube position={[0, 0, 0]} />
      <AnimatedCube position={[-2, 0, -2]} color="#2080ff" />
      <AnimatedCube position={[2, 0, -2]} color="#20ff80" />

      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <OrbitControls enableDamping dampingFactor={0.05} minDistance={2} maxDistance={10} />
    </Canvas>
  )
}
