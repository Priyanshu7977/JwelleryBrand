import React, { useState } from 'react';
import { X, Search, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setQuickViewProduct } = useCart();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filteredProducts = query.trim() === ''
    ? []
    : FEATURED_PRODUCTS.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
      );

  const trendingTags = ['Baroque Pearl', 'Wave Cuff', 'Velvet Hamper', 'Polaroids', 'Bangles Pair'];

  return (
    <div className="fixed inset-0 z-[120] flex items-start justify-center pt-20 px-4 md:px-8">
      {/* Backdrop */}
      <div
        onClick={() => setIsSearchOpen(false)}
        className="fixed inset-0 bg-obsidian/50 backdrop-blur-md transition-opacity"
      />

      {/* Search Panel */}
      <div className="relative w-full max-w-2xl bg-pearl-50 rounded-3xl shadow-2xl p-6 md:p-8 z-10 border border-champagne-300/50 space-y-6">
        
        {/* Search Input Bar */}
        <div className="flex items-center justify-between border-b border-champagne-300 pb-4">
          <div className="flex items-center gap-3 flex-1">
            <Search className="w-5 h-5 text-gold-dark" />
            <input
              type="text"
              autoFocus
              placeholder="Search jewellery, bangles, custom hampers..."
              value={query}
              onBeforeInput={(e: any) => {
                if (e.data && /[<>]/.test(e.data)) {
                  e.preventDefault();
                }
              }}
              onKeyDown={(e) => {
                if (e.key === '<' || e.key === '>') {
                  e.preventDefault();
                }
              }}
              onChange={(e) => setQuery(e.target.value.replace(/[<>]/g, ''))}
              className="w-full bg-transparent font-serif-luxury text-xl md:text-2xl text-obsidian placeholder:text-obsidian/40 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 hover:bg-champagne-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-obsidian/60" />
          </button>
        </div>

        {/* Trending Suggestions */}
        {query.trim() === '' && (
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-widest text-obsidian/50 font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
              Trending Curations
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-1.5 rounded-full bg-champagne-100/60 hover:bg-champagne-200 text-obsidian text-xs font-sans transition-all border border-champagne-300/40"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query.trim() !== '' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            <p className="text-[11px] uppercase tracking-widest text-obsidian/50 font-semibold">
              Results ({filteredProducts.length})
            </p>
            {filteredProducts.length === 0 ? (
              <p className="text-sm text-obsidian/60 py-6 text-center font-serif">
                No matching pieces found for "{query}". Explore our full collections below.
              </p>
            ) : (
              <div className="space-y-2">
                {filteredProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setQuickViewProduct(prod);
                    }}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white/70 hover:bg-white border border-champagne-300/30 hover:border-champagne-400 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={prod.images.hero}
                        alt={prod.title}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="font-serif-luxury text-base text-obsidian group-hover:text-gold-dark transition-colors">
                          {prod.title}
                        </h4>
                        <p className="text-xs text-obsidian/60">
                          {prod.category} • ₹{prod.price}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-obsidian/40 group-hover:text-obsidian group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
