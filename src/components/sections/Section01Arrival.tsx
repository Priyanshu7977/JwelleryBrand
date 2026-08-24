import React, { useEffect, useState } from 'react';
import { ProductStage3D } from '../canvas/ProductStage3D';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import { Sparkles, ArrowDown, Eye, ShoppingBag, Volume2, VolumeX, ArrowRight } from 'lucide-react';
import { atelierSound } from '../../utils/audioAtelier';

export const Section01Arrival: React.FC = () => {
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

  return (
    <section
      className="relative w-full bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden transform-gpu"
      id="section-arrival"
    >
      {/* Ambient Lighting Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] sm:w-[700px] h-[450px] sm:h-[700px] bg-gradient-radial from-champagne-200/35 to-transparent rounded-full blur-2xl" />
        <div className="absolute bottom-10 right-10 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-radial from-blush-100/40 to-transparent rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-noise opacity-20" />
      </div>

      {/* 3D WebGL Product Stage */}
      <div className="absolute inset-0 z-0 pointer-events-auto opacity-75 transform-gpu">
        <ProductStage3D scrollProgress={0.5} />
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
      <div className="relative z-10 flex-1 max-w-[1500px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center py-6 sm:py-10">
        
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
    </section>
  );
};

export default Section01Arrival;
