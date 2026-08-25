import React from 'react';
import { BRAND_INFO } from '../data/shopify-data';

export const TermsPage: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="space-y-4 border-b border-champagne-300/40 pb-8">
          <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
            Legal Agreements
          </span>
          <h1 className="site-main-title text-obsidian">
            Terms & <span className="font-semibold text-gold-dark">conditions</span>
          </h1>
          <p className="text-xs text-obsidian/60 font-sans">
            Last Updated: August 2026 • Mumbai Studio Atelier
          </p>
        </div>

        <div className="space-y-8 bg-pearl-50/90 p-8 md:p-12 rounded-3xl border border-champagne-300/50 shadow-sm text-xs text-obsidian/80 font-sans leading-relaxed">
          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">1. General overview</h2>
            <p>
              These Terms & Conditions govern your access to and purchase of items from <strong>CELestia</strong> (operated from Mumbai, India). By placing an order through our storefront or WhatsApp Concierge, you agree to be bound by these provisions.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">2. Product descriptions & photography</h2>
            <p>
              We strive to display our colours, finishes, and gemstone tones as accurately as possible under calibrated studio lighting. Handcrafted pieces and natural baroque elements may contain subtle organic variances, which constitute the authentic character of our pieces.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">3. Pricing & payments</h2>
            <p>
              All prices are listed in Indian Rupees (INR, ₹) and include applicable taxes. We reserve the right to revise pricing or promotions without prior notice. Payment must be cleared in full before parcel dispatch.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">4. Custom polaroid & hamper content</h2>
            <p>
              When uploading custom photo files for Polaroid printing, the customer affirms that they hold the right to print such media. Celestia treats all submitted memory photos with strict confidentiality.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="font-serif-luxury text-2xl text-obsidian">5. Contact & concierge</h2>
            <p>
              For legal or order inquiries, reach our Mumbai team at <a href={`mailto:${BRAND_INFO.email}`} className="underline font-bold text-obsidian">{BRAND_INFO.email}</a> or WhatsApp at <a href={BRAND_INFO.whatsappUrl} className="underline font-bold text-obsidian">{BRAND_INFO.phone}</a>.
            </p>
          </section>
        </div>

      </div>
    </div>
  );
};
