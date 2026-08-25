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
  CheckCircle2,
  Bookmark,
  Layers,
  ShieldCheck,
  Gift
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
        const matchTags = post.tags.some((t) => t.toLowerCase().includes(q));
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
    showToast('✨ Subscribed to The Celestia Journal!');
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* ================================================================= */}
        {/* SECTION 1: COMPACT EDITORIAL HEADER & FILTER BAR                 */}
        {/* ================================================================= */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="space-y-6 border-b border-champagne-300/40 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white border border-champagne-300 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gold-dark font-bold shadow-xs">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>The Celestia Journal • Style Notes & Care</span>
                </div>

                <h1 className="site-main-title text-obsidian font-serif-luxury">
                  Stories & <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">lookbooks</span>.
                </h1>

                <p className="text-xs sm:text-sm text-obsidian-soft font-sans leading-relaxed">
                  Styling guides, anti-tarnish jewellery care, bespoke gifting secrets, and stories from our Mumbai atelier.
                </p>
              </div>

              {/* Quick Search Input */}
              <div className="relative w-full md:w-72 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold-dark" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles, guides, tips..."
                  className="w-full h-10 pl-10 pr-4 bg-white rounded-full border border-champagne-300 text-xs font-sans text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark shadow-xs"
                />
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider font-bold transition-all cursor-pointer shrink-0 ${
                    selectedCategory === cat
                      ? 'bg-obsidian text-pearl-100 shadow-sm'
                      : 'bg-white text-obsidian-soft border border-champagne-300/80 hover:border-gold-dark hover:text-obsidian'
                  }`}
                >
                  {cat === 'All' ? 'All Stories' : cat}
                </button>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* ================================================================= */}
        {/* SECTION 2: COMPACT & PROPORTIONAL HERO SPOTLIGHT CARD             */}
        {/* ================================================================= */}
        {selectedCategory === 'All' && !searchQuery && featuredPost && (
          <RevealOnScroll direction="up" delay={0.06}>
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold block">
                Editor's Top Spotlight Story
              </span>

              <Link
                to={`/blog/${featuredPost.slug}`}
                className="group block bg-white rounded-3xl border border-champagne-300/80 p-5 sm:p-6 md:p-8 shadow-luxury-soft hover:shadow-xl hover:border-gold-dark transition-all"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                  
                  {/* Left Cover Photo (5 Cols) - Clean 4:3 Ratio with Rounded Frame */}
                  <div className="md:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden bg-sand shadow-inner border border-champagne-200">
                    <img
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      onError={(e) => {
                        e.currentTarget.src = '/assets/products/pink-blue-bangles.jpg';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-0.5 rounded-full bg-obsidian/90 text-pearl-100 text-[10px] font-mono uppercase font-bold tracking-widest backdrop-blur-xs shadow-sm">
                        {featuredPost.category}
                      </span>
                    </div>
                  </div>

                  {/* Right Content Details (7 Cols) */}
                  <div className="md:col-span-7 flex flex-col justify-center space-y-4">
                    <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gold-dark" />
                        <span>{featuredPost.publishDate}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-gold-dark" />
                        <span>{featuredPost.readTime}</span>
                      </span>
                    </div>

                    <h2 className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl text-obsidian font-bold leading-snug group-hover:text-gold-dark transition-colors">
                      {featuredPost.title}
                    </h2>

                    <p className="text-xs sm:text-sm text-obsidian-soft font-sans leading-relaxed line-clamp-3">
                      {featuredPost.excerpt}
                    </p>

                    <div className="pt-4 border-t border-champagne-200/80 flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-obsidian-soft">
                        Celestia Journal
                      </span>

                      <span className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-gold-dark font-bold group-hover:translate-x-1 transition-transform">
                        <span>Read Full Story</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>

                </div>
              </Link>
            </div>
          </RevealOnScroll>
        )}

        {/* ================================================================= */}
        {/* SECTION 3: EDITORIAL ARTICLES 3-COLUMN GRID                       */}
        {/* ================================================================= */}
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-champagne-300/40 pb-2.5">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gold-dark" />
              <h3 className="text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
                {selectedCategory === 'All' ? 'Latest Publications & Style Guides' : `${selectedCategory} Collection`} ({filteredPosts.length})
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredPosts.map((post, idx) => (
              <RevealOnScroll key={post.id} direction="up" delay={idx * 0.06}>
                <Link
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col justify-between h-full bg-white rounded-3xl border border-champagne-300/70 overflow-hidden shadow-xs hover:shadow-lg hover:border-gold-dark transition-all"
                >
                  <div>
                    {/* 16:9 Thumbnail Image */}
                    <div className="aspect-[16/10] overflow-hidden bg-sand relative">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        onError={(e) => {
                          e.currentTarget.src = '/assets/products/pink-blue-bangles.jpg';
                        }}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-0.5 rounded-full bg-obsidian/90 text-pearl-100 text-[10px] font-mono uppercase font-bold tracking-wider backdrop-blur-xs">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2 text-[10px] font-mono text-obsidian-soft uppercase tracking-wider">
                        <Calendar className="w-3 h-3 text-gold-dark" />
                        <span>{post.publishDate}</span>
                        <span>•</span>
                        <Clock className="w-3 h-3 text-gold-dark" />
                        <span>{post.readTime}</span>
                      </div>

                      <h3 className="font-serif-luxury text-base sm:text-lg text-obsidian font-bold leading-snug group-hover:text-gold-dark transition-colors line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-xs text-obsidian-soft font-sans line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-5 pt-3 border-t border-champagne-200/80 flex items-center justify-between">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-obsidian-soft/80 font-semibold">
                      Journal Guide
                    </span>

                    <span className="text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Read Guide</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </Link>
              </RevealOnScroll>
            ))}
          </div>
        </div>

        {/* ================================================================= */}
        {/* SECTION 4: THE GIFTING GAZETTE (Wide Editorial Banner)            */}
        {/* ================================================================= */}
        {selectedCategory === 'All' && !searchQuery && (
          <RevealOnScroll direction="up" delay={0.1}>
            <div className="rounded-3xl bg-gradient-to-r from-champagne-100/80 to-pearl-50 p-6 sm:p-8 border border-champagne-300/80 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2.5 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-white text-[10px] font-mono uppercase tracking-wider text-gold-dark font-bold border border-champagne-300 shadow-xs">
                    <Gift className="w-3 h-3" />
                    <span>The Gifting Gazette</span>
                  </div>
                  <h3 className="font-serif-luxury text-xl sm:text-2xl text-obsidian font-bold leading-snug">
                    Unboxing Emotional Memories with Polaroids & Wax Seals
                  </h3>
                  <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                    Discover why personalized physical keepsakes are replacing generic gifts across weddings, anniversaries, and milestone celebrations.
                  </p>
                  <Link
                    to="/blog/the-art-of-bespoke-gifting-polaroid-keepsakes"
                    className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-gold-dark font-bold hover:underline pt-1"
                  >
                    <span>Read Gifting Guide →</span>
                  </Link>
                </div>

                <div className="w-full md:w-64 aspect-[4/3] rounded-2xl overflow-hidden shadow-md border border-champagne-300 shrink-0">
                  <img
                    src="/assets/products/desi-barbie-hamper.jpg"
                    alt="Gifting Atelier"
                    onError={(e) => {
                      e.currentTarget.src = '/assets/products/pink-blue-bangles.jpg';
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </RevealOnScroll>
        )}

        {/* ================================================================= */}
        {/* SECTION 5: VIP NEWSLETTER / READING CIRCLE                        */}
        {/* ================================================================= */}
        <RevealOnScroll direction="up" delay={0.12}>
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#181411] to-[#251F1B] p-6 sm:p-10 text-center text-pearl-100 shadow-2xl border border-champagne-400/40 space-y-4">
            <div className="w-10 h-10 rounded-full bg-champagne-200/20 border border-gold-dark flex items-center justify-center mx-auto text-gold-dark">
              <Mail className="w-5 h-5" />
            </div>

            <div className="space-y-1.5 max-w-xl mx-auto">
              <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                Join The Reading Circle
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-pearl-50">
                Styling notes & <span className="font-zapfino text-champagne-300 font-normal tracking-normal lowercase inline-block px-1">secret drops</span>.
              </h2>
              <p className="text-xs sm:text-sm text-pearl-200/80 font-sans leading-relaxed">
                Receive weekly jewellery stacking masterclasses, private unboxing previews, and early VIP access to limited artisan drops.
              </p>
            </div>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-950 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>You are subscribed to the Celestia Journal!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full sm:flex-1 h-11 px-4 rounded-full bg-white/10 border border-champagne-300/40 text-xs text-pearl-100 placeholder:text-pearl-100/50 focus:outline-none focus:border-gold-dark backdrop-blur-xs"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto h-11 px-6 bg-gold-dark hover:bg-gold text-obsidian text-xs uppercase font-mono font-bold tracking-widest rounded-full transition-all shadow-md cursor-pointer"
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
