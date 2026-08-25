import React from 'react';
import { INSTAGRAM_POSTS, CUSTOMER_REVIEWS, BRAND_INFO } from '../data/shopify-data';
import { Instagram, Star, Heart, MessageCircle, Play, ExternalLink, CheckCircle2, ChevronDown } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const highlights = [
    { title: 'Reviews 🧿✨', img: '/assets/products/pink-blue-bangles.jpg' },
    { title: 'Premium Hampers', img: '/assets/products/desi-barbie-hamper.jpg' },
    { title: 'Customer Photos', img: '/assets/products/polaroids-20.jpg' },
    { title: 'Bangles', img: '/assets/products/white-bangles.jpg' },
    { title: 'Collabs', img: '/assets/products/red-emerald-set.jpg' },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 md:pt-36 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* ========================================================================= */}
        {/* TOP SCREEN-FITTED HERO SECTION (Header + Highlights + 6-Column UGC)       */}
        {/* ========================================================================= */}
        <div className="space-y-6 sm:space-y-8 min-h-[calc(100vh-14rem)] flex flex-col justify-between">
          
          {/* Editorial Community Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-champagne-300/40 pb-4 sm:pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Community & Lookbook
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                <span className="text-xs text-obsidian/60 font-medium font-mono">@celestiaamor.in</span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold leading-tight">
                The live <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block text-[34px] sm:text-[50px] md:text-[60px] leading-[0.9] px-1">circle</span>.
              </h1>

              <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed max-w-lg">
                Real unboxing moments, styling reels, and customer love from our vibrant Instagram family across Mumbai and Pan-India.
              </p>
            </div>

            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-widest hover:bg-obsidian-200 transition-all shadow-md group shrink-0"
            >
              <Instagram className="w-4 h-4 text-champagne-300 group-hover:rotate-12 transition-transform" />
              <span>Follow @celestiaamor.in</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>

          {/* Story Highlights Bar */}
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 justify-start sm:justify-center">
            {highlights.map((h, i) => (
              <a
                key={i}
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-champagne-400 via-gold to-blush-200 group-hover:scale-105 transition-transform shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-pearl-200">
                    <img src={h.img} alt={h.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-obsidian/80 group-hover:text-gold-dark transition-colors text-center max-w-[80px] truncate">
                  {h.title}
                </span>
              </a>
            ))}
          </div>

          {/* Dynamic Editorial UGC Collage - Generous & Full on Screen */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 flex-1">
            {INSTAGRAM_POSTS.map((post) => (
              <a
                key={post.id}
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative rounded-2xl overflow-hidden bg-sand shadow-sm hover:shadow-luxury-soft transition-all duration-300 group aspect-[4/3] sm:aspect-square"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {post.type === 'reel' && (
                  <div className="absolute top-2 right-2 p-1 rounded-full bg-obsidian/60 text-white backdrop-blur-sm">
                    <Play className="w-3 h-3 fill-white" />
                  </div>
                )}

                <div className="absolute inset-0 bg-obsidian/65 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 text-white">
                  <div className="flex items-center justify-between text-xs text-champagne-200 font-mono">
                    <Instagram className="w-3.5 h-3.5" />
                    <span className="text-[10px] uppercase font-bold">@celestiaamor.in</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] line-clamp-2 leading-tight">
                      {post.caption}
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-pearl-100 font-mono">
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

          {/* Scroll Down Prompt Indicator */}
          <div className="text-center pt-2">
            <a
              href="#reviews-section"
              className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-obsidian/60 hover:text-gold-dark transition-colors font-bold"
            >
              <span>Scroll for Verified Reviews</span>
              <ChevronDown className="w-3.5 h-3.5 animate-bounce text-gold-dark" />
            </a>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* VERIFIED CUSTOMER REVIEWS SECTION (Positioned Below the Screen Fold)     */}
        {/* ========================================================================= */}
        <div id="reviews-section" className="space-y-6 pt-12 sm:pt-16 border-t border-champagne-300/40">
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <span className="text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
              Real Voices from Real Homes
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-obsidian">
              Loved by 1,000+ Patrons
            </h2>
            <p className="text-xs text-obsidian-soft">
              Real feedback from verified buyers across India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-3xl bg-white/90 border border-champagne-300/60 shadow-sm space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-obsidian-muted">{rev.date}</span>
                </div>

                <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                  "{rev.comment}"
                </p>

                <div className="pt-2 border-t border-champagne-300/40 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-obsidian">
                    <span>{rev.author}</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  </div>
                  <span className="text-obsidian-muted font-mono text-[10px]">{rev.location}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityPage;
