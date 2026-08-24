import React, { useEffect, useRef, useState } from 'react';
import { ProductStage3D } from '../canvas/ProductStage3D';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import { Sparkles, ArrowDown, Eye, ShoppingBag, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { atelierSound } from '../../utils/audioAtelier';

export const Section01Arrival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTicking = useRef<boolean>(false);
  const hasAutoStartedAudio = useRef<boolean>(false);
  const hasTriggeredVideoEnd = useRef<boolean>(false);

  const [scrollFraction, setScrollFraction] = useState(0);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const { setQuickViewProduct, addToCart } = useCart();

  // Sync with audio engine state
  useEffect(() => {
    const unsubscribe = atelierSound.subscribe((state) => {
      setIsAudioActive(state === 'AUDIO_ENABLED');
    });
    return unsubscribe;
  }, []);

  const toggleAudio = async () => {
    if (!isAudioActive) {
      const started = await atelierSound.start();
      setIsAudioActive(started);
    } else {
      atelierSound.stop();
      setIsAudioActive(false);
    }
  };

  const product1 = FEATURED_PRODUCTS[0]; // pink and blue bangle set of 2 (₹500)
  const product2 = FEATURED_PRODUCTS[1]; // Desi Barbie Hamper (₹999)

  // Performant rAF-throttled scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;
            const totalScrollable = rect.height - windowHeight;
            const progress = totalScrollable > 0 ? Math.min(1, Math.max(0, -rect.top / totalScrollable)) : 0;
            setScrollFraction(progress);
          }
          scrollTicking.current = false;
        });
        scrollTicking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger login modal as soon as doors open past 18%
  useEffect(() => {
    if (scrollFraction >= 0.18 && !hasTriggeredVideoEnd.current) {
      hasTriggeredVideoEnd.current = true;
      window.dispatchEvent(new CustomEvent('celestia:video-ended'));

      if (!hasAutoStartedAudio.current && !isAudioActive) {
        hasAutoStartedAudio.current = true;
        atelierSound.start().then((started) => {
          setIsAudioActive(started);
        });
      }
    }
  }, [scrollFraction, isAudioActive]);

  // =========================================================================
  // 1. DOOR OPENING PHASE (0.00 - 0.25): Smooth & 100% Reversible Doors
  // =========================================================================
  const doorProgress = Math.min(1, Math.max(0, scrollFraction / 0.22));
  const easedDoorProgress = Math.pow(doorProgress, 1.15);
  const doorLeftTranslate = -easedDoorProgress * 102; // 0% to -102%
  const doorRightTranslate = easedDoorProgress * 102; // 0% to +102%
  const doorSeamOpacity = Math.max(0, 1 - doorProgress * 3.0);
  const doorOverallOpacity = doorProgress >= 0.98 ? 0 : 1;

  // Reveal Logo in Center as doors open (0.05 - 0.30)
  const logoRevealOpacity = Math.min(1, Math.max(0, (scrollFraction - 0.04) * 5.0)) * Math.max(0, 1 - (scrollFraction - 0.28) * 5.0);

  // Hero Section Reveal Progress (0.22 - 1.00)
  const heroOpacity = Math.min(1, Math.max(0, (scrollFraction - 0.18) * 6.0));
  const threeDProgress = Math.max(0, Math.min(1, (scrollFraction - 0.18) / 0.82));

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[160vh] bg-pearl-100 selection:bg-champagne-300 transform-gpu"
      id="section-arrival"
    >
      {/* Sticky Fullscreen Viewport (100vw x 100vh) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden transform-gpu">
        
        {/* ========================================================================= */}
        {/* LAYER 0: BIDIRECTIONAL ATELIER DOUBLE DOORS (0.00 - 0.25)                  */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 z-30 pointer-events-none overflow-hidden"
          style={{
            opacity: doorOverallOpacity,
            visibility: doorOverallOpacity === 0 ? 'hidden' : 'visible',
          }}
        >
          {/* Left Door Panel */}
          <div
            className="absolute top-0 bottom-0 left-0 w-1/2 overflow-hidden shadow-[10px_0_30px_rgba(0,0,0,0.8)] will-change-transform"
            style={{
              transform: `translate3d(${doorLeftTranslate}%, 0, 0)`,
              background: 'linear-gradient(135deg, #15110F 0%, #0E0C0A 50%, #080706 100%)',
              borderRight: '1px solid rgba(216, 195, 154, 0.45)',
            }}
          >
            <div className="absolute inset-4 sm:inset-8 md:inset-12 border border-[#D8C39A]/10 rounded-sm pointer-events-none" />
            <div className="absolute inset-8 sm:inset-14 md:inset-20 border border-[#D8C39A]/5 rounded-sm pointer-events-none" />
            
            {/* Left Half of Center Split Medallion */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border border-[#D8C39A]/40 bg-[#15110F] shadow-[0_0_25px_rgba(0,0,0,0.9)] flex items-center justify-start pl-2 sm:pl-3">
              <div className="w-2 h-2 rounded-full bg-[#D8C39A]/70 shadow-[0_0_8px_#D8C39A]" />
            </div>
          </div>

          {/* Right Door Panel */}
          <div
            className="absolute top-0 bottom-0 right-0 w-1/2 overflow-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.8)] will-change-transform"
            style={{
              transform: `translate3d(${doorRightTranslate}%, 0, 0)`,
              background: 'linear-gradient(225deg, #15110F 0%, #0E0C0A 50%, #080706 100%)',
              borderLeft: '1px solid rgba(216, 195, 154, 0.45)',
            }}
          >
            <div className="absolute inset-4 sm:inset-8 md:inset-12 border border-[#D8C39A]/10 rounded-sm pointer-events-none" />
            <div className="absolute inset-8 sm:inset-14 md:inset-20 border border-[#D8C39A]/5 rounded-sm pointer-events-none" />

            {/* Right Half of Center Split Medallion */}
            <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full border border-[#D8C39A]/40 bg-[#15110F] shadow-[0_0_25px_rgba(0,0,0,0.9)] flex items-center justify-end pr-2 sm:pr-3">
              <div className="w-2 h-2 rounded-full bg-[#D8C39A]/70 shadow-[0_0_8px_#D8C39A]" />
            </div>
          </div>

          {/* Center Door Seam Glowing Golden Thread */}
          <div
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px] pointer-events-none"
            style={{
              opacity: doorSeamOpacity,
              background: 'linear-gradient(to bottom, transparent, #D8C39A 30%, #FAF7F0 50%, #D8C39A 70%, transparent)',
              boxShadow: '0 0 25px rgba(216, 195, 154, 0.9)',
            }}
          />

          {/* Floating Instruction Banner on Closed Doors */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-end pb-14 z-40"
            style={{
              opacity: Math.max(0, 1 - doorProgress * 4.0),
              transform: `translateY(${doorProgress * 30}px)`,
            }}
          >
            <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/70 backdrop-blur-md border border-[#D8C39A]/50 text-xs font-mono uppercase tracking-widest text-[#FAF7F0] font-bold shadow-2xl">
              <span>Scroll Down to Open Atelier Doors</span>
              <ArrowDown className="w-4 h-4 text-[#D8C39A] animate-bounce" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 1: CENTER LOGO REVEAL IN-BETWEEN PARTING DOORS                      */}
        {/* ========================================================================= */}
        <div
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none bg-[#0E0C0A] transition-opacity duration-300"
          style={{
            opacity: logoRevealOpacity,
            visibility: logoRevealOpacity <= 0.02 ? 'hidden' : 'visible',
          }}
        >
          <div className="text-center space-y-3 px-6 max-w-xl">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full border border-champagne-300/40 bg-champagne-100/10 mb-2">
              <span className="text-champagne-300 text-lg font-serif">✦</span>
            </div>
            <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-[#FAF7F0] tracking-[0.2em] font-normal uppercase leading-tight drop-shadow-2xl">
              CELESTIA
            </h1>
            <p className="font-serif italic text-xs sm:text-sm tracking-[0.35em] text-champagne-300 font-light uppercase">
              REDEFINED FOR ALL.
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 2: GRAND CELESTIA HERO STAGE (REVEALED AFTER LOGIN & DOORS)        */}
        {/* ========================================================================= */}
        <div
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.4 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-10 flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 px-4 sm:px-8 md:px-12 lg:px-16 bg-pearl-100 transition-opacity duration-300 transform-gpu"
        >
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-gradient-radial from-champagne-200/35 to-transparent rounded-full blur-2xl" />
            <div className="absolute bottom-10 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-radial from-blush-100/40 to-transparent rounded-full blur-2xl" />
            <div className="absolute inset-0 bg-noise opacity-20" />
          </div>

          {/* 3D WebGL Product Stage */}
          <div className="absolute inset-0 z-0 pointer-events-auto opacity-75 transform-gpu">
            <ProductStage3D scrollProgress={threeDProgress} />
          </div>

          {/* Top Subheader Identity & Audio Toggle */}
          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 w-full max-w-[1500px] mx-auto">
            <div className="space-y-0.5 sm:space-y-1">
              <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span>Live Runway Campaign MMXXVI</span>
              </span>
              <p className="font-serif italic text-xs sm:text-sm text-obsidian-soft font-medium">
                Handcrafted Fine Jewellery & Bespoke Keepsake Hampers
              </p>
            </div>

            {/* Sound Micro-toggle */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2 px-4 sm:px-5 h-9 sm:h-11 rounded-full border transition-all text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                isAudioActive
                  ? 'bg-champagne-300 border-gold-dark text-obsidian shadow-gold-dark/20'
                  : 'border-champagne-300/80 bg-pearl-50/90 hover:bg-white text-obsidian'
              }`}
              aria-label="Toggle atmospheric sound"
            >
              {isAudioActive ? (
                <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark animate-pulse" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-obsidian" />
              )}
              <span>{isAudioActive ? 'Atelier Sound: ON' : 'Atelier Sound: OFF'}</span>
            </button>
          </div>

          {/* Clean Spatial 3-Column Arena */}
          <div className="relative z-10 flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center py-4 sm:py-8">
            
            {/* LEFT COLUMN: Real Piece 01 Card */}
            <div className="hidden lg:flex lg:col-span-3 justify-start animate-fade-in">
              <div className="w-full max-w-[280px] p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <LuxuryBadge variant="gold">Real Piece 01</LuxuryBadge>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    In Stock ({product1.availableStock})
                  </span>
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand">
                  <img src={product1.images.hero} alt={product1.title} className="w-full h-full object-cover" loading="eager" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base text-obsidian font-bold truncate">
                    {product1.title}
                  </h3>
                  <span className="font-serif text-lg text-obsidian font-bold">₹{product1.price}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => addToCart(product1, 1)}
                    className="flex-1 h-9 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Bag</span>
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(product1)}
                    className="w-9 h-9 border border-champagne-300/80 hover:bg-champagne-100 rounded-full text-obsidian transition-colors flex items-center justify-center"
                    title="Inspect Piece"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* CENTER COLUMN: Pristine Celestia Monument */}
            <div className="col-span-1 lg:col-span-6 text-center space-y-4 sm:space-y-5 px-3 sm:px-4 animate-fade-in">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-champagne-100/95 border border-champagne-300/80 backdrop-blur-sm text-[11px] sm:text-xs uppercase font-mono tracking-widest text-obsidian font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gold-dark" />
                <span>400+ Handcrafted Pieces • Mumbai Studio</span>
              </div>

              <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-obsidian font-normal tracking-tight uppercase leading-[0.92]">
                CEL<span className="italic font-light lowercase text-gold-dark">estia</span>
              </h1>

              <p className="font-sans text-[11px] sm:text-sm md:text-base tracking-[0.32em] uppercase text-obsidian-soft font-semibold max-w-lg mx-auto">
                redefined for all.
              </p>

              <p className="font-serif italic text-sm sm:text-lg text-obsidian font-normal max-w-md mx-auto leading-relaxed">
                "Fine jewellery, artisanal bangles, and celebration hampers made to be worn with joy."
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-1 sm:pt-2">
                <a href="#section-reveal" className="btn-primary w-full sm:w-auto shadow-md">
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/gifting" className="btn-secondary w-full sm:w-auto">
                  <span>Gifting Atelier</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Real Piece 02 Card */}
            <div className="hidden lg:flex lg:col-span-3 justify-end animate-fade-in">
              <div className="w-full max-w-[280px] p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <LuxuryBadge variant="blush">Real Piece 02</LuxuryBadge>
                  <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Mumbai Ready
                  </span>
                </div>
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand">
                  <img src={product2.images.hero} alt={product2.title} className="w-full h-full object-cover" loading="eager" />
                </div>
                <div>
                  <h3 className="font-serif-luxury text-base text-obsidian font-bold truncate">
                    {product2.title}
                  </h3>
                  <span className="font-serif text-lg text-obsidian font-bold">₹{product2.price}</span>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => addToCart(product2, 1)}
                    className="flex-1 h-9 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add Bag</span>
                  </button>
                  <button
                    onClick={() => setQuickViewProduct(product2)}
                    className="w-9 h-9 border border-champagne-300/80 hover:bg-champagne-100 rounded-full text-obsidian transition-colors flex items-center justify-center"
                    title="Inspect Piece"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>

          {/* Bottom Interactive Scroll Anchor */}
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-2.5 w-full max-w-[1500px] mx-auto pt-2">
            <div className="flex items-center gap-2.5">
              <span className="w-6 sm:w-8 h-0.5 bg-gold-dark" />
              <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
                1,000+ Journeys Dispatched • Pan-India Free Express
              </span>
            </div>

            <a
              href="#section-reveal"
              className="flex items-center gap-1.5 text-[11px] sm:text-xs uppercase font-mono tracking-widest text-obsidian hover:text-gold-dark transition-colors group cursor-pointer font-bold px-4 py-2 rounded-full bg-pearl-50 border border-champagne-300/80 shadow-sm"
            >
              <span>Scroll To Enter Collection</span>
              <ArrowDown className="w-3.5 h-3.5 text-gold-dark group-hover:translate-y-0.5 transition-transform" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};

export default Section01Arrival;
