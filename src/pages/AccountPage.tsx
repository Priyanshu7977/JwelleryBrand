import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { FEATURED_PRODUCTS } from '../data/shopify-data';
import { getUserOrders } from '../services/orderService';
import { OrderMetadata } from '../types/backend';
import { LuxuryBadge } from '../components/ui/LuxuryBadge';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  Sparkles,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Bell,
  Settings,
  ShoppingBag,
  Plus,
  LogIn,
  Eye,
  Trash2,
  Truck
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const { showToast, addToCart, setQuickViewProduct } = useCart();
  const { user, logout, isAuthenticated, wishlist, toggleWishlist, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'tracking' | 'addresses' | 'wishlist' | 'preferences'>('profile');
  const [ordersList, setOrdersList] = useState<OrderMetadata[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      setOrdersLoading(true);
      getUserOrders(user.email)
        .then((data) => setOrdersList(data))
        .finally(() => setOrdersLoading(false));
    }
  }, [user?.email]);

  // Address edit state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: 'Home',
    street: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '',
  });

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

  const handleLogout = () => {
    logout();
    showToast("Signed out of Celestia Atelier");
    navigate('/login');
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanStreet = sanitizeAddressText(newAddress.street).trim();
    if (!cleanStreet || cleanStreet.length < 5 || !newAddress.pincode) {
      showToast("Please fill in a valid street address (HTML, scripts & iframes not allowed) and pincode.");
      return;
    }
    const currentAddresses = user?.savedAddresses || [];
    const created = {
      id: `addr-${Date.now()}`,
      label: newAddress.label,
      street: cleanStreet,
      city: newAddress.city,
      state: newAddress.state,
      pincode: newAddress.pincode,
      isDefault: currentAddresses.length === 0,
    };
    if (user) {
      user.savedAddresses = [...currentAddresses, created];
      localStorage.setItem('celestia_authenticated_user', JSON.stringify(user));
    }
    setIsAddingAddress(false);
    showToast("Address saved successfully ✨");
    setNewAddress({ label: 'Home', street: '', city: 'Mumbai', state: 'Maharashtra', pincode: '' });
  };

  const wishlistedItems = FEATURED_PRODUCTS.filter((p) => wishlist.includes(p.id));

  // IF NOT AUTHENTICATED: Display Luxury Auth Gateway
  if (!isAuthenticated || !user) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
        <div className="max-w-2xl mx-auto space-y-10 text-center">
          
          <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark shadow-sm">
            <User className="w-8 h-8" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
              Private Atelier Portal
            </span>
            <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-obsidian uppercase">
              YOUR <span className="font-semibold text-gold-dark">ACCOUNT</span>.
            </h1>
            <p className="text-sm text-obsidian-soft font-sans max-w-md mx-auto leading-relaxed">
              Sign in to manage your dispatches, view saved addresses, track custom celebration hampers, or view your private wishlist.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => openAuthModal({ mode: 'login', reason: 'Sign in to access your orders, addresses, and member tier.' })}
              className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In to Account</span>
            </button>

            <button
              onClick={() => openAuthModal({ mode: 'register', reason: 'Create a complimentary account to save your bespoke hampers and orders.' })}
              className="btn-secondary w-full sm:w-auto flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Create Account</span>
            </button>
          </div>

          {/* Quick Wishlist Preview for Guest Users */}
          {wishlist.length > 0 && (
            <div className="p-6 rounded-3xl bg-pearl-50 border border-champagne-300/60 text-left space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600 fill-rose-600" />
                  <span>Saved Wishlist ({wishlist.length} {wishlist.length === 1 ? 'item' : 'items'})</span>
                </span>
                <Link to="/wishlist" className="text-xs font-sans text-obsidian hover:text-gold-dark font-bold underline">
                  View Full Wishlist →
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    );
  }

  // AUTHENTICATED USER PORTAL
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-champagne-300/40 pb-6">
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
              Private Hub • {user.tier}
            </span>
            <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase">
              HELLO, <span className="font-semibold text-gold-dark">{user.name.split(' ')[0]}</span>.
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian hover:text-red-700 transition-colors font-bold px-4 py-2 rounded-full border border-champagne-300/60 bg-pearl-50"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: 'profile', label: 'Member Profile', icon: <User className="w-3.5 h-3.5" /> },
            { id: 'orders', label: 'Atelier Dispatches', icon: <Package className="w-3.5 h-3.5" /> },
            { id: 'tracking', label: 'Delivery Tracking', icon: <Truck className="w-3.5 h-3.5" /> },
            { id: 'addresses', label: 'Saved Addresses', icon: <MapPin className="w-3.5 h-3.5" /> },
            { id: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: <Heart className="w-3.5 h-3.5" /> },
            { id: 'preferences', label: 'Preferences', icon: <Settings className="w-3.5 h-3.5" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs uppercase tracking-wider font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-obsidian text-pearl-100 shadow-md'
                  : 'bg-pearl-50 text-obsidian-soft hover:text-obsidian hover:bg-champagne-100/60 border border-champagne-300/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}

        {/* 1. Profile Overview */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-champagne-200 flex items-center justify-center text-obsidian font-serif text-lg font-bold">
                  {user.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-serif-luxury text-lg text-obsidian font-bold">{user.name}</h3>
                  <p className="text-xs text-obsidian-soft font-sans">{user.email}</p>
                </div>
              </div>
              <div className="pt-2 border-t border-champagne-300/30 text-xs text-obsidian-soft space-y-1 font-mono">
                <p>Phone: <span className="text-obsidian font-semibold">{user.phone}</span></p>
                <p>Member Since: <span className="text-obsidian font-semibold">{user.memberSince}</span></p>
                <p>Status: <span className="text-emerald-800 font-bold">Active Member</span></p>
              </div>
            </div>

            <div className="p-6 bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-3 shadow-sm">
              <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                Atelier Benefits
              </span>
              <div className="space-y-2 text-xs text-obsidian font-medium">
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Complimentary Pan-India express dispatch</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Same-Day Mumbai Studio hand delivery</span>
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-dark" />
                  <span>100% Anti-Tarnish Lifetime Promise</span>
                </p>
              </div>
            </div>

            <div className="p-6 bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-3 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Curated Wishlist
                </span>
                <p className="text-xs text-obsidian-soft mt-1">
                  You have <span className="font-bold text-obsidian">{wishlist.length}</span> pieces saved in your private vault.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('wishlist')}
                className="w-full py-2.5 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full font-bold hover:bg-obsidian-200 transition-colors"
              >
                View Wishlist
              </button>
            </div>
          </div>
        )}

        {/* 2. Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-2xl text-obsidian">Atelier Orders & Dispatches</h3>
              <Link
                to="/account/orders"
                className="text-xs uppercase font-mono tracking-widest text-gold-dark hover:underline font-bold"
              >
                View Full Archive →
              </Link>
            </div>

            {ordersLoading ? (
              <div className="p-12 text-center bg-pearl-50 rounded-3xl border border-champagne-300/50">
                <div className="w-8 h-8 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
                <p className="text-xs font-mono text-obsidian/60 mt-2">Loading Orders...</p>
              </div>
            ) : ordersList.length === 0 ? (
              <div className="p-8 text-center bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-4 shadow-sm">
                <Package className="w-8 h-8 mx-auto text-gold-dark" />
                <h3 className="font-serif-luxury text-2xl text-obsidian">No Active Orders Pending</h3>
                <p className="text-xs text-obsidian-soft max-w-sm mx-auto">
                  Your past parcels and newly placed bespoke dispatches will appear here with live tracking.
                </p>
                <Link to="/shop" className="inline-block btn-primary text-xs">
                  Explore The Collection
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {ordersList.slice(0, 3).map((ord) => (
                  <div
                    key={ord.id || ord.orderNumber}
                    className="p-5 sm:p-6 bg-pearl-50 rounded-3xl border border-champagne-300/50 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-champagne-300 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-obsidian">{ord.orderNumber}</span>
                        <span className="text-[10px] uppercase font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-full font-bold">
                          {ord.fulfillmentStatus.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="font-serif text-sm text-obsidian line-clamp-1">
                        {ord.items.map((i) => i.title).join(', ')}
                      </p>
                      <p className="text-[11px] text-obsidian/60 font-sans">
                        Placed on {new Date(ord.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="font-mono text-base font-bold text-gold-dark">₹{ord.total}</span>
                      <Link
                        to={`/account/orders/${ord.orderNumber}`}
                        className="px-4 py-2 bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-wider font-bold rounded-full hover:bg-obsidian-200"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 2b. Delivery Tracking Tab */}
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <div className="p-8 bg-pearl-50 rounded-3xl border border-champagne-300/60 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-4">
                <div>
                  <h3 className="font-serif-luxury text-2xl text-obsidian">Live Parcel Tracking</h3>
                  <p className="text-xs text-obsidian/60 font-sans">
                    Track any active Mumbai Atelier dispatch or Pan-India express cargo.
                  </p>
                </div>

                <Link
                  to="/order-tracking"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-wider font-bold hover:bg-obsidian-200 transition-all shadow-sm"
                >
                  <Truck className="w-3.5 h-3.5 text-champagne-300" />
                  <span>Open Dedicated Tracking Center</span>
                </Link>
              </div>

              {ordersList.length > 0 ? (
                <div className="space-y-3">
                  <span className="text-[10px] font-mono uppercase text-gold-dark font-bold block">
                    Your Active Dispatches ({ordersList.length})
                  </span>
                  {ordersList.map((ord) => (
                    <div
                      key={ord.orderNumber}
                      className="p-4 bg-white/90 rounded-2xl border border-champagne-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-obsidian">{ord.orderNumber}</span>
                          <span className="text-xs text-obsidian/50 font-mono">Carrier: {ord.carrier}</span>
                        </div>
                        <p className="text-xs text-obsidian/70 font-sans mt-0.5">
                          Estimated: <strong>{ord.estimatedDelivery?.estimatedDateFormatted || 'In Transit'}</strong> ({ord.estimatedDelivery?.expectedTimeWindow || '10:00 AM – 8:00 PM IST'})
                        </p>
                      </div>

                      <Link
                        to={`/order-tracking?id=${ord.orderNumber}`}
                        className="px-4 py-2 rounded-full border border-champagne-300 bg-pearl-50 hover:bg-champagne-100 text-xs font-mono font-bold uppercase text-obsidian transition-all self-start sm:self-auto"
                      >
                        Track Milestone →
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 space-y-3">
                  <p className="text-xs text-obsidian/60">No parcels currently in transit for your account.</p>
                  <Link to="/order-tracking" className="text-xs font-mono font-bold text-gold-dark underline">
                    Enter a tracking number manually →
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-2xl text-obsidian">Delivery Destinations</h3>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-wider font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
              </button>
            </div>

            {isAddingAddress && (
              <form onSubmit={handleSaveAddress} className="p-6 bg-pearl-50 rounded-3xl border border-champagne-300/60 space-y-4 max-w-xl shadow-sm">
                <h4 className="font-serif text-lg text-obsidian font-bold">New Delivery Address</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono text-obsidian font-bold">Address Label</label>
                    <input
                      type="text"
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      placeholder="Home, Office, Studio"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-champagne-300 text-xs text-obsidian focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono text-obsidian font-bold">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={newAddress.pincode}
                      onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                      placeholder="400050"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-champagne-300 text-xs text-obsidian focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-mono text-obsidian font-bold">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={newAddress.street}
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
                      setNewAddress(prev => ({ ...prev, street: sanitizeAddressText(prev.street + clean) }));
                    }}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const clean = sanitizeAddressText(e.currentTarget.value);
                      e.currentTarget.value = clean;
                      setNewAddress(prev => ({ ...prev, street: clean }));
                    }}
                    onChange={(e) => setNewAddress({ ...newAddress, street: sanitizeAddressText(e.target.value) })}
                    placeholder="Building, Flat, Street, Area"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-champagne-300 text-xs text-obsidian focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono text-obsidian font-bold">City</label>
                    <input
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-champagne-300 text-xs text-obsidian focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-mono text-obsidian font-bold">State</label>
                    <input
                      type="text"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-champagne-300 text-xs text-obsidian focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-obsidian text-pearl-100 rounded-full text-xs uppercase tracking-widest font-bold hover:bg-obsidian-200 transition-colors"
                >
                  Save Address
                </button>
              </form>
            )}

            {user.savedAddresses.length === 0 ? (
              <div className="p-8 text-center bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-2">
                <MapPin className="w-6 h-6 mx-auto text-gold-dark" />
                <p className="text-xs text-obsidian font-medium">No saved addresses yet.</p>
                <p className="text-xs text-obsidian-soft">Save your Mumbai or Pan-India address for 1-click express checkout.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr) => (
                  <div key={addr.id} className="p-5 bg-pearl-50 rounded-2xl border border-champagne-300/60 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-mono font-bold text-obsidian">{addr.label}</span>
                      {addr.isDefault && <LuxuryBadge variant="gold">Default</LuxuryBadge>}
                    </div>
                    <p className="text-xs text-obsidian">{addr.street}</p>
                    <p className="text-xs text-obsidian-soft font-mono">{addr.city}, {addr.state} — {addr.pincode}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. Wishlist Tab */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            {wishlistedItems.length === 0 ? (
              <div className="p-8 text-center bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-3">
                <Heart className="w-8 h-8 mx-auto text-gold-dark" />
                <h3 className="font-serif-luxury text-2xl text-obsidian">No Saved Pieces</h3>
                <p className="text-xs text-obsidian-soft max-w-sm mx-auto">
                  Tap the heart icon on any piece across the runway to save it here.
                </p>
                <Link to="/shop" className="inline-block btn-primary text-xs">
                  Browse The Collection
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {wishlistedItems.map((prod) => (
                  <div key={prod.id} className="bg-pearl-50 rounded-3xl overflow-hidden border border-champagne-300/60 p-4 space-y-3 flex flex-col justify-between shadow-sm">
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-sand">
                      <img src={prod.images.hero} alt={prod.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        className="absolute top-2 right-2 p-1.5 bg-pearl-50 rounded-full text-rose-600 shadow-sm"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-bold text-obsidian truncate">{prod.title}</h4>
                      <span className="font-serif text-base font-bold text-obsidian">₹{prod.price}</span>
                    </div>
                    <button
                      onClick={() => {
                        addToCart(prod, 1);
                        showToast(`Added ${prod.title} to Bag ✨`);
                      }}
                      className="w-full h-9 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full font-bold flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Bag</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 5. Preferences */}
        {activeTab === 'preferences' && (
          <div className="p-6 bg-pearl-50 rounded-3xl border border-champagne-300/50 space-y-4 max-w-xl shadow-sm">
            <h3 className="font-serif text-xl text-obsidian font-bold">Atelier Communication</h3>
            <div className="space-y-3 text-xs text-obsidian">
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-obsidian w-4 h-4 rounded" />
                <span>WhatsApp dispatches and delivery updates</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" defaultChecked className="accent-obsidian w-4 h-4 rounded" />
                <span>Private Circle seasonal drops and secret archive codes</span>
              </label>
            </div>
            <button
              onClick={() => showToast("Preferences updated ✨")}
              className="px-5 py-2.5 bg-obsidian text-pearl-100 rounded-full text-xs uppercase tracking-widest font-bold"
            >
              Update Preferences
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
