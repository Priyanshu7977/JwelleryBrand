import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, POPULAR_COUPONS } from '../context/CartContext';
import { BRAND_INFO } from '../data/shopify-data';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Tag,
  Check,
  Gift
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
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

  const [promoInput, setPromoInput] = useState('');

  const freeShippingThreshold = BRAND_INFO.freeShippingThreshold || 999;
  const freeGiftThreshold = 1999;

  const freeShippingNeeded = Math.max(0, freeShippingThreshold - subtotal);
  const freeGiftNeeded = Math.max(0, freeGiftThreshold - subtotal);

  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const shippingCost = finalPayable >= freeShippingThreshold || finalPayable === 0 ? 0 : 99;
  const grandTotal = finalPayable + shippingCost;

  const handleApplyPromo = (codeToApply: string) => {
    const res = applyCoupon(codeToApply);
    if (res.success) {
      setPromoInput('');
    } else {
      showToast(res.message);
    }
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-10 sm:space-y-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-champagne-300/40 pb-6 sm:pb-8">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
              Curated Bag ({totalItems} {totalItems === 1 ? 'item' : 'items'})
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold leading-[1.05] font-serif-luxury">
              Your <span className="font-zapfino text-champagne-400 font-normal tracking-normal capitalize inline-block text-[34px] sm:text-[50px] md:text-[60px] leading-[0.9] px-1">Bag</span>.
            </h1>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-obsidian/70 hover:text-obsidian"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Exploring</span>
          </Link>
        </div>

        {/* Free Shipping Progress Indicator */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-champagne-300/60 shadow-xs space-y-2 max-w-2xl">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-medium text-obsidian flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gold-dark" />
                {freeShippingNeeded === 0 ? (
                  <span className="text-emerald-700 font-bold">✨ Free Pan-India Express Delivery Unlocked!</span>
                ) : (
                  <span>
                    Add <strong className="text-gold-dark font-mono">₹{freeShippingNeeded}</strong> more for <strong>FREE Pan-India Delivery</strong>
                  </span>
                )}
              </span>
              <span className="font-mono text-xs font-bold text-gold-dark">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {subtotal < freeGiftThreshold && (
              <p className="text-[11px] text-obsidian-soft flex items-center gap-1">
                <Gift className="w-3 h-3 text-gold-dark" />
                <span>Add ₹{freeGiftNeeded} more to unlock a complimentary Velvet Keepsake Pouch</span>
              </p>
            )}
          </div>
        )}

        {/* Cart Contents */}
        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white/90 rounded-3xl border border-champagne-300/60 p-8 shadow-sm max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif-luxury text-2xl text-obsidian font-bold">Your bag is currently empty</h3>
              <p className="text-xs sm:text-sm text-obsidian-soft">
                Discover hand-poured artisanal enamel bangles, fluid jewellery, and bespoke hampers.
              </p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-bold tracking-widest hover:bg-obsidian-200 transition-all shadow-md"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Products List (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row gap-4 p-4 sm:p-5 rounded-2xl bg-white border border-champagne-300/60 shadow-xs hover:border-gold-dark transition-all"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-sand shrink-0 border border-champagne-200">
                    <img
                      src={item.product.images.hero}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-serif-luxury text-base sm:text-lg text-obsidian font-bold leading-snug">
                          {item.product.title}
                        </h3>
                        <p className="font-serif text-sm text-gold-dark font-bold mt-0.5">
                          ₹{item.product.price}
                        </p>
                        {item.selectedPersonalisation?.boxType && (
                          <p className="text-xs text-obsidian-soft mt-1 font-sans">
                            Gift Box: {item.selectedPersonalisation.boxType}
                          </p>
                        )}
                        {item.selectedPersonalisation?.customNote && (
                          <p className="text-xs text-gold-dark font-medium italic mt-0.5">
                            Note: "{item.selectedPersonalisation.customNote}"
                          </p>
                        )}
                      </div>

                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-obsidian/40 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                        aria-label="Remove item"
                        title="Remove piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-champagne-200">
                      <div className="flex items-center border border-champagne-300 rounded-full bg-pearl-50">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-bold text-obsidian">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-mono text-sm font-bold text-obsidian">
                        ₹{item.product.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (4 Cols) */}
            <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6 sticky top-28">
              <h3 className="font-serif-luxury text-xl text-obsidian uppercase font-bold border-b border-champagne-300/40 pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-obsidian-soft border-b border-champagne-300/40 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-obsidian">₹{subtotal}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-mono font-bold text-obsidian">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-bold">FREE</span> : `₹${shippingCost}`}
                  </span>
                </div>
              </div>

              {/* Promo Code Input & Chips */}
              <div className="space-y-2">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                  Have a Promo Code?
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span><strong>{appliedCoupon.code}</strong> (-₹{discountAmount})</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoInput}
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
                          setPromoInput(clean);
                        }}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                          const clean = e.currentTarget.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                          e.currentTarget.value = clean;
                          setPromoInput(clean);
                        }}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                          setPromoInput(clean);
                        }}
                        maxLength={20}
                        pattern="[a-zA-Z0-9]+"
                        title="Promo codes only contain letters and numbers"
                        placeholder="Promo code (e.g. CELESTIA10)"
                        className="flex-1 px-3.5 py-2 rounded-xl border border-champagne-300 text-xs uppercase font-mono text-obsidian focus:outline-none focus:border-gold-dark"
                      />
                      <button
                        onClick={() => handleApplyPromo(promoInput)}
                        className="px-4 py-2 bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold rounded-xl hover:bg-obsidian-200 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          onClick={() => handleApplyPromo(c.code)}
                          className="px-2.5 py-1 bg-champagne-100/70 hover:bg-champagne-200 border border-champagne-300 text-[10px] font-mono text-gold-dark font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          +{c.code}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-bold text-obsidian font-serif-luxury">Estimated Total</span>
                <span className="text-2xl font-bold text-gold-dark font-mono">₹{grandTotal}</span>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-primary w-full h-12 flex items-center justify-center gap-2 font-bold uppercase tracking-wider text-xs sm:text-sm shadow-md cursor-pointer"
                >
                  <span>Proceed to Express Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={checkoutViaWhatsApp}
                  className="w-full h-11 border border-emerald-600/60 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Order via WhatsApp Concierge</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-obsidian-muted pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>100% Anti-Tarnish Guarantee • 7-Day Returns</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
