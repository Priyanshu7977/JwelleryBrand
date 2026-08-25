import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle2, ArrowRight, Clock, MapPin, Check, Download } from 'lucide-react';
import { getUserOrders } from '../services/orderService';
import { downloadOrderInvoicePDF } from '../services/pdfInvoiceService';
import { OrderMetadata } from '../types/backend';
import { useAuth } from '../context/AuthContext';
import { formatOrderDateIST, formatOrderTimeIST } from '../utils/dateIST';

export const OrdersPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getUserOrders(user?.email)
      .then((data) => {
        setOrders(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [user?.email]);

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 selection:bg-champagne-300">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-xs uppercase font-mono tracking-widest text-obsidian/70 hover:text-obsidian transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>

        <div className="space-y-2 border-b border-champagne-300/40 pb-6">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Atelier Dispatches
          </span>
          <h1 className="site-main-title text-obsidian">
            Your <span className="font-semibold text-gold-dark">orders</span>
          </h1>
        </div>

        {loading ? (
          <div className="p-16 text-center space-y-3 bg-pearl-50/80 rounded-3xl border border-champagne-300/50">
            <div className="w-10 h-10 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono text-obsidian/60">Fetching Atelier Orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center space-y-4 bg-pearl-50/80 rounded-3xl border border-champagne-300/50">
            <Package className="w-10 h-10 text-gold-dark mx-auto" />
            <h3 className="font-serif-luxury text-2xl text-obsidian">No dispatches yet</h3>
            <p className="text-xs text-obsidian/70 max-w-sm mx-auto">
              Your pieces and bespoke curations will appear here once you place your first order.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all shadow-sm"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((ord) => {
              const orderDate = new Date(ord.createdAt);
              const formattedDate = formatOrderDateIST(orderDate);
              const formattedTime = formatOrderTimeIST(orderDate);
              const totalItemsCount = ord.items.reduce((acc, i) => acc + i.quantity, 0);

              return (
                <div
                  key={ord.id || ord.orderNumber}
                  className="p-6 md:p-8 bg-pearl-50/95 rounded-3xl border border-champagne-300/60 shadow-luxury-soft hover:border-champagne-300 transition-all space-y-6"
                >
                  {/* Order Top Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-champagne-300/40 pb-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="font-mono text-lg font-bold text-obsidian">{ord.orderNumber}</span>
                      <span className="text-[10px] uppercase font-mono bg-emerald-100 text-emerald-900 border border-emerald-300 px-3 py-0.5 rounded-full font-bold flex items-center gap-1">
                        <Check className="w-3 h-3 text-emerald-700 stroke-[3]" />
                        <span>{ord.fulfillmentStatus.replace('_', ' ')}</span>
                      </span>
                      <span className="text-xs text-obsidian/50 font-mono">
                        Tracking: {ord.trackingNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded font-bold uppercase">
                        {ord.financialStatus}
                      </span>
                      <span className="text-gold-dark font-bold text-base">₹{ord.total}</span>
                    </div>
                  </div>

                  {/* Order Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Left: Items Summary & Quantities */}
                    <div className="md:col-span-7 space-y-3">
                      <div className="space-y-1.5">
                        <span className="text-[10px] uppercase font-mono text-obsidian/50 block">
                          Purchased Pieces ({totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'})
                        </span>
                        <div className="space-y-1">
                          {ord.items.map((item, idx) => (
                            <div key={idx} className="flex items-baseline justify-between gap-2 text-xs font-sans">
                              <span className="font-serif text-obsidian font-semibold">
                                {item.title} <span className="font-mono text-[11px] text-gold-dark font-bold">(Qty: {item.quantity})</span>
                              </span>
                              <span className="font-mono text-obsidian/70">₹{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-xs text-obsidian/60 font-sans pt-2 border-t border-champagne-200/50">
                        <span><strong>Order Date:</strong> {formattedDate} at {formattedTime}</span>
                        <span>•</span>
                        <span><strong>Destination:</strong> {ord.customer.address}</span>
                      </div>
                    </div>

                    {/* Right: Estimated Delivery & Action Buttons */}
                    <div className="md:col-span-5 flex flex-col justify-between gap-4 p-4 bg-white/90 rounded-2xl border border-champagne-300/50">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-mono text-gold-dark font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-gold-dark" /> Estimated Delivery
                        </span>
                        <p className="font-serif text-base font-bold text-obsidian">
                          {ord.estimatedDelivery?.estimatedDateFormatted || formattedDate}
                        </p>
                        <p className="text-[11px] font-mono text-gold-dark font-medium">
                          {ord.estimatedDelivery?.expectedTimeWindow || 'Expected between 10:00 AM – 8:00 PM IST'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-champagne-200/50">
                        <Link
                          to={`/order-tracking?id=${ord.orderNumber}`}
                          className="flex-1 py-2 px-3 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-wider font-bold hover:bg-obsidian-200 transition-all text-center flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <Truck className="w-3.5 h-3.5 text-champagne-300" />
                          <span>Track</span>
                        </Link>

                        <button
                          onClick={() => downloadOrderInvoicePDF(ord)}
                          className="py-2 px-3 rounded-full border border-champagne-300 bg-pearl-50 hover:bg-champagne-100 text-obsidian text-xs uppercase font-mono tracking-wider font-bold transition-all text-center flex items-center justify-center gap-1 cursor-pointer"
                          title="Download PDF Invoice"
                        >
                          <Download className="w-3.5 h-3.5 text-gold-dark" />
                          <span>PDF</span>
                        </button>

                        <Link
                          to={`/account/orders/${ord.orderNumber}`}
                          className="flex-1 py-2 px-3 rounded-full border border-champagne-300/80 bg-white hover:bg-champagne-100/60 text-obsidian text-xs uppercase font-mono tracking-wider font-bold transition-all text-center"
                        >
                          Details
                        </Link>
                      </div>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};
