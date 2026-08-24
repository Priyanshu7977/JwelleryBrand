import React from 'react';
import { Link } from 'react-router-dom';
import { CELESTIA_COLLECTIONS } from '../data/shopify-data';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { ProductTiltCard } from '../components/motion/ProductTiltCard';

export const CollectionsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 md:pt-36 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Compact Editorial Header with Room for Floating Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="space-y-1.5 max-w-2xl border-b border-champagne-300/40 pb-4 sm:pb-5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                The Five Realms
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs italic text-obsidian/60 font-medium">
                Curated Universes
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-tight">
              CURATED <span className="italic font-normal text-gold-dark">Collections</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
              Explore our curated realms of sculptural fine jewellery, handcrafted artisanal bangles, custom celebration hampers, and retro polaroid keepsakes.
            </p>
          </div>
        </RevealOnScroll>

        {/* Collections Editorial List - Balanced Proportions */}
        <div className="space-y-6 sm:space-y-8">
          {CELESTIA_COLLECTIONS.map((col, idx) => (
            <RevealOnScroll key={col.id} direction="up" delay={idx * 80}>
              <div
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center p-5 sm:p-6 lg:p-7 rounded-3xl bg-white/95 border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-400"
              >
                {/* Image Frame (5 Cols) with Tilt & Sheen */}
                <div className={`lg:col-span-5 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <ProductTiltCard className="rounded-2xl overflow-hidden bg-sand aspect-[16/10] max-h-[220px] shadow-sm relative luxury-sheen">
                    <img
                      src={col.featuredImage}
                      alt={col.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-108"
                    />
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-widest bg-white/95 text-obsidian px-2.5 py-0.5 rounded-full border border-champagne-300/60 font-bold shadow-sm">
                        Realm 0{idx + 1}
                      </span>
                    </div>
                  </ProductTiltCard>
                </div>

                {/* Narrative Details (7 Cols) - Centered & Aligned */}
                <div className={`lg:col-span-7 flex flex-col justify-center space-y-2.5 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                      <Compass className="w-3.5 h-3.5" />
                      <span>{col.productCount} Handcrafted Pieces</span>
                    </div>

                    <h2 className="text-xl sm:text-3xl font-bold text-obsidian leading-snug">
                      {col.title}
                    </h2>
                    <p className="text-[11px] uppercase tracking-widest text-obsidian-muted font-mono font-bold">
                      {col.subtitle}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed line-clamp-2">
                    {col.editorialNarrative}
                  </p>

                  <blockquote className="border-l-2 border-gold-dark pl-3 italic text-xs text-obsidian/85">
                    "{col.accentQuote}"
                  </blockquote>

                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {col.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-0.5 bg-pearl-50 text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40 font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-1.5">
                    <Link
                      to={`/collections/${col.handle}`}
                      className="btn-primary group h-10 px-5 text-xs uppercase font-bold tracking-widest inline-flex items-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
                    >
                      <span>Explore {col.title}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1.5 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>

              </div>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CollectionsPage;
