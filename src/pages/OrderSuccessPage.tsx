import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Package,
  Truck,
  Sparkles,
  Calendar,
  Clock,
  ArrowRight,
  ShoppingBag,
  ExternalLink,
  MessageCircle,
  Video,
  ShieldCheck,
  MapPin,
} from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const stateOrder = location.state?.order as OrderMetadata | undefined;

  const [order, setOrder] = useState<OrderMetadata | null>(stateOrder || null);
  const [loading, setLoading] = useState<boolean>(!stateOrder);

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#D8C39A', '#181411', '#FAF7F0', '#C5A880'],
      });
    } catch {}
  }, []);

  // Fetch order data if not passed in route state
  useEffect(() => {
    if (!order && orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then((fetched) => {
          setOrder(fetched);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId, order]);

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
          <p className="font-serif italic text-sm text-obsidian/70">
            Retrieving Atelier Order Confirmation...
          </p>
        </div>
      </div>
    );
  }

  // Fallback if order not found
  if (!order) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-pearl-50/95 p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian uppercase">Order Information</h2>
            <p className="text-xs text-obsidian/70 font-sans">
              We couldn't locate this specific order in the active session. You can review all your dispatches in your account.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/account/orders"
              className="w-full py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="w-full py-3 rounded-full border border-champagne-300/80 bg-white text-obsidian text-xs uppercase font-mono tracking-widest font-bold hover:bg-champagne-100 transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const timelineSteps = [
    { label: 'Confirmed', desc: 'Order verified in Mumbai Atelier', done: true },
    { label: 'Packed', desc: 'Anti-tarnish wax sealed in Bandra', done: order.fulfillmentStatus !== 'confirmed' },
    { label: 'Shipped', desc: 'Airway bill assigned to courier', done: ['shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) },
    { label: 'Out for Delivery', desc: 'Courier reaching recipient', done: ['out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) },
    { label: 'Delivered', desc: 'Contactless doorstep handover', done: order.fulfillmentStatus === 'delivered' },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-32 px-4 sm:px-6 md:px-10 lg:px-16 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ========================================================================= */}
        {/* HERO CONFIRMATION CARD                                                   */}
        {/* ========================================================================= */}
        <div className="bg-pearl-50/98 p-6 sm:p-10 md:p-12 rounded-3xl border border-champagne-300/80 shadow-2xl space-y-6 text-center">
          
          <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 animate-scale-up" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-champagne-100/80 border border-champagne-300/80 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gold-dark font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Order Confirmed • Mumbai Atelier Queue</span>
            </div>
            
            <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-obsidian uppercase">
              THANK YOU, <span className="italic font-light text-gold-dark">{order.customer.name.split(' ')[0]}</span>.
            </h1>
            
            <p className="text-xs sm:text-sm text-obsidian/70 font-sans max-w-lg mx-auto leading-relaxed">
              Your handcrafted pieces have been assigned to our Bandra West artisans. A receipt and dispatch updates have been transmitted to <strong>{order.customer.email}</strong>.
            </p>
          </div>

          {/* Key Metadata Pill Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white/90 rounded-2xl border border-champagne-300/60 text-left text-xs">
            <div>
              <span className="text-[10px] uppercase font-mono text-obsidian/50 block">Order Number</span>
              <span className="font-mono font-bold text-obsidian text-sm">{order.orderNumber}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-obsidian/50 block">Placed Date</span>
              <span className="font-sans font-medium text-obsidian text-xs">
                {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-obsidian/50 block">Payment</span>
              <span className="font-mono font-bold text-emerald-800 text-xs">
                {order.financialStatus.toUpperCase()} • {order.paymentMethod.split(' ')[0]}
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-mono text-obsidian/50 block">Total Amount</span>
              <span className="font-mono font-bold text-gold-dark text-sm">₹{order.total}</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ESTIMATED DELIVERY PROMISE BANNER                                         */}
          {/* ========================================================================= */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-champagne-100/90 via-pearl-50 to-champagne-100/90 rounded-2xl border border-champagne-300/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-left shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-gold-dark">
                <Clock className="w-4 h-4 text-gold-dark" />
                <span>Estimated Delivery Window</span>
              </div>
              <p className="font-serif-luxury text-xl sm:text-2xl text-obsidian font-bold">
                {order.estimatedDelivery?.formattedRange || '2 — 3 Business Days'}
              </p>
              <p className="text-xs text-obsidian/70 font-sans">
                {order.shippingMethod} • {order.carrier}
              </p>
            </div>

            <Link
              to={`/order-tracking?id=${order.orderNumber}`}
              className="px-6 py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all flex items-center gap-2 shrink-0 shadow-md"
            >
              <Truck className="w-4 h-4 text-champagne-300" />
              <span>Track Live Delivery</span>
            </Link>
          </div>

          {/* ========================================================================= */}
          {/* 5-STAGE DELIVERY TIMELINE                                                 */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-4 border-t border-champagne-300/40 text-left">
            <h3 className="font-serif-luxury text-lg text-obsidian font-semibold flex items-center gap-2">
              <Package className="w-4 h-4 text-gold-dark" />
              <span>Dispatch Timeline</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              {timelineSteps.map((step, idx) => (
                <div
                  key={idx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    step.done
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 shadow-sm'
                      : 'bg-white/60 border-champagne-200/70 text-obsidian/50'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        step.done ? 'bg-emerald-700 text-white' : 'bg-champagne-200 text-obsidian/60'
                      }`}
                    >
                      {step.done ? '✓' : idx + 1}
                    </div>
                    <span className="font-serif font-bold text-xs">{step.label}</span>
                  </div>
                  <p className="text-[11px] font-sans leading-tight opacity-80">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PIECES PURCHASED LIST                                                     */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-4 border-t border-champagne-300/40 text-left">
            <h3 className="font-serif-luxury text-lg text-obsidian font-semibold flex items-center justify-between">
              <span>Pieces in this Curation ({order.items.length})</span>
              <span className="text-xs font-mono text-obsidian/60 font-normal">Inspected under natural daylight</span>
            </h3>

            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/95 rounded-2xl border border-champagne-300/50 shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover border border-champagne-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-champagne-100 flex items-center justify-center text-gold-dark shrink-0">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-0.5">
                      <h4 className="font-serif text-base text-obsidian font-semibold">{item.title}</h4>
                      <div className="flex flex-wrap gap-2 text-xs text-obsidian/70 font-sans">
                        <span>Qty: {item.quantity}</span>
                        {item.boxType && (
                          <>
                            <span>•</span>
                            <span className="text-gold-dark font-medium">{item.boxType}</span>
                          </>
                        )}
                      </div>
                      {item.customNotes && (
                        <p className="text-[11px] italic text-obsidian/60 font-sans bg-pearl-100 px-2 py-0.5 rounded inline-block mt-1">
                          Note: "{item.customNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right sm:self-center font-mono font-bold text-obsidian text-base">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="p-4 bg-white/70 rounded-2xl border border-champagne-200 text-xs font-sans space-y-1.5 max-w-sm ml-auto">
              <div className="flex justify-between text-obsidian/70">
                <span>Subtotal</span>
                <span className="font-mono">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-obsidian/70">
                <span>Delivery ({order.shippingMethod.split(' ')[0]})</span>
                <span className="font-mono">
                  {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
                </span>
              </div>
              <div className="flex justify-between text-obsidian font-bold text-sm pt-2 border-t border-champagne-200">
                <span>Total Paid</span>
                <span className="font-mono text-gold-dark">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SHIPPING DESTINATION & UNBOXING REMINDER                                  */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-xs font-sans pt-4 border-t border-champagne-300/40">
            <div className="p-4 bg-white rounded-2xl border border-champagne-300/50 space-y-1">
              <span className="text-[10px] uppercase font-mono text-gold-dark font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Destination Address
              </span>
              <p className="font-semibold text-obsidian">{order.customer.name}</p>
              <p className="text-obsidian/70">{order.customer.address}</p>
              <p className="text-[11px] text-obsidian/50 font-mono">Contact: {order.customer.phone}</p>
            </div>

            <div className="p-4 bg-champagne-100/60 rounded-2xl border border-champagne-300/50 space-y-1 text-obsidian/80">
              <span className="text-[10px] uppercase font-mono text-gold-dark font-bold flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Unboxing Video Policy
              </span>
              <p className="text-[11px] leading-relaxed">
                All Celestia parcels are packed with signature anti-tarnish wax seals. Please take an uncut video when opening for warranty claims.
              </p>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* PRIMARY ACTION BUTTONS                                                    */}
          {/* ========================================================================= */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6 border-t border-champagne-300/40">
            <Link
              to={`/order-tracking?id=${order.orderNumber}`}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4 text-champagne-300" />
              <span>Track Live Delivery</span>
            </Link>

            <Link
              to="/account/orders"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-champagne-300/80 bg-white hover:bg-champagne-100/60 text-obsidian text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>View in Account</span>
            </Link>

            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-champagne-300/80 bg-pearl-50 hover:bg-champagne-100/60 text-obsidian text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* WhatsApp Support Assistance */}
          <div className="pt-2">
            <a
              href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20regarding%20my%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-800 hover:text-emerald-950 underline"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Need help or want to add a rush request? Chat with our Atelier Concierge on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
