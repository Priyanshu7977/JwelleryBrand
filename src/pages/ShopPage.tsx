import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { Search, ShoppingBag, Eye, Heart } from 'lucide-react';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import { ProductTiltCard } from '../components/motion/ProductTiltCard';
import { SEOHead } from '../components/seo/SEOHead';
import { SEO_PAGES } from '../data/seoData';
import { getBreadcrumbSchema } from '../utils/jsonLdSchemas';

export const ShopPage: React.FC = () => {
  const shopSEO = SEO_PAGES.shop;
  const shopBreadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Shop All', url: '/shop' },
  ]);
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
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-28 px-4 sm:px-6 lg:px-10 selection:bg-champagne-300">
      <SEOHead
        title={shopSEO.title}
        description={shopSEO.description}
        keywords={shopSEO.keywords}
        canonical={shopSEO.canonical}
        ogImage={shopSEO.ogImage}
        schema={shopBreadcrumb}
      />
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        
        {/* Compact Editorial Discovery Room Header */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-champagne-300/40 pb-3 sm:pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                  The Discovery Room
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
                <span className="text-[11px] text-obsidian-soft font-medium">
                  400+ Handcrafted Creations
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-obsidian tracking-tight">
                The <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">collection</span>
              </h1>

              <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed max-w-xl">
                Browse sculptural fine jewellery, handcrafted artisanal bangles, custom celebration hampers, and retro polaroid keepsakes.
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full font-bold border border-emerald-200 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Same-Day Mumbai Ready
              </span>
            </div>
          </div>
        </RevealOnScroll>

        {/* Filter and Search Toolbar */}
        <div className="flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center">
          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-[11px] uppercase font-bold tracking-wider transition-all shrink-0 cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-obsidian text-pearl-100 shadow-xs'
                    : 'bg-white/80 hover:bg-white text-obsidian/80 hover:text-obsidian border border-champagne-300/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[200px] sm:w-64 shrink-0">
            <Search className="w-3.5 h-3.5 text-obsidian/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pieces..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white border border-champagne-300/80 text-xs text-obsidian placeholder:text-obsidian-muted/80 focus:outline-none focus:border-gold-dark shadow-2xs"
            />
          </div>
        </div>

        {/* Product Cards Grid - Proportionate and Optimized */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredProducts.map((prod, idx) => (
            <RevealOnScroll key={prod.id} direction="up" delay={Math.min(idx * 40, 240)}>
              <ProductTiltCard
                className="bg-white rounded-2xl overflow-hidden border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-400 flex flex-col justify-between group h-full"
              >
                <div className="relative aspect-[4/3] h-40 sm:h-44 md:h-48 overflow-hidden bg-sand luxury-sheen">
                  <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                    <img
                      src={prod.images.hero}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-xs rounded-full text-obsidian shadow-xs hover:scale-110 active:scale-95 transition-transform z-10 cursor-pointer"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        isWishlisted(prod.id) ? 'fill-rose-600 text-rose-600' : 'text-obsidian'
                      }`}
                    />
                  </button>

                  {/* Clean Badges - No Overlapping */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10 pointer-events-none">
                    {prod.isBestseller && (
                      <span className="text-[9px] uppercase font-mono tracking-wider font-bold bg-obsidian/90 text-pearl-100 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                        Bestseller
                      </span>
                    )}
                    {prod.availableStock && prod.availableStock <= 3 && (
                      <span className="text-[9px] font-mono font-bold bg-pearl-50/95 text-gold-dark backdrop-blur-xs px-2 py-0.5 rounded-full border border-gold-dark/40 shadow-xs">
                        Only {prod.availableStock} Left
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                        {prod.category}
                      </span>
                      {prod.availableStock && prod.availableStock > 3 && (
                        <span className="text-[9px] font-mono text-emerald-700 font-medium">
                          ● In Stock
                        </span>
                      )}
                    </div>
                    <Link to={`/product/${prod.handle}`}>
                      <h3 className="text-xs sm:text-sm font-bold text-obsidian truncate mt-0.5 hover:text-gold-dark transition-colors">
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

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleQuickAdd(prod)}
                        className="flex-1 h-9 bg-obsidian text-pearl-100 text-[11px] uppercase font-bold tracking-wider rounded-full hover:bg-obsidian-200 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{addedId === prod.id ? 'Added!' : 'Add to Bag'}</span>
                      </button>

                      <button
                        onClick={() => setQuickViewProduct(prod)}
                        className="w-9 h-9 min-w-[36px] min-h-[36px] border border-champagne-300/80 hover:bg-champagne-100 active:scale-[0.98] rounded-full text-obsidian transition-all flex items-center justify-center shrink-0 cursor-pointer"
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
