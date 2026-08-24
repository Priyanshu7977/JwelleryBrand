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

  const [scrollFraction, setScrollFraction] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const { setQuickViewProduct, addToCart } = useCart();

  // Entrance animation trigger
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

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

  // Subtle interactive mouse parallax
  const handleMouseMove = (e: React.MouseEvent) => {
    if (window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 20; // -10px to +10px
    const y = (clientY / innerHeight - 0.5) * 20; // -10px to +10px
    setMousePos({ x, y });
  };

  const product1 = FEATURED_PRODUCTS[0]; // pink and blue bangle set of 2 (₹500)
  const product2 = FEATURED_PRODUCTS[1]; // Desi Barbie Hamper (₹999)

  // Performant rAF-throttled scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollTicking.current) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const windowHeight = window.innerHeight;
          const progress = Math.min(1, Math.max(0, scrollY / (windowHeight * 0.8)));
          setScrollFraction(progress);
          scrollTicking.current = false;
        });
        scrollTicking.current = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3D WebGL spatial rotation progress
  const threeDProgress = Math.max(0, Math.min(1, scrollFraction));

  // Dynamic transforms
  const p1OffsetX = isLoaded ? -mousePos.x * 0.8 : -45;
  const p1OffsetY = isLoaded ? -mousePos.y * 0.6 : 0;
  const p2OffsetX = isLoaded ? mousePos.x * 0.8 : 45;
  const p2OffsetY = isLoaded ? mousePos.y * 0.6 : 0;
  const monumentOffsetX = mousePos.x * 0.3;
  const monumentOffsetY = mousePos.y * 0.3;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-4 sm:pb-6 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden transform-gpu"
      id="section-arrival"
    >
      {/* Ambient Lighting Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] bg-gradient-radial from-champagne-200/35 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-gradient-radial from-blush-100/40 to-transparent rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-noise opacity-20" />
      </div>

      {/* 3D WebGL Real Product Stage with dynamic scroll rotation */}
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

      {/* Clean Spatial 3-Column Arena with Kinetic Parallax & Hover Float */}
      <div className="relative z-10 flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 sm:py-6">
        
        {/* LEFT COLUMN: Real Piece 01 Kinetic Glide Card */}
        <div className="hidden lg:flex lg:col-span-3 justify-start">
          <div
            style={{
              transform: `translate3d(${p1OffsetX}px, ${p1OffsetY}px, 0) rotate(${isLoaded ? 2.5 : 6}deg)`,
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out',
            }}
            className="group w-full max-w-[280px] p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft hover:shadow-2xl hover:border-gold-dark/60 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 space-y-3 hardware-accelerated cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <LuxuryBadge variant="gold">Real Piece 01</LuxuryBadge>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                In Stock ({product1.availableStock})
              </span>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand relative group-hover:scale-[1.02] transition-transform duration-500">
              <img src={product1.images.hero} alt={product1.title} className="w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base text-obsidian font-bold truncate group-hover:text-gold-dark transition-colors">
                {product1.title}
              </h3>
              <span className="font-serif text-lg text-obsidian font-bold">₹{product1.price}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product1, 1);
                }}
                className="flex-1 h-9 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Bag</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(product1);
                }}
                className="w-9 h-9 border border-champagne-300/80 hover:bg-champagne-100 rounded-full text-obsidian transition-colors flex items-center justify-center"
                title="Inspect Piece"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Pristine Celestia Monument with Subtle 3D Parallax */}
        <div
          style={{
            transform: `translate3d(${monumentOffsetX}px, ${monumentOffsetY}px, 0) scale(${isLoaded ? 1 : 0.95})`,
            opacity: isLoaded ? 1 : 0,
            transition: 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out',
          }}
          className="col-span-1 lg:col-span-6 text-center space-y-5 px-4 hardware-accelerated"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-champagne-100/95 border border-champagne-300/80 backdrop-blur-sm text-xs uppercase font-mono tracking-widest text-obsidian font-bold shadow-sm animate-pulse" style={{ animationDuration: '3s' }}>
            <Sparkles className="w-4 h-4 text-gold-dark" />
            <span>400+ Handcrafted Pieces • Mumbai Studio</span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian font-normal tracking-tight uppercase leading-[0.90] drop-shadow-sm">
            CEL<span className="italic font-light lowercase text-gold-dark">estia</span>
          </h1>

          <p className="font-sans text-xs sm:text-sm md:text-base tracking-[0.34em] uppercase text-obsidian-soft font-semibold max-w-lg mx-auto">
            redefined for all.
          </p>

          <p className="font-serif italic text-base sm:text-xl text-obsidian font-normal max-w-md mx-auto leading-relaxed">
            "Fine jewellery, artisanal bangles, and celebration hampers made to be worn with joy."
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <a href="#section-reveal" className="btn-primary w-full sm:w-auto shadow-md hover:scale-105 transition-transform">
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a href="/gifting" className="btn-secondary w-full sm:w-auto hover:scale-105 transition-transform">
              <span>Gifting Atelier</span>
            </a>
          </div>
        </div>

        {/* RIGHT COLUMN: Real Piece 02 Kinetic Glide Card */}
        <div className="hidden lg:flex lg:col-span-3 justify-end">
          <div
            style={{
              transform: `translate3d(${p2OffsetX}px, ${p2OffsetY}px, 0) rotate(${isLoaded ? -2.5 : -6}deg)`,
              opacity: isLoaded ? 1 : 0,
              transition: 'transform 0.45s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease-out',
            }}
            className="group w-full max-w-[280px] p-5 bg-pearl-50/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft hover:shadow-2xl hover:border-gold-dark/60 hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 space-y-3 hardware-accelerated cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <LuxuryBadge variant="blush">Real Piece 02</LuxuryBadge>
              <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full">
                Mumbai Ready
              </span>
            </div>
            <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand relative group-hover:scale-[1.02] transition-transform duration-500">
              <img src={product2.images.hero} alt={product2.title} className="w-full h-full object-cover" loading="eager" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <h3 className="font-serif-luxury text-base text-obsidian font-bold truncate group-hover:text-gold-dark transition-colors">
                {product2.title}
              </h3>
              <span className="font-serif text-lg text-obsidian font-bold">₹{product2.price}</span>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product2, 1);
                }}
                className="flex-1 h-9 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Bag</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setQuickViewProduct(product2);
                }}
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
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-[1500px] mx-auto pb-1">
        <div className="flex items-center gap-3">
          <span className="w-8 sm:w-10 h-0.5 bg-gold-dark" />
          <span className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
            1,000+ Journeys Dispatched • Pan-India Free Express
          </span>
        </div>

        <a
          href="#section-reveal"
          className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian hover:text-gold-dark transition-colors group cursor-pointer font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-pearl-50 border border-champagne-300/80 shadow-sm hover:shadow-md transition-all"
        >
          <span>Scroll To Enter Collection</span>
          <ArrowDown className="w-4 h-4 text-gold-dark group-hover:translate-y-1 transition-transform" />
        </a>
      </div>
    </section>
  );
};

export default Section01Arrival;
