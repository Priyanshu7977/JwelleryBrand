import React from 'react';
import { BRAND_INFO } from '../data/shopify-data';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="space-y-4 border-b border-champagne-300/40 pb-8">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Data Integrity
          </span>
          <h1 className="font-serif-luxury text-4xl sm:text-6xl text-obsidian">
            Privacy <span className="font-semibold text-gold-dark">policy</span>.
          </h1>
          <p className="text-xs text-obsidian/60 font-sans">
            Your trust is our foremost priority.
          </p>
        </div>

        <div className="space-y-8 bg-pearl-50/90 p-8 md:p-12 rounded-3xl border border-champagne-300/50 shadow-sm text-xs text-obsidian/80 font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">1. Information we collect</h2>
            <p>
              We collect your name, shipping address, contact phone number, and email address solely for processing your orders, generating express courier labels, and communicating dispatch milestones.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">2. Privacy of custom polaroid photos</h2>
            <p>
              Photos submitted for custom 20-pack Polaroids or keepsake hamper envelopes are stored temporarily on encrypted private drives and permanently purged from print queues within 7 days of shipment. We never share, publish, or utilize your personal photos without explicit consent.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">3. Third-party services</h2>
            <p>
              Payment transactions are processed securely through certified gateways. We do not store credit card numbers, CVVs, or bank PINs on our servers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">4. Contact privacy officer</h2>
            <p>
              If you have queries regarding your data or wish to request data erasure, email <a href={`mailto:${BRAND_INFO.email}`} className="underline font-bold text-obsidian">{BRAND_INFO.email}</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
