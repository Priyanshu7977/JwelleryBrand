import React, { useEffect, useRef, useState } from 'react';
import { ProductStage3D } from '../canvas/ProductStage3D';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import { Sparkles, ArrowDown, Eye, ShoppingBag, Volume2, VolumeX, ArrowRight, Film } from 'lucide-react';
import { atelierSound } from '../../utils/audioAtelier';

export const Section01Arrival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);
  const hasAutoStartedAudio = useRef<boolean>(false);

  const [scrollFraction, setScrollFraction] = useState(0);
  const [videoDuration, setVideoDuration] = useState<number>(0);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [videoError, setVideoError] = useState<boolean>(false);
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

  // Track scroll position across the 380vh track
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollable = rect.height - windowHeight;
      const progress = totalScrollable > 0 ? Math.min(1, Math.max(0, -rect.top / totalScrollable)) : 0;
      setScrollFraction(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const hasTriggeredVideoEnd = useRef<boolean>(false);

  // Automatically start music and trigger post-video login as soon as user scrolls past the film sequence
  useEffect(() => {
    if (scrollFraction >= 0.32 && !hasTriggeredVideoEnd.current) {
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

  // Update target time and lerp video playback frame smoothly (0.00 - 0.35)
  useEffect(() => {
    const videoPhaseProgress = Math.min(1, Math.max(0, scrollFraction / 0.32));
    if (videoDuration > 0) {
      targetTimeRef.current = videoPhaseProgress * videoDuration;
    }

    const renderLoop = () => {
      const vid = videoRef.current;
      if (vid && !isNaN(vid.duration) && vid.duration > 0 && vid.readyState >= 2) {
        const diff = targetTimeRef.current - vid.currentTime;
        if (Math.abs(diff) > 0.01) {
          vid.currentTime += diff * 0.25;
        }
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };

    rafRef.current = requestAnimationFrame(renderLoop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [scrollFraction, videoDuration]);

  const onLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration || 5);
      setVideoLoaded(true);
      videoRef.current.currentTime = 0;
    }
  };

  // Phase Calculations:
  // Phase 1 (0.00 - 0.34): Pure Fullscreen Fashion Video Intro (Only Video + Celestia Logo)
  // Phase 2 (0.34 - 0.44): Smooth Dissolve Transition
  // Phase 3 (0.44 - 1.00): Spatial 3D Kinetic Universe & Main Home Screen Reveal
  const isVideoPhase = scrollFraction < 0.40;
  const videoOpacity = Math.max(0, Math.min(1, 1 - (scrollFraction - 0.28) * 8.0));
  const videoScale = 1 + scrollFraction * 0.10;

  // 3D progress for WebGL canvas
  const threeDProgress = Math.max(0, Math.min(1, (scrollFraction - 0.38) / 0.62));

  // Kinetic Spatial Typography Opacities & Transforms
  const intro3DOpacity = Math.max(0, Math.min(1, 1 - Math.abs(scrollFraction - 0.48) * 6.5));
  const wearOpacity = Math.max(0, Math.min(1, 1 - Math.abs(scrollFraction - 0.62) * 5.5));
  const yourOpacity = Math.max(0, Math.min(1, 1 - Math.abs(scrollFraction - 0.78) * 5.5));
  const worldOpacity = Math.max(0, Math.min(1, (scrollFraction - 0.88) * 8.0));

  const wearTransform = `translateY(${(0.62 - scrollFraction) * 100}px) scale(${1 + (0.62 - scrollFraction) * 0.2})`;
  const yourTransform = `translateY(${(0.78 - scrollFraction) * 100}px) scale(${1 + (0.78 - scrollFraction) * 0.2})`;
  const worldTransform = `translateY(${(0.95 - scrollFraction) * 80}px) scale(${1 + (0.95 - scrollFraction) * 0.15})`;

  // Sequential Real Piece Card Appearances (Clean margins, zero text overlap)
  const p1CardOpacity = Math.max(0, Math.min(1, 1 - Math.abs(scrollFraction - 0.64) * 5.0));
  const p1CardTranslateX = (0.64 - scrollFraction) * 80;

  const p2CardOpacity = Math.max(0, Math.min(1, (scrollFraction - 0.84) * 6.0));
  const p2CardTranslateX = (0.92 - scrollFraction) * 60;

  // Video progress indicator
  const filmProgressPercent = Math.min(100, Math.round((scrollFraction / 0.32) * 100));

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[380vh] bg-pearl-100 selection:bg-champagne-300"
      id="section-arrival"
    >
      {/* Fixed Fullscreen Viewport (100vw x 100vh) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
        
        {/* ========================================================================= */}
        {/* LAYER 1: PURE CINEMATIC FULLSCREEN VIDEO INTRO (ONLY VIDEO + LOGO) (0-38%) */}
        {/* ========================================================================= */}
        <div
          style={{
            opacity: videoOpacity,
            pointerEvents: isVideoPhase ? 'auto' : 'none',
            transform: `scale(${videoScale})`,
          }}
          className="absolute inset-0 z-20 bg-espresso-deep overflow-hidden transition-opacity duration-300"
        >
          {/* Real Video Element */}
          <video
            ref={videoRef}
            src="/videos/celestia-opening.mp4"
            onLoadedMetadata={onLoadedMetadata}
            onError={() => setVideoError(true)}
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          />

          {/* Luxury Video Fallback / Animated Stage (if video file is pending upload) */}
          {(videoError || !videoLoaded) && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#181411] via-[#241E1A] to-[#120F0D] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-25" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D8C39A]/15 rounded-full blur-3xl animate-pulse" />
            </div>
          )}

          {/* ONLY CELESTIA LOGO + VIDEO CENTER OVERLAY */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between items-center p-6 md:p-12 pointer-events-none">
            
            {/* Top Empty Spacing */}
            <div className="h-10" />

            {/* Pure Center Celestia Logo */}
            <div className="text-center space-y-4 max-w-xl px-6">
              <h1 className="font-serif-luxury text-6xl sm:text-8xl md:text-9xl text-[#FAF7F0] uppercase tracking-tight leading-[0.88] drop-shadow-2xl">
                CEL<span className="italic font-light lowercase text-[#D8C39A]">estia</span>
              </h1>

              <p className="text-xs sm:text-sm font-sans tracking-[0.38em] uppercase text-[#D8C39A] font-bold drop-shadow-md">
                redefined for all.
              </p>
            </div>

            {/* Bottom Minimal Scroll Callout */}
            <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-[#D8C39A]/40 text-xs font-mono uppercase tracking-widest text-[#FAF7F0] font-bold shadow-2xl mb-4">
              <span>Scroll To Play Film</span>
              <ArrowDown className="w-4 h-4 text-[#D8C39A] animate-bounce" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 2: ANIMATED 3D KINETIC HERO & MAIN HOME SCREEN (38% - 100%)         */}
        {/* ========================================================================= */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 bg-pearl-100">
          
          {/* Soft Ambient Background Radiance */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-champagne-200/40 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-[700px] h-[700px] bg-blush-100/50 rounded-full blur-3xl" />
            <div className="absolute inset-0 bg-noise opacity-30" />
          </div>

          {/* 3D WebGL Real Product Stage Layer */}
          <div className="absolute inset-0 z-0 pointer-events-auto">
            <ProductStage3D scrollProgress={threeDProgress} />
          </div>

          {/* Top Header Identity Info */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-[1500px] mx-auto pt-16 md:pt-12">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span>Live Catalogue Campaign MMXXVI</span>
              </span>
              <p className="font-serif italic text-sm md:text-base text-obsidian-soft font-medium">
                Featuring Real Celestia Jewellery & Bespoke Keepsake Hampers
              </p>
            </div>

            {/* Sound & Atmosphere Micro-toggle */}
            <button
              onClick={toggleAudio}
              className={`flex items-center gap-2.5 px-5 h-11 rounded-full border transition-all text-xs font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-md ${
                isAudioActive
                  ? 'bg-champagne-300 border-gold-dark text-obsidian shadow-gold-dark/20'
                  : 'border-champagne-300/80 bg-pearl-50/90 hover:bg-white text-obsidian'
              }`}
              aria-label="Toggle atmospheric sound"
            >
              {isAudioActive ? (
                <Volume2 className="w-4 h-4 text-gold-dark animate-pulse" />
              ) : (
                <VolumeX className="w-4 h-4 text-obsidian" />
              )}
              <span>{isAudioActive ? 'Atelier Sound: ON' : 'Atelier Sound: OFF'}</span>
            </button>
          </div>

          {/* Center Spatial Typography & Animated Piece Presentation */}
          <div className="relative z-10 flex-1 flex items-center justify-center pointer-events-none">
            
            {/* 3D Moment 01: Initial Brand Monument (0.42 - 0.55) */}
            <div
              style={{
                opacity: intro3DOpacity,
                transform: `scale(${0.96 + (scrollFraction - 0.42) * 0.1})`,
                pointerEvents: intro3DOpacity > 0.4 ? 'auto' : 'none',
              }}
              className="text-center space-y-5 max-w-2xl px-4 transition-all duration-200"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-champagne-100/95 border border-champagne-300/80 backdrop-blur-sm text-xs uppercase font-mono tracking-widest text-obsidian font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <span>400+ Handcrafted Pieces • Mumbai Studio</span>
              </div>

              <h1 className="font-serif-luxury text-6xl sm:text-8xl md:text-9xl text-obsidian font-normal tracking-tight uppercase leading-[0.88]">
                CEL<span className="italic font-light lowercase text-gold-dark">estia</span>
              </h1>

              <p className="font-sans text-sm sm:text-base md:text-lg tracking-[0.34em] uppercase text-obsidian-soft font-semibold max-w-xl mx-auto">
                redefined for all.
              </p>

              <p className="font-serif italic text-xl sm:text-2xl text-obsidian font-normal max-w-lg mx-auto leading-snug">
                "Fine jewellery, artisanal bangles, and celebration hampers made to be worn with joy."
              </p>
            </div>

            {/* 3D Moment 02: Spatial Word "WEAR" (0.55 - 0.72) */}
            <div
              style={{
                opacity: wearOpacity,
                transform: wearTransform,
              }}
              className="absolute inset-0 flex items-center justify-center transition-all duration-150 pointer-events-none"
            >
              <h2 className="font-serif-luxury text-7xl sm:text-9xl md:text-[12rem] lg:text-[16rem] font-light text-obsidian/85 tracking-widest uppercase select-none drop-shadow-sm">
                WEAR
              </h2>
            </div>

            {/* 3D Moment 03: Spatial Word "YOUR" (0.72 - 0.85) */}
            <div
              style={{
                opacity: yourOpacity,
                transform: yourTransform,
              }}
              className="absolute inset-0 flex items-center justify-center transition-all duration-150 pointer-events-none"
            >
              <h2 className="font-serif-luxury text-7xl sm:text-9xl md:text-[12rem] lg:text-[16rem] font-light text-obsidian/85 tracking-widest italic select-none drop-shadow-sm">
                YOUR
              </h2>
            </div>

            {/* 3D Moment 04: Spatial Word "WORLD." + Finale CTAs (0.85 - 1.00) */}
            <div
              style={{
                opacity: worldOpacity,
                transform: worldTransform,
                pointerEvents: worldOpacity > 0.4 ? 'auto' : 'none',
              }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center space-y-6 transition-all duration-200"
            >
              <h2 className="font-serif-luxury text-6xl sm:text-8xl md:text-[10rem] lg:text-[13rem] font-light text-gold-dark tracking-widest uppercase select-none drop-shadow-md leading-none">
                WORLD.
              </h2>

              <p className="font-serif italic text-xl sm:text-2xl text-obsidian max-w-md mx-auto">
                "Where timeless charm meets everyday grace."
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a href="#section-reveal" className="btn-primary w-full sm:w-auto">
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/gifting" className="btn-secondary w-full sm:w-auto">
                  <span>Gifting Atelier</span>
                </a>
              </div>
            </div>

            {/* Animated Real Piece 01 Card (Glides in on Left during "WEAR" phase) */}
            <div
              style={{
                opacity: p1CardOpacity,
                transform: `translateX(${p1CardTranslateX}px)`,
                pointerEvents: p1CardOpacity > 0.4 ? 'auto' : 'none',
              }}
              className="absolute left-4 sm:left-8 lg:left-14 top-1/2 -translate-y-1/2 max-w-[280px] sm:max-w-xs p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft transition-all duration-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <LuxuryBadge variant="gold">Real Piece 01</LuxuryBadge>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  In Stock ({product1.availableStock})
                </span>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand">
                <img src={product1.images.hero} alt={product1.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-base text-obsidian font-bold truncate">
                  {product1.title}
                </h3>
                <span className="font-serif text-lg text-obsidian font-bold">₹{product1.price}</span>
              </div>
              <div className="flex gap-2">
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
                  title="Inspect"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Animated Real Piece 02 Card (Glides in on Right during "WORLD." phase) */}
            <div
              style={{
                opacity: p2CardOpacity,
                transform: `translateX(${p2CardTranslateX}px)`,
                pointerEvents: p2CardOpacity > 0.4 ? 'auto' : 'none',
              }}
              className="absolute right-4 sm:right-8 lg:right-14 top-1/2 -translate-y-1/2 max-w-[280px] sm:max-w-xs p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft transition-all duration-300 space-y-3"
            >
              <div className="flex items-center justify-between">
                <LuxuryBadge variant="blush">Real Piece 02</LuxuryBadge>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Mumbai Ready
                </span>
              </div>
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand">
                <img src={product2.images.hero} alt={product2.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-base text-obsidian font-bold truncate">
                  {product2.title}
                </h3>
                <span className="font-serif text-lg text-obsidian font-bold">₹{product2.price}</span>
              </div>
              <div className="flex gap-2">
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
                  title="Inspect"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Interactive Scroll Anchor */}
          <div className="relative z-10 flex items-end justify-between w-full max-w-[1500px] mx-auto pb-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-0.5 bg-gold-dark" />
              <span className="text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
                1,000+ Journeys Dispatched • Pan-India Free Express
              </span>
            </div>

            <a
              href="#section-reveal"
              className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian hover:text-gold-dark transition-colors group cursor-pointer font-bold px-5 py-2.5 rounded-full bg-pearl-50 border border-champagne-300/80 shadow-sm"
            >
              <span>Scroll To Enter Collection</span>
              <ArrowDown className="w-4 h-4 text-gold-dark group-hover:translate-y-1 transition-transform" />
            </a>
          </div>

        </div>

      </div>
    </section>
  );
};
