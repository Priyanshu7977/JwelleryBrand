import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  Video,
  MessageCircle,
  Package,
  ShoppingBag,
  Clock,
  MapPin,
  Sparkles,
  Check,
} from 'lucide-react';
import { BRAND_INFO } from '../data/shopify-data';
import { getOrderById } from '../services/orderService';
import { OrderMetadata } from '../types/backend';
import { formatOrderDateIST, formatOrderTimeIST, formatTimelineStampIST } from '../utils/dateIST';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      getOrderById(orderId)
        .then((res) => {
          setOrder(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-mono text-obsidian/60">Loading Order Details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full min-h-screen bg-pearl-100 pt-36 pb-32 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-pearl-50/95 p-8 rounded-3xl border border-champagne-300/60 shadow-luxury-soft text-center space-y-6">
          <Package className="w-10 h-10 text-gold-dark mx-auto" />
          <h2 className="font-serif-luxury text-2xl text-obsidian uppercase">Order Not Found</h2>
          <p className="text-xs text-obsidian/70">
            We could not find an order matching reference "{orderId}".
          </p>
          <Link
            to="/account/orders"
            className="inline-block px-6 py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.createdAt);
  const formattedDate = formatOrderDateIST(orderDate);
  const formattedTime = formatOrderTimeIST(orderDate);

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
      description: 'Anti-tarnish wax seal applied with custom velvet box packaging.',
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
      description: 'Safely delivered with contactless signature verification.',
      status: order.fulfillmentStatus === 'delivered' ? 'completed' : 'pending',
    },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian/70 hover:text-obsidian transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <div className="bg-pearl-50/95 p-6 sm:p-10 md:p-12 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-8">
          
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-champagne-300/40 pb-6">
            <div>
              <span className="text-[10px] uppercase font-mono tracking-monumental text-gold-dark font-bold">
                Atelier Receipt
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian">
                {order.orderNumber}
              </h1>
              <p className="text-xs text-obsidian/60 font-sans mt-0.5">
                Placed on {formattedDate} at {formattedTime} • Payment: {order.financialStatus.toUpperCase()}
              </p>
            </div>

            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-mono font-bold uppercase tracking-wider">
              <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" />
              <span>{order.fulfillmentStatus.replace('_', ' ')}</span>
            </span>
          </div>

          {/* Quick Tracking & Estimated Delivery Bar */}
          <div className="p-5 bg-gradient-to-r from-champagne-100/90 to-pearl-50 rounded-2xl border border-champagne-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-mono uppercase text-gold-dark font-bold block">
                Estimated Delivery Window
              </span>
              <p className="font-serif-luxury text-xl sm:text-2xl text-obsidian font-bold">
                {order.estimatedDelivery?.estimatedDateFormatted || formattedDate}
              </p>
              <p className="text-xs font-mono text-gold-dark font-medium">
                {order.estimatedDelivery?.expectedTimeWindow || 'Expected between 10:00 AM – 8:00 PM IST'}
              </p>
            </div>

            <Link
              to={`/order-tracking?id=${order.orderNumber}`}
              className="px-6 py-2.5 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-sm shrink-0"
            >
              <Truck className="w-4 h-4 text-champagne-300" />
              <span>Track Live Parcel</span>
            </Link>
          </div>

          {/* Timeline Milestones */}
          <div className="p-6 bg-white/95 rounded-2xl border border-champagne-300/60 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-champagne-300/40 pb-3">
              <h3 className="font-serif-luxury text-lg text-obsidian font-bold">
                Delivery Timeline
              </h3>
              <span className="text-xs font-mono text-gold-dark font-semibold">
                Airway Bill: {order.trackingNumber}
              </span>
            </div>

            <div className="relative pl-7 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-champagne-300">
              {timelineSteps.map((step, idx) => {
                const isCompleted = step.status === 'completed';
                return (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div
                      className={`absolute -left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold ring-4 ring-pearl-50 ${
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
                          className={`font-serif text-base ${
                            isCompleted ? 'text-obsidian font-bold' : 'text-obsidian/60'
                          }`}
                        >
                          {isCompleted ? `✓ ${step.title}` : `○ ${step.title}`}
                        </h4>
                        <span
                          className={`font-mono text-xs ${
                            isCompleted ? 'text-emerald-800 font-bold' : 'text-gold-dark font-medium'
                          }`}
                        >
                          {step.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-obsidian/65 font-sans">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="space-y-4 pt-4 border-t border-champagne-300/30">
            <h3 className="font-serif-luxury text-xl text-obsidian font-bold">
              Pieces Inside ({order.items.reduce((acc, i) => acc + i.quantity, 0)} items)
            </h3>
            
            <div className="space-y-3">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white/80 rounded-2xl border border-champagne-300/40"
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
                    <div>
                      <h4 className="font-serif text-base text-obsidian font-semibold">{item.title}</h4>
                      <p className="text-xs text-obsidian/60">
                        Quantity: <span className="font-mono font-bold text-obsidian">{item.quantity}</span> {item.boxType && `• ${item.boxType}`}
                      </p>
                      {item.customNotes && (
                        <p className="text-[11px] text-obsidian/60 font-sans font-medium mt-0.5">
                          Note: "{item.customNotes}"
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="font-mono font-bold text-obsidian text-base sm:self-center">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {/* Total breakdown */}
            <div className="p-4 bg-white/60 rounded-2xl border border-champagne-200 text-xs font-sans space-y-1.5 max-w-sm ml-auto">
              <div className="flex justify-between text-obsidian/70">
                <span>Subtotal</span>
                <span className="font-mono">₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between text-obsidian/70">
                <span>Shipping ({order.shippingMethod.split(' ')[0]})</span>
                <span className="font-mono">{order.shippingCost === 0 ? 'FREE' : `₹${order.shippingCost}`}</span>
              </div>
              <div className="flex justify-between text-obsidian font-bold text-sm pt-2 border-t border-champagne-200">
                <span>Total Paid</span>
                <span className="font-mono text-gold-dark">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address & Policy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans pt-4 border-t border-champagne-300/30">
            <div className="p-4 bg-white rounded-2xl border border-champagne-300/50 space-y-1">
              <span className="text-[10px] uppercase font-mono text-gold-dark font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Destination Address
              </span>
              <p className="font-semibold text-obsidian">{order.customer.name}</p>
              <p className="text-obsidian/70">{order.customer.address}</p>
              <p className="text-[11px] text-obsidian/50 font-mono">Phone: {order.customer.phone}</p>
            </div>

            <div className="p-4 bg-champagne-100/60 rounded-2xl border border-champagne-300/50 space-y-1.5 text-obsidian/80">
              <p className="flex items-center gap-1.5 font-bold text-obsidian">
                <Video className="w-4 h-4 text-gold-dark" />
                <span>Unboxing Video Policy</span>
              </p>
              <p className="leading-relaxed text-[11px]">
                All parcels are sealed with signature gold wax. Please record an uncut unboxing video for transit warranty.
              </p>
            </div>
          </div>

          {/* WhatsApp Inquire */}
          <div className="pt-2">
            <a
              href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20inquiry%20regarding%20Order%20${order.orderNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase font-mono tracking-widest font-semibold hover:bg-emerald-900 transition-all shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Inquire on WhatsApp about this Dispatch</span>
            </a>
          </div>

        </div>

      </div>
    </div>
  );
};
