import React, { useState } from 'react';
import { X, Sparkles, ShieldCheck, Truck, ShoppingBag, Heart, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { MagneticButton } from '../ui/MagneticButton';
import { LuxuryBadge } from '../ui/LuxuryBadge';

export const QuickViewModal: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, addToCart, showToast } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  if (!quickViewProduct) return null;

  const currentHero = selectedImage || quickViewProduct.images.hero;
  const availableImages = [
    quickViewProduct.images.hero,
    quickViewProduct.images.detail,
    quickViewProduct.images.onModel,
  ].filter(Boolean) as string[];

  const handleAddToCart = () => {
    addToCart(quickViewProduct, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div
        onClick={() => setQuickViewProduct(null)}
        className="fixed inset-0 bg-obsidian/60 backdrop-blur-md transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-pearl-50 rounded-3xl shadow-2xl overflow-hidden z-10 border border-champagne-300/50 max-h-[92vh] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 p-2.5 bg-pearl-100/80 hover:bg-pearl-200 rounded-full text-obsidian shadow-sm transition-all"
          aria-label="Close product quick view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Gallery */}
        <div className="w-full md:w-1/2 p-6 md:p-8 bg-sand/30 flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-pearl-200 shadow-inner">
            <img
              src={currentHero}
              alt={quickViewProduct.images.alt}
              className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
            />
            {quickViewProduct.isBestseller && (
              <div className="absolute top-3 left-3">
                <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {availableImages.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {availableImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    currentHero === img ? 'border-gold-dark scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Product angle" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Details */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-between overflow-y-auto">
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="text-[11px] uppercase tracking-ethereal text-gold-dark font-semibold">
                {quickViewProduct.category}
              </span>
              <h2 className="font-serif-luxury text-2xl md:text-3xl text-obsidian leading-snug">
                {quickViewProduct.title}
              </h2>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-serif-luxury text-2xl text-obsidian font-semibold">
                ₹{quickViewProduct.price}
              </span>
              {quickViewProduct.compareAtPrice && (
                <span className="text-sm font-sans text-obsidian/40 line-through">
                  ₹{quickViewProduct.compareAtPrice}
                </span>
              )}
              <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-sans font-medium">
                Taxes Included
              </span>
            </div>

            <p className="text-xs text-obsidian/75 leading-relaxed font-sans">
              {quickViewProduct.description}
            </p>

            {/* Editorial Note Quote */}
            <div className="p-3.5 bg-champagne-100/50 rounded-xl border-l-2 border-gold-dark text-xs text-obsidian/85 font-serif font-medium">
              "{quickViewProduct.editorialNote}"
            </div>

            {/* Material & Craftsmanship Specs */}
            <div className="space-y-2 pt-2 text-xs border-t border-champagne-300/30">
              <div className="flex gap-2 text-obsidian/80">
                <span className="font-semibold text-obsidian shrink-0">Material:</span>
                <span>{quickViewProduct.material}</span>
              </div>
              {quickViewProduct.dimensions && (
                <div className="flex gap-2 text-obsidian/80">
                  <span className="font-semibold text-obsidian shrink-0">Dimensions:</span>
                  <span>{quickViewProduct.dimensions}</span>
                </div>
              )}
              <div className="flex gap-2 text-obsidian/80">
                <span className="font-semibold text-obsidian shrink-0">Craft:</span>
                <span>{quickViewProduct.craftsmanship}</span>
              </div>
            </div>

            {/* Reassurance Badges */}
            <div className="grid grid-cols-2 gap-2 pt-3">
              <div className="flex items-center gap-2 p-2.5 bg-pearl-100 rounded-xl text-[11px] text-obsidian/80">
                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                <span>Anti-Tarnish Seal</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-pearl-100 rounded-xl text-[11px] text-obsidian/80">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Same-Day Mumbai</span>
              </div>
            </div>
          </div>

          {/* Add to Bag Action */}
          <div className="pt-6 mt-6 border-t border-champagne-300/40 flex items-center gap-3">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              className="flex-1"
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4 text-champagne-300" />
                  <span>Added to Bag</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Curated Bag</span>
                </>
              )}
            </MagneticButton>

            {quickViewProduct.url && (
              <a
                href={quickViewProduct.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 border border-champagne-300/60 rounded-full text-obsidian hover:bg-champagne-100 transition-colors"
                title="View Live Listing on DM2Buy"
              >
                <Sparkles className="w-4 h-4 text-gold-dark" />
              </a>
            )}
            <button
              onClick={() => {
                toggleWishlist(quickViewProduct.id);
                showToast(
                  isWishlisted(quickViewProduct.id)
                    ? `Removed from wishlist`
                    : `Saved "${quickViewProduct.title}" to your private wishlist ✨`
                );
              }}
              className={`p-3.5 border border-champagne-300/60 rounded-full transition-all cursor-pointer ${
                isWishlisted(quickViewProduct.id)
                  ? 'bg-rose-50 border-rose-300 text-rose-600'
                  : 'text-obsidian hover:bg-champagne-100'
              }`}
              aria-label="Toggle wishlist"
              title={isWishlisted(quickViewProduct.id) ? 'Remove from wishlist' : 'Save to wishlist'}
            >
              <Heart
                className={`w-4 h-4 ${
                  isWishlisted(quickViewProduct.id) ? 'fill-rose-600 text-rose-600' : ''
                }`}
              />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
