import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FEATURED_PRODUCTS, BRAND_INFO } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { MagneticButton } from '../components/ui/MagneticButton';
import {
  Sparkles,
  ArrowLeft,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  MessageCircle,
  Video,
  Check,
  Plus,
  Minus,
  ArrowUpRight,
  Camera
} from 'lucide-react';
import { CelestiaMirrorModal } from '../components/layout/CelestiaMirrorModal';

export const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const { addToCart, showToast } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);
  const [isMirrorOpen, setIsMirrorOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'care'>('details');

  const product = FEATURED_PRODUCTS.find((p) => p.handle === handle) || FEATURED_PRODUCTS[0];

  const currentImage = activeImage || product.images.hero;
  const galleryImages = [product.images.hero, product.images.detail, product.images.onModel].filter(Boolean) as string[];

  const relatedProducts = FEATURED_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

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
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Breadcrumb Bar */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/60 font-sans">
          <Link to="/" className="hover:text-obsidian transition-colors">Home</Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-obsidian transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-obsidian font-medium truncate max-w-xs">{product.title}</span>
        </div>

        {/* Product Asymmetric Main Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-14 items-start">
          
          {/* Left Gallery Frame (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-sand shadow-luxury-soft border border-champagne-300/60 image-zoom-container">
              <img
                src={currentImage}
                alt={product.images.alt}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                {product.isBestseller && <LuxuryBadge variant="gold">Bestseller</LuxuryBadge>}
                {product.sameDayMumbaiAvailable && (
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full font-sans font-medium">
                    🚚 Mumbai Same-Day Ready
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnail Strip */}
            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                      currentImage === img
                        ? 'border-gold-dark scale-105 shadow-sm'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Product angle" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Product Buying Story (5 Cols) */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-ethereal text-gold-dark font-mono font-medium block">
                {product.category}
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl text-obsidian leading-tight">
                {product.title}
              </h1>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 pt-1">
                <span className="font-serif-luxury text-3xl md:text-4xl text-obsidian font-semibold">
                  ₹{product.price}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg font-sans text-obsidian/40 line-through">
                    ₹{product.compareAtPrice}
                  </span>
                )}
                <span className="text-[10px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                  Taxes Included • Stock: {product.availableStock || 1}
                </span>
              </div>
            </div>

            {/* Editorial Poetic Note */}
            <blockquote className="border-l-2 border-gold-dark pl-4 italic font-serif text-sm md:text-base text-obsidian/85 leading-relaxed">
              "{product.editorialNote}"
            </blockquote>

            <p className="text-xs md:text-sm text-obsidian/75 font-sans leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Controller & Add to Bag */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity */}
                <div className="flex items-center border border-champagne-300/80 rounded-full bg-white px-2 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-obsidian/60 hover:text-obsidian transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-obsidian/60 hover:text-obsidian transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add to Bag Button */}
                <MagneticButton
                  variant="primary"
                  size="lg"
                  onClick={handleAdd}
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

                {/* Wishlist Button */}
                <button
                  onClick={() => {
                    toggleWishlist(product.id);
                    showToast(isWishlisted(product.id) ? "Removed from Wishlist" : `Saved ${product.title} to Wishlist ❤️`);
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all shadow-sm shrink-0 ${
                    isWishlisted(product.id)
                      ? 'bg-rose-50 border-rose-300 text-rose-600'
                      : 'bg-white border-champagne-300/80 text-obsidian hover:bg-rose-50 hover:text-rose-600'
                  }`}
                  aria-label="Toggle Wishlist"
                  title={isWishlisted(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted(product.id) ? 'fill-rose-600' : ''}`} />
                </button>
              </div>

              {/* Instant WhatsApp Order */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-full bg-emerald-800 text-pearl-50 hover:bg-emerald-900 transition-all font-sans text-xs uppercase tracking-widest font-semibold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Order (+91 7718825792)</span>
              </button>

              {/* Celestia Mirror AR Try-On Entry */}
              <button
                onClick={() => setIsMirrorOpen(true)}
                className="w-full h-11 flex items-center justify-center gap-2 px-4 rounded-full bg-pearl-50/80 border border-champagne-300/80 text-obsidian/80 hover:text-obsidian hover:bg-champagne-100/60 transition-all text-xs font-sans font-medium"
              >
                <Camera className="w-3.5 h-3.5 text-gold-dark" />
                <span>Celestia Mirror (AR Virtual Try-On)</span>
              </button>
            </div>

            {/* Tabs (Specifications, Shipping Policy, Care) */}
            <div className="border-t border-champagne-300/40 pt-6 space-y-4">
              <div className="flex gap-4 border-b border-champagne-300/30 pb-2 text-xs font-medium uppercase tracking-wider">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`pb-1 transition-colors ${activeTab === 'details' ? 'border-b-2 border-gold-dark text-obsidian' : 'text-obsidian/50'}`}
                >
                  Material & Specs
                </button>
                <button
                  onClick={() => setActiveTab('shipping')}
                  className={`pb-1 transition-colors ${activeTab === 'shipping' ? 'border-b-2 border-gold-dark text-obsidian' : 'text-obsidian/50'}`}
                >
                  Shipping & Policy
                </button>
                <button
                  onClick={() => setActiveTab('care')}
                  className={`pb-1 transition-colors ${activeTab === 'care' ? 'border-b-2 border-gold-dark text-obsidian' : 'text-obsidian/50'}`}
                >
                  Anti-Tarnish Care
                </button>
              </div>

              {activeTab === 'details' && (
                <div className="space-y-2 text-xs text-obsidian/80">
                  <p><strong className="text-obsidian">Composition:</strong> {product.material}</p>
                  {product.dimensions && <p><strong className="text-obsidian">Dimensions:</strong> {product.dimensions}</p>}
                  <p><strong className="text-obsidian">Atelier Craft:</strong> {product.craftsmanship}</p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-2 text-xs text-obsidian/80">
                  <p className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-emerald-800 shrink-0" /> <strong>Mumbai:</strong> Same-day express courier dispatch available.</p>
                  <p><strong>Pan-India:</strong> Dispatched in 7–10 days with tracking link.</p>
                  <p className="flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-gold-dark shrink-0" /> <strong>Claim Policy:</strong> Uncut unboxing video is required for damage verification.</p>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-2 text-xs text-obsidian/80">
                  <p>• 100% Anti-tarnish & shower-safe coating.</p>
                  <p>• Wipe gently with a soft microfibre cloth after wear.</p>
                  <p>• Store in your complimentary Celestia keepsake pouch.</p>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Related Curated Pieces */}
        <div className="space-y-8 pt-12 border-t border-champagne-300/40">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-luxury text-3xl text-obsidian">
              Complementary Statements
            </h3>
            <Link to="/shop" className="text-xs uppercase tracking-widest text-gold-dark hover:text-obsidian font-semibold">
              View All Catalogue →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <div
                key={rel.id}
                className="bg-pearl-50 rounded-3xl overflow-hidden border border-champagne-300/40 p-4 space-y-3 group hover:shadow-luxury-soft transition-all"
              >
                <div className="aspect-square rounded-2xl overflow-hidden bg-sand">
                  <img src={rel.images.hero} alt={rel.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div>
                  <h4 className="font-serif text-base text-obsidian line-clamp-1">{rel.title}</h4>
                  <p className="text-xs font-mono text-gold-dark font-medium">₹{rel.price}</p>
                </div>
                <Link
                  to={`/product/${rel.handle}`}
                  className="block w-full py-2 bg-obsidian text-pearl-100 text-center rounded-full text-[10px] uppercase tracking-widest hover:bg-obsidian-200 transition-colors"
                >
                  Inspect Piece
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* AR Try-On Modal */}
        <CelestiaMirrorModal
          isOpen={isMirrorOpen}
          onClose={() => setIsMirrorOpen(false)}
          pieceName={product.title}
        />

      </div>
    </div>
  );
};
