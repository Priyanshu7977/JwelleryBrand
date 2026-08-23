import React, { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock, Video, Search, MessageCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/shopify-data';

export const OrderTrackingPage: React.FC = () => {
  const [trackingNumber, setTrackingNumber] = useState('MUM-EXPRESS-9921');
  const [searched, setSearched] = useState(true);

  const steps = [
    { label: 'Order Placed', time: '11:15 AM', done: true, desc: 'Verified & entered atelier queue' },
    { label: 'Handcrafted & Sealed', time: '01:30 PM', done: true, desc: 'Anti-tarnish wax seal applied in Mumbai' },
    { label: 'Dispatched via Courier', time: '02:45 PM', done: true, desc: 'Picked up by express delivery agent' },
    { label: 'Out for Delivery', time: '04:10 PM', done: true, desc: 'Agent reaching destination in Bandra' },
    { label: 'Delivered to Doorstep', time: '04:45 PM', done: true, desc: 'Handed over with signature verification' },
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-champagne-300/40 pb-8">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Live Courier Dispatch
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian uppercase">
            TRACK YOUR <span className="italic font-light text-gold-dark">Parcel</span>.
          </h1>
          <p className="text-xs sm:text-sm text-obsidian/70 font-sans">
            Real-time status for your Mumbai same-day or Pan-India express parcel.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearched(true);
            }}
            className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-champagne-300/80 max-w-md mx-auto shadow-inner mt-4"
          >
            <Search className="w-4 h-4 text-gold-dark" />
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Enter Order or Tracking ID..."
              className="w-full text-xs font-mono text-obsidian focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-obsidian text-pearl-100 text-xs uppercase tracking-wider rounded-full hover:bg-obsidian-200"
            >
              Track
            </button>
          </form>
        </div>

        {searched && (
          <div className="bg-pearl-50/95 p-8 md:p-12 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-10">
            
            {/* Status Top Line */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/30 pb-6">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                  Tracking ID: {trackingNumber}
                </span>
                <h2 className="font-serif-luxury text-2xl text-obsidian">
                  Same-Day Mumbai Express Dispatch
                </h2>
                <p className="text-xs text-obsidian/60 mt-0.5">Destination: Bandra West, Mumbai — 400050</p>
              </div>

              <span className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-100 text-emerald-900 rounded-full text-xs font-semibold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" /> Delivered Successfully
              </span>
            </div>

            {/* Timeline Progress */}
            <div className="relative pl-6 md:pl-8 space-y-8 before:absolute before:left-2 md:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gold-dark">
              {steps.map((st, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className="absolute -left-6 md:-left-8 top-0.5 w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] ring-4 ring-pearl-50">
                    ✓
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex items-baseline gap-3">
                      <h3 className="font-serif-luxury text-base sm:text-lg text-obsidian">
                        {st.label}
                      </h3>
                      <span className="font-mono text-[11px] text-gold-dark font-semibold">
                        {st.time}
                      </span>
                    </div>
                    <p className="text-xs text-obsidian/65 font-sans">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Unboxing Policy Reassurance */}
            <div className="p-4 bg-champagne-100/60 rounded-2xl border border-champagne-300/50 space-y-2 text-xs text-obsidian/80">
              <p className="flex items-center gap-1.5 font-semibold text-obsidian">
                <Video className="w-4 h-4 text-gold-dark" />
                Unboxing Video Requirement
              </p>
              <p className="leading-relaxed">
                Please remember to record an uncut unboxing video starting from the sealed outer package in the rare event of transit damage.
              </p>
            </div>

            {/* WhatsApp Assistance */}
            <div className="pt-2">
              <a
                href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20inquiry%20regarding%20Tracking%20${trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase tracking-widest font-semibold hover:bg-emerald-900 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Dispatch Concierge on WhatsApp</span>
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
