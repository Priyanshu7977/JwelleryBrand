import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle2, ArrowRight, Clock } from 'lucide-react';
import { getUserOrders } from '../services/orderService';
import { OrderMetadata } from '../types/backend';
import { useAuth } from '../context/AuthContext';

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
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/70 hover:text-obsidian transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Account</span>
        </Link>

        <div className="space-y-2 border-b border-champagne-300/40 pb-6">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Atelier Dispatches
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase">
            YOUR <span className="italic font-light text-gold-dark">Orders</span>.
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
            <h3 className="font-serif-luxury text-2xl text-obsidian">No Dispatches Yet</h3>
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
            {orders.map((ord) => (
              <div
                key={ord.id || ord.orderNumber}
                className="p-6 md:p-8 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 shadow-sm hover:border-champagne-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-base font-bold text-obsidian">{ord.orderNumber}</span>
                    <span className="text-[10px] uppercase font-mono tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>{ord.fulfillmentStatus.replace('_', ' ')}</span>
                    </span>
                    <span className="text-xs text-obsidian/50 font-mono">
                      Tracking: {ord.trackingNumber}
                    </span>
                  </div>

                  <p className="font-serif text-base text-obsidian">
                    {ord.items.map((i) => i.title).join(', ')}
                  </p>

                  <div className="flex flex-wrap gap-4 text-xs text-obsidian/60 font-sans">
                    <span>
                      Ordered: {new Date(ord.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    <span>•</span>
                    <span>Destination: {ord.customer.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-champagne-300/30">
                  <span className="font-mono text-lg font-bold text-gold-dark">₹{ord.total}</span>
                  <Link
                    to={`/account/orders/${ord.orderNumber}`}
                    className="px-5 py-2.5 bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold rounded-full hover:bg-obsidian-200 transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <span>View Receipt</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
