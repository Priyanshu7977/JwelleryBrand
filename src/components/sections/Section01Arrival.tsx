import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

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
      className="relative w-full h-[100dvh] min-h-[550px] max-h-[1080px] bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden"
      id="section-arrival"
    >
      {/* ===================================================================== */}
      {/* 100% PURE, FULL-SCREEN AUTOPLAYING JEWELLERY BACKGROUND VIDEO         */}
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

      {/* ===================================================================== */}
      {/* 2 FLOATING LUXURY ACTION BUTTONS                                      */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-4">
        
        {/* Button 1: Explore Collection */}
        <Link
          to="/shop"
          className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-obsidian/95 hover:bg-obsidian text-pearl-100 text-xs sm:text-sm uppercase font-mono tracking-widest font-bold shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-white/20"
        >
          <span>Explore Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Button 2: Bespoke Gifting */}
        <Link
          to="/gifting"
          className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-white/95 hover:bg-white text-obsidian text-xs sm:text-sm uppercase font-mono tracking-widest font-bold shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 backdrop-blur-md border border-champagne-300/80"
        >
          <span>Bespoke Gifting</span>
          <Sparkles className="w-4 h-4 text-gold-dark" />
        </Link>

      </div>
    </section>
  );
};

export default Section01Arrival;
