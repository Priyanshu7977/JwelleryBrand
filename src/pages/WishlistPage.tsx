import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { Heart, ShoppingBag, Eye, Trash2, ArrowRight, Compass } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, toggleWishlist } = useAuth();
  const { addToCart, setQuickViewProduct, showToast } = useCart();

  const wishlistedItems = FEATURED_PRODUCTS.filter((p) => wishlist.includes(p.id));

  const handleAddAndRemove = (prod: any) => {
    addToCart(prod, 1);
    showToast(`Added ${prod.title} to your Bag ✨`);
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Editorial Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-champagne-300/40 pb-6 sm:pb-8">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                Private Curation
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
              <span className="text-xs sm:text-sm italic text-obsidian-soft font-medium">
                {wishlistedItems.length} {wishlistedItems.length === 1 ? 'Piece' : 'Pieces'} Saved
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-[1.05]">
              YOUR <span className="italic font-normal text-gold-dark">Wishlist</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed max-w-xl">
              Your handpicked jewellery pieces, artisanal bangles, and bespoke celebration hampers saved for your next unboxing.
            </p>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-widest hover:bg-obsidian-200 transition-all shadow-sm"
          >
            <span>Explore Entire Runway</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Empty Wishlist State */}
        {wishlistedItems.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white/90 rounded-3xl border border-champagne-300/60 p-8 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
              <Heart className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-obsidian uppercase">
                Your Wishlist is Empty
              </h2>
              <p className="text-xs sm:text-sm text-obsidian-soft">
                Browse our curated realms and tap the heart icon on any piece to save it to your private atelier collection.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                <Compass className="w-4 h-4" />
                <span>Browse The Collection</span>
              </Link>
            </div>
          </div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6">
            {wishlistedItems.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-3xl overflow-hidden border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden bg-sand">
                  <Link to={`/product/${prod.handle}`} className="block w-full h-full">
                    <img
                      src={prod.images.hero}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <div className="absolute top-3 left-3">
                    {prod.isBestseller && <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>}
                  </div>

                  <button
                    onClick={() => toggleWishlist(prod.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
                        onClick={() => handleAddAndRemove(prod)}
                        className="flex-1 h-10 bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-wider rounded-full hover:bg-obsidian-200 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
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
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
