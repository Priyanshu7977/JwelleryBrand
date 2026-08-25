import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { Search, ShoppingBag, Eye, Heart } from 'lucide-react';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { ProductTiltCard } from '../components/motion/ProductTiltCard';

export const ShopPage: React.FC = () => {
  const { addToCart, setQuickViewProduct } = useCart();
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
    { id: 'gifting', label: 'Gift Hampers' },
    { id: 'personalised', label: 'Polaroids & Personalised' },
    { id: 'accessories', label: 'Charms & Accessories' },
  ];

  const filteredProducts = useMemo(() => {
    return FEATURED_PRODUCTS.filter((prod) => {
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) {
        return false;
      }
      if (selectedPriceRange === 'under-100' && prod.price > 100) return false;
      if (selectedPriceRange === '100-500' && (prod.price <= 100 || prod.price > 500)) return false;
      if (selectedPriceRange === 'above-500' && prod.price <= 500) return false;

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
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 pb-16 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Compact Editorial Discovery Room Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-champagne-300/40 pb-4 sm:pb-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                  The Discovery Room
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                <span className="text-xs text-obsidian-soft font-medium">
                  400+ Handcrafted Creations
                </span>
              </div>

              <h1 className="site-main-title text-obsidian">
                The <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">collection</span>
              </h1>

              <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed max-w-lg">
                Browse sculptural fine jewellery, handcrafted artisanal bangles, custom celebration hampers, and retro polaroid keepsakes.
              </p>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold border border-emerald-200">
                🚚 Same-Day Mumbai Ready
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col lg:flex-row gap-3 justify-between items-stretch lg:items-center">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs uppercase font-bold tracking-wider transition-all shrink-0 ${
                  selectedCategory === cat.id
                    ? 'bg-obsidian text-pearl-100 shadow-sm'
                    : 'bg-white/80 hover:bg-white text-obsidian border border-champagne-300/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-obsidian/50 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search jewellery, bangles..."
              className="w-full pl-9 pr-3 py-1.5 rounded-full bg-white/90 border border-champagne-300/70 text-xs text-obsidian placeholder:text-obsidian-muted focus:outline-none focus:border-gold-dark"
            />
          </div>
        </div>

        {/* Product Cards Grid - Fitted & Proportioned with Direct Product Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((prod, idx) => (
            <RevealOnScroll key={prod.id} direction="up" delay={Math.min(idx * 50, 300)}>
              <ProductTiltCard
                className="bg-white rounded-2xl overflow-hidden border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-400 flex flex-col justify-between group h-full"
              >
                <div className="relative aspect-[4/3] max-h-[220px] overflow-hidden bg-sand luxury-sheen">
                  <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                    <img
                      src={prod.images.hero}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-obsidian shadow-sm hover:scale-110 active:scale-[0.9] transition-transform z-10"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted(prod.id) ? 'fill-rose-600 text-rose-600' : 'text-obsidian'
                      }`}
                    />
                  </button>

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
                    {prod.isBestseller && <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>}
                    {prod.availableStock && (
                      <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full">
                        In Stock ({prod.availableStock})
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                      {prod.category}
                    </span>
                    <Link to={`/product/${prod.handle}`}>
                      <h3 className="text-sm font-bold text-obsidian truncate mt-0.5 hover:text-gold-dark transition-colors">
                        {prod.title}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-obsidian-soft line-clamp-1 mt-0.5">
                      {prod.description}
                    </p>
                  </div>

                  <div className="pt-1.5 border-t border-champagne-300/40">
                    <div className="flex items-baseline justify-between mb-2">
                      <span className="text-base sm:text-lg font-bold text-obsidian">₹{prod.price}</span>
                      {prod.compareAtPrice && (
                        <span className="text-xs text-obsidian-muted line-through font-medium">
                          ₹{prod.compareAtPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="flex-1 min-h-[40px] h-10 bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-wider rounded-full hover:bg-obsidian-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{addedId === prod.id ? 'Added!' : 'Add to Bag'}</span>
                      </button>

                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="w-10 h-10 min-w-[40px] min-h-[40px] border border-champagne-300/80 hover:bg-champagne-100 active:scale-[0.98] rounded-full text-obsidian transition-all flex items-center justify-center shrink-0 cursor-pointer"
                        title="Quick View"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </ProductTiltCard>
            </RevealOnScroll>
          ))}
        </div>

      </div>
    </div>
  );
};

export default ShopPage;
