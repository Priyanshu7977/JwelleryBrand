import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CELESTIA_COLLECTIONS, FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { Sparkles, ArrowLeft, ArrowUpRight, ShoppingBag, Eye, Check } from 'lucide-react';

export const CollectionDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart, setQuickViewProduct } = useCart();
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

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back link */}
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/70 hover:text-obsidian transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>All Collections</span>
        </Link>

        {/* Collection Hero Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-pearl-50/90 p-8 md:p-12 rounded-3xl border border-champagne-300/50 shadow-sm">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
                Curated Realm
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs font-serif italic text-obsidian/60">{collection.subtitle}</span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase leading-tight">
              {collection.title}
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed max-w-xl">
              {collection.editorialNarrative}
            </p>

            <blockquote className="border-l-2 border-gold-dark pl-4 italic font-serif text-sm text-obsidian/85">
              "{collection.accentQuote}"
            </blockquote>

            <div className="flex flex-wrap gap-2 pt-2">
              {collection.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-white text-[10px] uppercase tracking-wider text-obsidian/70 rounded-full border border-champagne-300/40"
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
        <div className="space-y-6">
          <div className="flex items-center justify-between text-xs text-obsidian/60">
            <span>{matchingProducts.length} pieces in {collection.title}</span>
            <span className="text-emerald-800 font-medium">✨ Same-Day Mumbai Dispatch Available</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {matchingProducts.map((prod) => (
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

                  <div className="absolute top-3 left-3">
                    {prod.isBestseller && <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>}
                  </div>

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
        </div>

      </div>
    </div>
  );
};
