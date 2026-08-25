import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  MessageCircle,
  Truck,
  Sparkles,
  Tag,
  ShieldCheck,
  Check,
  Gift,
  Lock,
  ChevronRight,
  Flame
} from 'lucide-react';
import { useCart, POPULAR_COUPONS } from '../../context/CartContext';
import { BRAND_INFO, FEATURED_PRODUCTS } from '../../data/shopify-data';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    subtotal,
    discountAmount,
    finalPayable,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    totalItems,
    checkoutViaWhatsApp,
    showToast
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  if (!isCartOpen) return null;

  // Multi-tier perks
  const freeShippingThreshold = BRAND_INFO.freeShippingThreshold || 999;
  const freeGiftThreshold = 1999;

  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const freeGiftNeeded = Math.max(0, freeGiftThreshold - subtotal);

  const shippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const giftProgress = Math.min(100, (subtotal / freeGiftThreshold) * 100);

  const shippingCost = finalPayable >= freeShippingThreshold || finalPayable === 0 ? 0 : 99;
  const grandTotal = finalPayable + shippingCost;

  const handleApplyCoupon = (codeToApply: string) => {
    const res = applyCoupon(codeToApply);
    if (res.success) {
      setCouponInput('');
    } else {
      showToast(res.message);
    }
  };

  // Upsell items (excluding what's already in cart)
  const cartProductIds = cart.map((i) => i.product.id);
  const upsellItems = FEATURED_PRODUCTS.filter((p) => !cartProductIds.includes(p.id)).slice(0, 3);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-pearl-100 h-full shadow-2xl flex flex-col justify-between z-10 border-l border-champagne-300/60 selection:bg-champagne-300">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-champagne-300/40 bg-pearl-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-champagne-100 flex items-center justify-center text-gold-dark shadow-xs">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif-luxury text-xl sm:text-2xl tracking-wide text-obsidian font-bold leading-none">
                  Your Curated Bag
                </h2>
                <p className="text-[10px] sm:text-[11px] text-obsidian-soft font-sans font-medium">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-champagne-200/60 rounded-full transition-colors cursor-pointer"
              aria-label="Close curated bag drawer"
            >
              <X className="w-5 h-5 text-obsidian/70" />
            </button>
          </div>

          {/* Dynamic Free Shipping & Gift Progress Bar */}
          {cart.length > 0 && (
            <div className="mt-3 p-3 bg-white rounded-2xl border border-champagne-300/60 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-obsidian flex items-center gap-1.5 text-[11px]">
                  <Truck className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  {freeShippingNeeded === 0 ? (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <span>✨ Free Pan-India Express Delivery Unlocked!</span>
                    </span>
                  ) : (
                    <span>
                      Add <strong className="text-gold-dark font-mono font-bold">₹{freeShippingNeeded}</strong> more for <strong>FREE Delivery</strong>
                    </span>
                  )}
                </span>
                <span className="font-mono text-[10px] font-bold text-gold-dark">{Math.round(shippingProgress)}%</span>
              </div>

              <div className="relative w-full h-2 bg-sand rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500 rounded-full shadow-xs"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>

              {/* Secondary Tier (Free Velvet Keepsake Pouch) */}
              {subtotal < freeGiftThreshold && (
                <div className="flex items-center justify-between text-[10px] text-obsidian-soft pt-0.5 font-sans">
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3 text-gold-dark" />
                    <span>Add ₹{freeGiftNeeded} more for complimentary Velvet Keepsake Pouch</span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Item List Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 scrollbar-thin">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-20 h-20 rounded-full bg-champagne-100/70 border border-champagne-300/60 flex items-center justify-center text-gold-dark shadow-sm">
                <ShoppingBag className="w-10 h-10 stroke-1" />
              </div>
              <div className="space-y-1 max-w-xs">
                <p className="font-serif-luxury text-2xl text-obsidian font-bold">Your Bag is Empty</p>
                <p className="text-xs text-obsidian/60 font-sans leading-relaxed">
                  Discover hand-poured artisanal enamel bangles, anti-tarnish rings, and bespoke hampers.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-6 py-3 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-bold rounded-full hover:bg-obsidian-200 transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Explore Runway Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3.5 p-3 bg-white rounded-2xl border border-champagne-300/60 hover:border-gold-dark transition-all shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand shrink-0 border border-champagne-200">
                      <img
                        src={item.product.images.hero}
                        alt={item.product.images.alt}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif-luxury text-sm sm:text-base text-obsidian font-bold leading-snug line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-obsidian/40 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                            aria-label="Remove item"
                            title="Remove piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs sm:text-sm font-serif text-gold-dark font-bold">
                            ₹{item.product.price}
                          </span>
                          {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                            <span className="text-[11px] text-obsidian/40 line-through">
                              ₹{item.product.compareAtPrice}
                            </span>
                          )}
                        </div>

                        {item.selectedPersonalisation?.boxType && (
                          <p className="text-[10px] text-obsidian-soft font-medium mt-0.5 line-clamp-1">
                            Box: {item.selectedPersonalisation.boxType}
                          </p>
                        )}
                        {item.selectedPersonalisation?.customNote && (
                          <p className="text-[10px] text-gold-dark font-medium mt-0.5 line-clamp-1 italic">
                            Note: "{item.selectedPersonalisation.customNote}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Controller & Item Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-champagne-300 rounded-full bg-pearl-50">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-mono font-bold text-obsidian">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="font-mono text-xs font-bold text-obsidian">
                          ₹{item.product.price * item.quantity}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Instant Coupons & Promo Codes Section */}
              <div className="p-3.5 bg-white rounded-2xl border border-champagne-300/60 shadow-xs space-y-2.5">
                <div
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold-dark font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Apply Discount Coupon</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-obsidian/60 transition-transform ${isCouponOpen ? 'rotate-90' : ''}`} />
                </div>

                {/* Applied Coupon Banner */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span><strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Coupon Input Form */}
                    {isCouponOpen && (
                      <div className="space-y-2 pt-1 animate-fade-in">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Enter Promo Code (e.g. CELESTIA10)"
                            value={couponInput}
                            onBeforeInput={(e: any) => {
                              if (e.data && /[^a-zA-Z0-9]/.test(e.data)) {
                                e.preventDefault();
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
                              if (!/[a-zA-Z0-9]/.test(e.key)) {
                                e.preventDefault();
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const paste = e.clipboardData.getData('text');
                              const clean = paste.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                              setCouponInput(clean);
                            }}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              const clean = e.currentTarget.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                              e.currentTarget.value = clean;
                              setCouponInput(clean);
                            }}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                              setCouponInput(clean);
                            }}
                            maxLength={20}
                            pattern="[a-zA-Z0-9]+"
                            title="Promo codes only contain letters and numbers"
                            className="flex-1 h-9 px-3 text-xs font-mono uppercase bg-pearl-50 rounded-xl border border-champagne-300 focus:outline-none focus:border-gold-dark text-obsidian"
                          />
                          <button
                            onClick={() => handleApplyCoupon(couponInput)}
                            className="h-9 px-4 bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold rounded-xl hover:bg-obsidian-200 transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Popular Quick Coupon Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {POPULAR_COUPONS.map((cpn) => (
                            <button
                              key={cpn.code}
                              onClick={() => handleApplyCoupon(cpn.code)}
                              className="px-2.5 py-1 rounded-lg bg-champagne-100/70 hover:bg-champagne-200 border border-champagne-300 text-[10px] font-mono text-gold-dark font-bold transition-all cursor-pointer"
                            >
                              +{cpn.code} ({cpn.description})
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* 1-Click Upsell Add-Ons Carousel */}
              {upsellItems.length > 0 && (
                <div className="p-3.5 bg-champagne-50/70 rounded-2xl border border-champagne-300/50 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-obsidian font-bold">
                    <Flame className="w-3.5 h-3.5 text-gold-dark" />
                    <span>Frequently Added Together</span>
                  </div>

                  <div className="space-y-2">
                    {upsellItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 p-2 bg-white rounded-xl border border-champagne-200 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.images.hero}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-sand"
                          />
                          <div>
                            <p className="font-serif-luxury text-xs text-obsidian font-bold line-clamp-1">{item.title}</p>
                            <p className="text-[10px] font-mono text-gold-dark font-bold">₹{item.price}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item, 1)}
                          className="px-3 py-1 bg-champagne-100 hover:bg-gold-dark hover:text-pearl-50 text-obsidian text-[10px] uppercase font-mono font-bold rounded-full border border-champagne-300 transition-all cursor-pointer shrink-0"
                        >
                          + Add
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 bg-pearl-50 border-t border-champagne-300/40 space-y-3.5">
            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-obsidian-soft">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-obsidian">₹{subtotal}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Special Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}

              <div className="flex justify-between text-obsidian-soft">
                <span>Express Shipping</span>
                <span className="font-mono">
                  {shippingCost === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    '₹99'
                  )}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 border-t border-champagne-300/40 text-obsidian">
                <div>
                  <span className="font-serif-luxury text-base font-bold">Estimated Total</span>
                  <span className="text-[10px] text-obsidian-soft block">(Incl. of all Indian taxes)</span>
                </div>
                <span className="font-mono font-bold text-xl text-gold-dark">
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              {/* Primary GoKwik-Style Direct Checkout */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full min-h-[48px] h-12 flex items-center justify-between px-6 rounded-full bg-obsidian text-pearl-100 hover:bg-obsidian-200 transition-all font-sans text-xs uppercase tracking-widest font-bold shadow-lg cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <span>Proceed to Checkout</span>
                </div>
                <div className="flex items-center gap-1.5 font-mono text-gold-light">
                  <span>₹{grandTotal}</span>
                  <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Instant WhatsApp Checkout */}
              <button
                onClick={checkoutViaWhatsApp}
                className="w-full min-h-[48px] h-12 flex items-center justify-center gap-2 px-6 rounded-full bg-emerald-800 text-pearl-50 hover:bg-emerald-900 transition-all font-sans text-xs uppercase tracking-widest font-bold shadow-sm cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span>Instant WhatsApp Checkout</span>
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-obsidian-soft pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
              <span>100% Anti-Tarnish Guarantee • Mumbai Handcrafted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
