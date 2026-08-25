import React from 'react';
import { Sparkles, MapPin, Award, HeartHandshake } from 'lucide-react';
import { BRAND_INFO } from '../../data/shopify-data';

export const Section04World: React.FC = () => {
  return (
    <section
      id="section-world"
      className="relative w-full py-28 md:py-40 px-6 md:px-12 bg-ivory-50 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Massive Editorial Headline Spread */}
        <div className="space-y-4 max-w-4xl">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
              Act 04 — The Celestia World
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
            <span className="text-xs font-serif text-obsidian/60">Philosophy & Origin</span>
          </div>

          <h2 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold leading-[1.08]">
            Little things <br />
            <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">that become</span> <br />
            your moments.
          </h2>
        </div>

        {/* Asymmetrical Parallax Storytelling Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-center">
          
          {/* Left Column: Handcraft & Origin Image */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-luxury-soft border border-champagne-300/60 bg-sand image-zoom-container">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop"
                alt="Celestia Mumbai Atelier Craftsmanship"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Floating Mumbai Studio Origin Tag */}
            <div className="absolute -bottom-6 -left-4 md:-left-6 p-4 bg-pearl-50 rounded-2xl shadow-xl border border-champagne-300/80 max-w-xs space-y-1">
              <div className="flex items-center gap-1.5 text-gold-dark text-[10px] uppercase tracking-widest font-semibold">
                <MapPin className="w-3.5 h-3.5" />
                <span>Born in Mumbai</span>
              </div>
              <p className="text-xs text-obsidian/80 font-serif">
                Hand-curated in our coastal studio with same-day express dispatch across Mumbai.
              </p>
            </div>
          </div>

          {/* Right Column: Layered Editorial Pillars */}
          <div className="lg:col-span-7 space-y-8 lg:pl-6">
            <div className="space-y-6">
              <p className="font-serif text-xl sm:text-2xl text-obsidian/90 leading-relaxed">
                Celestia was founded on a singular premise: luxury should not be locked behind velvet ropes or reserved for once-a-year occasions.
              </p>
              
              <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed font-sans">
                Every necklace, cuff, and bespoke hamper is curated to withstand the rhythm of everyday life. Featuring hypoallergenic stainless steel cores, 18K gold physical vapour deposition, and genuine organic baroque freshwater pearls, our pieces never ask you to compromise between beauty and endurance.
              </p>
            </div>

            {/* 3 Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-champagne-300/40">
              <div className="p-4 rounded-2xl bg-pearl-100/70 border border-champagne-300/30 space-y-2">
                <Sparkles className="w-5 h-5 text-gold-dark" />
                <h4 className="font-serif-luxury text-base text-obsidian font-semibold">100% Anti-Tarnish</h4>
                <p className="text-[11px] text-obsidian/70 leading-snug">
                  Waterproof and shower-safe. Designed for daily wear without fading.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pearl-100/70 border border-champagne-300/30 space-y-2">
                <HeartHandshake className="w-5 h-5 text-gold-dark" />
                <h4 className="font-serif-luxury text-base text-obsidian font-semibold">Bespoke Empathy</h4>
                <p className="text-[11px] text-obsidian/70 leading-snug">
                  Custom polaroid prints and hand-written wax-sealed notes in every hamper.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pearl-100/70 border border-champagne-300/30 space-y-2">
                <Award className="w-5 h-5 text-gold-dark" />
                <h4 className="font-serif-luxury text-base text-obsidian font-semibold">1000+ Journeys</h4>
                <p className="text-[11px] text-obsidian/70 leading-snug">
                  Trusted across Mumbai and all states with Pan-India express delivery.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
