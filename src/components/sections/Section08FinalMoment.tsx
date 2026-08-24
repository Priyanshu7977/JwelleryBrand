import React from 'react';
import { MagneticButton } from '../ui/MagneticButton';
import { Sparkles, ArrowUp } from 'lucide-react';

export const Section08FinalMoment: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-warm-ivory-100 overflow-hidden text-center border-t border-champagne-300/40">
      {/* Soft Ambient Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-champagne-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <div className="max-w-5xl mx-auto space-y-10 relative z-10">
        
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pearl-100 border border-champagne-300/60 text-[11px] uppercase tracking-widest text-gold-dark font-medium shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Act 08 — The Atelier Finale</span>
        </div>

        {/* Large Typography Transition */}
        <div className="space-y-4">
          <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-obsidian font-bold leading-[0.95] tracking-tight uppercase">
            redefined <br />
            <span className="italic font-light lowercase text-gold-dark">for all.</span>
          </h2>

          <p className="font-serif italic text-xl sm:text-2xl md:text-3xl text-obsidian/80 max-w-xl mx-auto pt-2">
            Find something that feels like you.
          </p>
        </div>

        <p className="max-w-md mx-auto text-xs sm:text-sm text-obsidian-soft font-sans leading-relaxed">
          From subtle everyday chains to grand celebration hampers, every piece is curated to capture your moments in gold.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <MagneticButton
            variant="primary"
            size="lg"
            onClick={() => {
              document.querySelector('#section-reveal')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>Explore Celestia Collections</span>
          </MagneticButton>

          <button
            onClick={scrollToTop}
            className="h-12 px-7 rounded-full border border-champagne-300/80 hover:bg-champagne-100/60 text-obsidian font-sans text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
};
