import React from 'react';
import { Truck, Video, ShieldAlert, CheckCircle2, Clock, MapPin } from 'lucide-react';
import { BRAND_INFO } from '../data/shopify-data';

export const ShippingReturnsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="space-y-4 border-b border-champagne-300/40 pb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
              Atelier Policies
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
            <span className="text-xs font-serif text-obsidian/60">
              Clear & Transparent
            </span>
          </div>

          <h1 className="site-main-title text-obsidian">
            Shipping & <span className="font-semibold text-gold-dark">returns</span>
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
            Authentic guidelines for dispatches, delivery timelines, and unboxing verification directly from our Mumbai studio.
          </p>
        </div>

        {/* Policy Blocks */}
        <div className="space-y-8">
          
          {/* Dispatch & Timelines */}
          <div className="p-8 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-champagne-200/80 text-obsidian rounded-2xl">
                <Truck className="w-5 h-5" />
              </div>
              <h2 className="font-serif-luxury text-2xl text-obsidian">Dispatch & delivery timelines</h2>
            </div>
            
            <div className="space-y-3 text-xs text-obsidian/80 font-sans leading-relaxed">
              <p>
                • <strong className="text-obsidian">Same-Day Mumbai Courier:</strong> Orders placed before 2:00 PM IST within Mumbai and surrounding suburbs are eligible for same-day express hand-delivery.
              </p>
              <p>
                • <strong className="text-obsidian">Pan-India Express:</strong> All domestic orders are handcrafted, anti-tarnish sealed, and dispatched within <strong className="text-obsidian">7–10 working days</strong> via reliable courier partners with live SMS tracking.
              </p>
              <p>
                • <strong className="text-obsidian">Cash on Delivery (COD):</strong> To maintain bespoke curation and instant personalised printing of Polaroids, COD is currently not supported. We accept all UPI, NetBanking, Cards, and direct WhatsApp payments.
              </p>
            </div>
          </div>

          {/* Returns & Exchange Policy */}
          <div className="p-8 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-champagne-200/80 text-obsidian rounded-2xl">
                <ShieldAlert className="w-5 h-5 text-amber-800" />
              </div>
              <h2 className="font-serif-luxury text-2xl text-obsidian">Cancellations, returns & exchanges</h2>
            </div>
            
            <div className="space-y-3 text-xs text-obsidian/80 font-sans leading-relaxed">
              <p>
                Due to the intimate, handcrafted nature of our jewellery, artisanal bangles, and customized polaroid memory hampers:
              </p>
              <p className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80 text-amber-900 font-medium">
                ⚠️ <strong>No cancellations, returns, or exchanges</strong> are accepted once an order is confirmed and prepared in our atelier.
              </p>
            </div>
          </div>

          {/* Unboxing Video Requirement */}
          <div className="p-8 bg-pearl-50/90 rounded-3xl border border-champagne-300/50 shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-champagne-200/80 text-obsidian rounded-2xl">
                <Video className="w-5 h-5 text-gold-dark" />
              </div>
              <h2 className="font-serif-luxury text-2xl text-obsidian">Damaged or missing item claims</h2>
            </div>
            
            <div className="space-y-3 text-xs text-obsidian/80 font-sans leading-relaxed">
              <p>
                We inspect every piece under studio light before packaging. In the rare event of transit damage or a missing piece:
              </p>
              <p className="p-4 bg-pearl-100 rounded-2xl border border-champagne-300/80 text-obsidian font-serif text-sm">
                🎥 <strong>Mandatory Requirement:</strong> An <em>uncut, continuous 360-degree unboxing video</em> starting from the sealed outer courier parcel to the inner jewellery inspection must be shared with us within 24 hours of delivery via WhatsApp (<a href={BRAND_INFO.whatsappUrl} className="underline text-emerald-800 font-bold">{BRAND_INFO.phone}</a>).
              </p>
              <p className="text-[11px] text-obsidian/60">
                Claims without an uncut video cannot be processed under our atelier guarantee.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
