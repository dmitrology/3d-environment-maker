"use client"

// Tree Model
export function TreeModel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.3, 1.5, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Foliage */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[1, 2, 8]} />
        <meshStandardMaterial color="#228B22" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Dog Model
export function DogModel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.3, 0.8, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0.5, 0.8, 0]}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      {/* Ears */}
      <mesh castShadow position={[0.6, 1.0, 0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[0.6, 1.0, -0.15]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Tail */}
      <mesh castShadow position={[-0.5, 0.5, 0]} rotation={[0, 0, Math.PI / 4]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[0.3, 0.2, 0.2]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[0.3, 0.2, -0.2]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[-0.3, 0.2, 0.2]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[-0.3, 0.2, -0.2]}>
        <capsuleGeometry args={[0.05, 0.4, 8, 8]} />
        <meshStandardMaterial color="#A0522D" roughness={0.8} />
      </mesh>
    </group>
  )
}

// Cat Model
export function CatModel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Body */}
      <mesh castShadow position={[0, 0.4, 0]}>
        <capsuleGeometry args={[0.25, 0.7, 8, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      {/* Head */}
      <mesh castShadow position={[0.45, 0.7, 0]}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      {/* Ears */}
      <mesh castShadow position={[0.55, 0.95, 0.12]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.05, 0.15, 4]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[0.55, 0.95, -0.12]} rotation={[0, 0, Math.PI / 4]}>
        <coneGeometry args={[0.05, 0.15, 4]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      {/* Tail */}
      <mesh castShadow position={[-0.4, 0.4, 0]} rotation={[0, 0, Math.PI / 2.5]}>
        <capsuleGeometry args={[0.04, 0.6, 8, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      {/* Legs */}
      <mesh castShadow position={[0.2, 0.15, 0.15]}>
        <capsuleGeometry args={[0.04, 0.3, 8, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[0.2, 0.15, -0.15]}>
        <capsuleGeometry args={[0.04, 0.3, 8, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[-0.2, 0.15, 0.15]}>
        <capsuleGeometry args={[0.04, 0.3, 8, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>

      <mesh castShadow position={[-0.2, 0.15, -0.15]}>
        <capsuleGeometry args={[0.04, 0.3, 8, 8]} />
        <meshStandardMaterial color="#808080" roughness={0.8} />
      </mesh>
    </group>
  )
}

// House Model
export function HouseModel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      {/* Main structure */}
      <mesh castShadow position={[0, 0.5, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#D3D3D3" roughness={0.8} />
      </mesh>

      {/* Roof */}
      <mesh castShadow position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[0.9, 0.5, 4]} />
        <meshStandardMaterial color="#8B0000" roughness={0.8} />
      </mesh>

      {/* Door */}
      <mesh castShadow position={[0, 0.4, 0.51]}>
        <boxGeometry args={[0.3, 0.6, 0.05]} />
        <meshStandardMaterial color="#8B4513" roughness={0.8} />
      </mesh>

      {/* Windows */}
      <mesh castShadow position={[0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#ADD8E6" roughness={0.2} metalness={0.8} />
      </mesh>

      <mesh castShadow position={[-0.3, 0.6, 0.51]}>
        <boxGeometry args={[0.2, 0.2, 0.05]} />
        <meshStandardMaterial color="#ADD8E6" roughness={0.2} metalness={0.8} />
      </mesh>
    </group>
  )
}

// Mountain Model
export function MountainModel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} rotation={rotation} scale={[scale, scale, scale]}>
      <mesh castShadow>
        <coneGeometry args={[2, 3, 4]} />
        <meshStandardMaterial color="#808080" roughness={0.9} />
      </mesh>

      {/* Snow cap */}
      <mesh castShadow position={[0, 2, 0]}>
        <coneGeometry args={[0.5, 1, 4]} />
        <meshStandardMaterial color="white" roughness={0.3} />
      </mesh>
    </group>
  )
}

// Water Model
export function WaterModel({
  position,
  rotation,
  scale,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
  scale: number
}) {
  return (
    <mesh position={position} rotation={rotation} scale={[scale, 0.1, scale]} receiveShadow>
      <boxGeometry args={[3, 0.1, 3]} />
      <meshStandardMaterial color="#4682B4" roughness={0.2} metalness={0.8} transparent opacity={0.8} />
    </mesh>
  )
}
