import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BLOG_POSTS, BlogPost } from '../data/blogData';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Calendar,
  Share2,
  Bookmark,
  Check,
  ShoppingBag,
  Sparkles,
  MessageCircle,
  BookOpen,
  Tag
} from 'lucide-react';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';

export const BlogPostDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, showToast, setIsCartOpen } = useCart();
  const [copied, setCopied] = useState(false);

  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  // Related posts (excluding current)
  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  // Featured shoppable products from handles
  const featuredProducts = FEATURED_PRODUCTS.filter((p) =>
    post.featuredProductHandles.includes(p.handle)
  );

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.subtitle,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      showToast('Article link copied to clipboard ✨');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsAppShare = () => {
    const text = `Read this interesting story on Celestia Gazette: "${post.title}" - ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-28 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between border-b border-champagne-300/40 pb-4">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-obsidian/70 hover:text-gold-dark font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Gazette</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="p-2 rounded-full bg-white hover:bg-emerald-50 text-emerald-700 border border-champagne-300 transition-colors cursor-pointer"
              title="Share via WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-white hover:bg-champagne-100 text-obsidian border border-champagne-300 transition-colors cursor-pointer"
              title="Copy Link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Article Header & Headline */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
              <span className="px-3 py-1 rounded-full bg-white border border-champagne-300">{post.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-obsidian-soft">
                <Clock className="w-3.5 h-3.5" />
                <span>{post.readTime}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-tight font-serif-luxury">
              {post.title}
            </h1>

            <p className="text-sm sm:text-base text-obsidian-soft font-sans leading-relaxed">
              {post.subtitle}
            </p>

            {/* Author Profile */}
            <div className="flex items-center gap-3 pt-3 border-t border-champagne-200">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-gold-dark"
              />
              <div>
                <p className="text-xs sm:text-sm font-bold text-obsidian">{post.author.name}</p>
                <p className="text-[11px] text-obsidian-soft font-mono">
                  {post.author.role} • {post.publishDate}
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Featured Cover Image */}
        <RevealOnScroll direction="up" delay={0.1}>
          <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-sand shadow-xl border border-champagne-300/80">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </RevealOnScroll>

        {/* Article Body Content */}
        <div className="space-y-8 text-obsidian font-sans leading-relaxed text-sm sm:text-base">
          
          {/* Intro */}
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-champagne-300/60 shadow-xs">
            <p className="text-base sm:text-lg text-obsidian font-medium leading-relaxed italic font-serif">
              "{post.content.intro}"
            </p>
          </div>

          {/* Body Sections */}
          {post.content.sections.map((sec, idx) => (
            <div key={idx} className="space-y-4 pt-4">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian font-bold uppercase tracking-tight">
                {sec.heading}
              </h2>

              <div className="space-y-3 text-obsidian/85">
                {sec.body.map((p, pIdx) => (
                  <p key={pIdx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Highlight Quote Banner */}
              {sec.highlightQuote && (
                <div className="my-6 p-6 rounded-2xl bg-champagne-100/70 border-l-4 border-gold-dark text-obsidian font-serif text-lg sm:text-xl font-medium italic">
                  "{sec.highlightQuote}"
                </div>
              )}
            </div>
          ))}

          {/* Conclusion Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-[#181411] text-pearl-100 space-y-2 border border-champagne-400/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
              The Atelier Verdict
            </span>
            <p className="text-sm sm:text-base text-pearl-200 leading-relaxed font-sans">
              {post.content.conclusion}
            </p>
          </div>
        </div>

        {/* Shoppable Products Mentioned in Article */}
        {featuredProducts.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white border border-champagne-300/80 shadow-md space-y-4">
            <div className="flex items-center gap-2 border-b border-champagne-200 pb-3">
              <Sparkles className="w-4 h-4 text-gold-dark" />
              <h3 className="text-sm uppercase font-mono tracking-widest text-obsidian font-bold">
                Shop The Pieces Featured in this Article
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {featuredProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between gap-4 p-3.5 bg-pearl-50 rounded-2xl border border-champagne-300/60"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.images.hero}
                      alt={prod.title}
                      className="w-14 h-14 rounded-xl object-cover bg-sand border border-champagne-200"
                    />
                    <div>
                      <h4 className="font-serif-luxury text-sm font-bold text-obsidian line-clamp-1">{prod.title}</h4>
                      <p className="text-xs font-mono text-gold-dark font-bold">₹{prod.price}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      addToCart(prod, 1);
                      setIsCartOpen(true);
                    }}
                    className="px-4 py-2 bg-obsidian hover:bg-obsidian-200 text-pearl-100 text-xs uppercase font-mono font-bold rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Bag</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-champagne-200">
          <span className="text-xs font-mono uppercase text-obsidian-soft font-bold flex items-center gap-1">
            <Tag className="w-3.5 h-3.5" />
            <span>Topics:</span>
          </span>
          {post.tags.map((t) => (
            <span
              key={t}
              className="px-3 py-1 bg-white border border-champagne-300 text-xs font-mono text-obsidian rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>

        {/* Related Articles Carousel */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-champagne-300/60">
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian font-bold uppercase">
              More Stories from the Gazette
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              {relatedPosts.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/blog/${rel.slug}`}
                  className="group flex flex-col justify-between bg-white rounded-2xl border border-champagne-300/60 overflow-hidden shadow-xs hover:shadow-md hover:border-gold-dark transition-all p-4 space-y-3"
                >
                  <div className="aspect-[16/10] rounded-xl overflow-hidden bg-sand">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] font-mono uppercase text-gold-dark font-bold">{rel.category}</span>
                    <h4 className="font-serif-luxury text-sm font-bold text-obsidian group-hover:text-gold-dark transition-colors line-clamp-2 mt-0.5">
                      {rel.title}
                    </h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default BlogPostDetailPage;
