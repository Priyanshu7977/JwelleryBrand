import React, { useState } from 'react';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { LuxuryBadge } from '../ui/LuxuryBadge';
import { Eye, ShoppingBag, ShieldCheck, ArrowRight } from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';
import { ProductTiltCard } from '../motion/ProductTiltCard';

export const Section02Reveal: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Dedicated Fine Jewellery & Gemstone Suite products
  const revealProducts = [
    FEATURED_PRODUCTS[4], // Exclusive Red Emerald set (₹799)
    FEATURED_PRODUCTS[5], // anti-tarnish rings (₹299)
    FEATURED_PRODUCTS[6], // purple floral aesthetic box (₹899)
  ];
  const heroProduct = revealProducts[activeTab] || revealProducts[0];

  return (
    <section
      id="section-reveal"
      className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-warm-ivory-100 overflow-hidden border-t border-champagne-300/40"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-80 sm:w-96 h-80 sm:h-96 bg-champagne-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Section Editorial Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/60 pb-6 sm:pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Act 02 — The Reveal
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                <span className="text-xs sm:text-sm text-obsidian-soft font-medium">
                  Fine Jewellery & Gemstones
                </span>
              </div>
              <h2 className="site-main-title text-obsidian">
                Sculpted in <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">gold</span> & light
              </h2>
            </div>

            {/* Product Switcher Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {revealProducts.map((prod, idx) => (
                <button
                  key={prod.id}
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs uppercase font-mono tracking-wider transition-all shrink-0 font-bold ${
                    activeTab === idx
                      ? 'bg-obsidian text-pearl-100 shadow-md'
                      : 'bg-pearl-50 text-obsidian-soft hover:text-obsidian hover:bg-champagne-100/60 border border-champagne-300/60'
                  }`}
                >
                  0{idx + 1}. {prod.title.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* Balanced 2-Column High-Fashion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Main Editorial Image Frame (6 Cols) with Tilt & Sheen */}
          <RevealOnScroll direction="up" delay={150} className="lg:col-span-6">
            <ProductTiltCard className="rounded-3xl border border-champagne-300/80 shadow-luxury-soft jewellery-spotlight">
              <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-sand/40 group luxury-sheen">
                <img
                  src={heroProduct.images.hero}
                  alt={heroProduct.images.alt}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                />
                
                {/* Floating Quick Action Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 sm:p-6">
                  <div className="text-pearl-100 space-y-0.5">
                    <p className="text-[10px] sm:text-xs uppercase font-mono tracking-wider text-champagne-200 font-bold">
                      Handcrafted Detail
                    </p>
                    <p className="text-base sm:text-lg text-pearl-50 font-bold">
                      {heroProduct.material}
                    </p>
                  </div>

                  <button
                    onClick={() => setQuickViewProduct(heroProduct)}
                    className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-pearl-50 text-obsidian text-xs uppercase tracking-widest font-bold flex items-center gap-1.5 hover:bg-champagne-200 active:scale-[0.98] transition-all shadow-lg"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect</span>
                  </button>
                </div>

                {/* Floating Bestseller Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <LuxuryBadge variant="gold">Signature Series</LuxuryBadge>
                </div>

                {/* Same Day Mumbai dispatch badge */}
                {heroProduct.sameDayMumbaiAvailable && (
                  <div className="absolute top-4 right-4 z-10">
                    <LuxuryBadge variant="pearl" dot={false}>
                      🚚 Mumbai Same-Day
                    </LuxuryBadge>
                  </div>
                )}
              </div>
            </ProductTiltCard>
          </RevealOnScroll>

          {/* Editorial Storytelling Column (6 Cols) */}
          <RevealOnScroll direction="up" delay={250} className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                  {heroProduct.category}
                </span>
                <span className="text-obsidian-muted">•</span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  Available Stock ({heroProduct.availableStock})
                </span>
              </div>

              <h3 className="text-2xl sm:text-4xl text-obsidian font-bold leading-tight">
                {heroProduct.title}
              </h3>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-2xl sm:text-3xl font-bold text-obsidian">
                  ₹{heroProduct.price}
                </span>
                {heroProduct.compareAtPrice && (
                  <span className="text-base sm:text-lg text-obsidian-muted line-through font-semibold">
                    ₹{heroProduct.compareAtPrice}
                  </span>
                )}
                {heroProduct.compareAtPrice && (
                  <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full">
                    Save ₹{heroProduct.compareAtPrice - heroProduct.price}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-obsidian-soft leading-relaxed">
              {heroProduct.description}
            </p>

            <blockquote className="border-l-2 border-gold-dark pl-4 text-sm text-obsidian/85 font-serif font-medium">
              "{heroProduct.editorialNote}"
            </blockquote>

            {/* Specifications Details */}
            <div className="grid grid-cols-2 gap-4 py-4 border-y border-champagne-300/60 text-xs">
              <div>
                <span className="font-mono uppercase tracking-wider text-gold-dark font-bold block mb-1">
                  Crafting Material
                </span>
                <span className="text-obsidian font-semibold">{heroProduct.material}</span>
              </div>
              <div>
                <span className="font-mono uppercase tracking-wider text-gold-dark font-bold block mb-1">
                  Atelier Promise
                </span>
                <span className="text-obsidian font-semibold">{heroProduct.craftsmanship}</span>
              </div>
            </div>

            {/* CTAs with Micro-Interactions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => addToCart(heroProduct, 1)}
                className="btn-primary group flex-1 h-12 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add To Bag • ₹{heroProduct.price}</span>
              </button>

              <button
                onClick={() => setQuickViewProduct(heroProduct)}
                className="btn-secondary group px-6 h-12 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest"
              >
                <span>Inspect Suite</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>

            {/* Trust note */}
            <div className="flex items-center gap-2 text-xs text-obsidian-soft pt-1">
              <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
              <span>100% Anti-Tarnish Dual Dip Coating • Waterproof Everyday Wear</span>
            </div>
          </RevealOnScroll>

        </div>

      </div>
    </section>
  );
};

export default Section02Reveal;
