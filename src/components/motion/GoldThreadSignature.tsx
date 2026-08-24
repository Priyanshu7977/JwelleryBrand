import React, { useEffect, useState, useRef } from 'react';

/**
 * Celestia Gold Thread Signature
 * An ultra-refined, continuous gold SVG thread that travels between major sections
 * on the homepage, drawing and retracting in direct synchrony with scroll progress.
 */
export const GoldThreadSignature: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ticking = useRef(false);

  useEffect(() => {
    // Show after slight delay
    const timer = setTimeout(() => setIsVisible(true), 600);

    const handleScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = docHeight > 0 ? Math.min(1, Math.max(0, scrollY / docHeight)) : 0;
          setScrollProgress(progress);
          ticking.current = false;
        });
        ticking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Calculate SVG stroke-dashoffset for continuous thread drawing
  const pathLength = 2200;
  const strokeOffset = pathLength * (1 - scrollProgress);

  return (
    <div
      aria-hidden="true"
      className={`fixed right-3 sm:right-6 md:right-8 top-0 bottom-0 w-8 sm:w-10 z-20 pointer-events-none transition-opacity duration-1000 hidden md:block ${
        isVisible ? 'opacity-90' : 'opacity-0'
      }`}
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 40 2200"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="celestiaGoldThreadGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D8C39A" stopOpacity="0.2" />
            <stop offset="25%" stopColor="#C29A4B" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#E5CFA5" stopOpacity="0.95" />
            <stop offset="90%" stopColor="#B88A3B" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#D8C39A" stopOpacity="0.3" />
          </linearGradient>

          <filter id="threadGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
        </defs>

        {/* Faint Background Guide Thread */}
        <path
          d="M20,0 Q12,300 24,600 T16,1200 T24,1800 T20,2200"
          stroke="#D8C39A"
          strokeWidth="0.75"
          strokeOpacity="0.12"
          fill="none"
        />

        {/* Active Signature Drawn Gold Thread */}
        <path
          d="M20,0 Q12,300 24,600 T16,1200 T24,1800 T20,2200"
          stroke="url(#celestiaGoldThreadGrad)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeDasharray={pathLength}
          strokeDashoffset={strokeOffset}
          filter="url(#threadGlow)"
          fill="none"
          className="transition-[stroke-dashoffset] duration-200 ease-out"
        />

        {/* Leading Golden Ember / Pearl Bead */}
        {scrollProgress > 0.01 && (
          <circle
            cx={20 + Math.sin(scrollProgress * Math.PI * 4) * 4}
            cy={scrollProgress * 2200}
            r="3"
            fill="#F5DEB3"
            stroke="#C29A4B"
            strokeWidth="1"
            className="gold-thread-glow transition-all duration-150 ease-out"
          />
        )}
      </svg>
    </div>
  );
};

export default GoldThreadSignature;
