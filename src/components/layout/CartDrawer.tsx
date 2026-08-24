import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, MessageCircle, Truck, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { BRAND_INFO } from '../../data/shopify-data';

export const CartDrawer: React.FC = () => {
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    totalItems,
    checkoutViaWhatsApp
  } = useCart();

  if (!isCartOpen) return null;

  const freeShippingNeeded = Math.max(0, BRAND_INFO.freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / BRAND_INFO.freeShippingThreshold) * 100);

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="fixed inset-0 bg-obsidian/40 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-over Drawer Panel */}
      <div className="relative w-full max-w-md bg-pearl-100 h-full shadow-2xl flex flex-col justify-between z-10 border-l border-champagne-300/40">
        
        {/* Drawer Header */}
        <div className="p-6 border-b border-champagne-300/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-gold-dark" />
              <h2 className="font-serif-luxury text-2xl tracking-wide text-obsidian uppercase">
                Curated Bag
              </h2>
              <span className="text-xs bg-champagne-200/80 px-2 py-0.5 rounded-full font-sans font-medium">
                {totalItems} {totalItems === 1 ? 'piece' : 'pieces'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-champagne-100 rounded-full transition-colors"
              aria-label="Close curated bag drawer"
            >
              <X className="w-5 h-5 text-obsidian/70" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="mt-4 p-3.5 bg-champagne-100/50 rounded-xl border border-champagne-300/30">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-medium text-obsidian flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-gold-dark" />
                {freeShippingNeeded === 0 ? (
                  <span className="text-emerald-800 font-semibold">✨ Free Pan-India Express Unlocked!</span>
                ) : (
                  <span>Add ₹{freeShippingNeeded} more for Free Express Shipping</span>
                )}
              </span>
              <span className="font-mono text-[11px] text-obsidian/60">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-sand rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-dark transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center text-gold-dark">
                <ShoppingBag className="w-7 h-7 stroke-1" />
              </div>
              <div>
                <p className="font-serif-luxury text-xl text-obsidian">Your bag is currently empty</p>
                <p className="text-xs text-obsidian/60 mt-1 max-w-xs">
                  Explore our curated jewellery, fluid bangles, and bespoke gift hampers.
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="px-6 py-2.5 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-all"
              >
                Discover Collection
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="flex gap-4 p-3.5 bg-white/70 rounded-2xl border border-champagne-300/30 hover:border-champagne-300 transition-all"
              >
                {/* Product Thumbnail */}
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-sand shrink-0">
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
                      <h4 className="font-serif-luxury text-base text-obsidian leading-snug line-clamp-1">
                        {item.product.title}
                      </h4>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-obsidian/40 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs font-serif text-gold-dark font-medium mt-0.5">
                      ₹{item.product.price}
                    </p>
                    {item.selectedPersonalisation?.boxType && (
                      <p className="text-[10px] text-obsidian/60 font-medium mt-0.5 line-clamp-1">
                        Box: {item.selectedPersonalisation.boxType}
                      </p>
                    )}
                    {item.selectedPersonalisation?.customNote && (
                      <p className="text-[10px] text-gold-dark font-medium mt-0.5 line-clamp-1">
                        Note: "{item.selectedPersonalisation.customNote}"
                      </p>
                    )}
                    {item.product.sameDayMumbaiAvailable && (
                      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wider text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded mt-1 font-sans">
                        Mumbai Same-Day Ready
                      </span>
                    )}
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-champagne-300/60 rounded-full bg-pearl-50">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-mono font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 text-obsidian/60 hover:text-obsidian transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-mono text-xs font-medium text-obsidian">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-6 bg-pearl-50 border-t border-champagne-300/30 space-y-4">
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-obsidian/70">
                <span>Subtotal</span>
                <span className="font-mono font-medium text-obsidian">₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-obsidian/70">
                <span>Shipping (Express)</span>
                <span className="font-mono">
                  {subtotal >= BRAND_INFO.freeShippingThreshold ? (
                    <span className="text-emerald-700 font-medium">FREE</span>
                  ) : (
                    '₹99'
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-medium text-obsidian pt-2 border-t border-champagne-300/30">
                <span className="font-serif text-base">Estimated Total</span>
                <span className="font-mono font-bold text-base text-gold-dark">
                  ₹{subtotal + (subtotal >= BRAND_INFO.freeShippingThreshold ? 0 : 99)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5">
              {/* WhatsApp Checkout */}
              <button
                onClick={checkoutViaWhatsApp}
                className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-full bg-emerald-800 text-pearl-50 hover:bg-emerald-900 transition-all font-sans text-xs uppercase tracking-widest font-semibold shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Instant WhatsApp Checkout</span>
              </button>

              {/* Standard Secure Checkout */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full h-12 flex items-center justify-center gap-2 px-6 rounded-full bg-obsidian text-pearl-100 hover:bg-obsidian-200 transition-all font-sans text-xs uppercase tracking-widest font-semibold shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10px] text-center text-obsidian/50 tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-gold-dark" />
              100% Anti-Tarnish Guarantee • Mumbai Studio Handcrafted
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
