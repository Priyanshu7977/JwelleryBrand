import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS, BRAND_INFO, FOUNDER_INFO } from '../../data/shopify-data';
import { Sparkles, Heart, ArrowRight, MapPin, Instagram, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const ThePersonBehindCelestia: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useCart();
  const founderCurations = [FEATURED_PRODUCTS[0], FEATURED_PRODUCTS[1], FEATURED_PRODUCTS[4]];

  return (
    <section className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-espresso-deep text-pearl-50 border-t border-champagne-400/30 overflow-hidden selection:bg-champagne-300 selection:text-obsidian">
      {/* Ambient background radiance */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-champagne-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-rose-muted/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-16 relative z-10">
        
        {/* Header */}
        <div className="space-y-4 max-w-4xl border-b border-champagne-400/25 pb-8">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-mono tracking-widest text-champagne-300 font-bold">
              The Human Touch
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-champagne-300" />
            <span className="text-sm font-serif italic text-pearl-200">
              Mumbai Studio Origins
            </span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-pearl-50 uppercase font-normal leading-[0.95]">
            FROM THE <span className="italic font-light text-champagne-200">Atelier</span>.
          </h2>

          <p className="font-serif italic text-2xl sm:text-3xl text-pearl-100 leading-relaxed max-w-3xl">
            "I wanted to build a world where jewellery is never intimidating—where every package you receive feels like a warm embrace from a friend."
          </p>
        </div>

        {/* 2-Column Founder Reveal & Personal Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          
          {/* High-End Editorial Founder Portrait Panel (5 Cols) */}
          <div className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-espresso-charcoal shadow-2xl border border-champagne-400/40 relative transition-transform duration-500 hover:scale-[1.02]">
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

            {/* Founder Atelier Badge */}
            <div className="absolute -bottom-6 -right-2 sm:-right-4 p-5 bg-espresso-charcoal/95 backdrop-blur-md rounded-2xl shadow-2xl border border-champagne-400/50 max-w-xs space-y-1.5">
              <div className="flex items-center gap-1.5 text-champagne-300 font-mono text-xs uppercase tracking-wider font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{FOUNDER_INFO.location}</span>
              </div>
              <p className="font-serif-luxury text-base text-pearl-50 font-bold">
                {FOUNDER_INFO.title}
              </p>
              <p className="text-xs text-pearl-100 font-sans">
                Hand-curating pieces, wax seals, and custom polaroids daily.
              </p>
            </div>
          </div>

          {/* Narrative & Selected Curations (7 Cols) */}
          <div className="lg:col-span-7 space-y-8 lg:pl-4">
            <div className="space-y-4">
              <h3 className="font-serif-luxury text-3xl sm:text-4xl text-pearl-50 leading-snug">
                From a handwritten dream to 1,000+ happy homes across India.
              </h3>
              <p className="text-sm sm:text-base text-pearl-100 font-sans leading-relaxed">
                {FOUNDER_INFO.storyParagraph1}
              </p>
              <p className="text-sm sm:text-base text-pearl-100 font-sans leading-relaxed">
                {FOUNDER_INFO.storyParagraph2}
              </p>
            </div>

            {/* Founder's Personal Curations Showcase */}
            <div className="space-y-4 pt-4 border-t border-champagne-400/25">
              <span className="text-xs uppercase font-mono tracking-widest text-champagne-300 font-bold block">
                The Founder's Everyday Favourites:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {founderCurations.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 bg-espresso-charcoal/90 rounded-2xl border border-champagne-400/30 hover:border-champagne-300 transition-all space-y-3 group"
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-espresso-deep relative">
                      <img
                        src={item.images.hero}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif-luxury text-base text-pearl-50 line-clamp-1 font-bold">
                        {item.title}
                      </h4>
                      <p className="text-sm font-mono font-bold text-champagne-200">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="flex-1 h-9 bg-champagne-300 hover:bg-champagne-200 text-obsidian text-[11px] uppercase font-mono tracking-wider font-bold rounded-full transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Bag</span>
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(item)}
                        className="w-9 h-9 border border-champagne-400/40 hover:bg-champagne-400/20 text-pearl-50 rounded-full transition-colors flex items-center justify-center"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                to="/the-world"
                className="h-12 px-8 rounded-full bg-champagne-300 hover:bg-champagne-200 text-obsidian font-sans text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Discover The Full Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-12 px-8 rounded-full border border-champagne-400/40 hover:bg-champagne-400/20 text-pearl-50 font-sans text-xs uppercase tracking-widest font-bold transition-all inline-flex items-center justify-center gap-2"
              >
                <Instagram className="w-4 h-4 text-champagne-300" />
                <span>@celestiaamor.in</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
