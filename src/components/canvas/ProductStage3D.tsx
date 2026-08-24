import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

interface ProductMesh3DProps {
  scrollProgress: number;
}

// Sculptural Luxury 3D Gold Ribbon / Ring Showcase
const LuxuryJewellerySculpture: React.FC<ProductMesh3DProps> = ({ scrollProgress }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const gemRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pointerX = state.pointer.x * 0.3;
    const pointerY = state.pointer.y * 0.3;

    if (groupRef.current) {
      groupRef.current.position.x = pointerX;
      groupRef.current.position.y = pointerY;
      groupRef.current.rotation.y = t * 0.15 + scrollProgress * 1.2;
    }

    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(t * 0.3) * 0.2 + 0.4;
      meshRef.current.rotation.z = Math.cos(t * 0.25) * 0.15;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.sin(t * 0.3) * 0.2 - 0.3;
      ring2Ref.current.rotation.y = t * 0.2;
    }

    if (gemRef.current) {
      gemRef.current.rotation.y = t * 0.4;
      gemRef.current.position.y = Math.sin(t * 0.8) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -0.5]}>
      {/* Outer Intertwined 18K Gold Ribbon */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={meshRef} position={[0, 0, 0]}>
          <torusKnotGeometry args={[1.4, 0.08, 128, 32, 2, 3]} />
          <meshStandardMaterial
            color="#D8C39A"
            metalness={0.92}
            roughness={0.18}
            envMapIntensity={1.5}
          />
        </mesh>
      </Float>

      {/* Inner Slender Gold Halo */}
      <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh ref={ring2Ref} position={[0, 0, 0]}>
          <torusGeometry args={[1.8, 0.03, 16, 64]} />
          <meshStandardMaterial
            color="#E8D8B8"
            metalness={0.88}
            roughness={0.25}
          />
        </mesh>
      </Float>

      {/* Center Floating Faceted Solitaire Gemstone */}
      <Float speed={2.0} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh ref={gemRef} position={[0, 0, 0]}>
          <octahedronGeometry args={[0.35, 0]} />
          <meshPhysicalMaterial
            color="#FAF7F0"
            transmission={0.85}
            opacity={1}
            transparent
            roughness={0.05}
            ior={2.4}
            thickness={1.2}
            specularIntensity={1.5}
          />
        </mesh>
      </Float>

      {/* Atmospheric Golden Dust Motes */}
      <Sparkles
        count={35}
        scale={6}
        size={2.5}
        speed={0.3}
        color="#D8C39A"
        opacity={0.45}
      />
    </group>
  );
};

export const ProductStage3D: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  return (
    <div className="w-full h-full relative pointer-events-none select-none">
      <Canvas
        camera={{ position: [0, 0, 4.8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.9} color="#FFFBF5" />
        <directionalLight position={[5, 8, 5]} intensity={1.8} color="#FFF8E7" />
        <directionalLight position={[-5, -4, -3]} intensity={0.8} color="#D8C39A" />
        <pointLight position={[0, 0, 2]} intensity={1.2} color="#FFF5E1" />

        <LuxuryJewellerySculpture scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
};

export default ProductStage3D;
