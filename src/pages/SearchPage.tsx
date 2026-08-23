import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { Search, Sparkles, ArrowRight, ArrowUpRight, ShoppingBag, Eye } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { addToCart, setQuickViewProduct } = useCart();

  const trendingTerms = ['Bangles', 'Hamper', 'Polaroid', 'Anti-Tarnish', 'Emerald', 'Honeybee'];

  const results = query.trim() === ''
    ? FEATURED_PRODUCTS
    : FEATURED_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      );

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Search Bar Banner */}
        <div className="bg-pearl-50/90 p-8 md:p-12 rounded-3xl border border-champagne-300/50 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
              Live Search
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase">
              SEARCH <span className="italic font-light text-gold-dark">Catalogue</span>.
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white px-5 py-4 rounded-2xl border border-champagne-300/80 focus-within:border-gold-dark shadow-inner max-w-2xl">
            <Search className="w-5 h-5 text-gold-dark shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by piece name, category, or material (e.g. Bangles, Hamper)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent font-serif text-lg text-obsidian placeholder:text-obsidian/40 focus:outline-none"
            />
          </div>

          {/* Trending Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-[11px] uppercase tracking-wider text-obsidian/50 font-semibold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-dark" /> Trending:
            </span>
            {trendingTerms.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1 rounded-full bg-white hover:bg-champagne-100 text-obsidian text-xs font-sans border border-champagne-300/40 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-obsidian/60">
          <span>{results.length} pieces found {query ? `for "${query}"` : ''}</span>
          <span className="text-emerald-800 font-medium">✨ Same-Day Mumbai Delivery Available</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {results.map((prod) => (
            <div
              key={prod.id}
              className="bg-pearl-50 rounded-3xl overflow-hidden border border-champagne-300/50 shadow-sm hover:shadow-luxury-soft transition-all duration-500 flex flex-col justify-between group"
            >
              <div className="relative aspect-square overflow-hidden bg-sand image-zoom-container">
                <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                  <img
                    src={prod.images.hero}
                    alt={prod.images.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </Link>

                <button
                  onClick={() => setQuickViewProduct(prod)}
                  className="absolute top-3 right-3 p-2 bg-pearl-100/90 rounded-full text-obsidian hover:bg-champagne-200 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                  aria-label="Quick inspect piece"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-gold-dark font-mono font-medium block">
                    {prod.category}
                  </span>
                  <Link
                    to={`/product/${prod.handle}`}
                    className="font-serif-luxury text-lg text-obsidian hover:text-gold-dark transition-colors line-clamp-1 leading-snug"
                  >
                    {prod.title}
                  </Link>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-lg font-semibold text-obsidian">
                      ₹{prod.price}
                    </span>
                    {prod.compareAtPrice && (
                      <span className="text-xs font-sans text-obsidian/40 line-through">
                        ₹{prod.compareAtPrice}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-champagne-300/30">
                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="flex-1 py-2.5 px-4 bg-obsidian text-pearl-100 text-[11px] uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>

                  <Link
                    to={`/product/${prod.handle}`}
                    className="p-2.5 border border-champagne-300/60 rounded-full hover:bg-champagne-100 transition-colors text-obsidian"
                    title="View Full Details"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
