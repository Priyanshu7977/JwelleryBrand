import React, { useState } from 'react';
import { CELESTIA_COLLECTIONS, FEATURED_PRODUCTS } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { MagneticButton } from '../ui/MagneticButton';
import { ArrowRight, Compass, Eye, ShoppingBag } from 'lucide-react';

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
      className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-pearl-100 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Ambient background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blush-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-6 sm:pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                Act 03 — Collection Journey
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs sm:text-sm italic text-obsidian/60 font-medium">The Five Realms</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-[1.05]">
              Curated for <span className="italic font-normal text-gold-dark">Every Mood</span>.
            </h2>
          </div>

          <p className="max-w-md text-xs sm:text-sm text-obsidian-soft leading-relaxed">
            Move between sculptural fine jewellery, fluid artisanal bangles, and bespoke personalised gifting boxes.
          </p>
        </div>

        {/* Category Selector Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {CELESTIA_COLLECTIONS.map((col, idx) => {
            const isActive = col.id === activeCollectionId;
            return (
              <button
                key={col.id}
                onClick={() => setActiveCollectionId(col.id)}
                className={`text-left p-3.5 sm:p-5 rounded-2xl transition-all duration-300 relative overflow-hidden group ${
                  isActive
                    ? 'bg-obsidian text-pearl-100 shadow-luxury-soft scale-[1.02]'
                    : 'bg-white/80 hover:bg-white text-obsidian border border-champagne-300/60 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] tracking-widest font-mono opacity-70 mb-2">
                  <span>0{idx + 1}</span>
                  <span className="uppercase">{col.tags[0]}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold leading-snug">
                  {col.title}
                </h3>

                <p className={`text-[11px] mt-0.5 line-clamp-1 ${isActive ? 'text-champagne-200' : 'text-obsidian-soft'}`}>
                  {col.subtitle}
                </p>

                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gold-dark" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Category Immersive Showcase Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 items-center bg-sand/20 rounded-3xl p-5 sm:p-8 lg:p-10 border border-champagne-300/50 shadow-inner">
          
          {/* Left Narrative Frame */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-champagne-100 text-[10px] uppercase font-mono tracking-widest text-obsidian border border-champagne-300/60 font-bold">
              <Compass className="w-3.5 h-3.5 text-gold-dark" />
              <span>{activeCollection.productCount} Handcrafted Pieces</span>
            </div>

            <h3 className="text-2xl sm:text-4xl text-obsidian font-bold leading-tight">
              {activeCollection.title}
            </h3>

            <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
              {activeCollection.editorialNarrative}
            </p>

            <blockquote className="border-l-2 border-gold-dark pl-4 italic text-xs sm:text-sm text-obsidian/90">
              "{activeCollection.accentQuote}"
            </blockquote>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {activeCollection.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-pearl-50 text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40 font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="pt-2">
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

          {/* Right Product Grid Preview */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {matchingProducts.length > 0 ? (
              matchingProducts.slice(0, 2).map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl overflow-hidden border border-champagne-300/40 shadow-sm group hover:shadow-luxury-soft transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                    <img
                      src={prod.images.hero}
                      alt={prod.images.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 right-2.5">
                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="p-2 bg-pearl-100/90 rounded-full text-obsidian hover:bg-champagne-200 transition-colors shadow-sm"
                        aria-label="Inspect piece"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-obsidian line-clamp-1">
                        {prod.title}
                      </h4>
                      <p className="text-xs font-mono text-gold-dark font-bold mt-0.5">
                        ₹{prod.price}
                      </p>
                    </div>

                    <button
                      onClick={() => addToCart(prod, 1)}
                      className="w-full py-2 bg-obsidian text-pearl-100 text-[11px] uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5 font-bold"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Add to Bag</span>
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

export default Section03Collections;
