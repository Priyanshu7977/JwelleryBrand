import React from 'react';
import { Link } from 'react-router-dom';
import { BRAND_INFO, FOUNDER_INFO } from '../data/shopify-data';
import { MagneticButton } from '../components/ui/MagneticButton';
import { Sparkles, MapPin, ShieldCheck, Heart, Award, ArrowRight, Instagram, Compass, Truck, Video } from 'lucide-react';

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

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 pb-32 px-6 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-[1500px] mx-auto space-y-20">
        
        {/* Cinematic Universe Header */}
        <div className="text-center space-y-4 max-w-4xl mx-auto border-b border-champagne-300/40 pb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] uppercase tracking-monumental text-gold-dark font-medium shadow-sm">
            <Compass className="w-3.5 h-3.5" />
            <span>The Celestia Universe</span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-9xl text-obsidian uppercase font-normal leading-[0.9]">
            THE <span className="italic font-light text-gold-dark">World</span>.
          </h1>

          <p className="font-serif italic text-xl sm:text-2xl text-obsidian/85 max-w-2xl mx-auto leading-relaxed">
            "A tactile world where modern jewellery meets vintage emotion."
          </p>
        </div>

        {/* Chapter Journey Flow */}
        <div className="space-y-20 max-w-5xl mx-auto">
          {chapters.map((ch, idx) => (
            <div
              key={ch.num}
              className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-start p-8 md:p-12 rounded-3xl bg-pearl-50/90 border border-champagne-300/50 shadow-luxury-soft"
            >
              {/* Chapter Number Badge (3 Cols) */}
              <div className="md:col-span-3 space-y-2">
                <span className="font-mono text-4xl sm:text-5xl font-light text-gold-dark/60 block">
                  {ch.num}
                </span>
                <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold block">
                  {ch.subtitle}
                </span>
              </div>

              {/* Narrative Content (9 Cols) */}
              <div className="md:col-span-9 space-y-5">
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian leading-snug">
                  {ch.title}
                </h2>

                <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
                  {ch.text}
                </p>

                <blockquote className="border-l-2 border-gold-dark pl-4 italic font-serif text-sm text-obsidian/90">
                  "{ch.accent}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        {/* Founder & Creative Direction Showcase — "FROM THE ATELIER" */}
        <div className="max-w-5xl mx-auto p-8 md:p-14 rounded-3xl bg-gradient-to-b from-pearl-50 to-champagne-100/40 border border-champagne-300/80 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-center">
            
            {/* High-End Editorial Founder Portrait Panel (5 Cols) */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-sand shadow-luxury-soft border border-champagne-300/70 relative transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={FOUNDER_INFO.image}
                  alt={FOUNDER_INFO.altText}
                  onError={(e) => {
                    // Fallback to SVG if webp is not found
                    (e.target as HTMLImageElement).src = FOUNDER_INFO.fallbackImage;
                  }}
                  className="w-full h-full object-cover filter brightness-[1.01] contrast-[1.01]"
                  style={{ objectPosition: 'center 20%' }}
                />
              </div>

              {/* Floating Curator Badge */}
              <div className="absolute -bottom-4 -right-2 sm:-right-4 p-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-champagne-300/80 max-w-[240px] space-y-0.5">
                <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-widest text-gold-dark font-mono font-semibold">
                  <MapPin className="w-3 h-3 text-gold-dark shrink-0" />
                  <span>{FOUNDER_INFO.location}</span>
                </div>
                <p className="font-serif text-xs text-obsidian font-semibold leading-tight">
                  {FOUNDER_INFO.title}
                </p>
              </div>
            </div>

            {/* Founder Message & Atelier Narrative (7 Cols) */}
            <div className="lg:col-span-7 space-y-6 lg:pl-2">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
                  {FOUNDER_INFO.subtitle}
                </span>
                <h3 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian leading-snug">
                  {FOUNDER_INFO.quote}
                </h3>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
                <p>{FOUNDER_INFO.storyParagraph1}</p>
                <p>{FOUNDER_INFO.storyParagraph2}</p>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <Link to="/shop">
                  <MagneticButton variant="primary" size="md">
                    <span>Discover The Collection</span>
                    <ArrowRight className="w-4 h-4" />
                  </MagneticButton>
                </Link>

                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-champagne-300/80 text-obsidian text-xs uppercase tracking-widest hover:bg-champagne-100/60 transition-colors"
                >
                  <Instagram className="w-4 h-4 text-champagne-400" />
                  <span>@celestiaamor.in</span>
                </a>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
