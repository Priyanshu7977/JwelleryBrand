import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  MessageCircle,
  Eye,
  Plus,
  Minus,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'care'>('details');

  const product = FEATURED_PRODUCTS.find((p) => p.handle === handle) || FEATURED_PRODUCTS[0];

  const currentImage = activeImage || product.images.hero;
  const galleryImages = [product.images.hero, product.images.detail, product.images.onModel].filter(Boolean) as string[];

  const handleAdd = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hello%20Celestia%20Team!%20✨%0A%0AI%20would%20like%20to%20order:*%20${encodeURIComponent(product.title)}%20(x${quantity})%0A*Price:*%20₹${product.price * quantity}%0A*Product%20Link:*%20https://celestiaamor.in/product/${product.handle}%0A%0APlease%20confirm%20availability%20for%20Same-Day%20Mumbai%20/%20Pan-India%20courier.`;
    window.open(`https://wa.me/917718825792?text=${msg}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian-muted">
          <Link to="/" className="hover:text-obsidian transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-obsidian transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-obsidian font-bold truncate max-w-xs">{product.title}</span>
        </div>

        {/* 2-Column Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
          
          {/* Left Gallery (6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-sand shadow-luxury-soft border border-champagne-300/60">
              <img
                src={currentImage}
                alt={product.images.alt}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isBestseller && <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>}
                {product.sameDayMumbaiAvailable && (
                  <span className="text-[10px] uppercase font-mono font-bold bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full">
                    🚚 Mumbai Same-Day Ready
                  </span>
                )}
              </div>

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full text-obsidian shadow-sm hover:scale-110 transition-transform"
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted(product.id) ? 'fill-rose-600 text-rose-600' : 'text-obsidian'
                  }`}
                />
              </button>
            </div>

            {/* Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-16 sm:w-20 aspect-square rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      currentImage === img
                        ? 'border-gold-dark scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Details (6 Cols) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                  {product.category}
                </span>
                <span className="text-obsidian-muted">•</span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full font-bold">
                  Available Stock ({product.availableStock})
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl text-obsidian font-bold leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl font-bold text-obsidian">₹{product.price}</span>
                {product.compareAtPrice && (
                  <span className="text-lg text-obsidian-muted line-through font-semibold">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-xs uppercase font-mono font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full">
                    Save ₹{product.compareAtPrice - product.price}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm sm:text-base text-obsidian-soft leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Add to Bag */}
            <div className="space-y-3 pt-4 border-t border-champagne-300/50">
              <div className="flex items-center gap-4">
                <div className="flex items-center border border-champagne-300/80 rounded-full bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-champagne-100 text-obsidian transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-obsidian font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-champagne-100 text-obsidian transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="flex-1 h-12 bg-obsidian text-pearl-100 text-xs sm:text-sm uppercase font-bold tracking-widest rounded-full hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isAdded ? 'Added to Bag!' : `Add to Bag • ₹${product.price * quantity}`}</span>
                </button>
              </div>

              {/* WhatsApp Concierge Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full h-11 border border-emerald-600/60 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Order via WhatsApp Concierge</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-champagne-300/50">
                <Truck className="w-4 h-4 text-gold-dark shrink-0" />
                <span className="text-xs font-medium text-obsidian">Same-Day Mumbai Express</span>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-white/80 border border-champagne-300/50">
                <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                <span className="text-xs font-medium text-obsidian">100% Anti-Tarnish Finish</span>
              </div>
            </div>

            {/* Detail Tabs */}
            <div className="space-y-3 pt-4 border-t border-champagne-300/50">
              <div className="flex gap-2">
                {(['details', 'shipping', 'care'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                      activeTab === tab
                        ? 'bg-obsidian text-pearl-100'
                        : 'bg-white text-obsidian hover:bg-champagne-100/60 border border-champagne-300/60'
                    }`}
                  >
                    {tab === 'details' ? 'Details' : tab === 'shipping' ? 'Shipping' : 'Care Guide'}
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-2xl bg-white/80 border border-champagne-300/50 text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                {activeTab === 'details' && (
                  <div className="space-y-1.5">
                    <p><strong className="text-obsidian">Material:</strong> {product.material}</p>
                    <p><strong className="text-obsidian">Craftsmanship:</strong> {product.craftsmanship}</p>
                  </div>
                )}
                {activeTab === 'shipping' && (
                  <p>Complimentary express shipping across India on all orders over ₹999. Same-day hand courier dispatch available for Mumbai PIN codes.</p>
                )}
                {activeTab === 'care' && (
                  <p>Store in your Celestia velvet pouch. Avoid direct exposure to harsh perfumes and chemical solvents to preserve the 18k gold dipped luster.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailPage;
