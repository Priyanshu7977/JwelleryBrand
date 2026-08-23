import React from 'react';
import { Link } from 'react-router-dom';
import { CELESTIA_COLLECTIONS } from '../data/shopify-data';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      {/* Background Ambience */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Editorial Header */}
        <div className="space-y-4 max-w-3xl border-b border-champagne-300/40 pb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
              The Five Realms
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
            <span className="text-xs font-serif italic text-obsidian/60">
              Curated Universes
            </span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian font-normal uppercase leading-[0.92]">
            CURATED <span className="italic font-light text-gold-dark">Collections</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
            Explore our curated realms of sculptural fine jewellery, handcrafted artisanal bangles, custom celebration hampers, and retro polaroid keepsakes.
          </p>
        </div>

        {/* Collections Editorial List */}
        <div className="space-y-12">
          {CELESTIA_COLLECTIONS.map((col, idx) => (
            <div
              key={col.id}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center p-6 md:p-12 rounded-3xl bg-pearl-50/90 border border-champagne-300/50 shadow-sm hover:shadow-luxury-soft transition-all duration-700 ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Image Frame (6 Cols) */}
              <div className={`lg:col-span-6 relative rounded-2xl overflow-hidden bg-sand aspect-[16/10] image-zoom-container shadow-inner ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img
                  src={col.featuredImage}
                  alt={col.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-pearl-100/90 text-obsidian px-3 py-1 rounded-full border border-champagne-300/60 shadow-sm">
                    Realm 0{idx + 1}
                  </span>
                </div>
              </div>

              {/* Narrative Details (6 Cols) */}
              <div className={`lg:col-span-6 space-y-6 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-gold-dark font-semibold">
                    <Compass className="w-3.5 h-3.5" />
                    <span>{col.productCount} Handcrafted Pieces</span>
                  </div>

                  <h2 className="font-serif-luxury text-3xl sm:text-5xl text-obsidian leading-tight">
                    {col.title}
                  </h2>
                  <p className="text-xs uppercase tracking-widest text-obsidian/50 font-sans">
                    {col.subtitle}
                  </p>
                </div>

                <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
                  {col.editorialNarrative}
                </p>

                <blockquote className="border-l-2 border-gold-dark pl-4 italic font-serif text-sm text-obsidian/85">
                  "{col.accentQuote}"
                </blockquote>

                <div className="flex flex-wrap gap-2 pt-1">
                  {col.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-white text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-2">
                  <Link to={`/collections/${col.handle}`}>
                    <MagneticButton variant="primary" size="md">
                      <span>Explore {col.title}</span>
                      <ArrowRight className="w-4 h-4" />
                    </MagneticButton>
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
