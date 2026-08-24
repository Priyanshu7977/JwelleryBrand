import React from 'react';
import { CUSTOMER_REVIEWS, BRAND_INFO } from '../../data/shopify-data';
import { Star, Sparkles, CheckCircle2, Truck, ShieldCheck, Heart } from 'lucide-react';

export const Section06SocialProof: React.FC = () => {
  return (
    <section
      id="section-community"
      className="relative w-full py-28 md:py-40 px-6 md:px-12 bg-ivory-100 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-noise opacity-30 pointer-events-none" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-20">
        
        {/* Top Verified Metric Band */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-10 px-8 rounded-3xl bg-pearl-50/90 border border-champagne-300/50 shadow-luxury-soft divide-y md:divide-y-0 md:divide-x divide-champagne-300/40 text-center">
          
          <div className="space-y-1 py-4 md:py-0">
            <span className="font-serif-luxury text-5xl sm:text-6xl text-obsidian font-normal">
              1,000<span className="text-gold-dark">+</span>
            </span>
            <p className="text-[11px] uppercase tracking-widest text-obsidian/60 font-sans">
              Orders Dispatched
            </p>
          </div>

          <div className="space-y-1 py-4 md:py-0">
            <span className="font-serif-luxury text-5xl sm:text-6xl text-obsidian font-normal">
              4.95<span className="text-gold-dark text-3xl">/5</span>
            </span>
            <p className="text-[11px] uppercase tracking-widest text-obsidian/60 font-sans">
              Client Satisfaction
            </p>
          </div>

          <div className="space-y-1 py-4 md:py-0">
            <span className="font-serif-luxury text-5xl sm:text-6xl text-obsidian font-normal">
              Mumbai
            </span>
            <p className="text-[11px] uppercase tracking-widest text-obsidian/60 font-sans">
              Same-Day Express Courier
            </p>
          </div>

          <div className="space-y-1 py-4 md:py-0">
            <span className="font-serif-luxury text-5xl sm:text-6xl text-obsidian font-normal">
              100%
            </span>
            <p className="text-[11px] uppercase tracking-widest text-obsidian/60 font-sans">
              Anti-Tarnish Seal
            </p>
          </div>

        </div>

        {/* Section Headline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
                Act 06 — Authentic Trust
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif text-obsidian/60">Reviews 🧿✨</span>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal leading-[0.95]">
              Praised by <span className="font-semibold text-gold-dark">Those Who Wear It</span>.
            </h2>
          </div>

          <p className="max-w-md text-xs md:text-sm text-obsidian/70 font-sans leading-relaxed">
            Real experiences from verified clients across Mumbai, Delhi, Bengaluru, and Pan-India.
          </p>
        </div>

        {/* Editorial Customer Review Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-3xl bg-pearl-50/80 border border-champagne-300/40 shadow-sm hover:shadow-luxury-soft transition-all duration-500 flex flex-col justify-between space-y-6 group"
            >
              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-gold-dark">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-gold-dark" />
                    ))}
                  </div>
                  <span className="text-[10px] uppercase font-mono text-obsidian/40">
                    {rev.date}
                  </span>
                </div>

                {/* Review Text */}
                <blockquote className="font-serif text-sm sm:text-base text-obsidian/90 leading-relaxed font-medium">
                  "{rev.comment}"
                </blockquote>
              </div>

              {/* Author & Product Info */}
              <div className="pt-4 border-t border-champagne-300/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-serif-luxury text-base text-obsidian font-semibold">
                    {rev.author}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                    <CheckCircle2 className="w-3 h-3" /> Verified
                  </span>
                </div>
                <p className="text-[11px] text-obsidian/50 font-sans">{rev.location}</p>
                <p className="text-[10px] uppercase tracking-wider text-gold-dark font-medium pt-1">
                  {rev.tag}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
