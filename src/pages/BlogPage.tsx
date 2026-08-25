import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import {
  Sparkles,
  BookOpen,
  ArrowRight,
  Clock,
  Calendar,
  Search,
  Tag,
  Mail,
  User,
  Heart,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { useCart } from '../context/CartContext';

const CATEGORIES = [
  'All',
  'Styling',
  'Care & Craft',
  'Gifting',
  'Atelier Story',
  'Trends'
] as const;

export const BlogPage: React.FC = () => {
  const { showToast } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      if (selectedCategory !== 'All' && post.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = post.title.toLowerCase().includes(q);
        const matchExcerpt = post.excerpt.toLowerCase().includes(q);
        const matchTags = post.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchExcerpt && !matchTags) return false;
      }
      return true;
    });
  }, [selectedCategory, searchQuery]);

  const featuredPost = BLOG_POSTS.find((p) => p.isFeatured) || BLOG_POSTS[0];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    setSubscribed(true);
    showToast('✨ Subscribed to The Celestia Gazette!');
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-28 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
        
        {/* ================================================================= */}
        {/* EDITORIAL HEADER & TITLE                                          */}
        {/* ================================================================= */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-6 sm:pb-8">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-champagne-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gold-dark font-bold shadow-xs">
                <BookOpen className="w-3.5 h-3.5" />
                <span>The Celestia Gazette • Journal & Style Notes</span>
              </div>

              <h1 className="text-4xl sm:text-6xl md:text-7xl text-obsidian font-bold uppercase leading-[1.02] font-serif-luxury">
                STORIES & <span className="font-light italic text-gold-dark">Lookbooks</span>.
              </h1>

              <p className="text-xs sm:text-sm text-obsidian-soft font-sans leading-relaxed">
                Styling guides, anti-tarnish jewellery care, bespoke gifting secrets, and behind-the-scenes dispatches from our Mumbai atelier.
              </p>
            </div>

            {/* Quick Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles, guides, tips..."
                className="w-full h-11 pl-10 pr-4 bg-white rounded-full border border-champagne-300 text-xs font-sans text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark shadow-xs"
              />
            </div>
          </div>
        </RevealOnScroll>

        {/* ================================================================= */}
        {/* CATEGORY FILTER CHIPS (Bonkers Corner Style)                      */}
        {/* ================================================================= */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${
                selectedCategory === cat
                  ? 'bg-obsidian text-pearl-100 shadow-md'
                  : 'bg-white text-obsidian-soft border border-champagne-300/80 hover:border-gold-dark hover:text-obsidian'
              }`}
            >
              {cat === 'All' ? 'All Stories' : cat}
            </button>
          ))}
        </div>

        {/* ================================================================= */}
        {/* FEATURED SPOTLIGHT ARTICLE BANNER (Top Hero Story)               */}
        {/* ================================================================= */}
        {selectedCategory === 'All' && !searchQuery && featuredPost && (
          <RevealOnScroll direction="up" delay={0.1}>
            <Link
              to={`/blog/${featuredPost.slug}`}
              className="group block relative rounded-3xl overflow-hidden bg-obsidian text-pearl-100 shadow-2xl border border-champagne-400/30 transition-all hover:shadow-luxury-heavy"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                {/* Image Cover (7 Cols) */}
                <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto overflow-hidden relative bg-obsidian-soft">
                  <img
                    src={featuredPost.coverImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-transparent lg:hidden" />
                  <div className="absolute top-4 left-4">
                    <span className="px-3.5 py-1 rounded-full bg-gold-dark text-obsidian text-[10px] font-mono uppercase font-bold tracking-widest shadow-md">
                      Featured Cover Story
                    </span>
                  </div>
                </div>

                {/* Content Details (5 Cols) */}
                <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-[#D8C39A]">
                      <span>{featuredPost.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{featuredPost.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-serif-luxury text-2xl sm:text-3xl md:text-4xl text-pearl-50 font-bold uppercase leading-snug group-hover:text-gold-light transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-pearl-200/80 font-sans line-clamp-3 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-champagne-300/20 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={featuredPost.author.avatar}
                        alt={featuredPost.author.name}
                        className="w-8 h-8 rounded-full object-cover border border-gold-dark"
                      />
                      <div>
                        <p className="text-xs font-bold text-pearl-100">{featuredPost.author.name}</p>
                        <p className="text-[10px] text-pearl-200/60 font-mono">{featuredPost.publishDate}</p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-dark font-bold group-hover:translate-x-1 transition-transform">
                      <span>Read Story</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </RevealOnScroll>
        )}

        {/* ================================================================= */}
        {/* 3-COLUMN EDITORIAL ARTICLE GRID                                   */}
        {/* ================================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-champagne-300/30 pb-2">
            <h3 className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
              {selectedCategory === 'All' ? 'Latest Gazette Publications' : `${selectedCategory} Articles`} ({filteredPosts.length})
            </h3>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="py-20 text-center space-y-4 bg-white rounded-3xl border border-champagne-300/60 p-8 shadow-xs">
              <BookOpen className="w-12 h-12 text-gold-dark mx-auto stroke-1" />
              <p className="font-serif-luxury text-2xl text-obsidian font-bold">No matching stories found</p>
              <p className="text-xs text-obsidian-soft">Try adjusting your search query or selecting a different category.</p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold rounded-full hover:bg-obsidian-200 transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post, idx) => (
                <RevealOnScroll key={post.id} direction="up" delay={idx * 0.08}>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between h-full bg-white rounded-3xl border border-champagne-300/60 overflow-hidden shadow-xs hover:shadow-xl hover:border-gold-dark transition-all"
                  >
                    <div>
                      {/* Image Thumbnail */}
                      <div className="aspect-[16/10] overflow-hidden bg-sand relative">
                        <img
                          src={post.coverImage}
                          alt={post.title}
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

                    {/* Footer Author & Read Action */}
                    <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-champagne-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-6 h-6 rounded-full object-cover border border-champagne-300"
                        />
                        <span className="text-[11px] font-medium text-obsidian">{post.author.name}</span>
                      </div>

                      <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Read</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </Link>
                </RevealOnScroll>
              ))}
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* VIP NEWSLETTER / GAZETTE SUBSCRIPTION BANNER                      */}
        {/* ================================================================= */}
        <RevealOnScroll direction="up" delay={0.2}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#181411] to-[#251F1B] p-8 sm:p-12 text-center text-pearl-100 shadow-2xl border border-champagne-400/40 space-y-5">
            <div className="w-12 h-12 rounded-full bg-champagne-200/20 border border-gold-dark flex items-center justify-center mx-auto text-gold-dark">
              <Mail className="w-6 h-6" />
            </div>

            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                Join the Atelier Gazette
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl uppercase font-bold text-pearl-50">
                STYLING NOTES & <span className="font-light italic text-gold-light">Secret Drops</span>.
              </h2>
              <p className="text-xs sm:text-sm text-pearl-200/80 font-sans leading-relaxed">
                Receive weekly jewellery stacking masterclasses, private unboxing previews, and early VIP access to limited artisan collections.
              </p>
            </div>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You are subscribed to the Celestia Gazette!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full sm:flex-1 h-12 px-4 rounded-full bg-white/10 border border-champagne-300/40 text-xs text-pearl-100 placeholder:text-pearl-100/50 focus:outline-none focus:border-gold-dark backdrop-blur-xs"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto h-12 px-6 bg-gold-dark hover:bg-gold text-obsidian text-xs uppercase font-mono font-bold tracking-widest rounded-full transition-all shadow-md cursor-pointer"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default BlogPage;
