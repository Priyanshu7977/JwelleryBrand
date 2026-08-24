import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';

export const Section01Arrival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

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
      className="relative w-full h-[100dvh] min-h-[580px] max-h-[960px] bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-center pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-12 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden"
      id="section-arrival"
    >
      {/* ===================================================================== */}
      {/* 100% CLEAR, FULL-OPACITY USER JEWELLERY BACKGROUND VIDEO (NO OVERLAY) */}
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
      {/* MAIN HERO CONTENT (Ultra Clean & Minimal, No Floating Pill Badges)    */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col justify-center">
        <div className="max-w-2xl lg:max-w-3xl space-y-4 sm:space-y-5 text-left">
          
          {/* Main Luxury Headline */}
          <h1
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 150ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 150ms',
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-obsidian leading-[1.08] drop-shadow-xs"
          >
            Handcrafted <br />
            <span className="text-gold-dark font-normal italic">Fine Jewellery</span> <br />
            Redefined For All.
          </h1>

          {/* Editorial Subtitle */}
          <p
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 250ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 250ms',
            }}
            className="text-xs sm:text-sm md:text-base text-obsidian font-semibold max-w-lg leading-relaxed drop-shadow-xs"
          >
            Discover artisanal bangles, 18k gold dipped jewellery suites, and bespoke velvet celebration hampers handcrafted with love in Mumbai.
          </p>

          {/* Action CTAs */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(12px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 350ms',
            }}
            className="flex flex-row items-center gap-3 pt-1"
          >
            <a
              href="#section-reveal"
              className="btn-primary group shadow-lg hover:shadow-2xl flex items-center justify-center gap-2 px-5 sm:px-7 py-3 text-xs sm:text-sm uppercase font-bold tracking-widest text-center transition-all"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            <a
              href="/gifting"
              className="btn-secondary group flex items-center justify-center gap-2 px-5 sm:px-7 py-3 text-xs sm:text-sm uppercase font-bold tracking-widest text-center transition-all bg-white hover:bg-champagne-100 shadow-md"
            >
              <span>Gifting Atelier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 opacity-70" />
            </a>
          </div>

          {/* Trust Signals Strip */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 450ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 450ms',
            }}
            className="pt-3 border-t border-champagne-300/80 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-obsidian font-bold uppercase tracking-wider"
          >
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="text-[10px] sm:text-xs">100% Handcrafted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="text-[10px] sm:text-xs">Pan-India Express</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-dark shrink-0" />
              <span className="text-[10px] sm:text-xs">Secure Payment</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Section01Arrival;
