import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Lock, 
  Truck, 
  Tag, 
  Zap, 
  Check, 
  ChevronRight,
  ShieldCheck,
  Flame
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { Product, CartItem } from '../../types/shopify';

const WhatsAppIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

const POPULAR_COUPONS = [
  { code: 'CELESTIA10', description: '10% Off' },
  { code: 'FIRST500', description: '₹500 Off' },
];

function sanitizeCouponCode(raw: string): string {
  if (typeof raw !== 'string') return '';
  return raw.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase();
}

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateQuantity, 
    removeFromCart, 
    subtotal, 
    totalItems,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    addToCart,
    discountAmount,
    finalPayable
  } = useCart();

  const navigate = useNavigate();
  const [couponInput, setCouponInput] = useState('');
  const [isCouponOpen, setIsCouponOpen] = useState(false);

  if (!isCartOpen) return null;

  const shippingThreshold = 999;
  const freeShippingNeeded = Math.max(0, shippingThreshold - subtotal);
  const shippingProgress = Math.min(100, (subtotal / shippingThreshold) * 100);
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 99;
  const grandTotal = finalPayable + shippingCost;

  // 1-Click Upsell Items
  const upsellItems = FEATURED_PRODUCTS.filter((p: Product) => !cart.some((c: CartItem) => c.product.id === p.id)).slice(0, 3);

  const handleApplyCoupon = (codeToApply?: string) => {
    const raw = codeToApply || couponInput;
    const clean = sanitizeCouponCode(raw);
    if (!clean) return;
    applyCoupon(clean);
    setCouponInput('');
  };

  const checkoutViaWhatsApp = () => {
    const phone = '917718825792';
    const itemsList = cart.map((i: CartItem) => `• ${i.product.title} (x${i.quantity}) - ₹${i.product.price * i.quantity}`).join('\n');
    const msg = `*CELESTIA LUXURY ATELIER • INSTANT BAG CHECKOUT* ✨\n\nI would like to place an order for:\n${itemsList}\n\n*Estimated Total:* ₹${grandTotal}\n\nPlease confirm availability and payment link! 💎`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end animate-fade-in">
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-obsidian/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-full sm:max-w-md bg-pearl-100 h-full h-[100dvh] max-h-[100dvh] shadow-2xl flex flex-col overflow-hidden z-10 border-l border-champagne-300/60 selection:bg-champagne-300">
        
        {/* Drawer Header */}
        <div className="px-3.5 py-2.5 sm:px-4 sm:py-3 pt-safe border-b border-champagne-300/40 bg-pearl-50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-champagne-100 flex items-center justify-center text-gold-dark shadow-xs">
                <ShoppingBag className="w-3 h-3" />
              </div>
              <div>
                <h2 className="font-serif-luxury text-base sm:text-lg tracking-wide text-obsidian font-bold leading-none">
                  Your Curated Bag
                </h2>
                <p className="text-[10px] text-obsidian-soft font-sans font-medium mt-0.5">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 hover:bg-champagne-200/60 rounded-full transition-colors cursor-pointer"
              aria-label="Close curated bag drawer"
            >
              <X className="w-4 h-4 text-obsidian/70" />
            </button>
          </div>

          {/* Dynamic Free Shipping Progress Bar */}
          {cart.length > 0 && (
            <div className="mt-2 p-2 bg-white rounded-lg border border-champagne-300/60 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[10.5px]">
                <span className="font-medium text-obsidian flex items-center gap-1">
                  <Truck className="w-3 h-3 text-gold-dark shrink-0" />
                  {freeShippingNeeded === 0 ? (
                    <span className="text-emerald-700 font-bold">✨ Free Pan-India Delivery Unlocked!</span>
                  ) : (
                    <span>
                      Add <strong className="text-gold-dark font-mono font-bold">₹{freeShippingNeeded}</strong> for <strong>FREE Delivery</strong>
                    </span>
                  )}
                </span>
                <span className="font-mono text-[9px] font-bold text-gold-dark">{Math.round(shippingProgress)}%</span>
              </div>

              <div className="relative w-full h-1 bg-sand rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500 rounded-full"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Item List Container */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-3.5 space-y-2.5 pb-6 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-champagne-300/80 [&::-webkit-scrollbar-thumb]:rounded-full">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-champagne-100/70 border border-champagne-300/60 flex items-center justify-center text-gold-dark shadow-sm">
                <ShoppingBag className="w-8 h-8 stroke-1" />
              </div>
              <div className="space-y-1 max-w-xs">
                <p className="font-serif-luxury text-xl text-obsidian font-bold">Your Bag is Empty</p>
                <p className="text-xs text-obsidian/60 font-sans leading-relaxed">
                  Discover hand-poured artisanal enamel bangles, anti-tarnish rings, and bespoke hampers.
                </p>
              </div>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/shop');
                }}
                className="px-5 py-2.5 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-bold rounded-full hover:bg-obsidian-200 transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Explore Runway Collection</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <>
              {/* Product List */}
              <div className="space-y-2">
                {cart.map((item: CartItem) => (
                  <div
                    key={item.product.id}
                    className="flex gap-2.5 p-2.5 bg-white rounded-xl border border-champagne-300/60 hover:border-gold-dark transition-all shadow-xs"
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-sand shrink-0 border border-champagne-200 aspect-square">
                      <img
                        src={item.product.images?.hero || item.product.images?.detail || (item.product as any).imageUrl || '/images/placeholder.jpg'}
                        alt={item.product.images?.alt || item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex justify-between items-start gap-1.5">
                          <h4 className="font-serif-luxury text-xs sm:text-sm text-obsidian font-bold leading-snug line-clamp-1">
                            {item.product.title}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="text-obsidian/40 hover:text-rose-600 transition-colors p-0.5 cursor-pointer shrink-0"
                            aria-label="Remove item"
                            title="Remove piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-xs font-serif text-gold-dark font-bold">
                            ₹{item.product.price}
                          </span>
                          {item.product.compareAtPrice && item.product.compareAtPrice > item.product.price && (
                            <span className="text-[10px] text-obsidian/40 line-through">
                              ₹{item.product.compareAtPrice}
                            </span>
                          )}
                        </div>

                        {item.selectedPersonalisation?.boxType && (
                          <p className="text-[9.5px] text-obsidian-soft font-medium mt-0.5 line-clamp-1">
                            Box: {item.selectedPersonalisation.boxType}
                          </p>
                        )}
                        {item.selectedPersonalisation?.customNote && (
                          <p className="text-[9.5px] text-gold-dark font-medium mt-0.5 line-clamp-1 italic">
                            Note: "{item.selectedPersonalisation.customNote}"
                          </p>
                        )}
                      </div>

                      {/* Quantity Controller & Item Total */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center border border-champagne-300 rounded-full bg-pearl-50 h-5.5">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-1.5 text-obsidian/60 hover:text-obsidian transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-2.5 h-2.5" />
                          </button>
                          <span className="px-1.5 text-[10px] font-mono font-bold text-obsidian">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-1.5 text-obsidian/60 hover:text-obsidian transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-2.5 h-2.5" />
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
              <div className="p-2 bg-white rounded-xl border border-champagne-300/60 shadow-xs space-y-1.5">
                <div
                  onClick={() => setIsCouponOpen(!isCouponOpen)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 text-[10.5px] font-mono uppercase tracking-wider text-gold-dark font-bold">
                    <Tag className="w-3 h-3" />
                    <span>Apply Discount Coupon</span>
                  </div>
                  <ChevronRight className={`w-3.5 h-3.5 text-obsidian/60 transition-transform ${isCouponOpen ? 'rotate-90' : ''}`} />
                </div>

                {/* Applied Coupon Banner */}
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-1.5 bg-emerald-50 rounded-lg border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium text-[10.5px]">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span><strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-[10.5px] text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Coupon Input Form */}
                    {isCouponOpen && (
                      <div className="space-y-1.5 pt-1 animate-fade-in">
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
                              if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Enter', 'Escape'].includes(e.key) || e.ctrlKey || e.metaKey) {
                                return;
                              }
                              if (!/^[a-zA-Z0-9]$/.test(e.key)) {
                                e.preventDefault();
                                e.stopPropagation();
                              }
                            }}
                            onKeyUp={(e) => {
                              const clean = sanitizeCouponCode(e.currentTarget.value);
                              if (e.currentTarget.value !== clean) {
                                e.currentTarget.value = clean;
                                setCouponInput(clean);
                              }
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                              const paste = e.clipboardData.getData('text') || '';
                              const clean = sanitizeCouponCode(paste);
                              setCouponInput(clean);
                            }}
                            onInput={(e: React.FormEvent<HTMLInputElement>) => {
                              const clean = sanitizeCouponCode(e.currentTarget.value);
                              e.currentTarget.value = clean;
                              setCouponInput(clean);
                            }}
                            onChange={(e) => {
                              const clean = sanitizeCouponCode(e.target.value);
                              setCouponInput(clean);
                            }}
                            onBlur={(e) => {
                              const clean = sanitizeCouponCode(e.target.value);
                              setCouponInput(clean);
                            }}
                            maxLength={20}
                            pattern="[a-zA-Z0-9]+"
                            autoComplete="off"
                            autoCorrect="off"
                            spellCheck={false}
                            title="Promo codes only contain letters and numbers"
                            className="flex-1 h-7.5 px-2.5 text-xs font-mono uppercase bg-pearl-50 rounded-lg border border-champagne-300 focus:outline-none focus:border-gold-dark text-obsidian"
                          />
                          <button
                            onClick={() => handleApplyCoupon(couponInput)}
                            className="h-7.5 px-3 bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold rounded-lg hover:bg-obsidian-200 transition-colors cursor-pointer"
                          >
                            Apply
                          </button>
                        </div>

                        {/* Popular Quick Coupon Chips */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {POPULAR_COUPONS.map((cpn) => (
                            <button
                              key={cpn.code}
                              onClick={() => handleApplyCoupon(cpn.code)}
                              className="px-2 py-0.5 rounded bg-champagne-100/70 hover:bg-champagne-200 border border-champagne-300 text-[8.5px] font-mono text-gold-dark font-bold transition-all cursor-pointer"
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

              {/* 1-Click Upsell Add-Ons Horizontal Swipeable Carousel */}
              {upsellItems.length > 0 && (
                <div className="pt-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-obsidian font-bold px-0.5">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3 text-gold-dark" />
                      <span>Complete Your Look</span>
                    </span>
                    <span className="text-[9px] text-obsidian/40 lowercase italic font-normal">swipe ➔</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none snap-x overscroll-x-contain">
                    {upsellItems.map((item: Product) => (
                      <div
                        key={item.id}
                        className="min-w-[165px] max-w-[165px] snap-start flex flex-col justify-between p-2 bg-white rounded-xl border border-champagne-300/60 shadow-xs shrink-0"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={item.images?.hero || (item as any).imageUrl || '/images/placeholder.jpg'}
                            alt={item.title}
                            className="w-10 h-10 rounded-lg object-cover bg-sand shrink-0 border border-champagne-200"
                          />
                          <div className="min-w-0">
                            <p className="font-serif-luxury text-[11px] text-obsidian font-bold line-clamp-1">{item.title}</p>
                            <p className="text-[10px] font-mono text-gold-dark font-bold">₹{item.price}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item, 1)}
                          className="mt-2 w-full py-1 bg-champagne-100/80 hover:bg-gold-dark hover:text-pearl-50 text-obsidian text-[9px] uppercase font-mono font-bold rounded-lg border border-champagne-300 transition-all cursor-pointer text-center"
                        >
                          + Add to Bag
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
          <div className="p-3 sm:p-3.5 pb-safe bg-pearl-50 border-t border-champagne-300/50 space-y-2 shrink-0 shadow-lg">
            {/* Price Calculations */}
            <div className="space-y-0.5 text-xs">
              <div className="flex justify-between items-center text-obsidian">
                <div>
                  <span className="font-serif-luxury text-xs sm:text-sm font-bold">Estimated Total</span>
                  <span className="text-[9.5px] text-obsidian-soft block leading-none">
                    {shippingCost === 0 ? 'Free Shipping • Incl. taxes' : '+ ₹99 Shipping • Incl. taxes'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-base sm:text-lg text-gold-dark">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 text-[10.5px] font-medium pt-0.5">
                  <span>Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{discountAmount}</span>
                </div>
              )}
            </div>

            {/* Bonkers Corner Style Prepaid Discount Badge */}
            <div className="px-2 py-1 bg-gradient-to-r from-emerald-50 to-champagne-100/60 rounded-lg border border-emerald-300/70 flex items-center justify-between text-[10px] text-emerald-950">
              <span className="flex items-center gap-1 font-medium">
                <Zap className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>Extra ₹50 Off on UPI / Prepaid</span>
              </span>
              <span className="font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-full text-[8.5px] uppercase">
                Instant
              </span>
            </div>

            {/* CTAs */}
            <div className="space-y-1.5 pt-0.5">
              {/* Primary Direct Checkout */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full h-9.5 sm:h-10 flex items-center justify-between px-4 rounded-full bg-obsidian text-pearl-100 hover:bg-obsidian-200 transition-all font-sans text-xs uppercase tracking-wider font-bold shadow-md cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-3 h-3 text-gold-dark shrink-0" />
                  <span>Proceed to Checkout</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-gold-light">
                  <span>₹{grandTotal}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>

              {/* Instant WhatsApp Checkout */}
              <button
                onClick={checkoutViaWhatsApp}
                className="w-full h-8.5 flex items-center justify-center gap-1.5 px-4 rounded-full bg-emerald-800/90 hover:bg-emerald-900 text-pearl-50 transition-all font-sans text-[11px] uppercase tracking-wider font-bold shadow-xs cursor-pointer"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 shrink-0" />
                <span>Instant WhatsApp Checkout</span>
              </button>
            </div>

            {/* Trust Assurance */}
            <div className="flex items-center justify-center gap-1.5 text-[9px] font-mono text-obsidian-soft pt-0.5">
              <ShieldCheck className="w-3 h-3 text-gold-dark" />
              <span>100% Anti-Tarnish Guarantee • Mumbai Handcrafted</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
