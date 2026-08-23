import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import { FloatingJewelleryMesh } from './FloatingPearl';

interface StageProps {
  scrollProgress?: number;
}

export const JewelleryStage: React.FC<StageProps> = ({ scrollProgress = 0 }) => {
  return (
    <div className="w-full h-full relative pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        className="w-full h-full"
      >
        <ambientLight intensity={0.8} />
        
        {/* Soft Warm Key Light */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.6}
          color="#FFF8EE"
        />

        {/* Soft Pearl Rim Light */}
        <directionalLight
          position={[-6, -4, -4]}
          intensity={0.9}
          color="#DFCCA9"
        />

        {/* Studio Top Diffuser */}
        <pointLight position={[0, 4, 2]} intensity={1.2} color="#FFFFFF" />

        <Suspense fallback={null}>
          <Float
            speed={1.5}
            rotationIntensity={0.6}
            floatIntensity={0.8}
            floatingRange={[-0.1, 0.1]}
          >
            <FloatingJewelleryMesh scrollProgress={scrollProgress} />
          </Float>
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};
