import React, { useEffect, useRef } from 'react';

export const Section01Arrival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure background video plays automatically
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Fallback for strict browser autoplay policies
      });
    }
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[100dvh] min-h-[500px] max-h-[1080px] bg-pearl-100 selection:bg-champagne-300 overflow-hidden"
      id="section-arrival"
    >
      {/* ===================================================================== */}
      {/* 100% PURE, FULL-SCREEN AUTOPLAYING JEWELLERY VIDEO (NO TEXT / BUTTONS)*/}
      {/* ===================================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 opacity-100 transition-opacity duration-500"
        >
          <source src="/assets/videos/hero-jewelry.mp4" type="video/mp4" />
          <source src="/assets/videos/hero-jewelry.webm" type="video/webm" />
          <source src="https://upload.wikimedia.org/wikipedia/commons/4/47/Jewellery_Maker.webm" type="video/webm" />
        </video>
      </div>
    </section>
  );
};

export default Section01Arrival;
