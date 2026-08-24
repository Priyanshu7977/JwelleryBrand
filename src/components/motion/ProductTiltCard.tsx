import React, { useState, useRef } from 'react';

interface ProductTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number; // default 3.5 degrees
  enableSheen?: boolean;
}

export const ProductTiltCard: React.FC<ProductTiltCardProps> = ({
  children,
  className = '',
  maxTilt = 3.5,
  enableSheen = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState<string>('none');
  const [sheenPosition, setSheenPosition] = useState<{ x: number; y: number; opacity: number }>({
    x: 0,
    y: 0,
    opacity: 0,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only enable on desktop screens
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(4px)`);
    setSheenPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100, opacity: 0.25 });
  };

  const handleMouseLeave = () => {
    setTransformStyle('perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)');
    setSheenPosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
        transformStyle: 'preserve-3d',
      }}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Luxury Specular Sheen Sweep on Mouse Move */}
      {enableSheen && (
        <div
          aria-hidden="true"
          style={{
            background: `radial-gradient(circle 180px at ${sheenPosition.x}% ${sheenPosition.y}%, rgba(255, 255, 255, ${sheenPosition.opacity}) 0%, transparent 80%)`,
            transition: 'opacity 0.3s ease',
          }}
          className="absolute inset-0 pointer-events-none z-10"
        />
      )}
      {children}
    </div>
  );
};

export default ProductTiltCard;
