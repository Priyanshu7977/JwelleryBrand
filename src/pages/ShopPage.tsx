import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS, BRAND_INFO } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { Sparkles, Search, ArrowUpRight, ShoppingBag, Eye, Check, Compass, ArrowRight, Heart } from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { addToCart, setQuickViewProduct, showToast } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [addedId, setAddedId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Pieces' },
    { id: 'bangles', label: 'Artisanal Bangles' },
    { id: 'jewellery', label: 'Fine Jewellery' },
    { id: 'gifting', label: 'Bespoke Hampers' },
    { id: 'personalised', label: 'Polaroids & Personalised' },
    { id: 'accessories', label: 'Charms & Accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((prod) => {
      // Category filter
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      // Price range filter
      if (selectedPriceRange === 'under-100' && prod.price > 100) return false;
      if (selectedPriceRange === '100-500' && (prod.price <= 100 || prod.price > 500)) return false;
      if (selectedPriceRange === 'above-500' && prod.price <= 500) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = prod.title.toLowerCase().includes(q);
        const matchCat = prod.category.toLowerCase().includes(q);
        const matchDesc = prod.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCat && !matchDesc) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'bestseller') return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      return 0;
    });
  }, [selectedCategory, selectedPriceRange, searchQuery, sortBy]);

  const handleQuickAdd = (prod: any) => {
    addToCart(prod, 1);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Editorial Discovery Room Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
                The Discovery Room
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif italic text-obsidian/60">
                400+ Handcrafted Creations
              </span>
            </div>

            <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian font-normal uppercase leading-[0.92]">
              THE <span className="italic font-light text-gold-dark">Collection</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed max-w-xl">
              Browse sculptural fine jewellery, handcrafted artisanal bangles, custom celebration hampers, and retro polaroid keepsakes. Hand-packed in Mumbai with same-day express courier dispatch.
            </p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full font-medium">
              🚚 Same-Day Mumbai Ready
            </span>
          </div>
        </div>

        {/* Horizontal Curator's Runway Strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Curator's Runway Highlights
            </span>
            <span className="text-xs font-mono text-obsidian/50">Swipe to Explore</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none">
            {FEATURED_PRODUCTS.slice(0, 5).map((item, idx) => (
              <div
                key={item.id}
                className="w-64 sm:w-72 p-4 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 hover:border-gold-dark shrink-0 transition-all duration-300 space-y-3 group shadow-sm"
              >
                <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-sand relative">
                  <img src={item.images.hero} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-2 left-2 text-[9px] font-mono uppercase bg-pearl-100/90 px-2 py-0.5 rounded text-obsidian">
                    0{idx + 1}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] uppercase tracking-widest text-gold-dark font-mono font-medium block">
                    {item.category}
                  </span>
                  <Link to={`/product/${item.handle}`} className="font-serif-luxury text-base text-obsidian hover:text-gold-dark line-clamp-1">
                    {item.title}
                  </Link>
                  <div className="flex items-center justify-between pt-1">
                    <span className="font-serif text-base font-bold text-obsidian">₹{item.price}</span>
                    <button
                      onClick={() => handleQuickAdd(item)}
                      className="text-[10px] uppercase tracking-widest text-obsidian hover:text-gold-dark font-semibold underline"
                    >
                      + Quick Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter & Search Tool Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-pearl-50/95 p-4 md:p-6 rounded-3xl border border-champagne-300/60 shadow-sm sticky top-24 z-30 backdrop-blur-md">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-xs uppercase tracking-wider font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-obsidian text-pearl-100 shadow-md'
                    : 'bg-white/80 text-obsidian/70 hover:text-obsidian hover:bg-champagne-100/50 border border-champagne-300/40'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Right Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-champagne-300/60 focus-within:border-gold-dark">
              <Search className="w-3.5 h-3.5 text-obsidian/40" />
              <input
                type="text"
                placeholder="Search pieces..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs font-sans text-obsidian placeholder:text-obsidian/40 focus:outline-none w-28 sm:w-36"
              />
            </div>

            <select
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-white border border-champagne-300/60 text-xs font-sans text-obsidian focus:outline-none"
            >
              <option value="all">All Prices</option>
              <option value="under-100">Under ₹100</option>
              <option value="100-500">₹100 — ₹500</option>
              <option value="above-500">Hampers (₹500+)</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 rounded-full bg-white border border-champagne-300/60 text-xs font-sans text-obsidian focus:outline-none"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="bestseller">Bestsellers First</option>
            </select>
          </div>

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-obsidian/60 font-sans">
          <span>Showing {filteredProducts.length} real pieces</span>
          <span className="text-emerald-800 font-medium">✨ Same-Day Mumbai Dispatch Active</span>
        </div>

        {/* Product Discovery Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white/40 rounded-3xl border border-champagne-300/40">
            <p className="font-serif-luxury text-2xl text-obsidian">No matching pieces found</p>
            <p className="text-xs text-obsidian/60 max-w-sm mx-auto">
              Try clearing your search query or selecting another category.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedPriceRange('all');
                setSearchQuery('');
              }}
              className="px-6 py-2.5 bg-obsidian text-pearl-100 rounded-full text-xs uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((prod, idx) => (
              <div
                key={prod.id}
                className={`bg-pearl-50 rounded-3xl overflow-hidden border border-champagne-300/50 shadow-sm hover:shadow-luxury-soft transition-all duration-500 flex flex-col justify-between group ${
                  idx % 4 === 1 ? 'sm:translate-y-3' : ''
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-sand image-zoom-container">
                  <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                    <img
                      src={prod.images.hero}
                      alt={prod.images.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>

                  <div className="absolute top-3 left-3 flex flex-col gap-1">
                    {prod.isBestseller && (
                      <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>
                    )}
                    {prod.sameDayMumbaiAvailable && (
                      <span className="text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-sans font-medium">
                        Mumbai Ready
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                        showToast(isWishlisted(prod.id) ? "Removed from Wishlist" : `Saved ${prod.title} to Wishlist ❤️`);
                      }}
                      className={`p-2 rounded-full transition-all shadow-sm ${
                        isWishlisted(prod.id)
                          ? 'bg-rose-50 text-rose-600'
                          : 'bg-pearl-100/90 text-obsidian hover:bg-rose-50 hover:text-rose-600'
                      }`}
                      aria-label="Toggle Wishlist"
                      title={isWishlisted(prod.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isWishlisted(prod.id) ? 'fill-rose-600' : ''}`} />
                    </button>

                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="p-2 bg-pearl-100/90 rounded-full text-obsidian hover:bg-champagne-200 transition-all shadow-sm"
                      aria-label="Quick inspect piece"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                      onClick={() => handleQuickAdd(prod)}
                      className="flex-1 py-2.5 px-4 bg-obsidian text-pearl-100 text-[11px] uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      {addedId === prod.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-champagne-300" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Bag</span>
                        </>
                      )}
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
        )}

      </div>
    </div>
  );
};
