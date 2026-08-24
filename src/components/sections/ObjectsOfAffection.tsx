import React, { useState, useRef } from 'react';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import {
  Sparkles,
  ShoppingBag,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';

export const ObjectsOfAffection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { addToCart, setQuickViewProduct } = useCart();

  const curatedProducts = FEATURED_PRODUCTS.slice(0, 4);
  const currentProduct = curatedProducts[activeIndex] || curatedProducts[0];

  const productHotspots = [
    [
      { x: 32, y: 40, label: '18K Gold Plated Contour', desc: 'Hand-finished metallic border with mirror polish' },
      { x: 68, y: 62, label: 'Dual-Tone Enamel', desc: 'Vibrant pink and sky blue artisanal glass enamel' },
      { x: 50, y: 82, label: 'Mumbai Atelier Seal', desc: 'Individually size-calibrated (2.4, 2.6, 2.8)' },
    ],
    [
      { x: 45, y: 28, label: 'Double Satin Bow', desc: 'Hand-tied archival blush ribbon' },
      { x: 30, y: 65, label: 'Curated Charms', desc: 'Handpicked bespoke aesthetic accessories' },
      { x: 72, y: 55, label: 'Custom Polaroids', desc: 'Glossy retro photographic print included' },
    ],
    [
      { x: 50, y: 35, label: 'Simulated Emerald', desc: 'Deep scarlet and emerald gemstone facets' },
      { x: 35, y: 70, label: '100% Anti-Tarnish', desc: 'Waterproof shower-safe protective coat' },
      { x: 65, y: 68, label: 'Artisanal Jhumka', desc: 'Sculptural heritage drops with modern balance' },
    ],
    [
      { x: 48, y: 45, label: 'Waterproof Steel', desc: 'Surgical-grade stainless steel core' },
      { x: 60, y: 70, label: 'High-Mirror Luster', desc: 'Resists perfume, lotion, and daily wear' },
      { x: 35, y: 60, label: 'Everyday Stack', desc: 'Comfort rounded inner profile' },
    ]
  ][activeIndex] || [];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || (typeof window !== 'undefined' && window.innerWidth < 1024)) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 16;
    setMouseOffset({ x, y });
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % curatedProducts.length);
    setActiveHotspot(null);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + curatedProducts.length) % curatedProducts.length);
    setActiveHotspot(null);
  };

  return (
    <section
      id="objects-of-affection"
      className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-warm-ivory-100 overflow-hidden border-t border-champagne-300/40"
    >
      {/* Ambient Editorial Atmosphere */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-br from-champagne-200/35 via-rose-muted/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-6 sm:pb-8">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Act 04 — The Celestia Edit</span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-[1.05]">
                OBJECTS OF <span className="italic font-normal text-gold-dark">Affection</span>.
              </h2>
            </div>

            {/* Stepper Controls & Counter */}
            <div className="flex items-center gap-3">
              <div className="font-mono text-xs text-obsidian/70 tracking-widest mr-2">
                <span className="font-bold text-obsidian text-sm">0{activeIndex + 1}</span>
                <span className="opacity-40"> / 0{curatedProducts.length}</span>
              </div>

              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-pearl-50 hover:bg-champagne-200 border border-champagne-300/80 text-obsidian flex items-center justify-center active:scale-[0.95] transition-all shadow-sm"
                aria-label="Previous Object"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 flex items-center justify-center active:scale-[0.95] transition-all shadow-sm"
                aria-label="Next Object"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </RevealOnScroll>

        {/* 2-Column Editorial Showcase */}
        <RevealOnScroll direction="up" delay={150}>
          <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center"
          >
            
            {/* Left: Product Stage (6 Cols) */}
            <div className="lg:col-span-6 relative">
              <div
                style={{
                  transform: typeof window !== 'undefined' && window.innerWidth >= 1024 ? `perspective(1000px) rotateY(${mouseOffset.x * 0.35}deg) rotateX(${-mouseOffset.y * 0.35}deg)` : 'none',
                  transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-sand/35 border border-champagne-300/70 shadow-2xl group luxury-sheen"
              >
                <img
                  src={currentProduct.images.hero}
                  alt={currentProduct.images.alt}
                  className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                    isZoomed ? 'scale-125' : 'scale-100 group-hover:scale-106'
                  }`}
                />

                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent pointer-events-none" />

                {/* Hotspots with Golden Pulse */}
                {productHotspots.map((hs, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHotspot(activeHotspot === i ? null : i)}
                    style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20"
                    aria-label={hs.label}
                  >
                    <div className="relative flex items-center justify-center">
                      <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-champagne-400 opacity-60" />
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-pearl-50 border-2 border-gold-dark shadow-md" />
                    </div>
                  </button>
                ))}

                {/* Hotspot details tooltip */}
                {activeHotspot !== null && productHotspots[activeHotspot] && (
                  <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-obsidian/90 backdrop-blur-md text-pearl-100 text-xs border border-champagne-400/40 z-30 animate-fade-in">
                    <p className="font-bold text-champagne-300 font-mono uppercase text-[10px] tracking-wider">
                      {productHotspots[activeHotspot].label}
                    </p>
                    <p className="text-pearl-100 text-xs mt-0.5">
                      {productHotspots[activeHotspot].desc}
                    </p>
                  </div>
                )}

                {/* Zoom toggle button */}
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-pearl-50/90 hover:bg-white text-obsidian text-[11px] font-mono font-bold uppercase tracking-wider shadow-sm transition-all z-20"
                >
                  {isZoomed ? 'Reset View' : 'Zoom 2x'}
                </button>
              </div>
            </div>

            {/* Right: Craftsmanship Details & Actions (6 Cols) */}
            <div className="lg:col-span-6 space-y-5 sm:space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-gold-dark">
                  <span>{currentProduct.category}</span>
                  <span>•</span>
                  <span>Handmade in Mumbai</span>
                </div>

                <h3 className="text-2xl sm:text-4xl font-bold text-obsidian leading-tight">
                  {currentProduct.title}
                </h3>

                <div className="flex items-baseline gap-3 pt-1">
                  <span className="text-2xl sm:text-3xl font-bold text-obsidian font-mono">
                    ₹{currentProduct.price}
                  </span>
                  <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                    Mumbai Dispatch Ready
                  </span>
                </div>
              </div>

              <p className="text-sm sm:text-base text-obsidian-soft leading-relaxed">
                {currentProduct.description}
              </p>

              <blockquote className="border-l-2 border-gold-dark pl-4 italic text-sm text-obsidian/85">
                "{currentProduct.editorialNote}"
              </blockquote>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={() => addToCart(currentProduct, 1)}
                  className="btn-primary group flex-1 h-12 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Bag • ₹{currentProduct.price}</span>
                </button>

                <button
                  onClick={() => setQuickViewProduct(currentProduct)}
                  className="btn-secondary group px-6 h-12 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest"
                >
                  <span>Quick View</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs text-obsidian-soft pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                <span>Individually sized & inspected under daylight before dispatch</span>
              </div>
            </div>

          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
};

export default ObjectsOfAffection;
