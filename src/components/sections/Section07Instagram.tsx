import React from 'react';
import { INSTAGRAM_POSTS, BRAND_INFO } from '../../data/shopify-data';
import { Instagram, Heart, MessageCircle, Play, ExternalLink } from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';

export const Section07Instagram: React.FC = () => {
  const highlights = [
    { title: 'Reviews 🧿✨', img: '/assets/products/pink-blue-bangles.jpg' },
    { title: 'Premium Hampers', img: '/assets/products/desi-barbie-hamper.jpg' },
    { title: 'Customer Photos', img: '/assets/products/polaroids-20.jpg' },
    { title: 'Bangles', img: '/assets/products/white-bangles.jpg' },
    { title: 'Collabs', img: '/assets/products/red-emerald-set.jpg' },
  ];

  const rotations = ['-rotate-1.5', 'rotate-1.5', '-rotate-2', 'rotate-1', 'rotate-2', '-rotate-1'];

  return (
    <section
      id="section-instagram"
      className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-6 md:px-10 lg:px-14 bg-pearl-100 overflow-hidden border-t border-champagne-300/30"
    >
      {/* Background Decor */}
      <div className="absolute top-1/2 right-10 w-[450px] h-[450px] bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-blush-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Section Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-champagne-300/40 pb-4 sm:pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Act 07 — Instagram Atelier
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                <span className="text-xs text-obsidian/60 font-medium font-mono">@celestiaamor.in</span>
              </div>
              <h2 className="site-main-title text-obsidian">
                The live <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">community lookbook</span>
              </h2>
            </div>

            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-widest hover:bg-obsidian-200 active:scale-[0.98] transition-all shadow-md group shrink-0"
            >
              <Instagram className="w-4 h-4 text-champagne-300 group-hover:rotate-12 transition-transform duration-300" />
              <span>Follow @celestiaamor.in</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" />
            </a>
          </div>
        </RevealOnScroll>

        {/* Story Highlights Bar */}
        <RevealOnScroll direction="up" delay={100}>
          <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto pb-1 justify-start sm:justify-center">
            {highlights.map((h, i) => (
              <a
                key={i}
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1 shrink-0 group cursor-pointer"
              >
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full p-0.5 bg-gradient-to-tr from-champagne-400 via-gold to-blush-200 group-hover:scale-108 transition-transform duration-300 shadow-md">
                  <div className="w-full h-full rounded-full overflow-hidden border-2 border-white bg-pearl-200">
                    <img src={h.img} alt={h.title} className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-obsidian/80 group-hover:text-gold-dark transition-colors text-center max-w-[75px] truncate">
                  {h.title}
                </span>
              </a>
            ))}
          </div>
        </RevealOnScroll>

        {/* Dynamic Editorial Collage with Organic Polaroid Rotation */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {INSTAGRAM_POSTS.map((post, pIdx) => (
            <RevealOnScroll key={post.id} direction="up" delay={150 + pIdx * 60}>
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative rounded-2xl overflow-hidden bg-sand shadow-sm hover:shadow-luxury-soft transition-all duration-500 group aspect-square max-h-[190px] block ${rotations[pIdx % rotations.length]} group-hover:rotate-0 hover:scale-105`}
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
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
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Section07Instagram;
