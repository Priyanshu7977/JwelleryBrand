import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, MapPin, Instagram, ArrowRight, Sparkles } from 'lucide-react';
import { BRAND_INFO, FOUNDER_INFO } from '../data/shopify-data';

export const TheWorldPage: React.FC = () => {
  const chapters = [
    {
      num: '01',
      subtitle: 'The Inception',
      title: 'Redefined for All.',
      text: 'Luxury had become too stiff, unapproachable, and locked behind heavy mahogany counters. Celestia was born in Mumbai with a singular conviction: that fine adornments, shimmering bangles, and thoughtful gifting should be intimate, accessible, and worn without hesitation every single day.',
      accent: 'Adornment is not a luxury for special days; it is a ritual of self-love.'
    },
    {
      num: '02',
      subtitle: 'The Mumbai Atelier',
      title: 'Crafted in Coastal Light.',
      text: 'From our bustling studio in Mumbai, every piece is inspected under soft daylight. We pioneered same-day Mumbai express deliveries because celebration moments—birthdays, dates, anniversaries—often happen spontaneously and deserve immediate magic.',
      accent: 'Same-day Mumbai courier active daily across Bandra, South Mumbai, and suburbs.'
    },
    {
      num: '03',
      subtitle: 'The Science of Shine',
      title: '100% Anti-Tarnish Promise.',
      text: 'Nothing breaks the heart more than a favourite ring or bangle turning dull after a shower. Every Celestia metal creation is treated with our proprietary protective dual-dip seal—making it waterproof, sweat-resistant, and shower-safe for your real life.',
      accent: 'Tested for continuous daily wear without color fade.'
    },
    {
      num: '04',
      subtitle: 'The Emotional Keepsake',
      title: 'Wax Seals & Fuji Polaroids.',
      text: 'Gifting is an emotional dialogue. When you curate a Celestia hamper, we print your personal memories on retro glossy emulsion photo cardstock, enclosed in a protective envelope sealed with warm gold wax.',
      accent: 'Twenty tangible moments preserved forever.'
    },
    {
      num: '05',
      subtitle: '1,000+ Dispatches',
      title: 'An Instagram-First Movement.',
      text: 'From a private Instagram page @celestiaamor.in to over 1,000 parcels delivered across Mumbai and Pan-India, our community is built on genuine trust, word-of-mouth love, and unboxing smiles.',
      accent: 'A community that wears their world with pride.'
    }
  ];

  const cleanedQuote = FOUNDER_INFO.quote.replace(/^["']|["']$/g, '');

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 md:pt-36 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Full-Width Cinematic Header */}
        <div className="text-center space-y-1.5 max-w-2xl mx-auto border-b border-champagne-300/40 pb-4 sm:pb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pearl-50 border border-champagne-300/80 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>The Celestia Universe</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-tight">
            THE <span className="italic font-normal text-gold-dark">World</span>.
          </h1>

          <p className="italic text-sm sm:text-base text-obsidian-soft max-w-lg mx-auto leading-relaxed">
            "A tactile world where modern jewellery meets vintage emotion."
          </p>
        </div>

        {/* ========================================================================= */}
        {/* FULL-WIDTH FOUNDER / OWNER SPOTLIGHT HERO CARD (Fitted on Screen)         */}
        {/* ========================================================================= */}
        <div className="w-full bg-white/95 p-5 sm:p-7 lg:p-8 rounded-3xl border border-champagne-300/70 shadow-luxury-soft">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
            
            {/* Owner Picture (5 Cols) */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[4/3] sm:aspect-square max-h-[320px] rounded-2xl overflow-hidden bg-sand shadow-lg border border-champagne-300/60 relative">
                <img
                  src={FOUNDER_INFO.image}
                  alt={FOUNDER_INFO.altText}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = FOUNDER_INFO.fallbackImage;
                  }}
                  className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.02]"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>

              {/* Studio Badge */}
              <div className="mt-2.5 sm:mt-0 sm:absolute sm:-bottom-4 sm:-right-2 p-3 bg-white/95 backdrop-blur-md rounded-xl shadow-md border border-champagne-300/80 space-y-0.5">
                <div className="flex items-center gap-1 text-gold-dark font-mono text-[10px] uppercase tracking-wider font-bold">
                  <MapPin className="w-3 h-3" />
                  <span>{FOUNDER_INFO.location}</span>
                </div>
                <p className="text-xs font-bold text-obsidian">
                  {FOUNDER_INFO.title}
                </p>
              </div>
            </div>

            {/* Owner Story Narrative (7 Cols) */}
            <div className="lg:col-span-7 space-y-3 sm:space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                    About The Founder
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                  <span className="text-xs italic text-obsidian/60 font-medium">Mumbai Studio Origins</span>
                </div>

                <h2 className="text-xl sm:text-3xl font-bold text-obsidian uppercase leading-snug">
                  The Person Behind <span className="italic font-normal text-gold-dark">Celestia</span>.
                </h2>
              </div>

              <blockquote className="border-l-2 border-gold-dark pl-3 italic text-xs sm:text-sm text-obsidian/90 font-medium">
                "{cleanedQuote}"
              </blockquote>

              <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                {FOUNDER_INFO.storyParagraph1}
              </p>

              <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                {FOUNDER_INFO.storyParagraph2}
              </p>

              <div className="pt-1 flex flex-wrap items-center gap-2.5">
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 px-5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-wider hover:bg-obsidian-200 transition-all inline-flex items-center gap-2 shadow-md"
                >
                  <Instagram className="w-3.5 h-3.5 text-champagne-300" />
                  <span>Follow @celestiaamor.in</span>
                </a>

                <Link
                  to="/shop"
                  className="h-10 px-5 rounded-full border border-champagne-300/80 hover:bg-champagne-100/60 text-obsidian text-xs uppercase font-bold tracking-wider transition-all inline-flex items-center gap-1.5"
                >
                  <span>Explore Pieces</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================================= */}
        {/* FULL-WIDTH 5 CORE PRINCIPLES GRID                                         */}
        {/* ========================================================================= */}
        <div className="space-y-5 pt-2">
          <div className="text-center space-y-1 pb-1">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
              Our Five Core Principles
            </span>
            <h3 className="text-xl sm:text-3xl font-bold text-obsidian uppercase">
              How We Craft Every Moment
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {chapters.map((ch) => (
              <div
                key={ch.num}
                className="p-5 rounded-3xl bg-white/90 border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-2xl font-light text-gold-dark/60">
                      {ch.num}
                    </span>
                    <span className="text-[9px] uppercase font-mono tracking-widest text-gold-dark font-bold px-2 py-0.5 bg-pearl-50 rounded-full border border-champagne-300/50">
                      {ch.subtitle}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-obsidian leading-snug">
                    {ch.title}
                  </h4>

                  <p className="text-xs text-obsidian/75 leading-relaxed">
                    {ch.text}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-champagne-300/40">
                  <blockquote className="border-l-2 border-gold-dark pl-2.5 italic text-xs text-obsidian/90">
                    "{ch.accent}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TheWorldPage;
