import React from 'react';
import { INSTAGRAM_POSTS, BRAND_INFO } from '../../data/shopify-data';
import { MagneticButton } from '../ui/MagneticButton';
import { Instagram, Heart, MessageCircle, Play, Sparkles, ExternalLink } from 'lucide-react';

export const Section07Instagram: React.FC = () => {
  const highlights = [
    { title: 'Reviews 🧿✨', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=300&auto=format&fit=crop' },
    { title: 'Premium Hampers', img: 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?q=80&w=300&auto=format&fit=crop' },
    { title: 'Customer Photos', img: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=300&auto=format&fit=crop' },
    { title: 'Bangles', img: 'https://images.unsplash.com/photo-1611591475828-569584d5df6d?q=80&w=300&auto=format&fit=crop' },
    { title: 'Collabs', img: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=300&auto=format&fit=crop' },
  ];

  return (
    <section
      id="section-instagram"
      className="relative w-full py-20 md:py-28 px-6 md:px-12 lg:px-20 bg-pearl-100 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Background Decor */}
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-blush-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-14">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
                Act 07 — Instagram Atelier
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif italic text-obsidian/60">@celestiaamor.in</span>
            </div>
            <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal leading-[0.95]">
              The Live <span className="italic font-light">Community Lookbook</span>.
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest hover:bg-obsidian-200 transition-all shadow-md group"
            >
              <Instagram className="w-4 h-4 text-champagne-300 group-hover:rotate-12 transition-transform" />
              <span>Follow @celestiaamor.in</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </div>

        {/* Instagram Highlights Bar */}
        <div className="flex items-center gap-6 overflow-x-auto pb-4 justify-start md:justify-center">
          {highlights.map((h, i) => (
            <a
              key={i}
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full p-0.5 bg-gradient-to-tr from-champagne-400 via-gold to-blush-200 group-hover:scale-105 transition-transform shadow-md">
                <div className="w-full h-full rounded-full overflow-hidden border-2 border-pearl-100 bg-pearl-200">
                  <img src={h.img} alt={h.title} className="w-full h-full object-cover" />
                </div>
              </div>
              <span className="text-[11px] font-medium text-obsidian/80 group-hover:text-gold-dark transition-colors text-center max-w-[80px] line-clamp-1">
                {h.title}
              </span>
            </a>
          ))}
        </div>

        {/* Dynamic Editorial Collage */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <a
              key={post.id}
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative rounded-2xl overflow-hidden bg-sand shadow-sm hover:shadow-luxury-soft transition-all duration-500 group aspect-[4/5] ${
                idx === 1 || idx === 4 ? 'lg:translate-y-4' : ''
              }`}
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Reel Indicator Icon */}
              {post.type === 'reel' && (
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-obsidian/60 text-white backdrop-blur-sm">
                  <Play className="w-3 h-3 fill-white" />
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between text-xs text-champagne-200">
                  <Instagram className="w-4 h-4" />
                  <span className="text-[10px] uppercase tracking-wider font-mono">@celestiaamor.in</span>
                </div>

                <div className="space-y-2">
                  <p className="font-serif italic text-xs line-clamp-2 leading-tight">
                    {post.caption}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-pearl-100">
                    <span className="flex items-center gap-1">
                      <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                      {post.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      {post.comments}
                    </span>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
