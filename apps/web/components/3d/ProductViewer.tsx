'use client'
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stage } from '@react-three/drei'

// The Actual 3D Mesh
function Model({ color, texture }: { color: string, texture: string }) {
  const meshRef = useRef<any>(null);
  
  // Auto-rotate animation
  useFrame((state, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef}>
      {/* Simple Cube for Demo (Replace with useGLTF for real models) */}
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color} 
        roughness={texture === 'Leather' ? 0.8 : 0.2} 
        metalness={texture === 'Metal' ? 0.8 : 0}
      />
    </mesh>
  )
}

export default function ProductViewer({ config }: { config: any }) {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
        <Stage environment="city" intensity={0.6}>
          <Model color={config.color} texture={config.texture} />
        </Stage>
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  )
}
