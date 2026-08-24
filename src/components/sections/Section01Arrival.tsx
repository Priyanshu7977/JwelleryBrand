import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift } from 'lucide-react';

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
      className="relative w-full h-[100dvh] min-h-[580px] max-h-[1080px] bg-black selection:bg-champagne-300 flex flex-col justify-end pb-10 sm:pb-14 md:pb-16 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden"
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
          className="absolute inset-0 w-full h-full object-cover object-center scale-100 opacity-90 transition-opacity duration-500"
        >
          <source src="/assets/videos/hero-jewelry.mp4" type="video/mp4" />
          <source src="/assets/videos/hero-jewelry.webm" type="video/webm" />
          <source src="https://upload.wikimedia.org/wikipedia/commons/4/47/Jewellery_Maker.webm" type="video/webm" />
        </video>

        {/* High-contrast dark gradient overlay for 100% crystal-clear white text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
      </div>

      {/* ===================================================================== */}
      {/* HIGH-CONTRAST WHITE TEXT & 2 ACTION BUTTONS                           */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-4">
        
        {/* Luxury White Headline & Description */}
        <div className="max-w-xl lg:max-w-2xl space-y-3 text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold uppercase tracking-tight text-white leading-[1.06] drop-shadow-2xl">
            Handcrafted <br />
            <span className="text-champagne-200 font-bold">Fine Jewellery</span> <br />
            Redefined For All.
          </h1>

          <p className="text-xs sm:text-base md:text-lg text-white font-medium max-w-xl leading-relaxed drop-shadow-lg">
            Discover artisanal bangles, 18k gold dipped jewellery suites, and custom celebration gift hampers handcrafted with love in Mumbai.
          </p>
        </div>

        {/* 2 Floating Action Buttons with Simple, Intuitive Labels */}
        <div className="flex flex-col sm:flex-row items-center justify-start gap-3.5 pt-2">
          {/* Button 1: Explore Collection */}
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-white hover:bg-pearl-100 text-obsidian text-xs sm:text-sm uppercase font-mono tracking-widest font-bold shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-white"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4 text-obsidian" />
          </Link>

          {/* Button 2: Custom Gift Hampers (Simplified friendly wording) */}
          <Link
            to="/gifting"
            className="w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-black/60 hover:bg-black/80 text-white text-xs sm:text-sm uppercase font-mono tracking-widest font-bold shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 backdrop-blur-md border border-white/60"
          >
            <span>Gift Hampers</span>
            <Gift className="w-4 h-4 text-champagne-300" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Section01Arrival;
