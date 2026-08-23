import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FloatingJewelleryProps {
  scrollProgress?: number;
}

export const FloatingJewelleryMesh: React.FC<FloatingJewelleryProps> = ({ scrollProgress = 0 }) => {
  const groupRef = useRef<THREE.Group>(null);
  const pearlRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating oscillation + scroll interaction
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15 - scrollProgress * 1.5;
      groupRef.current.rotation.y = t * 0.25 + scrollProgress * Math.PI * 1.5;
      groupRef.current.rotation.x = Math.sin(t * 0.4) * 0.1 + scrollProgress * 0.5;
      
      // Pointer subtle parallax
      const targetX = state.pointer.x * 0.4;
      const targetY = state.pointer.y * 0.4;
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.05;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.5;
      ring1Ref.current.rotation.z = Math.sin(t * 0.3) * 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.4;
      ring2Ref.current.rotation.z = Math.cos(t * 0.3) * 0.5;
    }

    if (orbitGroupRef.current) {
      orbitGroupRef.current.rotation.y = t * 0.35;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Central Iridescent Baroque Pearl */}
      <mesh ref={pearlRef} scale={[1.35, 1.6, 1.3]}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshPhysicalMaterial
          color="#FDFBF7"
          emissive="#DFCCA9"
          emissiveIntensity={0.08}
          roughness={0.12}
          metalness={0.08}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          transmission={0.15}
          ior={1.65}
          reflectivity={0.9}
          iridescence={0.85}
          iridescenceIOR={1.4}
          sheen={1.0}
          sheenRoughness={0.2}
          sheenColor="#DFC392"
        />
      </mesh>

      {/* Outer Molten Gold Moebius Ring 1 */}
      <mesh ref={ring1Ref} scale={[2.4, 2.4, 2.4]}>
        <torusGeometry args={[1, 0.045, 32, 100]} />
        <meshStandardMaterial
          color="#DFC392"
          metalness={0.92}
          roughness={0.2}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Interlocking Champagne Gold Ring 2 */}
      <mesh ref={ring2Ref} scale={[2.7, 2.7, 2.7]} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[1, 0.035, 32, 100]} />
        <meshStandardMaterial
          color="#C8AD7F"
          metalness={0.95}
          roughness={0.25}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Orbiting Satellite Pearl Droplets */}
      <group ref={orbitGroupRef}>
        <mesh position={[2.8, 0.6, 0.4]} scale={[0.3, 0.35, 0.3]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.15}
            metalness={0.1}
            clearcoat={1.0}
            iridescence={0.8}
          />
        </mesh>

        <mesh position={[-2.5, -0.8, -0.5]} scale={[0.22, 0.28, 0.22]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#FFFDF9"
            roughness={0.18}
            metalness={0.1}
            clearcoat={1.0}
            iridescence={0.8}
          />
        </mesh>

        <mesh position={[0.8, 2.6, -0.8]} scale={[0.18, 0.22, 0.18]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshPhysicalMaterial
            color="#FFFFFF"
            roughness={0.15}
            clearcoat={1.0}
            iridescence={0.9}
          />
        </mesh>
      </group>
    </group>
  );
};
