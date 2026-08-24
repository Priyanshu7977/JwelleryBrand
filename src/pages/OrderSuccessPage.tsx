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
  MessageCircle,
  Video,
  ShieldCheck,
  MapPin,
  Check,
  Circle,
} from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';
import { formatOrderDateIST, formatOrderTimeIST, formatTimelineStampIST } from '../utils/dateIST';

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
        particleCount: 90,
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

  const orderDate = new Date(order.createdAt);
  const formattedOrderDate = formatOrderDateIST(orderDate);
  const formattedOrderTime = formatOrderTimeIST(orderDate);

  const packDate = new Date(orderDate.getTime() + 2.5 * 3600 * 1000);
  const shipDate = new Date(orderDate.getTime() + 5.5 * 3600 * 1000);
  const outDeliveryDate = new Date(orderDate.getTime() + 48 * 3600 * 1000);
  const deliveredDate = new Date(orderDate.getTime() + 54 * 3600 * 1000);

  const timelineSteps = [
    {
      title: 'Order Confirmed',
      timestamp: formatTimelineStampIST(orderDate),
      description: 'Order placed & payment verified in Mumbai Atelier queue.',
      status: 'completed',
    },
    {
      title: 'Order Packed',
      timestamp: `${formatOrderDateIST(packDate)} • Estimated by ${formatOrderTimeIST(packDate)}`,
      description: 'Anti-tarnish wax seal applied with velvet box curation in Bandra.',
      status: ['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) ? 'completed' : 'pending',
    },
    {
      title: 'Order Shipped',
      timestamp: `${formatOrderDateIST(shipDate)} • Estimated by ${formatOrderTimeIST(shipDate)}`,
      description: 'Airway bill generated and handed over to express delivery network.',
      status: ['shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) ? 'completed' : 'pending',
    },
    {
      title: 'Out for Delivery',
      timestamp: `${formatOrderDateIST(outDeliveryDate)} • Expected between 10:00 AM – 1:00 PM`,
      description: 'Courier specialist dispatched for contactless doorstep handover.',
      status: ['out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) ? 'completed' : 'pending',
    },
    {
      title: 'Delivered',
      timestamp: `${order.estimatedDelivery?.estimatedDateFormatted || formatOrderDateIST(deliveredDate)} • Expected between 10:00 AM – 8:00 PM IST`,
      description: 'Signature verified and safely handed to recipient.',
      status: order.fulfillmentStatus === 'delivered' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-32 px-4 sm:px-6 md:px-10 lg:px-16 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* ========================================================================= */}
        {/* MAIN ORDER CONFIRMED LUXURY CARD                                          */}
        {/* ========================================================================= */}
        <div className="bg-pearl-50/98 p-6 sm:p-10 md:p-12 rounded-3xl border border-champagne-300/80 shadow-2xl space-y-8 text-center">
          
          {/* Top Check Icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10 animate-scale-up" />
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <span className="text-[11px] sm:text-xs uppercase font-mono tracking-widest text-emerald-800 bg-emerald-100/90 border border-emerald-300/80 px-4 py-1 rounded-full font-bold inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
              <span>ORDER CONFIRMED</span>
            </span>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-obsidian uppercase pt-2">
              THANK YOU, <span className="italic font-light text-gold-dark">{order.customer.name.split(' ')[0]}</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/70 font-sans max-w-lg mx-auto leading-relaxed">
              Your order has been confirmed and placed in our Bandra West studio queue. A confirmation receipt has been transmitted to <strong>{order.customer.email}</strong>.
            </p>
          </div>

          {/* ========================================================================= */}
          {/* ORDER DATE, TIME & ESTIMATED DELIVERY DETAILS                             */}
          {/* ========================================================================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            
            {/* Left: Order Date & Time in IST */}
            <div className="p-5 sm:p-6 bg-white/95 rounded-2xl border border-champagne-300/60 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold-dark font-bold">
                <Clock className="w-4 h-4 text-gold-dark" />
                <span>Order Placement Timestamp</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-obsidian/60 font-sans">Order Date:</span>
                  <span className="font-mono text-sm font-bold text-obsidian">{formattedOrderDate}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-obsidian/60 font-sans">Order Time:</span>
                  <span className="font-mono text-sm font-bold text-gold-dark">{formattedOrderTime}</span>
                </div>
                <div className="flex justify-between items-baseline pt-1 border-t border-champagne-200/60">
                  <span className="text-xs text-obsidian/60 font-sans">Order Number:</span>
                  <span className="font-mono text-sm font-bold text-obsidian">{order.orderNumber}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-obsidian/60 font-sans">Payment Status:</span>
                  <span className="font-mono text-xs font-bold text-emerald-800 uppercase bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    {order.financialStatus} • {order.paymentMethod}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Estimated Delivery & Expected Window in IST */}
            <div className="p-5 sm:p-6 bg-gradient-to-br from-champagne-100/90 to-pearl-50 rounded-2xl border border-champagne-300/80 shadow-sm space-y-2 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-gold-dark font-bold">
                  <Truck className="w-4 h-4 text-gold-dark" />
                  <span>Estimated Delivery</span>
                </div>
                <h3 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian font-bold">
                  {order.estimatedDelivery?.estimatedDateFormatted || formattedOrderDate}
                </h3>
                <p className="text-xs font-mono text-gold-dark font-bold">
                  {order.estimatedDelivery?.expectedTimeWindow || 'Expected between 10:00 AM – 8:00 PM IST'}
                </p>
              </div>

              <div className="pt-2 border-t border-champagne-300/50 flex items-center justify-between text-xs text-obsidian/70 font-sans">
                <span>{order.shippingMethod}</span>
                <span className="font-mono font-semibold text-obsidian">{order.carrier}</span>
              </div>
            </div>

          </div>

          {/* ========================================================================= */}
          {/* PREMIUM DELIVERY TIMELINE (EXACT VISUAL SPECIFICATION)                     */}
          {/* ========================================================================= */}
          <div className="p-6 sm:p-8 bg-white/95 rounded-2xl border border-champagne-300/60 shadow-sm space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-champagne-300/40 pb-4">
              <div>
                <h3 className="font-serif-luxury text-xl text-obsidian font-bold">
                  Delivery Timeline
                </h3>
                <p className="text-xs text-obsidian/60 font-sans">
                  Real-time milestone progression for {order.orderNumber}
                </p>
              </div>
              <span className="text-xs font-mono text-gold-dark font-semibold">
                Tracking: {order.trackingNumber}
              </span>
            </div>

            {/* Vertical Milestones */}
            <div className="relative pl-7 sm:pl-9 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-champagne-300">
              {timelineSteps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    {/* Checkmark or Circle Indicator */}
                    <div
                      className={`absolute -left-7 sm:-left-9 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ring-4 ring-pearl-50 ${
                        isCompleted
                          ? 'bg-emerald-700 text-white shadow-sm'
                          : 'bg-pearl-100 text-obsidian/40 border border-champagne-300'
                      }`}
                    >
                      {isCompleted ? '✓' : '○'}
                    </div>

                    <div className="space-y-0.5 flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h4
                          className={`font-serif text-base sm:text-lg ${
                            isCompleted ? 'text-obsidian font-bold' : 'text-obsidian/60 font-medium'
                          }`}
                        >
                          {isCompleted ? `✓ ${step.title}` : `○ ${step.title}`}
                        </h4>
                        <span
                          className={`font-mono text-xs sm:text-[13px] ${
                            isCompleted ? 'text-emerald-800 font-bold' : 'text-gold-dark font-semibold'
                          }`}
                        >
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian/65 font-sans leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* ITEMS PURCHASED & QUANTITIES SUMMARY                                      */}
          {/* ========================================================================= */}
          <div className="space-y-4 pt-4 border-t border-champagne-300/40 text-left">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-luxury text-xl text-obsidian font-bold">
                Items Purchased ({order.items.reduce((acc, i) => acc + i.quantity, 0)} items)
              </h3>
              <span className="text-xs font-mono text-obsidian/60">Inspected under natural daylight</span>
            </div>

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

                    <div className="space-y-1">
                      <h4 className="font-serif text-base text-obsidian font-semibold">{item.title}</h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs font-sans">
                        <span className="font-mono font-bold text-obsidian bg-champagne-100/70 px-2 py-0.5 rounded border border-champagne-300/50">
                          Quantity: {item.quantity}
                        </span>
                        {item.boxType && (
                          <span className="text-gold-dark font-medium">• {item.boxType}</span>
                        )}
                      </div>
                      {item.customNotes && (
                        <p className="text-[11px] italic text-obsidian/70 font-sans bg-pearl-100 px-2.5 py-1 rounded inline-block mt-1">
                          Custom Note: "{item.customNotes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right sm:self-center">
                    <span className="text-[10px] uppercase font-mono text-obsidian/50 block">Item Total</span>
                    <span className="font-mono font-bold text-obsidian text-base">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal, Shipping, Total Breakdown */}
            <div className="p-5 bg-white/90 rounded-2xl border border-champagne-300/60 text-xs font-sans space-y-2 max-w-sm ml-auto shadow-sm">
              <div className="flex justify-between text-obsidian/70">
                <span>Subtotal ({order.items.reduce((acc, i) => acc + i.quantity, 0)} items)</span>
                <span className="font-mono font-semibold text-obsidian">₹{order.subtotal}</span>
              </div>

              <div className="flex justify-between text-obsidian/70">
                <span>Shipping ({order.shippingMethod.split(' ')[0]})</span>
                <span className="font-mono font-semibold text-obsidian">
                  {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
                </span>
              </div>

              <div className="flex justify-between text-obsidian font-bold text-base pt-3 border-t border-champagne-200">
                <span>Total Paid</span>
                <span className="font-mono text-gold-dark text-lg">₹{order.total}</span>
              </div>

              <p className="text-[10px] font-mono text-emerald-800 text-right pt-1">
                ✓ Payment Verified & Captured
              </p>
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
              <p className="text-[11px] text-obsidian/50 font-mono">Phone: {order.customer.phone}</p>
            </div>

            <div className="p-4 bg-champagne-100/60 rounded-2xl border border-champagne-300/50 space-y-1 text-obsidian/80">
              <span className="text-[10px] uppercase font-mono text-gold-dark font-bold flex items-center gap-1">
                <Video className="w-3.5 h-3.5" /> Unboxing Video Policy
              </span>
              <p className="text-[11px] leading-relaxed">
                All Celestia parcels are packed with signature anti-tarnish wax seals. Please take an uncut video when opening for transit warranty claims.
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
              <span>Track Order</span>
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
              <span>Need to add a rush request or have a question? Chat with our Atelier Concierge on WhatsApp</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
