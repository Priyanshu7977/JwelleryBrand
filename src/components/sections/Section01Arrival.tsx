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
  const scrollTicking = useRef<boolean>(false);
  const hasAutoStartedAudio = useRef<boolean>(false);
  const hasTriggeredVideoEnd = useRef<boolean>(false);

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

  // Automatically start music and trigger post-video login as soon as user scrolls past the film sequence
  useEffect(() => {
    if (scrollFraction >= 0.30 && !hasTriggeredVideoEnd.current) {
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

  // Video scrubber lerp loop (active only during film phase 0.00 - 0.35)
  useEffect(() => {
    if (scrollFraction > 0.38) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const videoPhaseProgress = Math.min(1, Math.max(0, scrollFraction / 0.30));
    if (videoDuration > 0) {
      targetTimeRef.current = videoPhaseProgress * videoDuration;
    }

    const renderLoop = () => {
      const vid = videoRef.current;
      if (vid && !isNaN(vid.duration) && vid.duration > 0 && vid.readyState >= 2) {
        const diff = targetTimeRef.current - vid.currentTime;
        if (Math.abs(diff) > 0.01) {
          vid.currentTime += diff * 0.30;
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
  // Phase 1 (0.00 - 0.32): Pure Fullscreen Fashion Video Intro
  // Phase 2 (0.32 - 0.55): Grand Pristine Celestia Main Screen
  // Phase 3 (0.55 - 0.78): Crazy 3D Spatial Scroll & Piece 01 Kinetic Glide-in
  // Phase 4 (0.78 - 1.00): Piece 02 Kinetic Glide-in + Finale Collection Portal
  const isVideoPhase = scrollFraction < 0.34;
  const videoOpacity = Math.max(0, Math.min(1, 1 - (scrollFraction - 0.24) * 8.0));
  const heroOpacity = Math.min(1, Math.max(0, (scrollFraction - 0.26) * 5.0));

  // 3D WebGL progress
  const threeDProgress = Math.max(0, Math.min(1, (scrollFraction - 0.30) / 0.70));

  // Center Brand Monument transforms
  const monumentProgress = Math.max(0, Math.min(1, (scrollFraction - 0.32) / 0.68));
  const monumentScale = 1 - monumentProgress * 0.06;
  const monumentTranslateY = -monumentProgress * 25;

  // Kinetic Piece 01 Card
  const p1Opacity = Math.max(0, Math.min(1, (scrollFraction - 0.48) * 5.0));
  const p1TranslateX = Math.max(0, (0.70 - scrollFraction) * 100);
  const p1Rotate = Math.max(0, (0.70 - scrollFraction) * 8);

  // Kinetic Piece 02 Card
  const p2Opacity = Math.max(0, Math.min(1, (scrollFraction - 0.68) * 5.0));
  const p2TranslateX = Math.max(0, (0.90 - scrollFraction) * 100);
  const p2Rotate = Math.max(0, (0.90 - scrollFraction) * -8);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-[320vh] bg-pearl-100 selection:bg-champagne-300 transform-gpu"
      id="section-arrival"
    >
      {/* Fixed Fullscreen Viewport (100vw x 100vh) */}
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden transform-gpu">
        
        {/* ========================================================================= */}
        {/* LAYER 1: PURE CINEMATIC FULLSCREEN VIDEO INTRO (ONLY VIDEO + LOGO) (0-32%) */}
        {/* ========================================================================= */}
        <div
          style={{
            opacity: videoOpacity,
            pointerEvents: isVideoPhase ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-20 bg-espresso-deep overflow-hidden transition-opacity duration-300 transform-gpu"
        >
          {/* Video Element */}
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

          {/* Luxury Video Fallback */}
          {(videoError || !videoLoaded) && (
            <div className="absolute inset-0 bg-gradient-to-b from-[#181411] via-[#241E1A] to-[#120F0D] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-20" />
            </div>
          )}

          {/* PURE CENTER CELESTIA LOGO OVERLAY */}
          <div className="absolute inset-0 z-10 flex flex-col justify-between items-center p-6 md:p-12 pointer-events-none">
            <div className="h-10" />

            <div className="text-center space-y-4 max-w-xl px-6">
              <h1 className="font-serif-luxury text-6xl sm:text-8xl md:text-9xl text-[#FAF7F0] uppercase tracking-tight leading-[0.88] drop-shadow-2xl">
                CEL<span className="italic font-light lowercase text-[#D8C39A]">estia</span>
              </h1>

              <p className="text-xs sm:text-sm font-sans tracking-[0.38em] uppercase text-[#D8C39A] font-bold drop-shadow-md">
                redefined for all.
              </p>
            </div>

            <div className="flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-black/40 backdrop-blur-md border border-[#D8C39A]/40 text-xs font-mono uppercase tracking-widest text-[#FAF7F0] font-bold shadow-2xl mb-4">
              <span>Scroll To Play Film</span>
              <ArrowDown className="w-4 h-4 text-[#D8C39A] animate-bounce" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LAYER 2: CRAZY 3D KINETIC SPATIAL SCROLL & PRISTINE CELESTIA HERO STAGE   */}
        {/* ========================================================================= */}
        <div
          style={{
            opacity: heroOpacity,
            pointerEvents: heroOpacity > 0.4 ? 'auto' : 'none',
          }}
          className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-10 md:p-12 lg:p-14 bg-pearl-100 transition-opacity duration-300 transform-gpu"
        >
          {/* Ambient Lighting Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-champagne-200/35 to-transparent rounded-full" />
            <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-radial from-blush-100/40 to-transparent rounded-full" />
            <div className="absolute inset-0 bg-noise opacity-20" />
          </div>

          {/* 3D WebGL Real Product Stage (Lightweight GPU execution) */}
          <div className="absolute inset-0 z-0 pointer-events-auto opacity-75 transform-gpu">
            <ProductStage3D scrollProgress={threeDProgress} />
          </div>

          {/* Top Subheader Identity & Audio Toggle */}
          <div className="relative z-10 flex items-center justify-between w-full max-w-[1500px] mx-auto pt-20 md:pt-14">
            <div className="space-y-1">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-1.5">
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

          {/* Clean Spatial 3-Column Arena */}
          <div className="relative z-10 flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
            
            {/* LEFT COLUMN: Real Piece 01 Kinetic Glide Card */}
            <div className="hidden lg:flex lg:col-span-3 justify-start">
              <div
                style={{
                  opacity: p1Opacity,
                  transform: `translateX(-${p1TranslateX}px) rotate(${p1Rotate}deg)`,
                  pointerEvents: p1Opacity > 0.4 ? 'auto' : 'none',
                }}
                className="w-full max-w-[280px] p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft transition-all duration-200 space-y-3 hardware-accelerated"
              >
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
            <div
              style={{
                transform: `scale(${monumentScale}) translateY(${monumentTranslateY}px)`,
              }}
              className="col-span-1 lg:col-span-6 text-center space-y-5 px-4 transition-transform duration-200 hardware-accelerated"
            >
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-champagne-100/95 border border-champagne-300/80 backdrop-blur-sm text-xs uppercase font-mono tracking-widest text-obsidian font-bold shadow-sm">
                <Sparkles className="w-4 h-4 text-gold-dark" />
                <span>400+ Handcrafted Pieces • Mumbai Studio</span>
              </div>

              <h1 className="font-serif-luxury text-6xl sm:text-7xl md:text-8xl text-obsidian font-normal tracking-tight uppercase leading-[0.90]">
                CEL<span className="italic font-light lowercase text-gold-dark">estia</span>
              </h1>

              <p className="font-sans text-sm sm:text-base tracking-[0.34em] uppercase text-obsidian-soft font-semibold max-w-lg mx-auto">
                redefined for all.
              </p>

              <p className="font-serif italic text-lg sm:text-xl text-obsidian font-normal max-w-md mx-auto leading-relaxed">
                "Fine jewellery, artisanal bangles, and celebration hampers made to be worn with joy."
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <a href="#section-reveal" className="btn-primary w-full sm:w-auto shadow-md">
                  <span>Explore The Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/gifting" className="btn-secondary w-full sm:w-auto">
                  <span>Gifting Atelier</span>
                </a>
              </div>
            </div>

            {/* RIGHT COLUMN: Real Piece 02 Kinetic Glide Card */}
            <div className="hidden lg:flex lg:col-span-3 justify-end">
              <div
                style={{
                  opacity: p2Opacity,
                  transform: `translateX(${p2TranslateX}px) rotate(${p2Rotate}deg)`,
                  pointerEvents: p2Opacity > 0.4 ? 'auto' : 'none',
                }}
                className="w-full max-w-[280px] p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft transition-all duration-200 space-y-3 hardware-accelerated"
              >
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
