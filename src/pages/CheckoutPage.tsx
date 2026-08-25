import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { BRAND_INFO } from '../data/shopify-data';
import { createOrder } from '../services/orderService';
import { OrderItem } from '../types/backend';
import {
  Lock,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  QrCode,
  Truck,
  Copy,
  Sparkles,
  ShoppingBag,
  MessageCircle,
  Check,
  User,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, subtotal, totalItems, clearCart, showToast } = useCart();
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const navigate = useNavigate();

  // Form states (auto-prefill if user is authenticated)
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.savedAddresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.savedAddresses?.[0]?.city || 'Mumbai');
  const [state, setState] = useState(user?.savedAddresses?.[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.savedAddresses?.[0]?.pincode || '');
  
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'same-day'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'whatsapp'>('upi');
  const [upiCopied, setUpiCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Auto-prompt login if guest enters checkout
  React.useEffect(() => {
    if (!isAuthenticated) {
      openAuthModal({
        mode: 'login',
        reason: 'Please sign in or create an account to finalize your order and receive live dispatch tracking.',
      });
    }
  }, [isAuthenticated, openAuthModal]);

  // Sync user details when logging in
  React.useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setName(user.name || '');
      setPhone(user.phone || '');
      if (user.savedAddresses?.[0]) {
        setStreet(user.savedAddresses[0].street || '');
        setCity(user.savedAddresses[0].city || 'Mumbai');
        setState(user.savedAddresses[0].state || 'Maharashtra');
        setPincode(user.savedAddresses[0].pincode || '');
      }
    }
  }, [user]);

  const shippingCost = subtotal >= BRAND_INFO.freeShippingThreshold || subtotal === 0 ? 0 : 99;
  const sameDayExtra = shippingMethod === 'same-day' ? 100 : 0;
  const finalTotal = subtotal + shippingCost + sameDayExtra;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('7718825792@okaxis');
    setUpiCopied(true);
    showToast("UPI ID copied to clipboard ✨");
    setTimeout(() => setUpiCopied(false), 2500);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openAuthModal({
        mode: 'login',
        reason: 'Please sign in or create an account to confirm and place your order.',
      });
      return;
    }

    if (!name || !email || !phone || !street || !pincode) {
      showToast("Please fill in all shipping and contact details.");
      return;
    }

    setIsProcessing(true);

    try {
      const orderItems: OrderItem[] = cart.map((item) => {
        const img = item.product?.images?.hero || (item.product?.images as any)?.[0] || '';
        return {
          productId: item.product?.id || `item-${Date.now()}`,
          shopifyVariantId: item.product?.shopifyVariantId,
          title: item.product?.title || 'Celestia Fine Piece',
          handle: item.product?.handle || 'celestia-piece',
          imageUrl: img,
          price: item.product?.price || 0,
          quantity: item.quantity,
          boxType: item.selectedPersonalisation?.boxType,
          customNotes: item.selectedPersonalisation?.customNote,
        };
      });

      const newOrder = await createOrder({
        customer: {
          name,
          email,
          phone,
          address: `${street}, ${city}, ${state} - ${pincode}`,
        },
        items: orderItems,
        subtotal,
        shippingCost: shippingCost + sameDayExtra,
        total: finalTotal,
        shippingMethod: shippingMethod === 'same-day' ? 'Mumbai Same-Day Express Courier' : 'Pan-India Free Express Air Delivery',
        paymentMethod: paymentMethod.toUpperCase(),
        userId: user?.id,
      });

      // Clear cart
      clearCart();
      setIsProcessing(false);
      showToast(`Order ${newOrder.orderNumber} placed successfully ✨`);

      // Navigate to dedicated Order Success Page with full order state
      navigate(`/order-success/${newOrder.orderNumber}`, { state: { order: newOrder } });
    } catch (err) {
      setIsProcessing(false);
      showToast("Could not place order. Please try again.");
    }
  };

  // If cart is empty, redirect to shop
  if (cart.length === 0) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-pearl-50/95 p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-3xl text-obsidian uppercase">Your Bag is Empty</h2>
            <p className="text-xs text-obsidian/60 font-sans">
              Please add your favourite jewellery or celebration hampers to proceed with checkout.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-bold hover:bg-obsidian-200 transition-all shadow-md"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // =========================================================================
  // MAIN CHECKOUT FORM & BREAKDOWN
  // =========================================================================
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between border-b border-champagne-300/40 pb-6">
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian/70 hover:text-obsidian transition-colors font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Bag</span>
          </Link>

          <div className="flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* =============================================================== */}
          {/* LEFT: SHIPPING & PAYMENT FORM (7 COLS)                          */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 space-y-8">
            
            <form onSubmit={handlePlaceOrder} className="space-y-8">
              
              {/* 1. Contact Information */}
              <div className="bg-pearl-50/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/70 shadow-sm space-y-5">
                <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-obsidian text-pearl-100 text-xs font-bold flex items-center justify-center">1</span>
                    <h2 className="font-serif-luxury text-xl text-obsidian font-bold">Contact Details</h2>
                  </div>
                  {!isAuthenticated && (
                    <Link to="/login" className="text-xs text-gold-dark hover:underline font-sans font-bold">
                      Already have an account? Sign in
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Priyanshu Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                      Phone / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                      Email Address (for order tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-pearl-50/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/70 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-champagne-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-obsidian text-pearl-100 text-xs font-bold flex items-center justify-center">2</span>
                  <h2 className="font-serif-luxury text-xl text-obsidian font-bold">Delivery Address</h2>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                      Street Address & Flat / Building *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="A-402, Sea View Residency, Bandra West"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                        City *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                        State *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Maharashtra"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                        Pincode *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="400050"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        className="w-full h-11 px-4 rounded-xl bg-white border border-champagne-300/80 text-sm font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Shipping Speed */}
              <div className="bg-pearl-50/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/70 shadow-sm space-y-4">
                <div className="flex items-center gap-2 border-b border-champagne-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-obsidian text-pearl-100 text-xs font-bold flex items-center justify-center">3</span>
                  <h2 className="font-serif-luxury text-xl text-obsidian font-bold">Shipping Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    onClick={() => setShippingMethod('standard')}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-gold-dark bg-champagne-100/60 shadow-sm'
                        : 'border-champagne-300/60 bg-white hover:bg-champagne-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-serif-luxury text-base font-bold text-obsidian block">
                        Pan-India Express Air
                      </span>
                      <p className="text-xs text-obsidian/70">Delivers in 2–4 business days with signature tracking</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-obsidian">{shippingCost === 0 ? 'FREE' : '₹99'}</span>
                  </label>

                  <label
                    onClick={() => setShippingMethod('same-day')}
                    className={`flex items-start justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      shippingMethod === 'same-day'
                        ? 'border-gold-dark bg-champagne-100/60 shadow-sm'
                        : 'border-champagne-300/60 bg-white hover:bg-champagne-50'
                    }`}
                  >
                    <div className="space-y-1">
                      <span className="font-serif-luxury text-base font-bold text-obsidian flex items-center gap-1.5">
                        <span>Mumbai Same-Day Hand Delivery</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-900 font-mono">Fast</span>
                      </span>
                      <p className="text-xs text-obsidian/70">Dispatched in 4 hours from Mumbai Atelier</p>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-dark">₹{shippingCost + 100}</span>
                  </label>
                </div>
              </div>

              {/* 4. Payment Selection */}
              <div className="bg-pearl-50/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/70 shadow-sm space-y-5">
                <div className="flex items-center gap-2 border-b border-champagne-200 pb-3">
                  <span className="w-6 h-6 rounded-full bg-obsidian text-pearl-100 text-xs font-bold flex items-center justify-center">4</span>
                  <h2 className="font-serif-luxury text-xl text-obsidian font-bold">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'upi'
                        ? 'border-gold-dark bg-champagne-100/70 font-bold shadow-sm'
                        : 'border-champagne-300/60 bg-white hover:bg-champagne-50'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-gold-dark" />
                    <span className="text-xs uppercase font-mono tracking-wider">Instant UPI / QR</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'card'
                        ? 'border-gold-dark bg-champagne-100/70 font-bold shadow-sm'
                        : 'border-champagne-300/60 bg-white hover:bg-champagne-50'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 text-gold-dark" />
                    <span className="text-xs uppercase font-mono tracking-wider">Cards / Netbanking</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2 ${
                      paymentMethod === 'cod'
                        ? 'border-gold-dark bg-champagne-100/70 font-bold shadow-sm'
                        : 'border-champagne-300/60 bg-white hover:bg-champagne-50'
                    }`}
                  >
                    <Truck className="w-5 h-5 text-gold-dark" />
                    <span className="text-xs uppercase font-mono tracking-wider">Cash on Delivery</span>
                  </button>
                </div>

                {/* UPI QR & Payment Panel */}
                {paymentMethod === 'upi' && (
                  <div className="bg-white p-5 rounded-2xl border border-champagne-300/70 space-y-4 animate-fade-in">
                    <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                      <div className="w-28 h-28 bg-pearl-50 p-2 rounded-xl border border-champagne-300 flex items-center justify-center shrink-0 shadow-inner">
                        {/* Dynamic Stylized QR Code Visual */}
                        <div className="w-full h-full bg-[#181411] rounded-lg p-1.5 flex flex-col justify-between">
                          <div className="flex justify-between">
                            <span className="w-4 h-4 bg-[#D8C39A] rounded-sm" />
                            <span className="w-4 h-4 bg-[#D8C39A] rounded-sm" />
                          </div>
                          <p className="text-[8px] font-mono text-[#D8C39A] text-center font-bold tracking-widest">
                            UPI • ₹{finalTotal}
                          </p>
                          <div className="flex justify-between">
                            <span className="w-4 h-4 bg-[#D8C39A] rounded-sm" />
                            <span className="w-4 h-4 bg-emerald-400 rounded-sm animate-pulse" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <span className="text-[10px] uppercase font-mono text-gold-dark font-bold block tracking-widest">
                          Scan with Google Pay, PhonePe, Paytm, or BHIM
                        </span>
                        <div className="flex items-center gap-2 bg-pearl-100 px-3 py-2 rounded-lg border border-champagne-300/60">
                          <span className="font-mono text-xs text-obsidian font-bold select-all flex-1">
                            7718825792@okaxis
                          </span>
                          <button
                            type="button"
                            onClick={handleCopyUPI}
                            className="p-1 text-gold-dark hover:text-obsidian"
                            title="Copy UPI ID"
                          >
                            {upiCopied ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                        <p className="text-[11px] text-obsidian/60">
                          Pay directly to our Mumbai Atelier account. Verification is immediate upon order submission.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 bg-obsidian text-pearl-100 rounded-full text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-luxury-soft"
              >
                {isProcessing ? (
                  <span>Securing & Authorizing Order...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-champagne-300" />
                    <span>Place Order & Authorize (₹{finalTotal})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

            </form>

          </div>

          {/* =============================================================== */}
          {/* RIGHT: ORDER SUMMARY BREAKDOWN (5 COLS)                        */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 bg-pearl-50/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/70 shadow-sm space-y-6 sticky top-28">
            
            <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
              <h3 className="font-serif-luxury text-xl text-obsidian font-bold">Order Summary</h3>
              <span className="text-xs font-mono font-bold text-gold-dark">{totalItems} {totalItems === 1 ? 'Item' : 'Items'}</span>
            </div>

            {/* Item List */}
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3.5 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-sand shrink-0 border border-champagne-300/40">
                    <img src={item.product.images.hero} alt={item.product.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif-luxury text-sm text-obsidian font-bold truncate">
                      {item.product.title}
                    </h4>
                    <p className="text-xs text-obsidian/60 font-mono">Qty: {item.quantity}</p>
                    {item.selectedPersonalisation?.boxType && (
                      <p className="text-[10px] text-obsidian/70 truncate">Box: {item.selectedPersonalisation.boxType}</p>
                    )}
                    {item.selectedPersonalisation?.customNote && (
                      <p className="text-[10px] text-gold-dark truncate">Note: {item.selectedPersonalisation.customNote}</p>
                    )}
                  </div>
                  <span className="font-mono text-xs font-bold text-obsidian">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className="space-y-2.5 pt-4 border-t border-champagne-200 text-xs font-sans text-obsidian/80">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-mono font-medium text-obsidian">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shippingMethod === 'same-day' ? 'Mumbai Same-Day' : 'Pan-India Express'})</span>
                <span className="font-mono font-medium">
                  {shippingCost === 0 && sameDayExtra === 0 ? (
                    <span className="text-emerald-800 font-bold">FREE</span>
                  ) : (
                    `₹${shippingCost + sameDayExtra}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-obsidian pt-3 border-t border-champagne-300">
                <span className="font-serif text-lg">Total Amount</span>
                <span className="font-mono text-xl text-gold-dark">₹{finalTotal}</span>
              </div>
            </div>

            {/* Direct WhatsApp Concierge Alternative */}
            <div className="pt-2">
              <a
                href={`https://wa.me/917718825792?text=Hello%20Celestia!%20I%20would%20like%20to%20complete%20checkout%20for%20order%20value%20₹${finalTotal}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase font-mono tracking-wider font-bold hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Order via WhatsApp Direct</span>
              </a>
            </div>

            <div className="text-[10px] text-center text-obsidian/50 space-y-1">
              <p>100% Anti-Tarnish Guarantee • Mumbai Handcrafted</p>
              <p>Instant Dispatch confirmation on WhatsApp & Email</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
