import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CELESTIA_COLLECTIONS, FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { ArrowLeft, ShoppingBag, Eye, Compass, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SEOHead } from '../components/seo/SEOHead';
import { getBreadcrumbSchema } from '../utils/jsonLdSchemas';

export const CollectionDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart, setQuickViewProduct } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [addedId, setAddedId] = React.useState<string | null>(null);

  const collection = CELESTIA_COLLECTIONS.find((c) => c.handle === handle) || CELESTIA_COLLECTIONS[0];
  
  const matchingProducts = FEATURED_PRODUCTS.filter(
    (p) => p.category.toLowerCase().includes(collection.handle.split('-')[0].toLowerCase())
  );

  const handleQuickAdd = (prod: any) => {
    addToCart(prod, 1);
    setAddedId(prod.id);
    setTimeout(() => setAddedId(null), 1800);
  };

  const collectionBreadcrumb = getBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Collections', url: '/collections' },
    { name: collection.title, url: `/collections/${collection.handle}` },
  ]);

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <SEOHead
        title={`${collection.title} — ${collection.subtitle} | CELESTIA Collections`}
        description={collection.editorialNarrative || `Discover Celestia's handcrafted ${collection.title} collection in Mumbai with 100% anti-tarnish guarantee and same-day express delivery.`}
        keywords={`${collection.title}, ${collection.tags?.join(', ')}, Celestia collections, buy jewellery Mumbai`}
        canonical={`https://jwellery-brand.vercel.app/collections/${collection.handle}`}
        ogImage={collection.featuredImage.startsWith('http') ? collection.featuredImage : `https://jwellery-brand.vercel.app${collection.featuredImage}`}
        schema={collectionBreadcrumb}
      />
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Back link */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian/70 hover:text-obsidian transition-colors font-bold"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Collections</span>
        </Link>

        {/* Collection Hero Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/90 p-5 sm:p-8 lg:p-10 rounded-3xl border border-champagne-300/60 shadow-sm">
          <div className="lg:col-span-7 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Curated Realm
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs text-obsidian/60 font-medium font-sans">{collection.subtitle}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold leading-tight">
              {collection.title}
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed max-w-xl">
              {collection.editorialNarrative}
            </p>

            <blockquote className="border-l-2 border-gold-dark pl-4 text-xs sm:text-sm text-obsidian/85 font-serif font-medium">
              "{collection.accentQuote}"
            </blockquote>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {collection.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-pearl-50 text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40 font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl overflow-hidden aspect-[4/3] bg-sand shadow-inner">
            <img
              src={collection.featuredImage}
              alt={collection.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="space-y-5">
          <div className="flex items-center justify-between text-xs text-obsidian/70">
            <span className="font-medium">{matchingProducts.length} pieces in {collection.title}</span>
            <span className="text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              ✨ Same-Day Mumbai Dispatch Available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {matchingProducts.map((prod) => (
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
    </div>
  );
};

export default CollectionDetailPage;
