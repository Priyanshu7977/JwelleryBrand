import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Package, Truck, CheckCircle2, ArrowRight } from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const orders = [
    {
      id: 'ORD-2026-8941',
      date: '21 Aug 2026',
      total: 1499,
      status: 'Delivered',
      itemsCount: 2,
      summary: 'pink and blue bangle set of 2, polaroids 20(your pics)',
      trackingId: 'MUM-EXPRESS-9921',
      destination: 'Bandra West, Mumbai'
    },
    {
      id: 'ORD-2026-7720',
      date: '14 Aug 2026',
      total: 999,
      status: 'Delivered',
      itemsCount: 1,
      summary: 'Desi Barbie Hamper',
      trackingId: 'MUM-EXPRESS-8814',
      destination: 'Bandra West, Mumbai'
    },
    {
      id: 'ORD-2026-5512',
      date: '02 Aug 2026',
      total: 335,
      status: 'Delivered',
      itemsCount: 2,
      summary: 'white bangles, Golden anti tarnish rings',
      trackingId: 'BLR-PAN-4412',
      destination: 'Indiranagar, Bengaluru'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <Link
          to="/account"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/70 hover:text-obsidian"
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

        <div className="space-y-6">
          {orders.map((ord) => (
            <div
              key={ord.id}
              className="p-6 md:p-8 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 shadow-sm hover:border-champagne-300 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-base font-bold text-obsidian">{ord.id}</span>
                  <span className="text-[10px] uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {ord.status}
                  </span>
                  <span className="text-xs text-obsidian/50 font-mono">Tracking: {ord.trackingId}</span>
                </div>
                <p className="font-serif text-base text-obsidian">{ord.summary}</p>
                <div className="flex gap-4 text-xs text-obsidian/60 font-sans">
                  <span>Ordered: {ord.date}</span>
                  <span>•</span>
                  <span>Destination: {ord.destination}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-champagne-300/30">
                <span className="font-mono text-lg font-bold text-gold-dark">₹{ord.total}</span>
                <Link
                  to={`/account/orders/${ord.id}`}
                  className="px-5 py-2.5 bg-obsidian text-pearl-100 text-xs uppercase tracking-widest rounded-full hover:bg-obsidian-200 transition-all flex items-center gap-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
