import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { MagneticButton } from '../ui/MagneticButton';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import {
  Sparkles,
  ArrowUpRight,
  ShoppingBag,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Award,
  Layers,
  Camera,
  Check
} from 'lucide-react';

export const ObjectsOfAffection: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const { addToCart, setQuickViewProduct } = useCart();

  const curatedProducts = FEATURED_PRODUCTS.slice(0, 4);
  const currentProduct = curatedProducts[activeIndex] || curatedProducts[0];

  // Specific factual hotspots per product
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
    if (!containerRef.current) return;
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
      className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-warm-ivory-100 overflow-hidden border-t border-champagne-300/40 selection:bg-champagne-300"
    >
      {/* Ambient Editorial Atmosphere with Champagne Glow */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-champagne-200/35 via-rose-muted/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[550px] h-[550px] bg-champagne-300/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-14 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] uppercase tracking-monumental text-gold-dark font-semibold shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Act 08 — The Celestia Edit</span>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal leading-[0.95]">
              OBJECTS OF <span className="italic font-light text-gold-dark">Affection</span>.
            </h2>
          </div>

          {/* Stepper Controls & Counter */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-xs text-obsidian/70 tracking-widest">
              <span className="font-bold text-obsidian text-sm">0{activeIndex + 1}</span>
              <span className="opacity-40"> / 0{curatedProducts.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-pearl-50 hover:bg-champagne-200 border border-champagne-300/80 text-obsidian flex items-center justify-center transition-all shadow-sm"
                aria-label="Previous Object"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 flex items-center justify-center transition-all shadow-sm"
                aria-label="Next Object"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Cinematic Asymmetrical Editorial Campaign Layout */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center"
        >
          
          {/* Left: Large High-Resolution Product Stage (7 Cols) */}
          <div className="lg:col-span-7 relative">
            <div
              style={{
                transform: `perspective(1000px) rotateY(${mouseOffset.x * 0.4}deg) rotateX(${-mouseOffset.y * 0.4}deg)`,
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] rounded-3xl overflow-hidden bg-sand/35 border border-champagne-300/70 shadow-2xl group"
            >
              {/* Product Hero Image with Cinematic Zoom */}
              <img
                src={currentProduct.images.hero}
                alt={currentProduct.images.alt}
                className={`w-full h-full object-cover transition-transform duration-1000 ${
                  isZoomed ? 'scale-125' : 'scale-100 group-hover:scale-105'
                }`}
              />

              {/* Atmospheric Gradient Shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent pointer-events-none" />

              {/* Interactive Craftsmanship Hotspots */}
              {productHotspots.map((spot, idx) => (
                <div
                  key={idx}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActiveHotspot(activeHotspot === idx ? null : idx)}
                    onMouseEnter={() => setActiveHotspot(idx)}
                    className={`relative flex items-center justify-center w-7 h-7 rounded-full backdrop-blur-md border transition-all duration-300 ${
                      activeHotspot === idx
                        ? 'bg-gold-dark text-pearl-100 scale-125 border-white shadow-xl'
                        : 'bg-pearl-50/90 text-obsidian border-champagne-300 hover:scale-110 shadow-md'
                    }`}
                    aria-label={`Hotspot: ${spot.label}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-gold-dark animate-ping absolute" />
                    <Sparkles className="w-3.5 h-3.5 relative z-10" />
                  </button>

                  {/* Hotspot Floating Tooltip Card */}
                  {activeHotspot === idx && (
                    <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 sm:w-56 p-3 bg-pearl-50/95 backdrop-blur-md rounded-2xl border border-champagne-300 shadow-2xl space-y-1 z-30 animate-scale-up text-left">
                      <p className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-semibold">
                        ✦ {spot.label}
                      </p>
                      <p className="text-[11px] font-sans text-obsidian/75 leading-tight">
                        {spot.desc}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Lens Zoom Toggle */}
              <button
                onClick={() => setIsZoomed(!isZoomed)}
                className="absolute top-5 right-5 px-3.5 py-1.5 rounded-full bg-pearl-50/90 hover:bg-champagne-200 border border-champagne-300/80 text-[10px] uppercase font-mono tracking-widest text-obsidian flex items-center gap-1.5 shadow-md transition-all z-20"
              >
                <Camera className="w-3 h-3 text-gold-dark" />
                <span>{isZoomed ? 'Reset View' : 'Macro Lens'}</span>
              </button>

              {/* Status Badge */}
              <div className="absolute top-5 left-5 z-20">
                <LuxuryBadge variant="gold">
                  {currentProduct.isBestseller ? 'Atelier Bestseller' : 'Limited Edition'}
                </LuxuryBadge>
              </div>

              {/* Bottom Card Title Overlay */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-pearl-100 z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-ethereal text-champagne-200 font-mono">
                    Artisanal Piece
                  </p>
                  <p className="font-serif text-lg sm:text-xl font-medium drop-shadow-md">
                    {currentProduct.title}
                  </p>
                </div>

                <button
                  onClick={() => setQuickViewProduct(currentProduct)}
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-pearl-100 text-obsidian text-[11px] uppercase tracking-widest font-semibold hover:bg-champagne-200 transition-all shadow-lg"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </button>
              </div>
            </div>

            {/* Floating Macro Polaroid Accent Frame */}
            {currentProduct.images.detail && (
              <div className="hidden sm:block absolute -bottom-6 -right-6 md:-bottom-8 md:-right-8 w-44 md:w-52 p-3 bg-pearl-50 rounded-2xl shadow-2xl border border-champagne-300/90 rotate-3 transition-transform duration-500 hover:rotate-0 hover:scale-105 z-20">
                <div className="aspect-square rounded-xl overflow-hidden bg-sand">
                  <img
                    src={currentProduct.images.detail}
                    alt="Macro Detail"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-2 text-center">
                  <span className="text-[9px] uppercase tracking-widest text-obsidian/70 font-mono font-medium block">
                    Macro Texture • 100% Anti-Tarnish
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Editorial Narrative & Purchasing Chamber (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 lg:pl-2">
            
            {/* Object Title & Realm */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold-dark font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Realm 0{activeIndex + 1} • {currentProduct.category}</span>
              </div>

              <h3 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-obsidian font-normal leading-tight">
                {currentProduct.title}
              </h3>

              {/* Price Row */}
              <div className="flex items-baseline gap-4 pt-2">
                <span className="font-serif-luxury text-3xl md:text-4xl text-obsidian font-bold">
                  ₹{currentProduct.price}
                </span>
                {currentProduct.compareAtPrice && (
                  <span className="text-lg font-sans text-obsidian/40 line-through">
                    ₹{currentProduct.compareAtPrice}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-mono font-semibold">
                  In Stock • Mumbai Atelier
                </span>
              </div>
            </div>

            {/* Editorial Poetic Excerpt */}
            <blockquote className="border-l-2 border-gold-dark pl-4 italic font-serif text-base text-obsidian/85 leading-relaxed">
              "{currentProduct.editorialNote}"
            </blockquote>

            <p className="text-xs md:text-sm text-obsidian/75 font-sans leading-relaxed">
              {currentProduct.description}
            </p>

            {/* Material & Craftsmanship Specs */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-pearl-50 border border-champagne-300/40">
                <span className="text-[10px] uppercase tracking-widest text-obsidian/50 font-mono block">Composition</span>
                <span className="text-xs font-serif text-obsidian font-medium line-clamp-1">{currentProduct.material}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-pearl-50 border border-champagne-300/40">
                <span className="text-[10px] uppercase tracking-widest text-obsidian/50 font-mono block">Assurance</span>
                <span className="text-xs font-serif text-obsidian font-medium flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-dark inline" />
                  100% Anti-Tarnish Seal
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <MagneticButton
                variant="primary"
                size="lg"
                onClick={() => addToCart(currentProduct, 1)}
                className="flex-1"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Curated Bag</span>
              </MagneticButton>

              <MagneticButton
                variant="outline"
                size="lg"
                onClick={() => setQuickViewProduct(currentProduct)}
                className="sm:w-auto"
              >
                <span>Inspect Piece</span>
                <ArrowUpRight className="w-4 h-4" />
              </MagneticButton>
            </div>

            {/* Interactive Object Selector Tabs */}
            <div className="pt-4 border-t border-champagne-300/40">
              <p className="text-[10px] uppercase font-mono tracking-widest text-obsidian/50 mb-3">
                Switch Curated Object:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {curatedProducts.map((prod, idx) => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      setActiveIndex(idx);
                      setActiveHotspot(null);
                    }}
                    className={`p-2 rounded-xl text-left border transition-all text-xs ${
                      activeIndex === idx
                        ? 'bg-obsidian text-pearl-100 border-obsidian shadow-sm'
                        : 'bg-pearl-50 hover:bg-champagne-100 text-obsidian border-champagne-300/40'
                    }`}
                  >
                    <span className="font-mono text-[9px] block opacity-60">0{idx + 1}</span>
                    <span className="font-serif font-medium line-clamp-1">{prod.title}</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
