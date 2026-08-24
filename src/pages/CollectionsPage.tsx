import React from 'react';
import { Link } from 'react-router-dom';
import { CELESTIA_COLLECTIONS } from '../data/shopify-data';
import { MagneticButton } from '../components/ui/MagneticButton';
import { ArrowRight, Compass } from 'lucide-react';

export const CollectionsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-20 sm:pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Compact Editorial Header */}
        <div className="space-y-1.5 max-w-2xl border-b border-champagne-300/40 pb-4 sm:pb-6">
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

        {/* Collections Editorial List */}
        <div className="space-y-6 sm:space-y-8">
          {CELESTIA_COLLECTIONS.map((col, idx) => (
            <div
              key={col.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center p-4 sm:p-6 rounded-3xl bg-white/90 border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-300"
            >
              {/* Image Frame (5 Cols) */}
              <div className={`lg:col-span-5 relative rounded-2xl overflow-hidden bg-sand aspect-[16/10] max-h-[240px] shadow-inner ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                <img
                  src={col.featuredImage}
                  alt={col.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest bg-white/90 text-obsidian px-2.5 py-0.5 rounded-full border border-champagne-300/60 font-bold shadow-sm">
                    Realm 0{idx + 1}
                  </span>
                </div>
              </div>

              {/* Narrative Details (7 Cols) */}
              <div className={`lg:col-span-7 space-y-3 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
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

                <div className="flex flex-wrap gap-1 pt-0.5">
                  {col.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 bg-pearl-50 text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="pt-1">
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

export default CollectionsPage;
