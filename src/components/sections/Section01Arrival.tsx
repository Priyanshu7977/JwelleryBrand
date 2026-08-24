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
      className="relative w-full h-[100dvh] min-h-[580px] max-h-[1080px] bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-end pb-10 sm:pb-14 md:pb-16 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden"
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
      {/* CONCISE TITLE, DESCRIPTION & 2 ACTION BUTTONS                         */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto space-y-3.5 sm:space-y-4">
        
        {/* Concise Luxury Headline & Description */}
        <div className="max-w-xl lg:max-w-2xl space-y-2 text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold uppercase tracking-tight text-obsidian leading-[1.08] drop-shadow-xs">
            Handcrafted <br />
            <span className="text-gold-dark font-semibold">Fine Jewellery</span> <br />
            Redefined For All.
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-obsidian font-semibold max-w-lg leading-relaxed drop-shadow-xs">
            Discover artisanal bangles, 18k gold dipped jewellery suites, and bespoke celebration hampers handcrafted with love in Mumbai.
          </p>
        </div>

        {/* 2 Floating Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-start gap-3 pt-1">
          {/* Button 1: Explore Collection */}
          <Link
            to="/shop"
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 rounded-full bg-obsidian/95 hover:bg-obsidian text-pearl-100 text-xs sm:text-sm uppercase font-mono tracking-widest font-bold shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 border border-white/20"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Button 2: Bespoke Gifting */}
          <Link
            to="/gifting"
            className="w-full sm:w-auto px-7 sm:px-9 py-3.5 rounded-full bg-white/95 hover:bg-white text-obsidian text-xs sm:text-sm uppercase font-mono tracking-widest font-bold shadow-2xl hover:scale-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 backdrop-blur-md border border-champagne-300/80"
          >
            <span>Bespoke Gifting</span>
            <Sparkles className="w-4 h-4 text-gold-dark" />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default Section01Arrival;
