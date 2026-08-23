import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { Heart, ShoppingBag, Eye, Trash2, ArrowRight, Sparkles, Compass } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useAuth();
  const { addToCart, setQuickViewProduct, showToast } = useCart();

  const wishlistedItems = FEATURED_PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAndRemove = (prod: any) => {
    addToCart(prod, 1);
    showToast(`Added ${prod.title} to your Bag ✨`);
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                Private Curation
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-sm font-serif italic text-obsidian-soft">
                {wishlistedItems.length} {wishlistedItems.length === 1 ? 'Piece' : 'Pieces'} Saved
              </span>
            </div>

            <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal leading-[0.92]">
              YOUR <span className="italic font-light text-gold-dark">Wishlist</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian-soft font-sans leading-relaxed max-w-xl">
              Your handpicked jewellery pieces, artisanal bangles, and bespoke celebration hampers saved for your next unboxing.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest hover:bg-obsidian-200 transition-all shadow-sm font-bold"
          >
            <span>Explore Entire Runway</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Empty Wishlist State */}
        {wishlistedItems.length === 0 ? (
          <div className="py-24 text-center space-y-6 bg-pearl-50/90 rounded-3xl border border-champagne-300/60 p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
              <Heart className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian uppercase">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs sm:text-sm text-obsidian-soft font-sans">
                Browse our curated realms and tap the heart icon on any piece to save it to your private atelier collection.
              </p>
            </div>

            <div className="pt-2">
              <Link
                to="/shop"
                className="btn-primary"
              >
                <Compass className="w-4 h-4" />
                <span>Browse The Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {wishlistedItems.map((prod) => (
              <div
                key={prod.id}
                className="bg-pearl-50 rounded-3xl overflow-hidden border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-500 flex flex-col justify-between group"
              >
                {/* Image Frame */}
                <div className="relative aspect-square overflow-hidden bg-sand image-zoom-container">
                  <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                    <img
                      src={prod.images.hero}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </Link>

                  <div className="absolute top-3 left-3">
                    {prod.isBestseller ? (
                      <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>
                    ) : (
                      <LuxuryBadge variant="pearl">{prod.category}</LuxuryBadge>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => {
                      toggleWishlist(prod.id);
                      showToast(`Removed from Wishlist`);
                    }}
                    className="absolute top-3 right-3 p-2 bg-pearl-50/90 rounded-full text-rose-700 hover:bg-rose-100 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Details & Direct Action */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold block">
                      {prod.category}
                    </span>
                    <h3 className="font-serif-luxury text-lg text-obsidian font-bold truncate">
                      {prod.title}
                    </h3>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-serif text-xl text-obsidian font-bold">
                        ₹{prod.price}
                      </span>
                      {prod.compareAtPrice && (
                        <span className="text-xs font-sans text-obsidian-muted line-through font-semibold">
                          ₹{prod.compareAtPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1 border-t border-champagne-300/40">
                    <button
                      onClick={() => handleAddAndRemove(prod)}
                      className="flex-1 h-10 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5 font-bold shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Bag</span>
                    </button>
                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="w-10 h-10 border border-champagne-300/80 hover:bg-champagne-100 rounded-full text-obsidian transition-colors flex items-center justify-center"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
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
