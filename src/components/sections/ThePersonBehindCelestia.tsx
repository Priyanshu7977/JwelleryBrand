import React from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS, BRAND_INFO, FOUNDER_INFO } from '../../data/shopify-data';
import { ArrowRight, MapPin, Instagram, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { RevealOnScroll } from '../motion/RevealOnScroll';
import { ProductTiltCard } from '../motion/ProductTiltCard';

export const ThePersonBehindCelestia: React.FC = () => {
  const { setQuickViewProduct, addToCart } = useCart();
  const founderCurations = [FEATURED_PRODUCTS[0], FEATURED_PRODUCTS[1], FEATURED_PRODUCTS[4]];

  return (
    <section className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-espresso-deep text-pearl-50 border-t border-champagne-400/30 overflow-hidden selection:bg-champagne-300 selection:text-obsidian">
      {/* Ambient background radiance */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-champagne-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-rose-muted/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12 relative z-10">
        
        {/* Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="space-y-3 max-w-4xl border-b border-champagne-400/25 pb-6 sm:pb-8">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-champagne-300 font-bold">
                The Human Touch
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-champagne-300" />
              <span className="text-xs sm:text-sm text-pearl-200 font-medium">
                Mumbai Studio Origins
              </span>
            </div>

            <h2 className="site-main-title text-pearl-50">
              From the <span className="font-zapfino text-champagne-300 font-normal tracking-normal lowercase inline-block px-1">atelier</span>
            </h2>

            <p className="text-base sm:text-xl text-pearl-100 leading-relaxed max-w-2xl font-serif">
              "I wanted to build a world where jewellery is never intimidating—where every package you receive feels like a warm embrace from a friend."
            </p>
          </div>
        </RevealOnScroll>

        {/* 2-Column Founder Reveal & Personal Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
          
          {/* Founder Portrait (5 Cols) with Parallax Float */}
          <RevealOnScroll direction="up" delay={150} className="lg:col-span-5 relative group">
            <div className="aspect-[4/5] max-h-[460px] rounded-3xl overflow-hidden bg-espresso-charcoal shadow-2xl border border-champagne-400/40 relative">
              <img
                src={FOUNDER_INFO.image}
                alt={FOUNDER_INFO.altText}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FOUNDER_INFO.fallbackImage;
                }}
                className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.02] transition-transform duration-700 group-hover:scale-105"
                style={{ objectPosition: 'center 20%' }}
              />
            </div>

            {/* Founder Atelier Badge with Floating Motion */}
            <div className="mt-3 sm:mt-0 sm:absolute sm:-bottom-5 sm:-right-3 p-3.5 sm:p-4 bg-espresso-charcoal/95 backdrop-blur-md rounded-2xl shadow-2xl border border-champagne-400/50 max-w-xs space-y-1 animate-subtle-float">
              <div className="flex items-center gap-1.5 text-champagne-300 font-mono text-xs uppercase tracking-wider font-bold">
                <MapPin className="w-3.5 h-3.5" />
                <span>{FOUNDER_INFO.location}</span>
              </div>
              <p className="text-sm font-bold text-pearl-50">
                {FOUNDER_INFO.title}
              </p>
              <p className="text-[11px] text-pearl-200">
                Hand-curating pieces, wax seals, and custom polaroids daily.
              </p>
            </div>
          </RevealOnScroll>

          {/* Narrative & Selected Curations (7 Cols) */}
          <RevealOnScroll direction="up" delay={250} className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <h3 className="text-2xl sm:text-3xl text-pearl-50 font-bold leading-snug">
                From a handwritten dream to 1,000+ happy homes across India.
              </h3>
              <p className="text-xs sm:text-sm text-pearl-100 leading-relaxed">
                {FOUNDER_INFO.storyParagraph1}
              </p>
              <p className="text-xs sm:text-sm text-pearl-100 leading-relaxed">
                {FOUNDER_INFO.storyParagraph2}
              </p>
            </div>

            {/* Founder's Curations Row */}
            <div className="space-y-3 pt-3 border-t border-champagne-400/25">
              <span className="text-[11px] uppercase font-mono tracking-widest text-champagne-300 font-bold block">
                The Founder's Everyday Favourites:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {founderCurations.map((item, fIdx) => (
                  <ProductTiltCard
                    key={item.id}
                    className="p-3 bg-espresso-charcoal/90 rounded-2xl border border-champagne-400/30 hover:border-champagne-300 transition-all space-y-2 group flex flex-col justify-between"
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden bg-espresso-deep relative luxury-sheen">
                      <img
                        src={item.images.hero}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-pearl-50 truncate">
                        {item.title}
                      </h4>
                      <p className="text-xs font-mono font-bold text-champagne-200">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex gap-1.5 pt-1">
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="flex-1 h-8 bg-champagne-300 hover:bg-champagne-200 active:scale-[0.98] text-obsidian text-[10px] uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-1 shadow-sm"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Bag</span>
                      </button>
                      <button
                        onClick={() => setQuickViewProduct(item)}
                        className="w-8 h-8 border border-champagne-400/40 hover:bg-champagne-400/20 active:scale-[0.98] text-pearl-50 rounded-full transition-all flex items-center justify-center shrink-0"
                        title="Quick View"
                      >
                        <Eye className="w-3 h-3" />
                      </button>
                    </div>
                  </ProductTiltCard>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Link
                to="/the-world"
                className="h-11 px-6 rounded-full bg-champagne-300 hover:bg-champagne-200 text-obsidian text-xs uppercase tracking-widest font-bold active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Discover The Full Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="h-11 px-6 rounded-full border border-champagne-400/40 hover:bg-champagne-400/20 text-pearl-50 text-xs uppercase tracking-widest font-bold active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2"
              >
                <Instagram className="w-3.5 h-3.5 text-champagne-300" />
                <span>@celestiaamor.in</span>
              </a>
            </div>

          </RevealOnScroll>

        </div>

      </div>
    </section>
  );
};

export default ThePersonBehindCelestia;
