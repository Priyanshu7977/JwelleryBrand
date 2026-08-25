import React, { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FEATURED_PRODUCTS, BRAND_INFO } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import { ProductTiltCard } from '../components/motion/ProductTiltCard';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  Eye,
  Plus,
  Minus,
  Star,
  Clock,
  ArrowRight,
  Share2,
  Check,
  HelpCircle,
  Maximize2,
  X,
  Package,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { SEOHead } from '../components/seo/SEOHead';
import { getProductSchema, getBreadcrumbSchema } from '../utils/jsonLdSchemas';

export const ProductDetailPage: React.FC = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const { addToCart, showToast, setIsCartOpen, setQuickViewProduct } = useCart();
  const { toggleWishlist, isWishlisted } = useAuth();

  const product = FEATURED_PRODUCTS.find((p) => p.handle === handle) || FEATURED_PRODUCTS[0];

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string>('2.6');
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'craftsmanship' | 'packaging' | 'shipping' | 'care'>('details');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [zoomStyle, setZoomStyle] = useState({ transformOrigin: 'center center', transform: 'scale(1)' });

  // Gallery Images
  const galleryImages = [
    product.images.hero,
    product.images.detail,
    product.images.onModel,
    '/assets/products/pink-blue-bangles.jpg',
  ].filter(Boolean) as string[];

  const currentImage = galleryImages[activeImageIndex] || product.images.hero;

  // Zoom on hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.75)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: 'center center',
      transform: 'scale(1)',
    });
  };

  const handleAdd = () => {
    addToCart(product, quantity, {
      selectedSize: product.category === 'bangles' ? selectedSize : undefined,
    });
    setIsAdded(true);
    showToast(`Added ${product.title} to your bag ✨`);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, {
      selectedSize: product.category === 'bangles' ? selectedSize : undefined,
    });
    navigate('/checkout');
  };

  const handleWhatsAppOrder = () => {
    const msg = `Hello Celestia Atelier! ✨%0A%0AI would like to order:* ${encodeURIComponent(product.title)}*%0A*Quantity:* ${quantity}%0A*Selected Size:* ${selectedSize}%0A*Total Price:* ₹${product.price * quantity}%0A*Product URL:* https://celestiaamor.in/product/${product.handle}%0A%0APlease confirm availability for Same-Day Mumbai Express / Pan-India dispatch.`;
    window.open(`https://wa.me/917718825792?text=${msg}`, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: `Check out ${product.title} on Celestia Atelier`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Product link copied to clipboard ✨");
    }
  };

  // Related products
  const relatedProducts = FEATURED_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  const discountPercent = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 md:pt-36 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      
      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL                                                            */}
      {/* ========================================================================= */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[200] bg-obsidian/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fade-in">
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-pearl-100/20 text-pearl-100 hover:bg-pearl-100 hover:text-obsidian flex items-center justify-center transition-all"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="max-w-4xl max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-champagne-400/40">
            <img src={currentImage} alt={product.title} className="w-full h-full object-contain" />
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BANGLE SIZE GUIDE MODAL                                                   */}
      {/* ========================================================================= */}
      {isSizeGuideOpen && (
        <div className="fixed inset-0 z-[200] bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 space-y-4 border border-champagne-300 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-champagne-300/60 pb-3">
              <h3 className="text-base font-bold text-obsidian">Bangle Sizing Guide</h3>
              <button onClick={() => setIsSizeGuideOpen(false)} className="p-1 rounded-full hover:bg-champagne-100 text-obsidian">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3 text-xs text-obsidian-soft leading-relaxed">
              <p>Measure the inner diameter of a bangle that fits you well:</p>
              <div className="border border-champagne-300 rounded-xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-champagne-100 font-mono uppercase text-[10px] text-obsidian font-bold">
                    <tr>
                      <th className="p-2.5">Indian Size</th>
                      <th className="p-2.5">Inner Diameter</th>
                      <th className="p-2.5">Wrist Fit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-champagne-200 text-obsidian font-medium">
                    <tr>
                      <td className="p-2.5 font-bold">2.4</td>
                      <td className="p-2.5">2.25 in (5.7 cm)</td>
                      <td className="p-2.5">Small</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">2.6</td>
                      <td className="p-2.5">2.37 in (6.0 cm)</td>
                      <td className="p-2.5">Standard / Medium</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold">2.8</td>
                      <td className="p-2.5">2.50 in (6.4 cm)</td>
                      <td className="p-2.5">Comfort / Large</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-obsidian/70 font-medium">
                ✨ Free size exchange supported within 7 days across India.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic SEO & Product Schema */}
      <SEOHead
        title={`${product.title} | 100% Anti-Tarnish Fine Jewellery | CELESTIA`}
        description={product.description || `Handcrafted ${product.title} in Mumbai. 100% anti-tarnish, water-resistant, and delivered with same-day Mumbai express dispatch.`}
        keywords={`${product.title}, buy ${product.title} online, anti tarnish ${product.category}, Celestia jewellery Mumbai`}
        canonical={`https://jwellery-brand.vercel.app/product/${product.handle}`}
        ogType="product"
        ogImage={product.images?.hero ? (product.images.hero.startsWith('http') ? product.images.hero : `https://jwellery-brand.vercel.app${product.images.hero}`) : undefined}
        schema={[
          getProductSchema(product),
          getBreadcrumbSchema([
            { name: 'Home', url: '/' },
            { name: 'Shop', url: '/shop' },
            { name: product.category, url: `/collections/${product.category}` },
            { name: product.title, url: `/product/${product.handle}` },
          ]),
        ]}
      />

      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* ========================================================================= */}
        {/* BREADCRUMBS & SHARE BAR                                                   */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="flex items-center justify-between gap-4 border-b border-champagne-300/40 pb-3 sm:pb-4 text-xs font-mono tracking-wider">
            <div className="flex items-center gap-2 text-obsidian-muted uppercase truncate">
              <Link to="/" className="hover:text-gold-dark transition-colors">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-gold-dark transition-colors">Shop</Link>
              <span>/</span>
              <span className="text-gold-dark font-bold uppercase">{product.category}</span>
              <span>/</span>
              <span className="text-obsidian font-bold truncate max-w-[140px] sm:max-w-xs">{product.title}</span>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-champagne-300/70 hover:bg-champagne-100 text-obsidian transition-colors text-[11px] font-bold shrink-0"
              title="Share piece"
            >
              <Share2 className="w-3.5 h-3.5 text-gold-dark" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </RevealOnScroll>

        {/* ========================================================================= */}
        {/* 2-COLUMN MAIN PRODUCT SHOWCASE (Matching Luxury Almari Experience)        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT: INTERACTIVE MEDIA GALLERY (7 Cols)                                */}
          {/* ======================================================================= */}
          <RevealOnScroll direction="up" delay={100} className="lg:col-span-7 space-y-4">
            
            {/* Main Stage Image with Zoom on Hover */}
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] rounded-3xl overflow-hidden bg-sand shadow-luxury-soft border border-champagne-300/80 group">
              
              {/* Zoom container */}
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full h-full cursor-zoom-in overflow-hidden"
              >
                <img
                  src={currentImage}
                  alt={product.title}
                  style={zoomStyle}
                  className="w-full h-full object-cover transition-transform duration-200 ease-out"
                />
              </div>

              {/* Luxury Badges Overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                {product.isBestseller && <LuxuryBadge variant="gold">Signature Bestseller</LuxuryBadge>}
                {product.sameDayMumbaiAvailable && (
                  <span className="text-[10px] uppercase font-mono font-bold bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full shadow-xs border border-emerald-200">
                    🚚 Mumbai Same-Day Ready
                  </span>
                )}
              </div>

              {/* Floating Action Buttons */}
              <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                <button
                  onClick={() => setIsLightboxOpen(true)}
                  className="p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-obsidian shadow-md hover:scale-105 transition-all"
                  title="Expand Fullscreen"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="p-2.5 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-obsidian shadow-md hover:scale-105 transition-all"
                  aria-label="Wishlist"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isWishlisted(product.id) ? 'fill-rose-600 text-rose-600' : 'text-obsidian'
                    }`}
                  />
                </button>
              </div>

              {/* Hint badge at bottom */}
              <div className="absolute bottom-3 right-3 text-[10px] font-mono uppercase bg-obsidian/70 backdrop-blur-sm text-pearl-100 px-2.5 py-1 rounded-full pointer-events-none">
                Hover to Zoom • Click for Full View
              </div>
            </div>

            {/* Thumbnail Carousel Bar */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 pt-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 sm:w-24 aspect-square rounded-2xl overflow-hidden border-2 shrink-0 transition-all duration-300 bg-sand ${
                      activeImageIndex === idx
                        ? 'border-gold-dark ring-2 ring-gold-dark/30 scale-105 shadow-md'
                        : 'border-champagne-300/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`${product.title} view ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Atelier Verification Trust Bar */}
            <div className="grid grid-cols-3 gap-2.5 p-4 rounded-2xl bg-white/90 border border-champagne-300/60 text-center shadow-xs">
              <div className="space-y-0.5">
                <ShieldCheck className="w-4 h-4 text-gold-dark mx-auto" />
                <p className="text-[11px] font-bold text-obsidian uppercase">100% Anti-Tarnish</p>
                <p className="text-[10px] text-obsidian-soft">Waterproof everyday wear</p>
              </div>
              <div className="space-y-0.5 border-x border-champagne-300/50">
                <Package className="w-4 h-4 text-gold-dark mx-auto" />
                <p className="text-[11px] font-bold text-obsidian uppercase">Luxury Keepsake</p>
                <p className="text-[10px] text-obsidian-soft">Velvet pouch & wax seal</p>
              </div>
              <div className="space-y-0.5">
                <Truck className="w-4 h-4 text-gold-dark mx-auto" />
                <p className="text-[11px] font-bold text-obsidian uppercase">Express Dispatch</p>
                <p className="text-[10px] text-obsidian-soft">Same-day Mumbai delivery</p>
              </div>
            </div>

          </RevealOnScroll>

          {/* ======================================================================= */}
          {/* RIGHT: BUYING CONSOLE & SPECIFICATIONS (5 Cols)                         */}
          {/* ======================================================================= */}
          <RevealOnScroll direction="up" delay={150} className="lg:col-span-5 space-y-6">
            
            {/* Header / Titles */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="uppercase font-bold tracking-widest text-gold-dark bg-champagne-100 px-2.5 py-0.5 rounded-full border border-champagne-300/60">
                  {product.category}
                </span>
                <span className="text-obsidian-muted font-bold">
                  SKU: CEL-MMXXVI-0{product.id.slice(-4) || '79'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl text-obsidian font-bold leading-tight">
                {product.title}
              </h1>

              {/* Verified Reviews Rating Pill */}
              <div className="flex items-center gap-2 pt-0.5">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-obsidian">4.95 / 5.0</span>
                <span className="text-xs text-obsidian-soft">• (148 verified buyers)</span>
              </div>

              {/* Price Block */}
              <div className="p-4 rounded-2xl bg-sand/30 border border-champagne-300/60 space-y-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-bold text-obsidian font-mono">
                    ₹{product.price}
                  </span>
                  {product.compareAtPrice && (
                    <span className="text-lg text-obsidian-muted line-through font-semibold font-mono">
                      ₹{product.compareAtPrice}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-xs uppercase font-mono font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Save ₹{product.compareAtPrice! - product.price} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-obsidian-soft">
                  Inclusive of all taxes. Free Pan-India express courier on orders over ₹999.
                </p>
              </div>
            </div>

            {/* Urgency & Stock Bar */}
            <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-300/70 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-950">
                <Clock className="w-4 h-4 text-gold-dark shrink-0" />
                <span>Order within 2h 45m for Same-Day Mumbai Dispatch</span>
              </div>
              <p className="text-[11px] text-amber-900/80 font-medium">
                🔥 Rare Mumbai Atelier Stock: Only {product.availableStock || 2} piece(s) available.
              </p>
            </div>

            {/* Bangle Sizing Option Selector (if bangles) */}
            {product.category === 'bangles' && (
              <div className="space-y-2 pt-2 border-t border-champagne-300/50">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase font-mono font-bold text-obsidian flex items-center gap-1.5">
                    <span>Select Size (Diameter)</span>
                  </label>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="text-[11px] text-gold-dark underline font-bold flex items-center gap-1 hover:text-obsidian transition-colors"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>Size Guide</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {['2.4 (Small)', '2.6 (Standard)', '2.8 (Comfort)'].map((sizeLabel) => {
                    const sizeKey = sizeLabel.split(' ')[0];
                    const isSelected = selectedSize === sizeKey;
                    return (
                      <button
                        key={sizeKey}
                        onClick={() => setSelectedSize(sizeKey)}
                        className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all text-center ${
                          isSelected
                            ? 'border-gold-dark bg-obsidian text-pearl-100 shadow-sm'
                            : 'border-champagne-300/80 bg-white text-obsidian hover:bg-champagne-100/60'
                        }`}
                      >
                        {sizeLabel}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Stepper & Add to Bag Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-champagne-300/80 rounded-full bg-white p-1 shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-champagne-100 text-obsidian transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-obsidian font-mono">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-champagne-100 text-obsidian transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className="btn-primary flex-1 min-h-[48px] h-12 text-xs sm:text-sm uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>{isAdded ? 'Added to Bag! ✨' : `Add To Bag • ₹${product.price * quantity}`}</span>
                </button>
              </div>

              {/* Direct WhatsApp Concierge Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                className="w-full min-h-[48px] h-12 border border-emerald-600/70 bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-950 text-xs uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-2.5 shadow-sm cursor-pointer"
              >
                <WhatsAppIcon className="w-5 h-5 shrink-0" />
                <span>Direct Order via WhatsApp Concierge</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full min-h-[48px] h-12 border border-champagne-400/80 bg-white hover:bg-champagne-100 text-obsidian text-xs uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Instant Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 shrink-0" />
              </button>
            </div>

            {/* Editorial Description Snippet */}
            <div className="pt-2 border-t border-champagne-300/50 space-y-2">
              <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                {product.description}
              </p>
              {product.editorialNote && (
                <blockquote className="border-l-2 border-gold-dark pl-3 text-xs text-obsidian/85 font-serif font-medium">
                  "{product.editorialNote}"
                </blockquote>
              )}
            </div>

          </RevealOnScroll>

        </div>

        {/* ========================================================================= */}
        {/* STRUCTURED SPECIFICATION TABS (Inspired by myalmari.in reference)        */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={150}>
          <div className="bg-white/95 rounded-3xl border border-champagne-300/70 shadow-luxury-soft p-6 sm:p-8 lg:p-10 space-y-6">
            
            {/* Tab Navigation Pill Bar */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-champagne-300/40">
              {[
                { id: 'details', label: 'Details & Specifications' },
                { id: 'craftsmanship', label: 'Artisanal Craftsmanship' },
                { id: 'packaging', label: 'Keepsake Unboxing' },
                { id: 'shipping', label: 'Shipping & Returns' },
                { id: 'care', label: 'Care Instructions' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-obsidian text-pearl-100 shadow-sm'
                      : 'bg-pearl-50 text-obsidian-soft hover:text-obsidian hover:bg-champagne-100/60 border border-champagne-300/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Body Content */}
            <div className="text-xs sm:text-sm text-obsidian leading-relaxed space-y-4">
              {activeTab === 'details' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/60 space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gold-dark block">Material Composition</span>
                    <p className="font-semibold text-obsidian">{product.material}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/60 space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gold-dark block">Dimensions & Fit</span>
                    <p className="font-semibold text-obsidian">{product.dimensions || 'Universal comfort fit calibrated in Mumbai'}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/60 space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gold-dark block">Anti-Tarnish Seal</span>
                    <p className="font-semibold text-obsidian">18K Dual-Dip Coating over surgical-grade steel</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/60 space-y-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gold-dark block">Dispatch Origin</span>
                    <p className="font-semibold text-obsidian">Bandra West Atelier, Mumbai, Maharashtra 400050</p>
                  </div>
                </div>
              )}

              {activeTab === 'craftsmanship' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-obsidian">Handmade with Tenderness in Mumbai</h4>
                  <p className="text-obsidian-soft">
                    {product.craftsmanship || 'Each piece undergoes a 4-step artisan inspection under Mumbai coastal daylight. Contours are hand-polished to mirror perfection before receiving our signature protective lustre coat.'}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {product.tags.map((t) => (
                      <span key={t} className="px-3 py-1 rounded-full bg-champagne-100 text-obsidian text-[11px] font-mono font-semibold">
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'packaging' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-obsidian">Signature Celestia Keepsake Presentation</h4>
                  <p className="text-obsidian-soft">
                    Every order arrives wrapped inside our archival textured gift box, tied with a double-satin ribbon, accompanied by a custom wax-sealed card and retro Polaroid keepsake.
                  </p>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-obsidian">Pan-India Express & Mumbai Same-Day</h4>
                  <ul className="space-y-2 list-disc pl-5 text-obsidian-soft">
                    <li><strong>Mumbai Orders:</strong> Same-day evening delivery available for orders placed before 2:00 PM IST.</li>
                    <li><strong>Pan-India Express:</strong> 2 to 4 business days via premium air couriers (Bluedart / Delhivery).</li>
                    <li><strong>Returns & Exchanges:</strong> 7-day hassle-free size exchange and defect warranty.</li>
                  </ul>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="space-y-3">
                  <h4 className="font-bold text-base text-obsidian">Preserving Your 18K Dipped Gold Luster</h4>
                  <p className="text-obsidian-soft">
                    Our anti-tarnish coating resists water, sweat, and everyday humidity. To maintain maximum brilliance, gently wipe with the complimentary micro-fiber cloth and store inside the velvet pouch when not in use.
                  </p>
                </div>
              )}
            </div>

          </div>
        </RevealOnScroll>

        {/* ========================================================================= */}
        {/* VERIFIED CUSTOMER REVIEWS SECTION                                         */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={200}>
          <div className="bg-white/95 rounded-3xl border border-champagne-300/70 shadow-luxury-soft p-6 sm:p-8 lg:p-10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold block">
                  Verified Atelier Experiences
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-obsidian">
                  Client <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">reflections</span>
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <span className="text-2xl font-bold text-obsidian font-mono">4.95 / 5</span>
                  <p className="text-[10px] text-obsidian-soft">From 148 verified buyers</p>
                </div>
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonials Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  name: 'Tanvi S. (Mumbai)',
                  rating: 5,
                  comment: 'The packaging itself made me gasp! The bangles have the most gorgeous lustre, and the retro polaroid was such a thoughtful touch.',
                  date: 'Verified Buyer • 3 days ago',
                },
                {
                  name: 'Radhika K. (Bangalore)',
                  rating: 5,
                  comment: 'Wore these for 3 wedding functions back to back and zero tarnishing even with perfume and sweat. Truly luxury at an honest price.',
                  date: 'Verified Buyer • 1 week ago',
                },
                {
                  name: 'Pooja D. (Delhi)',
                  rating: 5,
                  comment: 'Customer service on WhatsApp was so patient with my custom hamper sizing questions. Dispatched on the same day!',
                  date: 'Verified Buyer • 2 weeks ago',
                },
              ].map((rev, rIdx) => (
                <div key={rIdx} className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/50 space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-xs text-obsidian/85 font-serif leading-relaxed">
                      "{rev.comment}"
                    </p>
                  </div>
                  <div className="pt-2 border-t border-champagne-200">
                    <p className="text-xs font-bold text-obsidian">{rev.name}</p>
                    <p className="text-[10px] text-emerald-800 font-mono font-medium">{rev.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* ========================================================================= */}
        {/* COMPANION PIECES: "YOU MAY ALSO ADORE" (Curated 4-Product Grid)            */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={250}>
          <div className="space-y-6">
            <div className="flex items-end justify-between border-b border-champagne-300/40 pb-4">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Curated Companions
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold text-obsidian">
                  Complete the <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">suite</span>
                </h3>
              </div>
              <Link to="/shop" className="text-xs font-bold uppercase tracking-widest text-obsidian hover:text-gold-dark transition-colors flex items-center gap-1">
                <span>View All Pieces</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {relatedProducts.map((relProd) => (
                <ProductTiltCard
                  key={relProd.id}
                  className="bg-white rounded-2xl overflow-hidden border border-champagne-300/60 shadow-sm hover:shadow-luxury-soft transition-all duration-400 flex flex-col justify-between group"
                >
                  <Link to={`/product/${relProd.handle}`} className="block relative aspect-[4/3] overflow-hidden bg-sand luxury-sheen">
                    <img
                      src={relProd.images.hero}
                      alt={relProd.title}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-xs text-white font-bold uppercase tracking-wider flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> View Piece
                      </span>
                    </div>
                  </Link>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                        {relProd.category}
                      </span>
                      <Link to={`/product/${relProd.handle}`}>
                        <h4 className="text-sm font-bold text-obsidian truncate hover:text-gold-dark transition-colors">
                          {relProd.title}
                        </h4>
                      </Link>
                      <p className="text-[11px] text-obsidian-soft line-clamp-1 mt-0.5">
                        {relProd.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-champagne-300/40 flex items-center justify-between">
                      <span className="text-base font-bold text-obsidian font-mono">₹{relProd.price}</span>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => addToCart(relProd, 1)}
                          className="px-3 h-8 bg-obsidian text-pearl-100 text-[10px] uppercase font-bold tracking-wider rounded-full hover:bg-obsidian-200 active:scale-[0.98] transition-all flex items-center gap-1 shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add</span>
                        </button>
                        <button
                          onClick={() => setQuickViewProduct(relProd)}
                          className="w-8 h-8 border border-champagne-300/80 hover:bg-champagne-100 active:scale-[0.98] rounded-full text-obsidian transition-all flex items-center justify-center shrink-0"
                          title="Quick View"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ProductTiltCard>
              ))}
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default ProductDetailPage;
