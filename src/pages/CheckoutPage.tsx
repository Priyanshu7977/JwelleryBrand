import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, POPULAR_COUPONS } from '../context/CartContext';
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
  MapPin,
  Tag,
  Zap,
  Clock,
  Shield
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discountAmount,
    finalPayable,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    totalItems,
    clearCart,
    showToast
  } = useCart();

  const { user } = useAuth();
  const navigate = useNavigate();

  // Contact & Address Info (Auto-prefills if user is logged in)
  const [email, setEmail] = useState(user?.email || '');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [street, setStreet] = useState(user?.savedAddresses?.[0]?.street || '');
  const [city, setCity] = useState(user?.savedAddresses?.[0]?.city || 'Mumbai');
  const [state, setState] = useState(user?.savedAddresses?.[0]?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(user?.savedAddresses?.[0]?.pincode || '400001');
  
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'same-day'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'whatsapp'>('upi');
  const [upiCopied, setUpiCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');

  // Sync user profile if available
  useEffect(() => {
    if (user) {
      if (!email && user.email) setEmail(user.email);
      if (!name && user.name) setName(user.name);
      if (!phone && user.phone) setPhone(user.phone);
      if (user.savedAddresses?.[0]) {
        if (!street) setStreet(user.savedAddresses[0].street || '');
        if (!city) setCity(user.savedAddresses[0].city || 'Mumbai');
        if (!state) setState(user.savedAddresses[0].state || 'Maharashtra');
        if (!pincode) setPincode(user.savedAddresses[0].pincode || '');
      }
    }
  }, [user]);

  // Indian Pincode Auto-City-State helper
  const handlePincodeChange = (pin: string) => {
    setPincode(pin);
    if (pin.startsWith('400') || pin.startsWith('401')) {
      setCity('Mumbai');
      setState('Maharashtra');
    } else if (pin.startsWith('110')) {
      setCity('New Delhi');
      setState('Delhi');
    } else if (pin.startsWith('560')) {
      setCity('Bengaluru');
      setState('Karnataka');
    } else if (pin.startsWith('600')) {
      setCity('Chennai');
      setState('Tamil Nadu');
    } else if (pin.startsWith('500')) {
      setCity('Hyderabad');
      setState('Telangana');
    } else if (pin.startsWith('700')) {
      setCity('Kolkata');
      setState('West Bengal');
    } else if (pin.startsWith('380')) {
      setCity('Ahmedabad');
      setState('Gujarat');
    }
  };

  const isMumbai = pincode.startsWith('400') || pincode.startsWith('401') || city.toLowerCase().includes('mumbai');

  const freeShippingThreshold = BRAND_INFO.freeShippingThreshold || 999;
  const shippingCost = finalPayable >= freeShippingThreshold || finalPayable === 0 ? 0 : 99;
  const sameDayExtra = shippingMethod === 'same-day' ? 100 : 0;
  const grandTotal = finalPayable + shippingCost + sameDayExtra;

  const handleCopyUPI = () => {
    navigator.clipboard.writeText('7718825792@okaxis');
    setUpiCopied(true);
    showToast("UPI ID copied to clipboard ✨");
    setTimeout(() => setUpiCopied(false), 2500);
  };

  const sanitizeAddressText = (val: string): string => {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/[<>]/g, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onload\s*=/gi, '');
  };

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    if (res.success) {
      setCouponCodeInput('');
    } else {
      showToast(res.message);
    }
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanName = name.replace(/[^a-zA-Z\s'-]/g, '').trim();
    if (!cleanName || cleanName.length < 2) {
      showToast("Please enter a valid full name (letters only).");
      return;
    }

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast("Please enter a valid email address.");
      return;
    }

    const cleanPhoneDigits = phone.replace(/\D/g, '');
    if (cleanPhoneDigits.length < 10) {
      showToast("Please enter a valid 10-digit mobile number (numbers only).");
      return;
    }

    const cleanStreet = sanitizeAddressText(street).trim();
    if (!cleanStreet || cleanStreet.length < 5 || !pincode.trim() || pincode.replace(/\D/g, '').length !== 6) {
      showToast("Please fill in a valid delivery address (HTML, scripts & iframes not allowed) and 6-digit PIN code.");
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
        total: grandTotal,
        shippingMethod: shippingMethod === 'same-day' ? 'Mumbai Same-Day Priority Express Courier' : 'Pan-India Free Express Air Cargo',
        paymentMethod: paymentMethod.toUpperCase(),
        userId: user?.id,
      });

      // Clear cart
      clearCart();
      setIsProcessing(false);
      showToast(`✨ Order ${newOrder.orderNumber} placed successfully!`);

      // Navigate to dedicated Order Success Page with full order state
      navigate(`/order-success/${newOrder.orderNumber}`, { state: { order: newOrder } });
    } catch (err) {
      setIsProcessing(false);
      showToast("Could not place order. Please try again.");
    }
  };

  // If cart is empty, render friendly return screen
  if (cart.length === 0) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-pearl-50/95 p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-3xl text-obsidian font-bold">Your Bag is Empty</h2>
            <p className="text-xs text-obsidian/60 font-sans">
              Please add your favourite fine jewellery or celebration hampers to proceed with checkout.
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

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Back Button & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                Frictionless Checkout Portal
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[11px] text-emerald-800 font-sans font-semibold">256-Bit SSL Encrypted</span>
            </div>
            <h1 className="site-main-title text-obsidian font-serif-luxury">
              Express <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">checkout</span>.
            </h1>
          </div>

          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase text-obsidian/70 hover:text-gold-dark transition-colors self-start sm:self-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Boutique</span>
          </Link>
        </div>

        {/* 2-Column Responsive Checkout Grid */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Customer Details & Payment Options (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Step 1: Customer Contact & Delivery Info */}
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                <div className="flex items-center gap-2 text-sm uppercase font-mono tracking-wider text-gold-dark font-bold">
                  <User className="w-4 h-4" />
                  <span>1. Contact & Shipping Address</span>
                </div>
                <span className="text-[11px] text-obsidian-soft font-sans font-medium">Guest or Member</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold flex items-center justify-between">
                    <span>Full Name *</span>
                    <span className="text-[10px] text-obsidian-soft/70 font-normal">Letters only</span>
                  </label>
                  <div className="flex items-center gap-2 px-3.5 h-11 bg-pearl-50 rounded-xl border border-champagne-300 focus-within:border-gold-dark">
                    <User className="w-4 h-4 text-gold-dark shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Priyanshu Sharma"
                      value={name}
                      onBeforeInput={(e: any) => {
                        if (e.data && /[0-9]/.test(e.data)) {
                          e.preventDefault();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow control/editing keys: Backspace, Delete, Arrows, Tab, Enter, etc.
                        if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
                        if (!/[a-zA-Z\s'-]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = e.currentTarget.value.replace(/[^a-zA-Z\s'-]/g, '');
                        e.currentTarget.value = clean;
                        setName(clean);
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData('text');
                        const clean = paste.replace(/[^a-zA-Z\s'-]/g, '');
                        setName((name + clean).replace(/[^a-zA-Z\s'-]/g, ''));
                      }}
                      onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
                      autoComplete="name"
                      pattern="[a-zA-Z\s'-]+"
                      title="Name must only contain letters"
                      className="w-full bg-transparent text-xs sm:text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                    Email Address *
                  </label>
                  <div className="flex items-center gap-2 px-3.5 h-11 bg-pearl-50 rounded-xl border border-champagne-300 focus-within:border-gold-dark">
                    <Mail className="w-4 h-4 text-gold-dark shrink-0" />
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value.trim())}
                      autoComplete="email"
                      className="w-full bg-transparent text-xs sm:text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold flex items-center justify-between">
                    <span>Mobile Phone *</span>
                    <span className="text-[10px] text-obsidian-soft/70 font-normal">Digits only</span>
                  </label>
                  <div className="flex items-center gap-2 px-3.5 h-11 bg-pearl-50 rounded-xl border border-champagne-300 focus-within:border-gold-dark">
                    <Phone className="w-4 h-4 text-gold-dark shrink-0" />
                    <input
                      type="tel"
                      inputMode="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onBeforeInput={(e: any) => {
                        if (e.data && /[a-zA-Z]/.test(e.data)) {
                          e.preventDefault();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow control/editing keys: Backspace, Delete, Arrows, Tab, Enter, etc.
                        if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
                        if (!/[0-9+\s-]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = e.currentTarget.value.replace(/[^0-9+\s-]/g, '').slice(0, 16);
                        e.currentTarget.value = clean;
                        setPhone(clean);
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData('text');
                        const clean = paste.replace(/[^0-9+\s-]/g, '').slice(0, 16);
                        setPhone(clean);
                      }}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9+\s-]/g, '').slice(0, 16))}
                      autoComplete="tel"
                      pattern="[0-9+\s-]{10,16}"
                      title="Phone number must only contain digits"
                      className="w-full bg-transparent text-xs sm:text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
                    />
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                    Flat / House No. / Street Address *
                  </label>
                  <div className="flex items-center gap-2 px-3.5 h-11 bg-pearl-50 rounded-xl border border-champagne-300 focus-within:border-gold-dark">
                    <MapPin className="w-4 h-4 text-gold-dark shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 402, Sea Crest Towers, Worli Sea Face"
                      value={street}
                      onBeforeInput={(e: any) => {
                        if (e.data && /[<>]/.test(e.data)) {
                          e.preventDefault();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === '<' || e.key === '>') {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData('text');
                        const clean = sanitizeAddressText(paste);
                        setStreet(sanitizeAddressText(street + clean));
                      }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = sanitizeAddressText(e.currentTarget.value);
                        e.currentTarget.value = clean;
                        setStreet(clean);
                      }}
                      onChange={(e) => setStreet(sanitizeAddressText(e.target.value))}
                      className="w-full bg-transparent text-xs sm:text-sm font-sans text-obsidian focus:outline-none placeholder:text-obsidian/40"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                    PIN Code * (6 Digits)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    placeholder="400001"
                    maxLength={6}
                    value={pincode}
                    onBeforeInput={(e: any) => {
                      if (e.data && /[^0-9]/.test(e.data)) {
                        e.preventDefault();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow control/editing keys: Backspace, Delete, Arrows, Tab, Enter, etc.
                      if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const clean = e.currentTarget.value.replace(/\D/g, '').slice(0, 6);
                      e.currentTarget.value = clean;
                      handlePincodeChange(clean);
                    }}
                    onChange={(e) => handlePincodeChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className="w-full h-11 px-3.5 bg-pearl-50 rounded-xl border border-champagne-300 focus:outline-none focus:border-gold-dark text-xs sm:text-sm font-mono text-obsidian"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                    City & State
                  </label>
                  <div className="h-11 px-3.5 bg-champagne-100/60 rounded-xl border border-champagne-300 flex items-center justify-between text-xs font-mono text-obsidian font-bold">
                    <span>{city}, {state}</span>
                    {isMumbai && <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">Mumbai Zone</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Delivery Method Selection */}
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-sm uppercase font-mono tracking-wider text-gold-dark font-bold border-b border-champagne-200 pb-3">
                <Truck className="w-4 h-4" />
                <span>2. Delivery Speed & Options</span>
              </div>

              <div className="space-y-3">
                {/* Standard Free Express Delivery */}
                <label
                  onClick={() => setShippingMethod('standard')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    shippingMethod === 'standard'
                      ? 'border-gold-dark bg-champagne-100/60 shadow-sm'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'standard'}
                      onChange={() => setShippingMethod('standard')}
                      className="accent-gold-dark"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-serif-luxury text-sm text-obsidian font-bold">Pan-India Express Air Cargo</p>
                        <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">Recommended</span>
                      </div>
                      <p className="text-xs text-obsidian-soft mt-0.5">Dispatches in 24h • Delivered in 2-3 business days</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-emerald-700">
                    {finalPayable >= freeShippingThreshold ? 'FREE' : '₹99'}
                  </span>
                </label>

                {/* Same-Day Mumbai Priority Delivery */}
                <label
                  onClick={() => setShippingMethod('same-day')}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                    shippingMethod === 'same-day'
                      ? 'border-gold-dark bg-champagne-100/60 shadow-sm'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shippingMethod"
                      checked={shippingMethod === 'same-day'}
                      onChange={() => setShippingMethod('same-day')}
                      className="accent-gold-dark"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-serif-luxury text-sm text-obsidian font-bold">Mumbai Same-Day Express Courier</p>
                        <span className="text-[10px] font-mono text-gold-dark bg-champagne-200 px-1.5 py-0.5 rounded font-bold">⚡ Hyper-Fast</span>
                      </div>
                      <p className="text-xs text-obsidian-soft mt-0.5">Delivered by 8:00 PM today across Mumbai & Navi Mumbai</p>
                    </div>
                  </div>
                  <span className="font-mono text-xs font-bold text-gold-dark">+₹100</span>
                </label>
              </div>
            </div>

            {/* Step 3: GoKwik-Style Payment Method Selection */}
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                <div className="flex items-center gap-2 text-sm uppercase font-mono tracking-wider text-gold-dark font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>3. Payment Gateway</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-emerald-800">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified & Protected</span>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-3">
                
                {/* 1. UPI Fast Pay */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    paymentMethod === 'upi'
                      ? 'border-gold-dark bg-champagne-100/50 shadow-sm'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="accent-gold-dark"
                      />
                      <div>
                        <p className="font-serif-luxury text-sm text-obsidian font-bold">UPI Fast Pay (GPay / PhonePe / Paytm / QR)</p>
                        <p className="text-xs text-obsidian-soft">Instant verification & faster dispatch</p>
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Zero Fees
                    </span>
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="p-3.5 bg-white rounded-xl border border-champagne-300/80 space-y-3 animate-fade-in text-xs font-sans">
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-pearl-50 rounded-lg border border-champagne-200">
                        <div>
                          <p className="text-[10px] uppercase font-mono text-obsidian-soft font-bold">Celestia Official Atelier UPI ID:</p>
                          <p className="font-mono text-sm text-obsidian font-bold">7718825792@okaxis</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCopyUPI}
                          className="px-3.5 py-1.5 bg-obsidian text-pearl-100 text-xs font-mono font-bold rounded-full hover:bg-obsidian-200 transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                        >
                          {upiCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{upiCopied ? 'Copied!' : 'Copy UPI ID'}</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-obsidian-soft text-center">
                        You can also pay directly after placing the order via the instant WhatsApp receipt or UPI prompt.
                      </p>
                    </div>
                  )}
                </div>

                {/* 2. Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'cod'
                      ? 'border-gold-dark bg-champagne-100/50 shadow-sm'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-gold-dark"
                      />
                      <div>
                        <p className="font-serif-luxury text-sm text-obsidian font-bold">Cash on Delivery (COD)</p>
                        <p className="text-xs text-obsidian-soft">Pay at your doorstep with Cash or UPI upon unboxing</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-obsidian font-bold">₹0 Prepay</span>
                  </div>
                </div>

                {/* 3. Cards & Net Banking */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'border-gold-dark bg-champagne-100/50 shadow-sm'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="accent-gold-dark"
                      />
                      <div>
                        <p className="font-serif-luxury text-sm text-obsidian font-bold">Credit / Debit Cards & Net Banking</p>
                        <p className="text-xs text-obsidian-soft">Visa, Mastercard, RuPay, Diners, American Express</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-obsidian/60" />
                  </div>
                </div>

                {/* 4. Instant WhatsApp Concierge */}
                <div
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    paymentMethod === 'whatsapp'
                      ? 'border-gold-dark bg-champagne-100/50 shadow-sm'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'whatsapp'}
                        onChange={() => setPaymentMethod('whatsapp')}
                        className="accent-gold-dark"
                      />
                      <div>
                        <p className="font-serif-luxury text-sm text-obsidian font-bold">WhatsApp Concierge Assisted Pay</p>
                        <p className="text-xs text-obsidian-soft">Chat with our Mumbai studio manager for custom billing</p>
                      </div>
                    </div>
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Instant Checkout CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6">
              
              <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                <div className="flex items-center gap-2 text-sm uppercase font-mono tracking-wider text-gold-dark font-bold">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Order Summary ({totalItems})</span>
                </div>
                <Link to="/cart" className="text-xs font-mono text-obsidian hover:text-gold-dark underline font-bold">
                  Edit Bag
                </Link>
              </div>

              {/* Items Preview */}
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-sand shrink-0 border border-champagne-200">
                        <img
                          src={item.product.images.hero}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif-luxury text-sm text-obsidian font-bold line-clamp-1">{item.product.title}</p>
                        <p className="text-[10px] font-mono text-obsidian-soft">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-obsidian">₹{item.product.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input & Chips */}
              <div className="pt-2 border-t border-champagne-200 space-y-2">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                  Discount Code
                </label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span><strong>{appliedCoupon.code}</strong> (-₹{discountAmount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 font-bold hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="e.g. CELESTIA10"
                        value={couponCodeInput}
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
                          setCouponCodeInput(clean);
                        }}
                        onInput={(e: React.FormEvent<HTMLInputElement>) => {
                          const clean = e.currentTarget.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                          e.currentTarget.value = clean;
                          setCouponCodeInput(clean);
                        }}
                        onChange={(e) => {
                          const clean = e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 20);
                          setCouponCodeInput(clean);
                        }}
                        maxLength={20}
                        pattern="[a-zA-Z0-9]+"
                        title="Discount codes only contain letters and numbers"
                        className="flex-1 h-10 px-3 bg-pearl-50 rounded-xl border border-champagne-300 text-xs font-mono uppercase text-obsidian focus:outline-none focus:border-gold-dark"
                      />
                      <button
                        type="button"
                        onClick={() => handleApplyCoupon(couponCodeInput)}
                        className="h-10 px-4 bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold rounded-xl hover:bg-obsidian-200 transition-colors cursor-pointer"
                      >
                        Apply
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {POPULAR_COUPONS.map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => handleApplyCoupon(c.code)}
                          className="px-2.5 py-1 bg-champagne-100/70 hover:bg-champagne-200 border border-champagne-300 text-[10px] font-mono text-gold-dark font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          +{c.code} ({c.description})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price Calculation Table */}
              <div className="pt-3 border-t border-champagne-200 space-y-2 text-xs">
                <div className="flex justify-between text-obsidian-soft">
                  <span>Bag Subtotal</span>
                  <span className="font-mono font-medium text-obsidian">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                <div className="flex justify-between text-obsidian-soft">
                  <span>Shipping & Delivery</span>
                  <span className="font-mono font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold">FREE</span>
                    ) : (
                      '₹99'
                    )}
                  </span>
                </div>

                {shippingMethod === 'same-day' && (
                  <div className="flex justify-between text-gold-dark font-medium">
                    <span>Mumbai Same-Day Priority Courier</span>
                    <span className="font-mono">+₹100</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-champagne-300 text-obsidian">
                  <div>
                    <span className="font-serif-luxury text-lg font-bold">Total Amount Payable</span>
                    <span className="text-[10px] text-obsidian-soft block">(All Indian taxes & duties included)</span>
                  </div>
                  <span className="font-mono font-bold text-2xl text-gold-dark">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* High-Converting Direct Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full h-14 bg-obsidian hover:bg-obsidian-200 text-pearl-100 rounded-full text-xs sm:text-sm uppercase tracking-widest font-bold transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 group"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-pearl-100 border-t-transparent rounded-full animate-spin" />
                    <span>Confirming Order...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gold-dark" />
                    <span>Place Order • ₹{grandTotal}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-2 pt-2 text-[10px] font-mono text-obsidian-soft border-t border-champagne-200">
                <div className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <span>100% Anti-Tarnish</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <span>7-Day Returns</span>
                </div>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
