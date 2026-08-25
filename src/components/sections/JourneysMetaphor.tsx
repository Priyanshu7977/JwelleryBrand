import React from 'react';
import { MapPin, Truck, Sparkles, ShieldCheck, Heart, Award } from 'lucide-react';
import { BRAND_INFO } from '../../data/shopify-data';
import { AnimatedCounter } from '../ui/AnimatedCounter';

export const JourneysMetaphor: React.FC = () => {
  return (
    <section className="relative w-full py-28 md:py-36 px-6 md:px-12 bg-ivory-100 overflow-hidden border-t border-champagne-300/40">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto border-b border-champagne-300/40 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] uppercase tracking-monumental text-gold-dark font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Journey Metaphor</span>
          </div>

          <h2 className="site-main-title text-obsidian">
            <AnimatedCounter target={1000} suffix="+" /> <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">journeys</span>.
          </h2>

          <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed max-w-xl mx-auto">
            From our quiet studio in Mumbai to doorsteps across Delhi, Bengaluru, Kolkata, Chennai, and beyond. Every parcel is an artistic journey of personal love.
          </p>
        </div>

        {/* Artistic Mumbai to Pan-India Radial Web */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Left Spatial Constellation Map (7 Cols) */}
          <div className="lg:col-span-7 relative h-[360px] sm:h-[420px] bg-sand/30 rounded-3xl border border-champagne-300/60 p-6 flex items-center justify-center overflow-hidden">
            {/* Ambient concentric dispatch ripples */}
            <div className="absolute w-72 h-72 rounded-full border border-champagne-400/40 animate-ping opacity-25 pointer-events-none" />
            <div className="absolute w-96 h-96 rounded-full border border-champagne-400/20 pointer-events-none" />

            {/* Center Origin: Mumbai Studio */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-obsidian text-pearl-100 flex items-center justify-center shadow-xl border-2 border-champagne-300">
                <MapPin className="w-7 h-7 text-champagne-300" />
              </div>
              <span className="font-serif-luxury text-base font-bold text-obsidian mt-2">MUMBAI ATELIER</span>
              <span className="text-[10px] uppercase font-mono text-gold-dark tracking-widest font-semibold">Origin of Every Sparkle</span>
            </div>

            {/* Orbiting Destination Nodes */}
            <div className="absolute top-12 left-16 px-3 py-1.5 bg-pearl-50 rounded-full border border-champagne-300/80 shadow-md text-[10px] font-sans uppercase tracking-wider text-obsidian flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
              Delhi NCR
            </div>

            <div className="absolute bottom-16 left-20 px-3 py-1.5 bg-pearl-50 rounded-full border border-champagne-300/80 shadow-md text-[10px] font-sans uppercase tracking-wider text-obsidian flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
              Bengaluru
            </div>

            <div className="absolute top-20 right-16 px-3 py-1.5 bg-pearl-50 rounded-full border border-champagne-300/80 shadow-md text-[10px] font-sans uppercase tracking-wider text-obsidian flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
              Kolkata
            </div>

            <div className="absolute bottom-12 right-20 px-3 py-1.5 bg-pearl-50 rounded-full border border-champagne-300/80 shadow-md text-[10px] font-sans uppercase tracking-wider text-obsidian flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 animate-pulse" />
              Chennai
            </div>
          </div>

          {/* Right Metrics & Trust Narrative (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
                Genuine Brand Milestones
              </span>
              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian leading-snug">
                1,000+ unboxings. Infinite smiles.
              </h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-pearl-50 rounded-2xl border border-champagne-300/40 flex items-center gap-4">
                <div className="p-3 bg-champagne-200/80 rounded-xl text-obsidian font-mono font-bold text-lg">
                  <AnimatedCounter target={1000} suffix="+" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-obsidian">Parcels Dispatched</h4>
                  <p className="text-xs text-obsidian/60">Delivered across 120+ Indian cities and towns.</p>
                </div>
              </div>

              <div className="p-4 bg-pearl-50 rounded-2xl border border-champagne-300/40 flex items-center gap-4">
                <div className="p-3 bg-champagne-200/80 rounded-xl text-obsidian font-mono font-bold text-lg">
                  <AnimatedCounter target={100} suffix="%" />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-obsidian">Anti-Tarnish Assurance</h4>
                  <p className="text-xs text-obsidian/60">Shower-safe & waterproof everyday protection.</p>
                </div>
              </div>

              <div className="p-4 bg-pearl-50 rounded-2xl border border-champagne-300/40 flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl text-emerald-800 font-mono font-bold text-lg">
                  ⚡
                </div>
                <div>
                  <h4 className="font-serif text-sm font-semibold text-obsidian">Same-Day Mumbai Express</h4>
                  <p className="text-xs text-obsidian/60">Doorstep hand-delivery active every day.</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
