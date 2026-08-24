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
  Mail,
  Printer,
  RefreshCw,
  Send,
  ExternalLink,
  Phone,
  CreditCard,
} from 'lucide-react';
import { getOrderById } from '../services/orderService';
import { sendOrderConfirmationEmail, buildOrderInvoiceText } from '../services/emailService';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';
import { formatOrderDateIST, formatOrderTimeIST, formatTimelineStampIST } from '../utils/dateIST';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const stateOrder = location.state?.order as OrderMetadata | undefined;

  const [order, setOrder] = useState<OrderMetadata | null>(stateOrder || null);
  const [loading, setLoading] = useState<boolean>(!stateOrder);
  const [emailStatus, setEmailStatus] = useState<'sent' | 'resending' | 'resent'>('sent');

  // Trigger celebration confetti on mount
  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
        colors: ['#D8C39A', '#181411', '#FAF7F0', '#C5A880', '#10B981'],
      });
    } catch {}
  }, []);

  // Fetch order data if not passed in route state & automatically trigger background email
  useEffect(() => {
    if (!order && orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then((fetched) => {
          setOrder(fetched);
          if (fetched) {
            sendOrderConfirmationEmail(fetched).catch(() => {});
          }
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (order) {
      sendOrderConfirmationEmail(order).catch(() => {});
    }
  }, [orderId, order]);

  const handleResendEmail = async () => {
    if (!order) return;
    setEmailStatus('resending');
    try {
      await sendOrderConfirmationEmail(order);
      setEmailStatus('resent');
      setTimeout(() => setEmailStatus('sent'), 3500);
    } catch {
      setEmailStatus('sent');
    }
  };

  const handleOpenGmail = () => {
    if (!order) return;
    const subject = `✨ Celestia Order Confirmed: ${order.orderNumber} - ₹${order.total}`;
    const body = buildOrderInvoiceText(order);
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      order.customer.email
    )}&cc=${encodeURIComponent(BRAND_INFO.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, '_blank');
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
          <p className="font-serif text-sm text-obsidian/70">
            A copy of your parcel confirmation has been dispatched to your email.
          </p>
        </div>
      </div>
    );
  }

  // Fallback if order not found
  if (!order) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-champagne-300/70 shadow-luxury-soft text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-champagne-100 flex items-center justify-center mx-auto text-gold-dark">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-obsidian uppercase">Order Information</h2>
            <p className="text-xs text-obsidian/70">
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

  const timelineSteps = [
    {
      title: 'Order Confirmed',
      timestamp: formatTimelineStampIST(orderDate),
      description: 'Order placed & payment captured in Bandra studio queue.',
      status: 'completed',
    },
    {
      title: 'Studio Packed & Sealed',
      timestamp: `${formatOrderDateIST(packDate)} • By ${formatOrderTimeIST(packDate)}`,
      description: 'Hand-inspected under coastal daylight with anti-tarnish wax seal.',
      status: ['packed', 'shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) ? 'completed' : 'pending',
    },
    {
      title: 'Handed to Express Courier',
      timestamp: `${formatOrderDateIST(shipDate)} • By ${formatOrderTimeIST(shipDate)}`,
      description: 'Airway bill assigned and dispatched via express air cargo.',
      status: ['shipped', 'out_for_delivery', 'delivered'].includes(order.fulfillmentStatus) ? 'completed' : 'pending',
    },
    {
      title: 'Doorstep Handover',
      timestamp: `${order.estimatedDelivery?.estimatedDateFormatted || formatOrderDateIST(outDeliveryDate)}`,
      description: 'Contactless signature verified delivery at destination.',
      status: order.fulfillmentStatus === 'delivered' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* TOP CELEBRATION & EMAIL DISPATCH CONFIRMATION CARD                         */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-champagne-300/80 shadow-luxury-soft p-6 sm:p-8 space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 animate-scale-up" />
          </div>

          <div className="space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-800 text-[10px] sm:text-xs font-mono font-bold border border-emerald-300 uppercase tracking-widest">
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Order Confirmed • #{order.orderNumber}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-obsidian uppercase leading-tight">
              Thank You, <span className="font-semibold text-gold-dark">{order.customer.name.split(' ')[0]}</span>.
            </h1>

            <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
              Your handcrafted pieces are now queued for inspection at our Mumbai Atelier.
            </p>
          </div>

          {/* Automated Email Dispatch & 1-Click Gmail Action */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sand/40 border border-champagne-300/70 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-left">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200 shadow-xs">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-obsidian flex items-center gap-1.5">
                  <span>Order Confirmation & Tax Invoice Linked</span>
                  <span className="text-[9px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                    {emailStatus === 'resending' ? 'Dispatching...' : 'Delivered'}
                  </span>
                </p>
                <p className="text-[11px] text-obsidian-soft">
                  Linked to <strong className="text-obsidian">{order.customer.email}</strong> & Atelier Desk ({BRAND_INFO.email})
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 justify-end">
              <button
                onClick={handleOpenGmail}
                className="px-4 py-2 rounded-full bg-emerald-800 hover:bg-emerald-900 text-pearl-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                title="Open formatted confirmation in Gmail"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open in Gmail</span>
              </button>

              <button
                onClick={handleResendEmail}
                disabled={emailStatus === 'resending'}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-champagne-100 text-obsidian border border-champagne-300/80 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${emailStatus === 'resending' ? 'animate-spin' : ''}`} />
                <span>{emailStatus === 'resent' ? 'Sent!' : 'Resend'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-full border border-champagne-300/80 bg-white hover:bg-champagne-100 text-obsidian transition-colors shadow-xs"
                title="Print Official Invoice"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* UNIFIED 2-COLUMN LUXURY INVOICE & ORDER DETAILS GRID                      */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ======================================================================= */}
          {/* LEFT: ITEMS PURCHASED & ADDRESS (7 Cols)                                */}
          {/* ======================================================================= */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Items Purchased Box */}
            <div className="bg-white rounded-3xl border border-champagne-300/70 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-champagne-300/40 pb-3">
                <h3 className="text-base font-bold text-obsidian uppercase">
                  Atelier Pieces ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
                </h3>
                <span className="text-[11px] font-mono text-gold-dark font-semibold">
                  Natural Daylight Inspection
                </span>
              </div>

              <div className="divide-y divide-champagne-200/60">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-16 h-16 rounded-2xl object-cover border border-champagne-300/60 bg-sand shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-sand flex items-center justify-center text-gold-dark shrink-0">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      )}

                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-obsidian capitalize leading-tight">
                          {item.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="font-mono font-bold text-obsidian bg-champagne-100 px-2 py-0.5 rounded-full text-[10px]">
                            Qty: {item.quantity}
                          </span>
                          {item.boxType && (
                            <span className="text-[11px] text-gold-dark font-semibold">
                              • {item.boxType}
                            </span>
                          )}
                        </div>
                        {item.customNotes && (
                          <p className="text-[10px] text-obsidian/75 bg-pearl-50 px-2 py-0.5 rounded border border-champagne-200 inline-block font-serif font-medium">
                            "{item.customNotes}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-sm sm:text-base font-bold text-obsidian font-mono">
                        ₹{item.price * item.quantity}
                      </span>
                      <span className="text-[10px] text-obsidian-soft block font-mono">
                        (₹{item.price} each)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destination & Unboxing Guidelines (2-Grid inside Left Column) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Destination Address */}
              <div className="p-5 rounded-2xl bg-white border border-champagne-300/70 shadow-xs space-y-2">
                <span className="text-[10px] uppercase font-mono font-bold text-gold-dark flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Delivery Destination</span>
                </span>
                <p className="text-xs font-bold text-obsidian">{order.customer.name}</p>
                <p className="text-xs text-obsidian-soft leading-relaxed">{order.customer.address}</p>
                <p className="text-[11px] font-mono text-obsidian/60 pt-1 border-t border-champagne-200">
                  Phone: {order.customer.phone}
                </p>
              </div>

              {/* Unboxing Policy */}
              <div className="p-5 rounded-2xl bg-champagne-100/60 border border-champagne-300/70 shadow-xs space-y-2 text-obsidian/85">
                <span className="text-[10px] uppercase font-mono font-bold text-gold-dark flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5" />
                  <span>Unboxing & Warranty</span>
                </span>
                <p className="text-[11px] leading-relaxed">
                  All Celestia parcels are sealed with anti-tarnish metallic wax. Please record an uncut opening video to validate our 7-day guarantee.
                </p>
              </div>

            </div>

          </div>

          {/* ======================================================================= */}
          {/* RIGHT: FINANCIAL SUMMARY, TIMELINE & ACTIONS (5 Cols)                   */}
          {/* ======================================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Financial Summary Card */}
            <div className="bg-white rounded-3xl border border-champagne-300/80 shadow-luxury-soft p-6 space-y-4">
              <h3 className="text-base font-bold text-obsidian uppercase border-b border-champagne-300/40 pb-3">
                Payment Breakdown
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-obsidian-soft">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-obsidian">₹{order.subtotal}</span>
                </div>

                <div className="flex justify-between text-obsidian-soft">
                  <span>Shipping ({order.shippingMethod.split(' ')[0]})</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-champagne-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-obsidian uppercase">Total Paid</span>
                  <span className="text-2xl font-bold text-obsidian font-mono">
                    ₹{order.total}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 font-mono font-semibold flex items-center justify-between">
                  <span>Status: {order.financialStatus.toUpperCase()}</span>
                  <span>{order.paymentMethod}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <Link
                  to={`/order-tracking?id=${order.orderNumber}`}
                  className="btn-primary w-full h-11 text-xs uppercase font-bold tracking-widest flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Truck className="w-4 h-4" />
                  <span>Track Live Delivery</span>
                </Link>

                <Link
                  to="/account/orders"
                  className="w-full h-10 border border-champagne-400 bg-white hover:bg-champagne-100 text-obsidian text-xs uppercase font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <Package className="w-3.5 h-3.5" />
                  <span>View in Account</span>
                </Link>

                <Link
                  to="/shop"
                  className="w-full text-center block text-xs font-bold text-gold-dark hover:text-obsidian transition-colors uppercase tracking-wider py-1"
                >
                  <span>Explore More Pieces →</span>
                </Link>
              </div>
            </div>

            {/* Delivery Timeline Card */}
            <div className="bg-white rounded-3xl border border-champagne-300/70 shadow-sm p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-champagne-300/40 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-obsidian uppercase">Delivery Progress</h4>
                  <p className="text-[10px] text-obsidian-soft font-mono">Courier: {order.carrier}</p>
                </div>
                <span className="text-[10px] font-mono font-bold bg-champagne-100 text-obsidian px-2.5 py-1 rounded-full">
                  {order.trackingNumber}
                </span>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-champagne-300">
                {timelineSteps.map((step, idx) => {
                  const isCompleted = step.status === 'completed';
                  return (
                    <div key={idx} className="relative flex items-start gap-3">
                      <div
                        className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ring-4 ring-white ${
                          isCompleted
                            ? 'bg-emerald-700 text-white shadow-xs'
                            : 'bg-pearl-100 text-obsidian/40 border border-champagne-300'
                        }`}
                      >
                        {isCompleted ? '✓' : '○'}
                      </div>
                      <div className="space-y-0.5 flex-1">
                        <div className="flex justify-between items-baseline gap-1">
                          <p className={`text-xs ${isCompleted ? 'font-bold text-obsidian' : 'font-medium text-obsidian/60'}`}>
                            {step.title}
                          </p>
                          <span className={`text-[10px] font-mono ${isCompleted ? 'text-emerald-800 font-bold' : 'text-gold-dark'}`}>
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-obsidian-soft leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct WhatsApp Concierge Help */}
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-300/60 text-center">
              <a
                href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20regarding%20my%20Order%20${order.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-950 hover:underline"
              >
                <MessageCircle className="w-4 h-4 text-emerald-700" />
                <span>Need rush dispatch? Chat with Mumbai Atelier Desk</span>
              </a>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
