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
  Shield,
  Smartphone,
  Building2,
  ChevronRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { SEOHead } from '../components/seo/SEOHead';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { sanitizeCouponCode } from '../utils/sanitize';

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
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'simpl' | 'cod' | 'whatsapp'>('upi');
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'qr'>('gpay');
  const [upiCopied, setUpiCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [showQrModal, setShowQrModal] = useState(false);

  // Card Form State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC');

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
    } else if (pin.startsWith('411')) {
      setCity('Pune');
      setState('Maharashtra');
    } else if (pin.startsWith('302')) {
      setCity('Jaipur');
      setState('Rajasthan');
    }
  };

  const isMumbai = pincode.startsWith('400') || pincode.startsWith('401') || city.toLowerCase().includes('mumbai');

  // Bonkers Corner Style Dynamic Pricing & Discounts
  const freeShippingThreshold = BRAND_INFO.freeShippingThreshold || 999;
  const shippingCost = finalPayable >= freeShippingThreshold || finalPayable === 0 ? 0 : 99;
  const sameDayExtra = shippingMethod === 'same-day' ? 100 : 0;
  
  // Extra ₹50 Instant Discount for UPI/Prepaid payments (Like Bonkers Corner / GoKwik)
  const upiInstantDiscount = paymentMethod === 'upi' && finalPayable >= 200 ? 50 : 0;
  
  // ₹50 Convenience Handling Fee on Cash on Delivery
  const codFee = paymentMethod === 'cod' ? 50 : 0;

  const grandTotal = Math.max(0, finalPayable - upiInstantDiscount + shippingCost + sameDayExtra + codFee);

  // Dynamic UPI Deep Link
  const upiDeepLink = `upi://pay?pa=7718825792@okaxis&pn=Celestia%20Luxury%20Atelier&am=${grandTotal}&cu=INR&tn=Celestia%20Order`;
  const dynamicQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiDeepLink)}&margin=8`;

  // Detect Card Brand
  const getCardBrand = (num: string) => {
    const clean = num.replace(/\D/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MasterCard';
    if (/^(60|65|81|82|508)/.test(clean)) return 'RuPay';
    if (/^(34|37)/.test(clean)) return 'Amex';
    return null;
  };

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
    const clean = sanitizeCouponCode(code);
    setCouponCodeInput(clean);
    if (!clean) {
      showToast("Please enter a valid promo code (letters and numbers only).");
      return;
    }
    const res = applyCoupon(clean);
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
      showToast("Please fill in a valid delivery address and 6-digit PIN code.");
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
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhoneDigits,
          address: `${cleanStreet}, ${city}, ${state} - ${pincode}`,
        },
        items: orderItems,
        subtotal,
        shippingCost: shippingCost + sameDayExtra + codFee,
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
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-bold hover:bg-obsidian-200 transition-all shadow-md"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-36 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <SEOHead
        title="Secure Checkout | CELESTIA Luxury Atelier"
        description="Encrypted 256-bit SSL checkout with UPI Instant Pay, Credit Card, and Verified COD at Celestia Atelier."
        canonical="https://jwellery-brand.vercel.app/checkout"
        noIndex={true}
      />
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Back Button & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                1-Click Fast Checkout Portal
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                <span>GoKwik Powered</span>
              </span>
            </div>
            <h1 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian font-bold">
              Complete Your Order
            </h1>
          </div>

          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-obsidian-soft hover:text-gold-dark transition-colors font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Curated Bag</span>
          </Link>
        </div>

        {/* Dynamic Bonkers Corner Style Trust Banner */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-champagne-100/90 via-pearl-50 to-champagne-100/90 border border-champagne-300/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-obsidian font-medium">
            <Zap className="w-4 h-4 text-gold-dark shrink-0" />
            <span><strong>Special Offer:</strong> Extra ₹50 Instant Discount automatically on <strong>UPI / Prepaid</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-mono text-obsidian/70">
            <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> 100% Secure Gateway</span>
            <span className="hidden md:inline">•</span>
            <span className="hidden md:flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-gold-dark" /> Same-Day Mumbai Air Dispatch</span>
          </div>
        </div>

        {/* Main 2-Column Checkout Layout */}
        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* LEFT COLUMN: Steps 1, 2, 3 (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Step 1: Customer Contact & Delivery Details */}
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                <div className="flex items-center gap-2 text-sm uppercase font-mono tracking-wider text-gold-dark font-bold">
                  <User className="w-4 h-4" />
                  <span>1. Delivery Address & Contact</span>
                </div>
                {user && (
                  <span className="text-[10px] uppercase font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                    Patron Profile Loaded
                  </span>
                )}
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
                      placeholder="e.g. Radhika Sharma"
                      value={name}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = e.currentTarget.value.replace(/[^a-zA-Z\s'-]/g, '');
                        e.currentTarget.value = clean;
                        setName(clean);
                      }}
                      onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ''))}
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
                      onChange={(e) => setEmail(e.target.value.replace(/[<>'"\s]/g, '').trim())}
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
                      placeholder="9876543210"
                      value={phone}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = e.currentTarget.value.replace(/[^0-9]/g, '').slice(0, 10);
                        e.currentTarget.value = clean;
                        setPhone(clean);
                      }}
                      onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, '').slice(0, 10))}
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

            {/* Step 2: Delivery Speed Selection */}
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

            {/* Step 3: Bonkers Corner Style Payment Gateway */}
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                <div className="flex items-center gap-2 text-sm uppercase font-mono tracking-wider text-gold-dark font-bold">
                  <CreditCard className="w-4 h-4" />
                  <span>3. Payment Gateway & Options</span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit Bank Grade SSL</span>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-3.5">
                
                {/* 1. UPI Fast Pay (Bonkers Corner Top Option) */}
                <div
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                    paymentMethod === 'upi'
                      ? 'border-gold-dark bg-gradient-to-b from-champagne-100/70 to-pearl-50 shadow-md ring-1 ring-gold-dark/40'
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
                        <div className="flex items-center gap-2">
                          <p className="font-serif-luxury text-sm sm:text-base text-obsidian font-bold">UPI Instant Pay</p>
                          <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                            Extra ₹50 Off
                          </span>
                        </div>
                        <p className="text-xs text-obsidian-soft mt-0.5">Google Pay, PhonePe, Paytm, BHIM & QR Code</p>
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 text-gold-dark shrink-0" />
                  </div>

                  {paymentMethod === 'upi' && (
                    <div className="p-4 bg-white rounded-2xl border border-champagne-300 shadow-inner space-y-4 animate-fade-in text-xs">
                      
                      {/* Popular UPI Apps Intent Buttons (Bonkers Corner Style) */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-mono text-obsidian-soft uppercase font-bold tracking-wider">
                          Select Instant UPI App:
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {[
                            { id: 'gpay', name: 'Google Pay', iconUrl: '/assets/icons/payment/gpay.svg', color: 'border-blue-200 hover:border-blue-400 hover:bg-blue-50/50' },
                            { id: 'phonepe', name: 'PhonePe', iconUrl: '/assets/icons/payment/phonepe.svg', color: 'border-purple-200 hover:border-purple-400 hover:bg-purple-50/50' },
                            { id: 'paytm', name: 'Paytm UPI', iconUrl: '/assets/icons/payment/paytm_badge.svg', color: 'border-cyan-200 hover:border-cyan-400 hover:bg-cyan-50/50' },
                            { id: 'bhim', name: 'BHIM UPI', iconUrl: '/assets/icons/payment/bhim.svg', color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50' },
                          ].map((app) => (
                            <button
                              key={app.id}
                              type="button"
                              onClick={() => setSelectedUpiApp(app.id as any)}
                              className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2.5 transition-all font-sans font-bold text-xs cursor-pointer ${
                                selectedUpiApp === app.id
                                  ? 'border-gold-dark bg-champagne-100 text-obsidian shadow-sm ring-1 ring-gold-dark/40'
                                  : `bg-pearl-50 text-obsidian/80 ${app.color}`
                              }`}
                            >
                              <img
                                src={app.iconUrl}
                                alt={app.name}
                                className="w-6 h-6 object-contain shrink-0 rounded-sm"
                              />
                              <span className="truncate">{app.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Direct UPI App Trigger / Dynamic QR Code Section */}
                      <div className="p-4 bg-pearl-50 rounded-xl border border-champagne-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                        
                        {/* Dynamic Scannable QR Code */}
                        <div className="flex flex-col items-center text-center space-y-1.5 shrink-0">
                          <div className="p-2 bg-white rounded-xl border border-champagne-300 shadow-sm">
                            <img
                              src={dynamicQrUrl}
                              alt="Scan & Pay via Any UPI App"
                              className="w-28 h-28 object-contain"
                            />
                          </div>
                          <span className="text-[10px] font-mono text-obsidian-soft font-bold">
                            Scan with Any UPI App
                          </span>
                        </div>

                        {/* UPI Details & 1-Click Pay */}
                        <div className="flex-1 space-y-2.5 text-left w-full">
                          <div>
                            <span className="text-[10px] uppercase font-mono text-gold-dark font-bold block">
                              Celestia Verified Merchant ID:
                            </span>
                            <div className="flex items-center justify-between gap-2 mt-1 p-2 bg-white rounded-lg border border-champagne-200">
                              <span className="font-mono text-xs text-obsidian font-bold">7718825792@okaxis</span>
                              <button
                                type="button"
                                onClick={handleCopyUPI}
                                className="px-2.5 py-1 bg-obsidian text-pearl-100 text-[11px] font-mono font-bold rounded-md hover:bg-obsidian-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                              >
                                {upiCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{upiCopied ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          </div>

                          {/* Mobile Direct Pay Link */}
                          <a
                            href={upiDeepLink}
                            className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-pearl-100 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-xs"
                          >
                            {selectedUpiApp !== 'qr' ? (
                              <img
                                src={selectedUpiApp === 'paytm' ? '/assets/icons/payment/paytm_badge.svg' : `/assets/icons/payment/${selectedUpiApp}.svg`}
                                alt={selectedUpiApp}
                                className="w-5 h-5 object-contain rounded-xs shrink-0"
                              />
                            ) : (
                              <Zap className="w-3.5 h-3.5 text-champagne-300" />
                            )}
                            <span>Launch {selectedUpiApp.toUpperCase()} on Mobile (₹{grandTotal})</span>
                          </a>
                        </div>
                      </div>

                    </div>
                  )}
                </div>

                {/* 2. Credit & Debit Cards (Razorpay / Cashfree Style) */}
                <div
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-4 ${
                    paymentMethod === 'card'
                      ? 'border-gold-dark bg-gradient-to-b from-champagne-100/70 to-pearl-50 shadow-md ring-1 ring-gold-dark/40'
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
                        <p className="font-serif-luxury text-sm sm:text-base text-obsidian font-bold">Credit / Debit Card & NetBanking</p>
                        <p className="text-xs text-obsidian-soft mt-0.5">Visa, Mastercard, RuPay, Amex & 50+ Banks</p>
                      </div>
                    </div>
                    <CreditCard className="w-5 h-5 text-obsidian/70 shrink-0" />
                  </div>

                  {paymentMethod === 'card' && (
                    <div className="p-4 bg-white rounded-2xl border border-champagne-300 shadow-inner space-y-3.5 animate-fade-in text-xs">
                      
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                          Card Number
                        </label>
                        <div className="flex items-center gap-2 px-3.5 h-11 bg-pearl-50 rounded-xl border border-champagne-300 focus-within:border-gold-dark">
                          <CreditCard className="w-4 h-4 text-gold-dark shrink-0" />
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="4532 •••• •••• 8890"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => {
                              const v = e.target.value.replace(/\D/g, '').slice(0, 16);
                              const parts = v.match(/.{1,4}/g) || [];
                              setCardNumber(parts.join(' '));
                            }}
                            className="w-full bg-transparent text-xs sm:text-sm font-mono text-obsidian focus:outline-none placeholder:text-obsidian/40"
                          />
                          {getCardBrand(cardNumber) && (
                            <span className="px-2 py-0.5 bg-champagne-200 text-obsidian font-mono text-[10px] font-bold rounded">
                              {getCardBrand(cardNumber)}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                            Expiry (MM/YY)
                          </label>
                          <input
                            type="text"
                            placeholder="12/28"
                            maxLength={5}
                            value={cardExpiry}
                            onChange={(e) => {
                              let v = e.target.value.replace(/\D/g, '').slice(0, 4);
                              if (v.length >= 3) v = `${v.slice(0, 2)}/${v.slice(2)}`;
                              setCardExpiry(v);
                            }}
                            className="w-full h-11 px-3.5 bg-pearl-50 rounded-xl border border-champagne-300 text-xs font-mono text-obsidian focus:outline-none focus:border-gold-dark"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-mono tracking-wider text-obsidian-soft font-bold flex items-center justify-between">
                            <span>CVV</span>
                            <span className="text-[9px] text-obsidian/50">3-4 digits</span>
                          </label>
                          <input
                            type="password"
                            placeholder="•••"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            className="w-full h-11 px-3.5 bg-pearl-50 rounded-xl border border-champagne-300 text-xs font-mono text-obsidian focus:outline-none focus:border-gold-dark"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-mono tracking-wider text-obsidian-soft font-bold block">
                          Cardholder Name
                        </label>
                        <input
                          type="text"
                          placeholder="Name as printed on card"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value.toUpperCase())}
                          className="w-full h-11 px-3.5 bg-pearl-50 rounded-xl border border-champagne-300 text-xs font-sans text-obsidian focus:outline-none focus:border-gold-dark"
                        />
                      </div>

                    </div>
                  )}
                </div>

                {/* 3. Pay Later / Simpl Style (Bonkers Corner Feature) */}
                <div
                  onClick={() => setPaymentMethod('simpl')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    paymentMethod === 'simpl'
                      ? 'border-gold-dark bg-gradient-to-b from-champagne-100/70 to-pearl-50 shadow-md ring-1 ring-gold-dark/40'
                      : 'border-champagne-300/80 hover:bg-pearl-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'simpl'}
                        onChange={() => setPaymentMethod('simpl')}
                        className="accent-gold-dark"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-serif-luxury text-sm sm:text-base text-obsidian font-bold">Simpl 1-Click Pay Later</p>
                          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                            3 Interest-Free Splits
                          </span>
                        </div>
                        <p className="text-xs text-obsidian-soft mt-0.5">Pay in 3 payments of ₹{Math.round(grandTotal / 3)}/month with 0% interest</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-gold-dark">SIMPL</span>
                  </div>
                </div>

                {/* 4. Cash on Delivery (COD) */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    paymentMethod === 'cod'
                      ? 'border-gold-dark bg-gradient-to-b from-champagne-100/70 to-pearl-50 shadow-md ring-1 ring-gold-dark/40'
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
                        <div className="flex items-center gap-2">
                          <p className="font-serif-luxury text-sm sm:text-base text-obsidian font-bold">Cash on Delivery (COD)</p>
                          <span className="text-[10px] font-mono bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                            +₹50 COD Fee
                          </span>
                        </div>
                        <p className="text-xs text-obsidian-soft mt-0.5">Pay via Cash or UPI at your doorstep upon unboxing (+₹50 handling charge)</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-amber-900 font-bold">+₹50 COD Charge</span>
                  </div>

                  {paymentMethod === 'cod' && (
                    <div className="p-3.5 bg-amber-50/90 rounded-xl border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
                      <div>
                        <p className="font-bold">⚠️ Cash on Delivery requires a ₹50 logistics verification charge.</p>
                        <p className="text-[11px] text-amber-800 mt-0.5">Tip: Pay via Instant UPI to waive the ₹50 fee and get an EXTRA ₹50 discount!</p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentMethod('upi');
                        }}
                        className="px-3 py-1.5 rounded-full bg-gold-dark text-pearl-100 text-[11px] font-mono font-bold uppercase shrink-0 hover:bg-gold-dark/90 transition-all cursor-pointer shadow-xs"
                      >
                        Switch to UPI (Save ₹100)
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Order Summary & Instant Checkout CTA (5 Cols) */}
          <div className="lg:col-span-5 space-y-6 sticky top-28">
            
            <div className="bg-white/95 p-6 sm:p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6">
              
              <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
                <span className="text-sm uppercase font-mono tracking-wider text-gold-dark font-bold">
                  Order Summary ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
                </span>
                <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  100% Guaranteed
                </span>
              </div>

              {/* Items List with Thumbnails */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 pb-3 border-b border-champagne-200/50">
                    <img
                      src={item.product.images.hero}
                      alt={item.product.title}
                      className="w-14 h-14 rounded-xl object-cover bg-sand shrink-0 border border-champagne-300/60"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif-luxury text-xs text-obsidian font-bold truncate">
                        {item.product.title}
                      </p>
                      <p className="text-[11px] text-obsidian-soft">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-mono text-xs font-bold text-obsidian">
                      ₹{item.product.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon Code Applicator */}
              <div className="space-y-2 pt-1">
                <div className="flex gap-2">
                  <div className="flex-1 flex items-center gap-2 px-3.5 h-11 bg-pearl-50 rounded-xl border border-champagne-300 focus-within:border-gold-dark">
                    <Tag className="w-4 h-4 text-gold-dark shrink-0" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. CELESTIA10)"
                      value={couponCodeInput}
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
                          setCouponCodeInput(clean);
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData('text') || '';
                        const clean = sanitizeCouponCode(paste);
                        setCouponCodeInput(clean);
                      }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = sanitizeCouponCode(e.currentTarget.value);
                        e.currentTarget.value = clean;
                        setCouponCodeInput(clean);
                      }}
                      onChange={(e) => {
                        const clean = sanitizeCouponCode(e.target.value);
                        setCouponCodeInput(clean);
                      }}
                      onBlur={(e) => {
                        const clean = sanitizeCouponCode(e.target.value);
                        setCouponCodeInput(clean);
                      }}
                      maxLength={20}
                      pattern="[a-zA-Z0-9]+"
                      autoComplete="off"
                      autoCorrect="off"
                      spellCheck={false}
                      title="Promo codes only contain letters and numbers"
                      className="w-full bg-transparent text-xs font-mono uppercase text-obsidian focus:outline-none placeholder:text-obsidian/40"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(couponCodeInput)}
                    className="px-5 h-11 bg-champagne-200 hover:bg-gold-dark hover:text-pearl-50 text-obsidian text-xs uppercase font-mono font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                    <div className="flex items-center gap-1.5 text-emerald-800 font-medium">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span><strong>{appliedCoupon.code}</strong> applied (-₹{discountAmount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Price Calculations Breakdown */}
              <div className="space-y-2 pt-2 border-t border-champagne-200 text-xs">
                <div className="flex justify-between text-obsidian-soft">
                  <span>Bag Subtotal</span>
                  <span className="font-mono font-medium text-obsidian">₹{subtotal}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Coupon Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{discountAmount}</span>
                  </div>
                )}

                {upiInstantDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50 p-1.5 rounded-lg border border-emerald-200">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Instant UPI Prepaid Discount</span>
                    </span>
                    <span className="font-mono">-₹{upiInstantDiscount}</span>
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

                {sameDayExtra > 0 && (
                  <div className="flex justify-between text-gold-dark font-medium">
                    <span>Mumbai Same-Day Priority Courier</span>
                    <span className="font-mono">+₹100</span>
                  </div>
                )}

                {codFee > 0 && (
                  <div className="flex justify-between text-amber-900 font-medium bg-amber-50/80 p-1.5 rounded-lg border border-amber-200/80">
                    <span>Cash on Delivery Handling Fee</span>
                    <span className="font-mono font-bold">+₹{codFee}</span>
                  </div>
                )}

                <div className="flex justify-between items-baseline pt-3 border-t border-champagne-300 text-obsidian">
                  <div>
                    <span className="font-serif-luxury text-base sm:text-lg font-bold">Total Amount</span>
                    <span className="text-[10px] text-obsidian-soft block">(Incl. of GST & all Indian taxes)</span>
                  </div>
                  <span className="font-mono font-bold text-2xl text-gold-dark">
                    ₹{grandTotal}
                  </span>
                </div>
              </div>

              {/* Main Submit Button (Bonkers Corner Style High-Conversion CTA) */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full min-h-[50px] py-4 px-6 rounded-full bg-obsidian text-pearl-100 hover:bg-obsidian-200 transition-all font-sans text-xs uppercase tracking-widest font-bold shadow-xl hover:shadow-2xl active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer group"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-champagne-300 border-t-transparent rounded-full animate-spin" />
                    <span>Processing Secure Gateway...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-gold-dark" />
                    <span>Pay ₹{grandTotal} • Place Order</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Trust Badges Bar */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-[10px] font-mono text-obsidian-soft text-center">
                <div className="p-2.5 bg-pearl-50 rounded-xl border border-champagne-200 flex flex-col items-center justify-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-gold-dark" />
                  <span>100% Anti-Tarnish</span>
                </div>
                <div className="p-2.5 bg-pearl-50 rounded-xl border border-champagne-200 flex flex-col items-center justify-center gap-1">
                  <Truck className="w-4 h-4 text-emerald-700" />
                  <span>Mumbai Studio Dispatch</span>
                </div>
              </div>

            </div>

          </div>

        </form>

      </div>

      {/* Mobile Fixed 1-Tap Checkout Footer Bar (Bonkers Corner Style) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-champagne-300/80 p-3 sm:p-4 shadow-2xl flex items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-mono text-obsidian-soft block">Grand Total</span>
          <span className="font-mono text-lg sm:text-xl font-bold text-gold-dark leading-none">
            ₹{grandTotal}
          </span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="flex-1 min-h-[48px] py-3.5 px-6 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
          {isProcessing ? (
            <span>Processing...</span>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5 text-gold-dark" />
              <span>Pay ₹{grandTotal} • Place Order →</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default CheckoutPage;
