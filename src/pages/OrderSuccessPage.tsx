import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
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
  Video,
  ShieldCheck,
  MapPin,
  Check,
  Mail,
  Printer,
  Download,
  FileText,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { WhatsAppIcon } from '../components/ui/WhatsAppIcon';
import { getOrderById } from '../services/orderService';
import { sendOrderConfirmationEmail } from '../services/emailService';
import { downloadOrderInvoicePDF } from '../services/pdfInvoiceService';
import { OrderMetadata } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';
import { formatOrderDateIST, formatOrderTimeIST } from '../utils/dateIST';

// 6-Stage Linear Progress Stages
const SIX_STAGE_STEPS = [
  { id: 'placed', label: 'ORDER PLACED' },
  { id: 'confirmed', label: 'CONFIRMED' },
  { id: 'preparing', label: 'PREPARING' },
  { id: 'shipped', label: 'SHIPPED' },
  { id: 'out_for_delivery', label: 'OUT FOR DELIVERY' },
  { id: 'delivered', label: 'DELIVERED' },
];

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateOrder = location.state?.order as OrderMetadata | undefined;

  const [order, setOrder] = useState<OrderMetadata | null>(stateOrder || null);
  const [loading, setLoading] = useState<boolean>(!stateOrder);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

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

  // Fetch order data if not passed in route state & dispatch email once
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

  const handleDownloadInvoice = () => {
    if (!order) return;
    setIsDownloadingPdf(true);
    try {
      downloadOrderInvoicePDF(order);
    } catch (e) {
      console.error('PDF download error:', e);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 1000);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
          <p className="font-serif text-sm text-obsidian/70">
            Confirming your order in Mumbai Atelier queue...
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
            <h2 className="text-2xl font-bold text-obsidian font-serif-luxury">Order Reference Not Found</h2>
            <p className="text-xs text-obsidian/70">
              We couldn't locate reference "{orderId}". You can check your recent orders in your account portal.
            </p>
          </div>
          <div className="flex flex-col gap-2.5">
            <Link
              to="/account/orders"
              className="w-full py-3.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all text-center"
            >
              View My Orders
            </Link>
            <Link
              to="/shop"
              className="w-full py-3.5 rounded-full border border-champagne-300/80 bg-white text-obsidian text-xs uppercase font-mono tracking-widest font-bold hover:bg-champagne-100 transition-all text-center"
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

  const deliveryDayDate = order.estimatedDelivery?.estimatedDateFormatted || '2-3 Business Days';
  const deliveryTimeWindow = order.shippingMethod.toLowerCase().includes('same-day')
    ? 'Today by 8:00 PM'
    : '10:00 AM – 1:00 PM';

  // Map order fulfillment status to the 6-stage tracker
  const getStageIndex = (status: string) => {
    switch (status) {
      case 'placed':
        return 0;
      case 'confirmed':
        return 1;
      case 'packed':
      case 'preparing':
        return 2;
      case 'shipped':
        return 3;
      case 'out_for_delivery':
        return 4;
      case 'delivered':
        return 5;
      default:
        return 1; // Default to 'CONFIRMED' for newly confirmed orders
    }
  };

  const currentStageIndex = getStageIndex(order.fulfillmentStatus);

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 pb-28 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* ========================================================================= */}
        {/* 1. TOP ORDER CONFIRMED LUXURY BANNER                                      */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-champagne-300/80 shadow-luxury-soft p-6 sm:p-10 space-y-6 text-center">
          
          <div className="w-16 h-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-9 h-9 animate-scale-up" />
          </div>

          <div className="space-y-3 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100/90 text-emerald-800 text-xs font-mono font-bold border border-emerald-300 uppercase tracking-widest">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>ORDER CONFIRMED ✓</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-obsidian font-serif-luxury leading-tight">
              Thank you, <span className="text-gold-dark">{order.customer.name}</span>
            </h1>

            <p className="text-xs sm:text-sm font-mono font-bold text-obsidian/70">
              ORDER #{order.orderNumber}
            </p>
            
            <p className="text-xs text-obsidian-soft">
              Placed on {formattedOrderDate} • {formattedOrderTime}
            </p>
          </div>

          {/* Prominent Estimated Delivery Box */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50 via-pearl-50 to-emerald-50 border border-emerald-300/80 max-w-lg mx-auto shadow-xs text-center space-y-1">
            <span className="text-[11px] uppercase font-mono tracking-widest text-emerald-800 font-bold block">
              Estimated Delivery
            </span>
            <p className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif-luxury">
              {deliveryDayDate}
            </p>
            <p className="text-xs font-mono font-semibold text-emerald-800">
              {deliveryTimeWindow}
            </p>
          </div>

          {/* ======================================================================= */}
          {/* 2. SIMPLE REALISTIC 6-STAGE PROGRESS TRACKER                            */}
          {/* ======================================================================= */}
          <div className="pt-4 border-t border-champagne-200/80 space-y-4 text-left">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-mono tracking-wider text-obsidian-soft font-bold">
                Order Fulfillment Progress
              </span>
              <span className="text-xs font-mono text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold uppercase">
                {SIX_STAGE_STEPS[currentStageIndex].label}
              </span>
            </div>

            {/* Linear Stage Pipeline */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {SIX_STAGE_STEPS.map((step, idx) => {
                const isPassed = idx < currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const isPending = idx > currentStageIndex;

                return (
                  <div
                    key={step.id}
                    className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center space-y-1 transition-all ${
                      isCurrent
                        ? 'bg-obsidian border-gold-dark text-pearl-100 shadow-md ring-1 ring-gold-dark'
                        : isPassed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-pearl-50/60 border-champagne-200 text-obsidian/40 opacity-70'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-gold-dark text-obsidian'
                          : isPassed
                          ? 'bg-emerald-700 text-white'
                          : 'bg-champagne-200 text-obsidian/50'
                      }`}
                    >
                      {isPassed ? '✓' : idx + 1}
                    </div>
                    <span className="text-[9px] font-mono font-bold tracking-tight leading-tight">
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-obsidian-soft italic text-center sm:text-left">
              * Active status: <strong>{SIX_STAGE_STEPS[currentStageIndex].label}</strong>. We will notify you via email and WhatsApp as your parcel progresses.
            </p>
          </div>

          {/* ======================================================================= */}
          {/* 3. 4 KEY ACTION BUTTONS                                                 */}
          {/* ======================================================================= */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-w-3xl mx-auto">
            <Link
              to={`/orders/${order.orderNumber}`}
              className="py-3.5 px-4 rounded-full bg-obsidian text-pearl-100 hover:bg-obsidian-200 transition-all text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <FileText className="w-4 h-4 text-gold-dark" />
              <span>VIEW ORDER</span>
            </Link>

            <Link
              to={`/order-tracking?id=${order.orderNumber}`}
              className="py-3.5 px-4 rounded-full bg-champagne-100 hover:bg-gold-dark hover:text-pearl-50 text-obsidian border border-champagne-300 transition-all text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-xs"
            >
              <Truck className="w-4 h-4" />
              <span>TRACK ORDER</span>
            </Link>

            <button
              onClick={handleDownloadInvoice}
              disabled={isDownloadingPdf}
              className="py-3.5 px-4 rounded-full bg-white hover:bg-champagne-100 text-obsidian border border-champagne-400 transition-all text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <Download className={`w-4 h-4 text-gold-dark ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
              <span>{isDownloadingPdf ? 'GENERATING...' : 'DOWNLOAD INVOICE'}</span>
            </button>

            <Link
              to="/shop"
              className="py-3.5 px-4 rounded-full border border-champagne-300/80 bg-pearl-50 hover:bg-pearl-100 text-obsidian transition-all text-xs font-mono uppercase font-bold tracking-wider flex items-center justify-center gap-2"
            >
              <span>CONTINUE SHOPPING</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 4. ITEMISED PRODUCTS & SUMMARY CARD                                       */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl border border-champagne-300/70 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-champagne-200 pb-3">
            <h3 className="text-base font-bold text-obsidian font-serif-luxury">
              Purchased Pieces ({order.items.reduce((acc, i) => acc + i.quantity, 0)})
            </h3>
            <span className="text-xs font-mono text-gold-dark font-bold">
              Bandra West Atelier
            </span>
          </div>

          {/* Product Items List */}
          <div className="divide-y divide-champagne-200/60">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
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
                    <h4 className="text-sm font-bold text-obsidian font-serif-luxury capitalize">
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
                      <p className="text-[10px] text-obsidian/75 bg-pearl-50 px-2 py-0.5 rounded border border-champagne-200 inline-block font-serif italic">
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

          {/* Delivery & Financial Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-champagne-200">
            
            {/* Delivery Address */}
            <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-200 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase font-mono font-bold text-gold-dark flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>Delivery Address</span>
              </span>
              <p className="font-bold text-obsidian">{order.customer.name}</p>
              <p className="text-obsidian-soft leading-relaxed">{order.customer.address}</p>
              <p className="text-[11px] font-mono text-obsidian/60 pt-1 border-t border-champagne-200/60">
                Phone: {order.customer.phone} • Email: {order.customer.email}
              </p>
            </div>

            {/* Financial Totals */}
            <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-200 space-y-2 text-xs">
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
              <div className="pt-2 border-t border-champagne-300 flex justify-between items-baseline">
                <span className="font-bold text-obsidian">Total Paid</span>
                <span className="font-mono font-bold text-xl text-gold-dark">
                  ₹{order.total}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100/70 px-2 py-1 rounded">
                <span>Payment: {order.paymentMethod}</span>
                <span>STATUS: {order.financialStatus.toUpperCase()}</span>
              </div>
            </div>

          </div>

          {/* WhatsApp Support Bar */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-950 font-medium">
              <WhatsAppIcon className="w-5 h-5 shrink-0" />
              <span>Need priority dispatch or address adjustments? Contact Mumbai Concierge</span>
            </div>
            <a
              href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20regarding%20my%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-pearl-100 text-xs font-mono font-bold shrink-0 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
