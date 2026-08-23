import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';

interface ProductMesh3DProps {
  scrollProgress: number;
}

// Error Boundary for WebGL safety
class WebGLErrorBoundary extends React.Component<{ children: React.ReactNode; fallback: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("WebGL notice: falling back to 3D CSS stage", error);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const ProductPhysicalCard: React.FC<{
  imageUrl: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}> = ({ imageUrl, position, rotation = [0, 0, 0], scale = [1, 1, 1] }) => {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageUrl,
      (tex) => {
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        setTexture(tex);
      },
      undefined,
      (err) => {
        console.warn("Failed to load texture for 3D card, using pearl finish", err);
      }
    );
  }, [imageUrl]);

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {/* Front Bevel Frame in Warm Champagne Gold */}
      <mesh position={[0, 0, -0.04]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 3.2, 0.06]} />
        <meshStandardMaterial
          color="#DFC392"
          metalness={0.88}
          roughness={0.22}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Pearl Inset Casing */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[2.42, 3.12, 0.05]} />
        <meshPhysicalMaterial
          color="#FAF8F5"
          roughness={0.15}
          clearcoat={0.9}
        />
      </mesh>

      {/* Main Real Product Image Texture Surface */}
      <mesh position={[0, 0, 0.025]} castShadow>
        <planeGeometry args={[2.3, 3.0]} />
        {texture ? (
          <meshStandardMaterial
            map={texture}
            roughness={0.3}
            metalness={0.05}
            side={THREE.DoubleSide}
          />
        ) : (
          <meshPhysicalMaterial
            color="#FAF8F5"
            roughness={0.2}
            clearcoat={1.0}
          />
        )}
      </mesh>

      {/* Floating Gold Halo Ring around the Product */}
      <mesh position={[0, 0, -0.1]} rotation={[Math.PI / 4, Math.PI / 6, 0]}>
        <torusGeometry args={[2.2, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#C8AD7F"
          metalness={0.95}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
};

const ProductsScene: React.FC<ProductMesh3DProps> = ({ scrollProgress }) => {
  const group1Ref = useRef<THREE.Group>(null);
  const group2Ref = useRef<THREE.Group>(null);
  const masterGroupRef = useRef<THREE.Group>(null);

  const product1 = FEATURED_PRODUCTS[0]; // pink and blue bangle set of 2 (₹500)
  const product2 = FEATURED_PRODUCTS[1]; // Desi Barbie Hamper (₹999)

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const pointerX = state.pointer.x * 0.35;
    const pointerY = state.pointer.y * 0.35;

    if (masterGroupRef.current) {
      masterGroupRef.current.position.x = pointerX;
      masterGroupRef.current.position.y = pointerY;
    }

    if (group1Ref.current) {
      const p1Progress = Math.min(1, Math.max(0, scrollProgress * 2.2));
      if (scrollProgress < 0.5) {
        group1Ref.current.position.z = -2.5 + p1Progress * 3.2;
        group1Ref.current.position.y = Math.sin(t * 0.8) * 0.08 + (0.2 - scrollProgress) * 1.2;
        group1Ref.current.position.x = 0;
        group1Ref.current.rotation.y = Math.sin(t * 0.5) * 0.15 + (0.25 - scrollProgress) * 1.5;
        group1Ref.current.rotation.x = Math.cos(t * 0.4) * 0.08;
        group1Ref.current.scale.setScalar(0.75 + p1Progress * 0.45);
      } else {
        const exitProgress = (scrollProgress - 0.5) * 2;
        group1Ref.current.position.z = 0.7 - exitProgress * 4.0;
        group1Ref.current.position.x = -exitProgress * 3.5;
        group1Ref.current.rotation.y = -exitProgress * 1.2;
      }
    }

    if (group2Ref.current) {
      if (scrollProgress < 0.4) {
        group2Ref.current.position.z = -10;
        group2Ref.current.scale.setScalar(0.01);
      } else {
        const p2Progress = Math.min(1, Math.max(0, (scrollProgress - 0.4) * 2.2));
        group2Ref.current.position.z = -5.0 + p2Progress * 5.8;
        group2Ref.current.position.y = Math.sin(t * 0.7 + 1) * 0.08 + (0.7 - scrollProgress) * 1.5;
        group2Ref.current.position.x = (1 - p2Progress) * 2.5;
        group2Ref.current.rotation.y = Math.sin(t * 0.5) * 0.12 - (0.75 - scrollProgress) * 1.5;
        group2Ref.current.rotation.x = Math.cos(t * 0.4) * 0.06;
        group2Ref.current.scale.setScalar(0.6 + p2Progress * 0.55);
      }
    }
  });

  return (
    <group ref={masterGroupRef}>
      {/* Real Product 01: pink and blue bangle set of 2 (₹500) */}
      <group ref={group1Ref} position={[0, 0, -2.5]}>
        <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
          <ProductPhysicalCard
            imageUrl={product1.images.hero}
            position={[0, 0, 0]}
          />
        </Float>
      </group>

      {/* Real Product 02: Desi Barbie Hamper (₹999) */}
      <group ref={group2Ref} position={[2, 0, -6]}>
        <Float speed={1.6} rotationIntensity={0.3} floatIntensity={0.4}>
          <ProductPhysicalCard
            imageUrl={product2.images.hero}
            position={[0, 0, 0]}
          />
        </Float>
      </group>
    </group>
  );
};

// CSS 3D Fallback Stage
const CSS3DFallbackStage: React.FC<{ scrollProgress: number }> = ({ scrollProgress }) => {
  const p1 = FEATURED_PRODUCTS[0];
  const p2 = FEATURED_PRODUCTS[1];

  const p1Opacity = Math.max(0, Math.min(1, 1 - (scrollProgress - 0.2) * 3));
  const p2Opacity = Math.max(0, Math.min(1, (scrollProgress - 0.4) * 3));

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden pointer-events-none">
      {/* Product 01 Card */}
      <div
        style={{
          opacity: p1Opacity,
          transform: `scale(${0.8 + scrollProgress * 0.4}) translateY(${(0.2 - scrollProgress) * 80}px) rotateY(${scrollProgress * 20}deg)`,
        }}
        className="absolute w-64 md:w-80 aspect-[4/5] rounded-3xl p-3 bg-gradient-to-b from-champagne-300/80 to-champagne-100 shadow-2xl transition-all duration-300 border border-champagne-400"
      >
        <div className="w-full h-full rounded-2xl overflow-hidden bg-pearl-50 shadow-inner">
          <img src={p1.images.hero} alt={p1.title} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Product 02 Card */}
      <div
        style={{
          opacity: p2Opacity,
          transform: `scale(${0.7 + (scrollProgress - 0.4) * 0.4}) translateY(${(0.7 - scrollProgress) * 80}px) rotateY(${(scrollProgress - 0.6) * -20}deg)`,
        }}
        className="absolute w-64 md:w-80 aspect-[4/5] rounded-3xl p-3 bg-gradient-to-b from-champagne-300/80 to-champagne-100 shadow-2xl transition-all duration-300 border border-champagne-400"
      >
        <div className="w-full h-full rounded-2xl overflow-hidden bg-pearl-50 shadow-inner">
          <img src={p2.images.hero} alt={p2.title} className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
};

export const ProductStage3D: React.FC<{ scrollProgress?: number }> = ({ scrollProgress = 0 }) => {
  return (
    <WebGLErrorBoundary fallback={<CSS3DFallbackStage scrollProgress={scrollProgress} />}>
      <div className="w-full h-full relative pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={1.1} color="#FAF8F5" />
          
          <directionalLight
            position={[4, 6, 6]}
            intensity={1.8}
            color="#FFF9F0"
            castShadow
          />

          <directionalLight
            position={[-5, -3, -2]}
            intensity={0.9}
            color="#DFCCA9"
          />

          <pointLight position={[0, 5, 2]} intensity={1.4} color="#FFFFFF" />

          <React.Suspense fallback={null}>
            <ProductsScene scrollProgress={scrollProgress} />
            <Environment preset="studio" />
          </React.Suspense>
        </Canvas>
      </div>
    </WebGLErrorBoundary>
  );
};
