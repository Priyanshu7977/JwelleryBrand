import React, { useState } from 'react';
import { CELESTIA_COLLECTIONS, FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { MagneticButton } from '../ui/MagneticButton';
import { Sparkles, ArrowRight, ArrowUpRight, Compass, Shield, Layers, Eye } from 'lucide-react';

export const Section03Collections: React.FC = () => {
  const [activeCollectionId, setActiveCollectionId] = useState<string>(CELESTIA_COLLECTIONS[0].id);
  const { setQuickViewProduct, addToCart } = useCart();

  const activeCollection = CELESTIA_COLLECTIONS.find((c) => c.id === activeCollectionId) || CELESTIA_COLLECTIONS[0];
  const matchingProducts = FEATURED_PRODUCTS.filter(
    (p) => p.category.toLowerCase().includes(activeCollection.handle.split('-')[0].toLowerCase())
  );

  return (
    <section
      id="section-collections"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-pearl-100 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Ambient background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blush-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
                Act 03 — Collection Journey
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif italic text-obsidian/60">The Five Realms</span>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal leading-[0.95]">
              Curated for <span className="italic font-light">Every Mood</span>.
            </h2>
          </div>

          <p className="max-w-md text-xs md:text-sm text-obsidian/70 font-sans leading-relaxed">
            Move between sculptural fine jewellery, fluid artisanal bangles, and bespoke personalised gifting boxes.
          </p>
        </div>

        {/* Unconventional Editorial Category Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
          {CELESTIA_COLLECTIONS.map((col, idx) => {
            const isActive = col.id === activeCollectionId;
            return (
              <button
                key={col.id}
                onClick={() => setActiveCollectionId(col.id)}
                className={`text-left p-4 md:p-6 rounded-2xl transition-all duration-500 relative overflow-hidden group ${
                  isActive
                    ? 'bg-obsidian text-pearl-100 shadow-luxury-soft scale-[1.02]'
                    : 'bg-ivory-100 hover:bg-champagne-100/60 text-obsidian border border-champagne-300/40'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] tracking-widest font-mono opacity-60 mb-3">
                  <span>0{idx + 1}</span>
                  <span className="uppercase">{col.tags[0]}</span>
                </div>

                <h3 className="font-serif-luxury text-lg md:text-xl leading-snug">
                  {col.title}
                </h3>

                <p className={`text-[11px] mt-1 font-sans line-clamp-1 ${isActive ? 'text-champagne-200' : 'text-obsidian/60'}`}>
                  {col.subtitle}
                </p>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Category Immersive Showcase Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center bg-sand/20 rounded-3xl p-6 md:p-12 border border-champagne-300/50 shadow-inner">
          
          {/* Left Narrative Frame */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100 text-[10px] uppercase tracking-widest text-obsidian border border-champagne-300/60">
              <Compass className="w-3 h-3 text-gold-dark" />
              <span>{activeCollection.productCount} Handcrafted Pieces</span>
            </div>

            <h3 className="font-serif-luxury text-3xl sm:text-5xl text-obsidian font-normal leading-tight">
              {activeCollection.title}
            </h3>

            <p className="text-xs md:text-sm text-obsidian/75 font-sans leading-relaxed">
              {activeCollection.editorialNarrative}
            </p>

            <blockquote className="border-l-2 border-gold-dark pl-4 italic font-serif text-sm md:text-base text-obsidian/90">
              "{activeCollection.accentQuote}"
            </blockquote>

            <div className="flex flex-wrap gap-2 pt-2">
              {activeCollection.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-pearl-50 text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-4">
              <MagneticButton
                variant="primary"
                size="md"
                onClick={() => {
                  const targetSection = activeCollection.handle.includes('gifting') ? '#section-gifting' : '#section-reveal';
                  document.querySelector(targetSection)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <span>Explore {activeCollection.title}</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>

          {/* Right Product Grid / Lookbook Preview */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {matchingProducts.length > 0 ? (
              matchingProducts.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-pearl-50 rounded-2xl overflow-hidden border border-champagne-300/40 shadow-sm group hover:shadow-luxury-soft transition-all duration-500 flex flex-col justify-between"
                >
                  <div className="relative aspect-square overflow-hidden bg-sand image-zoom-container">
                    <img
                      src={prod.images.hero}
                      alt={prod.images.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="p-2 bg-pearl-100/90 rounded-full text-obsidian hover:bg-champagne-200 transition-colors shadow-sm"
                        aria-label="Inspect piece"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="font-serif-luxury text-lg text-obsidian line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs font-mono text-gold-dark font-medium mt-0.5">
                        ₹{prod.price}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full py-2 bg-obsidian text-pearl-100 text-[11px] uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors"
                    >
                      Add to Bag
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 relative aspect-video rounded-2xl overflow-hidden shadow-md">
                <img
                  src={activeCollection.featuredImage}
                  alt={activeCollection.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
