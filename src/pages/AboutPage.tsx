import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_INFO, FOUNDER_INFO } from '../data/shopify-data';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Sparkles, MapPin, Heart, ShieldCheck, Award, ArrowRight, Instagram } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 pb-32 px-6 md:px-12 selection:bg-champagne-300">
      {/* Background Decor */}
      <div className="absolute top-24 left-1/4 w-96 h-96 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Hero Editorial Narrative */}
        <div className="space-y-4 max-w-4xl border-b border-champagne-300/40 pb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
              The Atelier Story
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
            <span className="text-xs font-serif italic text-obsidian/60">
              Mumbai Roots • Pan-India Reach
            </span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian font-normal uppercase leading-[0.92]">
            THE SOUL OF <span className="italic font-light text-gold-dark">CELestia</span>.
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-obsidian/85 leading-relaxed">
            "We believe fine jewellery and emotional gifting should not be reserved for rare occasions. It should belong to every day you choose to feel extraordinary."
          </p>
        </div>

        {/* 2-Column Editorial Spread with Founder & Origin */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
          
          {/* Founder Image Frame (5 Cols) */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-sand shadow-luxury-soft border border-champagne-300/60 relative transition-transform duration-500 hover:scale-[1.02]">
              <img
                src={FOUNDER_INFO.image}
                alt={FOUNDER_INFO.altText}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FOUNDER_INFO.fallbackImage;
                }}
                className="w-full h-full object-cover filter brightness-[1.01] contrast-[1.01]"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>

            {/* Founder Caption Tag */}
            <div className="absolute -bottom-6 -right-4 md:-right-6 p-5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-champagne-300/80 max-w-xs space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-gold-dark font-mono font-semibold block">
                The Creative Vision
              </span>
              <p className="font-serif text-sm text-obsidian font-medium">
                {FOUNDER_INFO.title}
              </p>
              <p className="text-[11px] text-obsidian/60 font-sans">
                Curating everyday magic from our Mumbai studio for clients across India.
              </p>
            </div>
          </div>

          {/* Narrative Text (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 lg:pl-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs text-gold-dark font-mono uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Born in Mumbai • 1000+ Orders</span>
              </div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian leading-snug">
                An Instagram-first movement built on genuine warmth.
              </h2>
              <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
                What began as handpicked collections shared on <a href={BRAND_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-obsidian underline underline-offset-4 hover:text-gold-dark">@celestiaamor.in</a> has grown into a cherished community with over 1,000 orders dispatched across Mumbai and Pan-India.
              </p>
              <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
                From same-day courier dispatches across Mumbai suburbs to bespoke wax-sealed celebration hampers, we ensure every unboxing feels like a personal love letter.
              </p>
            </div>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-champagne-300/30">
              <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/40 space-y-2">
                <ShieldCheck className="w-5 h-5 text-gold-dark" />
                <h3 className="font-serif text-base text-obsidian font-semibold">100% Anti-Tarnish</h3>
                <p className="text-[11px] text-obsidian/70">
                  Shower-safe, waterproof, and crafted for daily wear.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/40 space-y-2">
                <Heart className="w-5 h-5 text-gold-dark" />
                <h3 className="font-serif text-base text-obsidian font-semibold">Bespoke Empathy</h3>
                <p className="text-[11px] text-obsidian/70">
                  Custom polaroid prints & handwritten notes in every gift.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/40 space-y-2">
                <Award className="w-5 h-5 text-gold-dark" />
                <h3 className="font-serif text-base text-obsidian font-semibold">Mumbai Atelier</h3>
                <p className="text-[11px] text-obsidian/70">
                  Same-day delivery active daily across Mumbai.
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link to="/shop">
                <MagneticButton variant="primary" size="md">
                  <span>Discover Catalogue</span>
                  <ArrowRight className="w-4 h-4" />
                </MagneticButton>
              </Link>

              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-champagne-300/70 text-obsidian text-xs uppercase tracking-widest hover:bg-champagne-100/60 transition-colors"
              >
                <Instagram className="w-4 h-4 text-champagne-400" />
                <span>@celestiaamor.in</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
