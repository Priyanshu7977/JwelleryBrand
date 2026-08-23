import React, { useEffect, useState } from 'react';

export const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [cursorText, setCursorText] = useState<string | null>(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Check touch device or reduced motion
    if (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsTouchDevice(true);
      return;
    }

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check contextual target
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const productTarget = target.closest('[data-cursor="product"]') || target.closest('a[href^="/product/"]');
      const giftingTarget = target.closest('[data-cursor="gifting"]') || target.closest('a[href^="/gifting"]');
      const communityTarget = target.closest('[data-cursor="community"]') || target.closest('a[href^="/community"]');
      const imageTarget = target.closest('img') || target.closest('.image-zoom-container');

      if (productTarget) {
        setIsHovered(true);
        setCursorText('DISCOVER');
      } else if (giftingTarget) {
        setIsHovered(true);
        setCursorText('CREATE');
      } else if (communityTarget) {
        setIsHovered(true);
        setCursorText('STORY');
      } else if (imageTarget) {
        setIsHovered(true);
        setCursorText('VIEW');
      } else if (target.closest('button') || target.closest('a')) {
        setIsHovered(true);
        setCursorText(null);
      } else {
        setIsHovered(false);
        setCursorText(null);
      }
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updatePosition);
  }, []);

  if (isTouchDevice) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[200] overflow-hidden">
      {/* Outer Ring with Contextual Label */}
      <div
        className={`fixed rounded-full transition-transform duration-100 ease-out flex items-center justify-center -translate-x-1/2 -translate-y-1/2 ${
          cursorText
            ? 'w-16 h-16 bg-obsidian text-pearl-100 shadow-xl border border-champagne-300'
            : isHovered
            ? 'w-10 h-10 border-2 border-gold-dark/80 bg-champagne-100/30'
            : 'w-6 h-6 border border-champagne-400/80 bg-transparent'
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {cursorText && (
          <span className="text-[9px] uppercase font-mono font-bold tracking-widest animate-fade-in">
            {cursorText}
          </span>
        )}
      </div>

      {/* Tiny Center Dot */}
      {!cursorText && (
        <div
          className="fixed w-1.5 h-1.5 bg-gold-dark rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
          }}
        />
      )}
    </div>
  );
};
