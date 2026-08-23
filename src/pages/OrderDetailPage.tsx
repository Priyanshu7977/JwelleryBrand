import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Truck, Video, MessageCircle, Package } from 'lucide-react';
import { BRAND_INFO } from '../data/shopify-data';

export const OrderDetailPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 pb-32 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <Link
          to="/account/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-obsidian/70 hover:text-obsidian"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>

        <div className="bg-pearl-50/95 p-8 md:p-12 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-8">
          
          {/* Order Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-champagne-300/40 pb-6">
            <div>
              <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
                Order Receipt
              </span>
              <h1 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian">
                {orderId || 'ORD-2026-8941'}
              </h1>
              <p className="text-xs text-obsidian/60 mt-0.5">Dispatched from Mumbai Studio Atelier</p>
            </div>

            <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" /> Delivered
            </span>
          </div>

          {/* Timeline Tracker */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto text-xs font-bold">1</div>
              <p className="font-semibold text-obsidian">Order Placed</p>
              <p className="text-[10px] text-obsidian/50">11:15 AM</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto text-xs font-bold">2</div>
              <p className="font-semibold text-obsidian">Handcrafted & Sealed</p>
              <p className="text-[10px] text-obsidian/50">01:30 PM (Mumbai)</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center mx-auto text-xs font-bold">3</div>
              <p className="font-semibold text-obsidian">Delivered to Doorstep</p>
              <p className="text-[10px] text-obsidian/50">04:45 PM (Bandra)</p>
            </div>
          </div>

          {/* Order Items Summary */}
          <div className="space-y-4 pt-4 border-t border-champagne-300/30">
            <h3 className="font-serif-luxury text-xl text-obsidian">Pieces Inside</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-champagne-300/40">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/assets/products/pink-blue-bangles.jpg"
                    alt="pink and blue bangle set of 2"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-serif text-base text-obsidian">pink and blue bangle set of 2</h4>
                    <p className="text-xs text-obsidian/60">Qty: 1 • Size: 2.6 • Anti-Tarnish</p>
                  </div>
                </div>
                <span className="font-mono font-semibold text-obsidian">₹500</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-white/80 rounded-2xl border border-champagne-300/40">
                <div className="flex items-center gap-3.5">
                  <img
                    src="/assets/products/desi-barbie-hamper.jpg"
                    alt="Desi Barbie Hamper"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-serif text-base text-obsidian">Desi Barbie Hamper</h4>
                    <p className="text-xs text-obsidian/60">Qty: 1 • Custom Polaroid Wax Sealed</p>
                  </div>
                </div>
                <span className="font-mono font-semibold text-obsidian">₹999</span>
              </div>
            </div>
          </div>

          {/* Policy & Concierge */}
          <div className="p-4 bg-champagne-100/60 rounded-2xl border border-champagne-300/50 space-y-2 text-xs text-obsidian/80">
            <p className="flex items-center gap-1.5 font-semibold text-obsidian">
              <Video className="w-4 h-4 text-gold-dark" />
              Unboxing Policy Reminder
            </p>
            <p className="leading-relaxed">
              As per Celestia policy, all parcels are packed with anti-tarnish seals. An uncut continuous unboxing video is required in the rare event of damage during transit.
            </p>
          </div>

          {/* WhatsApp Inquire */}
          <div className="pt-2">
            <a
              href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20inquiry%20regarding%20Order%20${orderId || 'ORD-2026-8941'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase tracking-widest font-semibold hover:bg-emerald-900 transition-all shadow-md"
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
