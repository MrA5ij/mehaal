import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Preload } from '@react-three/drei';

interface HeroBackground3DProps {
  intensity?: number;
  color?: string;
  enableRotation?: boolean;
  rotationSpeed?: number;
}

const TorusGeometry = ({ intensity, color }: any) => {
  return (
    <mesh>
      <torusGeometry args={[1.6, 0.18, 64, 200]} />
      <meshStandardMaterial
        color={color || '#6666FF'}
        emissive={color || '#6666FF'}
        emissiveIntensity={intensity}
        roughness={0.2}
        metalness={0.6}
      />
    </mesh>
  );
};

const HeroBackground3D: React.FC<HeroBackground3DProps> = ({
  intensity = 0.4,
  color = '#6666FF',
  enableRotation = true,
  rotationSpeed = 0.25,
}) => {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        background: 'transparent',
      }}
      gl={{ antialias: true, alpha: true }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[4, 4, 4]} intensity={1.2} />
        
        <TorusGeometry intensity={intensity} color={color} />
        
        {enableRotation && (
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate
            autoRotateSpeed={rotationSpeed}
          />
        )}

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default HeroBackground3D;
