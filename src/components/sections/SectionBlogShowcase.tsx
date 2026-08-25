import React from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS } from '../../data/blogData';
import { BookOpen, ArrowRight, Clock, Calendar, Sparkles } from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';

export const SectionBlogShowcase: React.FC = () => {
  const featuredStories = BLOG_POSTS.slice(0, 3);

  return (
    <section className="w-full py-20 sm:py-28 px-4 sm:px-6 md:px-10 lg:px-14 bg-pearl-50 border-t border-champagne-300/40 relative selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/50 pb-6 sm:pb-8">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-champagne-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gold-dark font-bold shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>The Celestia Blog • Style Notes & Guides</span>
            </div>

            <h2 className="site-main-title text-obsidian font-serif-luxury">
              From the <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">journal</span>
            </h2>

            <p className="text-xs sm:text-sm text-obsidian-soft font-sans leading-relaxed">
              Explore styling masterclasses, anti-tarnish jewellery maintenance, bespoke hamper secrets, and stories from our Mumbai atelier.
            </p>
          </div>

          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold tracking-widest hover:bg-obsidian-200 transition-all shadow-md shrink-0 self-start md:self-auto cursor-pointer"
          >
            <span>Explore All Blogs</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3 Featured Blog Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredStories.map((post, idx) => (
            <RevealOnScroll key={post.id} direction="up" delay={idx * 0.1}>
              <Link
                to={`/blog/${post.slug}`}
                className="group flex flex-col justify-between h-full bg-white rounded-3xl border border-champagne-300/70 overflow-hidden shadow-xs hover:shadow-xl hover:border-gold-dark transition-all"
              >
                <div>
                  {/* Thumbnail Image with Category Badge */}
                  <div className="aspect-[16/10] overflow-hidden bg-sand relative">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/products/pink-blue-bangles.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-0.5 rounded-full bg-obsidian/90 text-pearl-100 text-[10px] font-mono uppercase font-bold tracking-wider backdrop-blur-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 sm:p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-obsidian-soft uppercase tracking-wider">
                      <Calendar className="w-3 h-3 text-gold-dark" />
                      <span>{post.publishDate}</span>
                      <span>•</span>
                      <Clock className="w-3 h-3 text-gold-dark" />
                      <span>{post.readTime}</span>
                    </div>

                    <h3 className="font-serif-luxury text-lg sm:text-xl text-obsidian font-bold leading-snug group-hover:text-gold-dark transition-colors line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-obsidian-soft font-sans line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                {/* Footer with CTA */}
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-champagne-200 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-obsidian-soft/80 font-semibold">
                    Celestia Journal
                  </span>

                  <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};

export default SectionBlogShowcase;
