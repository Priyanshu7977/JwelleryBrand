import React, { useState, useEffect } from 'react';

const SESSION_KEY = 'celestia_atelier_opening_played';

export const CinematicAtelierOpening: React.FC = () => {
  const [shouldRender, setShouldRender] = useState<boolean>(() => {
    // Check if animation already played in this browser session
    try {
      const alreadyPlayed = sessionStorage.getItem(SESSION_KEY);
      if (alreadyPlayed) return false;
    } catch {}

    // Check prefers-reduced-motion
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    return true;
  });

  const [doorsOpen, setDoorsOpen] = useState(false);
  const [logoVisible, setLogoVisible] = useState(false);
  const [taglineVisible, setTaglineVisible] = useState(false);
  const [lightLeak, setLightLeak] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!shouldRender) return;

    // Lock page scroll during the 3.5s cinematic opening
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Timeline Sequence
    // 0.2s: Center light leak begins
    const t0 = setTimeout(() => {
      setLightLeak(true);
    }, 200);

    // 0.5s: Atelier doors begin opening outward
    const t1 = setTimeout(() => {
      setDoorsOpen(true);
    }, 500);

    // 1.0s: Celestia logo gently scales & fades in
    const t2 = setTimeout(() => {
      setLogoVisible(true);
    }, 1000);

    // 1.6s: "REDEFINED FOR ALL." appears
    const t3 = setTimeout(() => {
      setTaglineVisible(true);
    }, 1600);

    // 2.9s: Entire overlay fades out into homepage
    const t4 = setTimeout(() => {
      setFadeOut(true);
    }, 2900);

    // 3.6s: Complete unmount and unlock page scroll
    const t5 = setTimeout(() => {
      setShouldRender(false);
      document.body.style.overflow = originalOverflow;
      try {
        sessionStorage.setItem(SESSION_KEY, 'true');
      } catch {}
    }, 3600);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
      document.body.style.overflow = originalOverflow;
    };
  }, [shouldRender]);

  if (!shouldRender) return null;

  return (
    <aside
      role="status"
      aria-label="Atelier Entrance Ceremony"
      className={`fixed inset-0 z-[99999] pointer-events-none flex items-center justify-center overflow-hidden transition-opacity duration-700 ease-out bg-[#0B0908] ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* ========================================================================= */}
      {/* 1. ATMOSPHERIC ATELIER BACKDROP & RADIAL GOLD LIGHT                        */}
      {/* ========================================================================= */}
      <div className="absolute inset-0 bg-[#0B0908] pointer-events-none" />

      {/* Warm Golden Light Leak & Bloom */}
      <div
        className={`absolute inset-0 pointer-events-none transition-all duration-1000 ease-out ${
          lightLeak
            ? 'opacity-100 scale-100'
            : 'opacity-0 scale-75'
        }`}
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(216, 195, 154, 0.22) 0%, rgba(200, 168, 115, 0.08) 40%, rgba(11, 9, 8, 0.95) 75%, #0B0908 100%)',
        }}
      />

      {/* Ambient Floating Dust Motes / Gold Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-champagne-300/40 blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/2 left-2/3 w-2 h-2 rounded-full bg-gold-dark/30 blur-[1px] animate-ping" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-1 h-1 rounded-full bg-champagne-200/50" />
        <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-champagne-300/40 blur-[0.5px]" />
      </div>

      {/* ========================================================================= */}
      {/* 2. REVEALED LOGO & ATELIER EMBLEM (CENTER STAGE)                          */}
      {/* ========================================================================= */}
      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto space-y-4 pointer-events-none select-none">
        
        {/* Subtle Celestial Crest */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            logoVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-champagne-300/40 bg-gradient-to-b from-champagne-100/10 to-transparent shadow-[0_0_25px_rgba(216,195,154,0.15)] mb-3">
            <span className="text-champagne-300 text-lg font-serif">✦</span>
          </div>
        </div>

        {/* CELESTIA Main Logo */}
        <div
          className={`transition-all duration-1000 ease-out transform ${
            logoVisible
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-6 scale-90'
          }`}
        >
          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.24em] sm:tracking-[0.28em] text-pearl-50 font-normal uppercase leading-tight drop-shadow-[0_4px_30px_rgba(216,195,154,0.25)]">
            CELESTIA
          </h1>
        </div>

        {/* “REDEFINED FOR ALL.” Subtitle */}
        <div
          className={`transition-all duration-1000 ease-out transform delay-150 ${
            taglineVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="font-serif text-xs sm:text-sm md:text-base tracking-[0.35em] sm:tracking-[0.42em] text-champagne-300 font-light uppercase">
            REDEFINED FOR ALL.
          </p>

          <div className="flex items-center justify-center gap-3 pt-3">
            <span className="w-8 h-[1px] bg-gradient-to-r from-transparent to-champagne-300/40" />
            <span className="text-[9px] sm:text-[10px] font-mono tracking-[0.3em] text-pearl-100/50 uppercase font-medium">
              MUMBAI ATELIER
            </span>
            <span className="w-8 h-[1px] bg-gradient-to-l from-transparent to-champagne-300/40" />
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. LUXURY DOUBLE ATELIER DOORS (SLIDE OPEN FROM CENTER)                   */}
      {/* ========================================================================= */}
      
      {/* LEFT DOOR PANEL */}
      <div
        className="absolute top-0 bottom-0 left-0 w-1/2 z-20 overflow-hidden shadow-2xl transition-transform duration-[1800ms]"
        style={{
          transform: doorsOpen ? 'translateX(-100%)' : 'translateX(0%)',
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
          background: 'linear-gradient(135deg, #15110F 0%, #0E0C0A 50%, #080706 100%)',
          borderRight: '1px solid rgba(216, 195, 154, 0.35)',
        }}
      >
        {/* Subtle Architectural Door Paneling & Grain Accent */}
        <div className="absolute inset-4 sm:inset-8 md:inset-12 border border-champagne-400/10 rounded-sm pointer-events-none" />
        <div className="absolute inset-8 sm:inset-14 md:inset-20 border border-champagne-400/5 rounded-sm pointer-events-none" />
        
        {/* Left Half of Center Split Medallion */}
        <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border border-champagne-300/40 bg-[#15110F] shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-start pl-2 sm:pl-3">
          <div className="w-1.5 h-1.5 rounded-full bg-champagne-300/60" />
        </div>
      </div>

      {/* RIGHT DOOR PANEL */}
      <div
        className="absolute top-0 bottom-0 right-0 w-1/2 z-20 overflow-hidden shadow-2xl transition-transform duration-[1800ms]"
        style={{
          transform: doorsOpen ? 'translateX(100%)' : 'translateX(0%)',
          transitionTimingFunction: 'cubic-bezier(0.77, 0, 0.175, 1)',
          background: 'linear-gradient(225deg, #15110F 0%, #0E0C0A 50%, #080706 100%)',
          borderLeft: '1px solid rgba(216, 195, 154, 0.35)',
        }}
      >
        {/* Subtle Architectural Door Paneling & Grain Accent */}
        <div className="absolute inset-4 sm:inset-8 md:inset-12 border border-champagne-400/10 rounded-sm pointer-events-none" />
        <div className="absolute inset-8 sm:inset-14 md:inset-20 border border-champagne-400/5 rounded-sm pointer-events-none" />

        {/* Right Half of Center Split Medallion */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border border-champagne-300/40 bg-[#15110F] shadow-[0_0_20px_rgba(0,0,0,0.8)] flex items-center justify-end pr-2 sm:pr-3">
          <div className="w-1.5 h-1.5 rounded-full bg-champagne-300/60" />
        </div>
      </div>

      {/* Center Door Seam Light Glow */}
      <div
        className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] z-30 pointer-events-none transition-opacity duration-700 ease-out ${
          lightLeak && !doorsOpen ? 'opacity-100 shadow-[0_0_25px_rgba(216,195,154,0.9)]' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(to bottom, transparent, #D8C39A 30%, #FAF7F0 50%, #D8C39A 70%, transparent)',
        }}
      />

    </aside>
  );
};

export default CinematicAtelierOpening;
