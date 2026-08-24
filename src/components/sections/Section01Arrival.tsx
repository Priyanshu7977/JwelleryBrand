import React, { useEffect, useRef, useState } from 'react';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import { Sparkles, ArrowDown, Eye, ShoppingBag, Volume2, VolumeX, ArrowRight, ShieldCheck, Truck, Award } from 'lucide-react';
import { atelierSound } from '../../utils/audioAtelier';
import { ProductTiltCard } from '../motion/ProductTiltCard';

export const Section01Arrival: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTicking = useRef<boolean>(false);

  const [scrollFraction, setScrollFraction] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const { setQuickViewProduct, addToCart } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

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

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 16;
    const y = (clientY / innerHeight - 0.5) * 16;
    setMousePos({ x, y });
  };

  const product1 = FEATURED_PRODUCTS[0]; // pink and blue bangle set of 2 (₹500)
  const product2 = FEATURED_PRODUCTS[1]; // Desi Barbie Hamper (₹999)
  const displayProducts = [product1, product2];
  const currentProduct = displayProducts[activeTab];

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

  const cardParallaxX = mousePos.x * 0.4;
  const cardParallaxY = mousePos.y * 0.4 - scrollFraction * 12;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[92vh] lg:min-h-screen bg-pearl-100 selection:bg-champagne-300 flex flex-col justify-between pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-8 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden"
      id="section-arrival"
    >
      {/* Background Ambience & Floating Parallax Blooms */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <div
          style={{
            transform: `translate3d(${mousePos.x * -0.2}px, ${mousePos.y * -0.2}px, 0)`,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute top-1/4 right-1/4 w-[350px] sm:w-[550px] lg:w-[650px] h-[350px] sm:h-[550px] lg:h-[650px] bg-gradient-radial from-champagne-200/40 via-champagne-100/20 to-transparent rounded-full blur-3xl opacity-80"
        />
        <div
          style={{
            transform: `translate3d(${mousePos.x * 0.25}px, ${mousePos.y * 0.25}px, 0)`,
            transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
          className="absolute bottom-10 left-10 w-[280px] sm:w-[420px] lg:w-[500px] h-[280px] sm:h-[420px] lg:h-[500px] bg-gradient-radial from-rose-200/35 via-rose-100/15 to-transparent rounded-full blur-3xl opacity-75"
        />
        <div className="absolute inset-0 bg-noise opacity-15" />
      </div>

      {/* Top Subheader Identity & Sound Controller */}
      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transform: isLoaded ? 'translateY(0)' : 'translateY(-12px)',
          transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className="relative z-10 flex items-center justify-between gap-3 w-full max-w-7xl mx-auto"
      >
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100 border border-champagne-300/80 text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-widest text-gold-dark shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Mumbai Atelier MMXXVI</span>
          </span>
          <span className="hidden sm:inline text-xs text-obsidian-soft font-medium">
            Handcrafted Fine Jewellery & Hampers
          </span>
        </div>

        {/* Sound Micro-toggle */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-2 px-3 sm:px-3.5 h-8 rounded-full border transition-all text-[11px] font-mono font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
            isAudioActive
              ? 'bg-champagne-300 border-gold-dark text-obsidian shadow-gold-dark/20'
              : 'border-champagne-300/80 bg-pearl-50/90 hover:bg-white text-obsidian'
          }`}
          aria-label="Toggle atmospheric sound"
        >
          {isAudioActive ? (
            <Volume2 className="w-3.5 h-3.5 text-gold-dark animate-pulse" />
          ) : (
            <VolumeX className="w-3.5 h-3.5 text-obsidian" />
          )}
          <span>{isAudioActive ? 'Sound: ON' : 'Sound: OFF'}</span>
        </button>
      </div>

      {/* Hero Content: Balanced Split Layout with Sequential Reveals */}
      <div className="relative z-10 flex-1 max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center py-4 sm:py-6 lg:py-8">
        
        {/* Left Column: Brand Manifesto & CTAs (7 Cols) */}
        <div className="col-span-1 lg:col-span-7 space-y-4 sm:space-y-5 text-left">
          
          {/* Stagger Item 1: Counter Tag */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 100ms',
            }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-200/70 border border-champagne-300 text-[11px] sm:text-xs uppercase font-mono tracking-widest text-obsidian font-bold"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>400+ Handcrafted Designs • 1,000+ Journeys</span>
          </div>

          {/* Stagger Item 2: Main Headline */}
          <h1
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 200ms',
            }}
            className="text-3xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-tight text-obsidian leading-[1.08]"
          >
            Handcrafted <br />
            <span className="text-gold-dark font-normal italic">Fine Jewellery</span> <br />
            Redefined For All.
          </h1>

          {/* Stagger Item 3: Description */}
          <p
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 320ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 320ms',
            }}
            className="text-sm sm:text-base text-obsidian-soft max-w-lg leading-relaxed"
          >
            Discover artisanal bangles, 18k gold dipped jewellery suites, and bespoke velvet celebration hampers handcrafted with love in Mumbai.
          </p>

          {/* Stagger Item 4: Action CTAs with Micro-Interactions */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(16px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 420ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 420ms',
            }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1"
          >
            <a
              href="#section-reveal"
              className="btn-primary group shadow-md hover:shadow-xl flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm uppercase font-bold tracking-widest text-center w-full sm:w-auto transition-all"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
            </a>

            <a
              href="/gifting"
              className="btn-secondary group flex items-center justify-center gap-2 px-6 py-3.5 text-xs sm:text-sm uppercase font-bold tracking-widest text-center w-full sm:w-auto transition-all"
            >
              <span>Gifting Atelier</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300 opacity-70" />
            </a>
          </div>

          {/* Stagger Item 5: Key Trust Signals */}
          <div
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(14px)',
              transition: 'opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 520ms, transform 0.7s cubic-bezier(0.16, 1, 0.3, 1) 520ms',
            }}
            className="pt-3 border-t border-champagne-300/80 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 max-w-lg"
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-dark shrink-0" />
              <span className="text-[11px] font-bold text-obsidian uppercase tracking-wider">100% Handcrafted</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-dark shrink-0" />
              <span className="text-[11px] font-bold text-obsidian uppercase tracking-wider">Pan-India Express</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
              <span className="text-[11px] font-bold text-obsidian uppercase tracking-wider">Secure Payment</span>
            </div>
          </div>
        </div>

        {/* Right Column: Featured Luxury Showcase with 3D Tilt & Spotlight */}
        <div
          style={{
            transform: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `translate3d(${cardParallaxX}px, ${cardParallaxY}px, 0)` : 'none',
            opacity: isLoaded ? 1 : 0,
            transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1) 250ms',
          }}
          className="col-span-1 lg:col-span-5 flex flex-col items-center lg:items-end w-full"
        >
          {/* Card Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 p-1 bg-white/90 backdrop-blur-md rounded-full border border-champagne-300/80 mb-3 shadow-sm w-full max-w-[340px] sm:max-w-[360px]">
            <button
              onClick={() => setActiveTab(0)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center ${
                activeTab === 0
                  ? 'bg-obsidian text-pearl-100 shadow-sm'
                  : 'text-obsidian hover:text-gold-dark'
              }`}
            >
              Real Piece 01
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex-1 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all text-center ${
                activeTab === 1
                  ? 'bg-obsidian text-pearl-100 shadow-sm'
                  : 'text-obsidian hover:text-gold-dark'
              }`}
            >
              Real Piece 02
            </button>
          </div>

          {/* Active Featured Product Card with Specular Tilt & Sheen */}
          <ProductTiltCard
            className="w-full max-w-[340px] sm:max-w-[360px] p-4 sm:p-5 bg-white/95 backdrop-blur-md rounded-3xl border border-champagne-300/80 shadow-luxury-soft hover:shadow-2xl transition-all duration-500 space-y-3 jewellery-spotlight"
          >
            <div className="flex items-center justify-between relative z-10">
              <LuxuryBadge variant={activeTab === 0 ? 'gold' : 'blush'}>
                {activeTab === 0 ? 'Artisanal Bangle' : 'Celebration Hamper'}
              </LuxuryBadge>
              <span className="text-[10px] sm:text-[11px] font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                {currentProduct.availableStock ? `In Stock (${currentProduct.availableStock})` : 'Mumbai Ready'}
              </span>
            </div>

            <div
              className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand relative group cursor-pointer luxury-sheen z-10"
              onClick={() => setQuickViewProduct(currentProduct)}
            >
              <img
                src={currentProduct.images.hero}
                alt={currentProduct.title}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/35 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <span className="text-xs text-white font-bold uppercase tracking-widest flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5" /> Quick View
                </span>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-base font-bold text-obsidian truncate">
                {currentProduct.title}
              </h3>
              <p className="text-xs text-obsidian-soft line-clamp-1 mt-0.5">
                {currentProduct.description}
              </p>
              <div className="flex items-center justify-between pt-1.5">
                <span className="text-xl font-bold text-obsidian">₹{currentProduct.price}</span>
                <span className="text-[10px] sm:text-[11px] text-obsidian-soft uppercase tracking-wider font-semibold">Includes Taxes</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1 relative z-10">
              <button
                onClick={() => addToCart(currentProduct, 1)}
                className="flex-1 h-10 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 font-bold shadow-md"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add To Bag</span>
              </button>
              <button
                onClick={() => setQuickViewProduct(currentProduct)}
                className="w-10 h-10 border border-champagne-300/80 hover:bg-champagne-100 active:scale-[0.98] rounded-full text-obsidian transition-all flex items-center justify-center shadow-sm shrink-0"
                title="Inspect Piece"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </ProductTiltCard>
        </div>

      </div>

      {/* Bottom Interactive Anchor & Stats */}
      <div
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 600ms',
        }}
        className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 w-full max-w-7xl mx-auto pt-2"
      >
        <div className="flex items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="hidden sm:inline w-8 sm:w-10 h-0.5 bg-gold-dark" />
          <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
            1,000+ Journeys Dispatched • Pan-India Free Express
          </span>
        </div>

        <a
          href="#section-reveal"
          className="flex items-center gap-2 text-[11px] sm:text-xs uppercase font-mono tracking-widest text-obsidian hover:text-gold-dark transition-all group cursor-pointer font-bold px-4 py-1.5 sm:py-2 rounded-full bg-pearl-50 border border-champagne-300/80 shadow-sm hover:shadow-md"
        >
          <span>Scroll To Enter Collection</span>
          <ArrowDown className="w-3.5 h-3.5 text-gold-dark group-hover:translate-y-1 transition-transform duration-300" />
        </a>
      </div>
    </section>
  );
};

export default Section01Arrival;
