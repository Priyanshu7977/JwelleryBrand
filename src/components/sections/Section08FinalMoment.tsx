import React from 'react';
import { MagneticButton } from '../ui/MagneticButton';
import { Sparkles, ArrowUp } from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';

export const Section08FinalMoment: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-warm-ivory-100 overflow-hidden text-center border-t border-champagne-300/40">
      {/* Soft Ambient Radiance */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-champagne-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />

      <RevealOnScroll direction="up" delay={0}>
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pearl-100 border border-champagne-300/60 text-[11px] uppercase tracking-widest text-gold-dark font-medium shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Act 08 — The Atelier Finale</span>
          </div>

          {/* Large Typography Transition */}
          <div className="space-y-3">
            <h2 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-obsidian font-bold leading-[0.95] tracking-tight">
              Redefined <br />
              <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block text-[44px] sm:text-[68px] md:text-[84px] leading-[0.9] px-1">for all.</span>
            </h2>

            <p className="text-xl sm:text-2xl md:text-3xl text-obsidian/80 font-serif max-w-xl mx-auto pt-2 font-medium">
              Find something that feels like you.
            </p>
          </div>

          <p className="max-w-md mx-auto text-xs sm:text-sm text-obsidian-soft leading-relaxed">
            From subtle everyday chains to grand celebration hampers, every piece is curated to capture your moments in gold.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-3">
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
              className="h-12 px-7 rounded-full border border-champagne-300/80 hover:bg-champagne-100/60 active:scale-[0.98] text-obsidian text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </RevealOnScroll>
    </section>
  );
};

export default Section08FinalMoment;
