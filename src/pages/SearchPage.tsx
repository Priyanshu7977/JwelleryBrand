import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { Search, Sparkles, ShoppingBag, Eye, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const { addToCart, setQuickViewProduct } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [addedId, setAddedId] = useState<string | null>(null);

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

  const handleQuickAdd = (prod: any) => {
    addToCart(prod, 1);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Search Bar Banner */}
        <div className="bg-white/90 p-6 sm:p-10 rounded-3xl border border-champagne-300/60 shadow-sm space-y-5">
          <div className="space-y-1.5">
            <span className="text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
              Live Search
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-[1.05]">
              SEARCH <span className="font-semibold text-gold-dark">CATALOGUE</span>.
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-pearl-50 px-4 py-3 rounded-full border border-champagne-300/80 focus-within:border-gold-dark max-w-2xl">
            <Search className="w-5 h-5 text-gold-dark shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Search by piece name, category, or material (e.g. Bangles, Hamper)..."
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
              className="w-full bg-transparent text-sm sm:text-base text-obsidian placeholder:text-obsidian-muted focus:outline-none"
            />
          </div>

          {/* Trending Suggestions */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs uppercase font-mono tracking-wider text-obsidian-muted font-bold flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-dark" /> Trending:
            </span>
            {trendingTerms.map((term) => (
              <button
                key={term}
                onClick={() => setQuery(term)}
                className="px-3 py-1 rounded-full bg-white hover:bg-champagne-100 text-obsidian text-xs font-bold border border-champagne-300/60 transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-obsidian-soft">
          <span className="font-medium">{results.length} pieces found {query ? `for "${query}"` : ''}</span>
          <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            ✨ Same-Day Mumbai Delivery Available
          </span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
          {results.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl overflow-hidden border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                  <img
                    src={prod.images.hero}
                    alt={prod.images.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <button
                  onClick={() => toggleWishlist(prod.id)}
                  className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-obsidian shadow-sm hover:scale-110 transition-transform"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      isWishlisted(prod.id) ? 'fill-rose-600 text-rose-600' : 'text-obsidian'
                    }`}
                  />
                </button>

                <div className="absolute top-3 left-3">
                  {prod.isBestseller && <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>}
                </div>
              </div>

              <div className="p-4 sm:p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-obsidian truncate">
                    <Link to={`/product/${prod.handle}`} className="hover:text-gold-dark transition-colors">
                      {prod.title}
                    </Link>
                  </h3>
                  <p className="text-xs text-obsidian-soft line-clamp-1 mt-0.5">
                    {prod.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-champagne-300/40">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="text-lg sm:text-xl font-bold text-obsidian">₹{prod.price}</span>
                    {prod.compareAtPrice && (
                      <span className="text-xs text-obsidian-muted line-through font-medium">
                        ₹{prod.compareAtPrice}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleQuickAdd(prod)}
                      className="flex-1 h-10 bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-wider rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>{addedId === prod.id ? 'Added!' : 'Add to Bag'}</span>
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="w-10 h-10 border border-champagne-300/80 hover:bg-champagne-100 rounded-full text-obsidian transition-colors flex items-center justify-center shrink-0"
                      title="Quick View"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default SearchPage;
