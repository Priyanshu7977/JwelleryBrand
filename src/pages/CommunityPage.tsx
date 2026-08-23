import React from 'react';
import { INSTAGRAM_POSTS, CUSTOMER_REVIEWS, BRAND_INFO } from '../data/shopify-data';
import { Instagram, Star, Heart, MessageCircle, Play, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const highlights = [
    { title: 'Reviews 🧿✨', img: '/assets/products/pink-blue-bangles.jpg' },
    { title: 'Premium Hampers', img: '/assets/products/desi-barbie-hamper.jpg' },
    { title: 'Customer Photos', img: '/assets/products/polaroids-20.jpg' },
    { title: 'Bangles', img: '/assets/products/white-bangles.jpg' },
    { title: 'Collabs', img: '/assets/products/red-emerald-set.jpg' },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      {/* Background Decor */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Editorial Community Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
                Community & Lookbook
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif italic text-obsidian/60">@celestiaamor.in</span>
            </div>

            <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian font-normal uppercase leading-[0.92]">
              THE LIVE <span className="italic font-light text-gold-dark">Circle</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed max-w-xl">
              Real unboxing moments, styling reels, and customer love from our vibrant Instagram family across Mumbai and Pan-India.
            </p>
          </div>

          <a
            href={BRAND_INFO.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest hover:bg-obsidian-200 transition-all shadow-md group shrink-0"
          >
            <Instagram className="w-4 h-4 text-champagne-300 group-hover:rotate-12 transition-transform" />
            <span>Follow @celestiaamor.in</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
          </a>
        </div>

        {/* Story Highlights Bar */}
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

        {/* Dynamic Editorial UGC Collage */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {INSTAGRAM_POSTS.map((post, idx) => (
            <a
              key={post.id}
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative rounded-3xl overflow-hidden bg-sand shadow-sm hover:shadow-luxury-soft transition-all duration-500 group aspect-[4/5] ${
                idx % 2 === 1 ? 'lg:translate-y-4' : ''
              }`}
            >
              <img
                src={post.mediaUrl}
                alt={post.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {post.type === 'reel' && (
                <div className="absolute top-3 right-3 p-1.5 rounded-full bg-obsidian/60 text-white backdrop-blur-sm">
                  <Play className="w-3 h-3 fill-white" />
                </div>
              )}

              <div className="absolute inset-0 bg-obsidian/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 text-white">
                <div className="flex items-center justify-between text-xs text-champagne-200 font-mono">
                  <Instagram className="w-4 h-4" />
                  <span className="text-[10px]">@celestiaamor.in</span>
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

        {/* Verified Client Reviews Section */}
        <div className="space-y-8 pt-12 border-t border-champagne-300/40">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian">
                Verified Client Love (Reviews 🧿✨)
              </h2>
              <p className="text-xs text-obsidian/60 font-sans mt-1">
                Real feedback from clients across Mumbai and Pan-India.
              </p>
            </div>
            <span className="text-xs font-mono text-gold-dark font-semibold">1000+ Orders</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-pearl-50 border border-champagne-300/40 shadow-sm flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-gold-dark">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-gold-dark" />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-obsidian/40">{rev.date}</span>
                  </div>
                  <blockquote className="font-serif italic text-sm text-obsidian/85 leading-relaxed">
                    "{rev.comment}"
                  </blockquote>
                </div>

                <div className="pt-3 border-t border-champagne-300/30 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-serif-luxury text-base text-obsidian font-semibold">{rev.author}</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  </div>
                  <p className="text-[11px] text-obsidian/50 font-sans">{rev.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
