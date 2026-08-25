import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
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
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    checkoutViaWhatsApp,
    showToast
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);

  const freeShippingNeeded = Math.max(0, BRAND_INFO.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / BRAND_INFO.freeShippingThreshold) * 100);

  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingCost = subtotal >= BRAND_INFO.freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CELESTIA10' || promoCode.trim().toUpperCase() === 'FIRST10') {
      setDiscountApplied(true);
      showToast('10% VIP Atelier discount applied! ✨');
    } else {
      showToast("Invalid code. Try 'CELESTIA10' for 10% off");
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
            <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-[1.05]">
              YOUR <span className="font-semibold text-gold-dark">Bag</span>.
            </h1>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-obsidian/70 hover:text-obsidian"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Shipping Milestone */}
        <div className="p-4 sm:p-5 bg-white/90 rounded-2xl border border-champagne-300/60 shadow-sm max-w-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-obsidian flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-dark" />
              {freeShippingNeeded === 0 ? (
                <span className="text-emerald-800">✨ Free Pan-India Express Delivery Unlocked!</span>
              ) : (
                <span>Add ₹{freeShippingNeeded} more for Free Express Delivery</span>
              )}
            </span>
            <span className="font-mono text-xs text-obsidian/60 font-bold">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-sand rounded-full overflow-hidden">
            <div
              className="h-full bg-gold-dark transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2-Column Cart Breakdown */}
        {cart.length === 0 ? (
          <div className="py-20 text-center space-y-5 bg-white/90 rounded-3xl border border-champagne-300/60 max-w-2xl mx-auto p-8 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center text-gold-dark mx-auto">
              <ShoppingBag className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-obsidian uppercase">Your Bag is Empty</h2>
              <p className="text-xs sm:text-sm text-obsidian-soft">
                Explore our curated collection of fine jewellery, artisanal bangles, and bespoke celebration hampers.
              </p>
            </div>

            <div className="pt-2">
              <Link to="/shop" className="btn-primary inline-flex items-center gap-2">
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            
            {/* Cart Items List (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 p-4 sm:p-5 bg-white/90 rounded-2xl border border-champagne-300/60 shadow-sm items-center justify-between"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand shrink-0 border border-champagne-300/40">
                      <img
                        src={item.product.images.hero}
                        alt={item.product.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-obsidian truncate max-w-[200px] sm:max-w-xs">
                        {item.product.title}
                      </h3>
                      <p className="text-xs font-mono text-gold-dark font-bold">
                        ₹{item.product.price}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-champagne-300/80 rounded-full bg-white p-0.5">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-champagne-100 text-obsidian transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-obsidian font-mono">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-champagne-100 text-obsidian transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary (5 Cols) */}
            <div className="lg:col-span-5 bg-white/95 p-5 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-5">
              <h3 className="text-lg font-bold text-obsidian uppercase">Order Summary</h3>

              <div className="space-y-3 text-xs sm:text-sm text-obsidian-soft border-b border-champagne-300/40 pb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-obsidian">₹{subtotal}</span>
                </div>
                {discountApplied && (
                  <div className="flex justify-between text-emerald-800 font-bold">
                    <span>10% Circle Privilege</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="font-mono font-bold text-obsidian">
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost}`}
                  </span>
                </div>
              </div>

              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code (CELESTIA10)"
                  className="flex-1 px-3.5 py-2 rounded-full border border-champagne-300/80 text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-obsidian text-pearl-100 text-xs uppercase font-bold rounded-full hover:bg-obsidian-200 transition-colors"
                >
                  Apply
                </button>
              </form>

              <div className="flex justify-between items-baseline pt-2">
                <span className="text-base font-bold text-obsidian">Estimated Total</span>
                <span className="text-2xl font-bold text-obsidian font-mono">₹{finalTotal}</span>
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
                  className="w-full h-11 border border-emerald-600/60 bg-emerald-50/70 hover:bg-emerald-100 text-emerald-900 text-xs uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Order via WhatsApp Concierge</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-obsidian-muted pt-1">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>100% Secure Checkout with Razorpay & UPI</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
