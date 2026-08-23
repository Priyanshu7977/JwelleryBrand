import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { BRAND_INFO } from '../data/shopify-data';
import { MagneticButton } from '../components/ui/MagneticButton';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  MessageCircle,
  Truck,
  ShieldCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    checkoutViaWhatsApp
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [discountApplied, setDiscountApplied] = useState(false);
  const [orderNote, setOrderNote] = useState('');

  const freeShippingNeeded = Math.max(0, BRAND_INFO.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / BRAND_INFO.freeShippingThreshold) * 100);

  const discountAmount = discountApplied ? Math.round(subtotal * 0.1) : 0;
  const shippingCost = subtotal >= BRAND_INFO.freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'CELESTIA10' || promoCode.trim().toUpperCase() === 'FIRST10') {
      setDiscountApplied(true);
    } else {
      alert("Invalid code. Try 'CELESTIA10' for 10% off your curated bag!");
    }
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-champagne-300/40 pb-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
              Curated Bag
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase">
              YOUR <span className="italic font-light text-gold-dark">Bag</span>.
            </h1>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/70 hover:text-obsidian"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Free Shipping Unlock Milestone */}
        <div className="p-4 md:p-6 bg-pearl-50 rounded-3xl border border-champagne-300/60 shadow-sm max-w-3xl">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-obsidian flex items-center gap-2">
              <Truck className="w-4 h-4 text-gold-dark" />
              {freeShippingNeeded === 0 ? (
                <span className="text-emerald-800 font-semibold">✨ Free Pan-India Express Delivery Unlocked!</span>
              ) : (
                <span>Add ₹{freeShippingNeeded} more for Free Express Delivery</span>
              )}
            </span>
            <span className="font-mono text-xs text-obsidian/60">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full h-2 bg-sand rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* 2-Column Cart Breakdown */}
        {cart.length === 0 ? (
          <div className="py-24 text-center space-y-6 bg-pearl-50 rounded-3xl border border-champagne-300/40 max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center text-gold-dark mx-auto">
              <ShoppingBag className="w-8 h-8 stroke-1" />
            </div>
            <div>
              <h2 className="font-serif-luxury text-2xl text-obsidian">Your Bag is Empty</h2>
              <p className="text-xs text-obsidian/60 mt-1 max-w-xs mx-auto">
                Explore our curated bangles, anti-tarnish rings, and bespoke celebration hampers.
              </p>
            </div>
            <Link to="/shop">
              <MagneticButton variant="primary" size="md">
                <span>Explore The Collection</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Items Table (7 Cols) */}
            <div className="lg:col-span-7 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex flex-col sm:flex-row gap-4 p-5 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 shadow-sm hover:border-champagne-300 transition-all items-start sm:items-center"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-sand shrink-0">
                    <img
                      src={item.product.images.hero}
                      alt={item.product.images.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif-luxury text-lg text-obsidian leading-snug">
                        {item.product.title}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-obsidian/40 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs font-mono text-gold-dark font-medium">
                      ₹{item.product.price}
                    </p>

                    {item.product.sameDayMumbaiAvailable && (
                      <span className="inline-flex text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-sans">
                        Mumbai Same-Day Ready
                      </span>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-champagne-300/80 rounded-full bg-white">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-mono font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors"
                          aria-label="Increase"
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

              {/* Order Gift Note / Special Instructions */}
              <div className="p-5 bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-2">
                <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-semibold block">
                  Gift Note / Delivery Instructions for Mumbai Studio:
                </label>
                <textarea
                  rows={2}
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  placeholder="e.g. Please tie pink satin ribbon / Deliver before 5 PM in Bandra..."
                  className="w-full p-3 rounded-2xl bg-white border border-champagne-300/60 font-serif text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                />
              </div>
            </div>

            {/* Right Summary & Checkout Card (5 Cols) */}
            <div className="lg:col-span-5 bg-pearl-50/95 p-6 md:p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6">
              <h2 className="font-serif-luxury text-2xl text-obsidian border-b border-champagne-300/30 pb-3">
                Order Summary
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-obsidian/70">
                  <span>Subtotal ({totalItems} pieces)</span>
                  <span className="font-mono font-medium text-obsidian">₹{subtotal}</span>
                </div>

                {discountApplied && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Celebration Discount (10%)</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-obsidian/70">
                  <span>Shipping (Express Courier)</span>
                  <span className="font-mono">
                    {shippingCost === 0 ? <span className="text-emerald-700 font-medium">FREE</span> : `₹${shippingCost}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-medium text-obsidian pt-3 border-t border-champagne-300/40">
                  <span className="font-serif text-lg">Final Total</span>
                  <span className="font-mono text-xl font-bold text-gold-dark">₹{finalTotal}</span>
                </div>
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Coupon (e.g. CELESTIA10)"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 h-10 px-4 rounded-full bg-white border border-champagne-300/60 text-xs font-mono uppercase text-obsidian focus:outline-none focus:border-gold-dark"
                />
                <button
                  type="submit"
                  className="h-10 px-5 bg-obsidian text-pearl-100 text-xs uppercase tracking-wider rounded-full hover:bg-obsidian-200 transition-colors font-medium shrink-0"
                >
                  Apply
                </button>
              </form>

              {/* CTAs */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={checkoutViaWhatsApp}
                  className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase tracking-widest font-semibold hover:bg-emerald-900 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Instant WhatsApp Checkout</span>
                </button>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-semibold hover:bg-obsidian-200 transition-all shadow-sm"
                >
                  <span>Proceed to Online Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 pt-2 text-[11px] text-obsidian/60 text-center">
                <p className="flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-gold-dark" />
                  100% Anti-Tarnish Guarantee • Mumbai Hand-Packed
                </p>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
