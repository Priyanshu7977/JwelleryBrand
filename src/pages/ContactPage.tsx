import React, { useState } from 'react';
import { BRAND_INFO } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { MagneticButton } from '../components/ui/MagneticButton';
import { MessageCircle, Phone, Mail, MapPin, Sparkles, Send, Check, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'custom-hamper',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Please provide your name and contact number.");
      return;
    }
    setIsSubmitted(true);
    showToast("Message sent to Mumbai Atelier Concierge ✨");
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', phone: '', email: '', inquiryType: 'custom-hamper', message: '' });
    }, 3000);
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 pb-32 px-6 md:px-12 lg:px-20 selection:bg-champagne-300">
      {/* Background Ambience */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-champagne-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Editorial Header */}
        <div className="space-y-4 max-w-3xl border-b border-champagne-300/40 pb-8">
          <div className="flex items-center gap-2">
            <span className="text-[11px] uppercase tracking-monumental text-gold-dark font-semibold">
              Concierge Desk
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-gold-dark" />
            <span className="text-xs font-serif italic text-obsidian/60">
              Personalized Assistance
            </span>
          </div>

          <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl text-obsidian font-normal uppercase leading-[0.92]">
            CONNECT WITH <span className="italic font-light text-gold-dark">Us</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed">
            Whether you are curating a custom hamper, need same-day Mumbai delivery assistance, or have inquiries about bespoke sizing, our atelier concierge is ready to assist.
          </p>
        </div>

        {/* 2-Column Contact Spread */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-14 items-start">
          
          {/* Left Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct WhatsApp Concierge Card */}
            <div className="p-6 rounded-3xl bg-pearl-50 border border-champagne-300/50 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-serif-luxury text-xl text-obsidian">WhatsApp Concierge</h2>
                  <p className="text-xs text-obsidian/60 font-sans">Instant replies for orders & rush delivery</p>
                </div>
              </div>
              <p className="text-xs text-obsidian/75 font-sans leading-relaxed">
                Chat directly with our Mumbai team for custom polaroid uploads, bulk wedding hampers, or quick same-day orders.
              </p>
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase tracking-widest font-semibold hover:bg-emerald-900 transition-all shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp (+91 7718825792)</span>
              </a>
            </div>

            {/* Direct Phone & Email */}
            <div className="p-6 rounded-3xl bg-pearl-50 border border-champagne-300/50 shadow-sm space-y-4">
              <div className="space-y-3 text-xs text-obsidian/80">
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-gold-dark shrink-0" />
                  <a href={`tel:${BRAND_INFO.phone}`} className="hover:text-obsidian font-mono">
                    {BRAND_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-gold-dark shrink-0" />
                  <a href={`mailto:${BRAND_INFO.email}`} className="hover:text-obsidian font-sans">
                    {BRAND_INFO.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-gold-dark shrink-0" />
                  <span>Mumbai Studio Atelier • Dispatches Pan-India</span>
                </div>
                <div className="flex items-center gap-3 pt-1 border-t border-champagne-300/30">
                  <Clock className="w-4 h-4 text-gold-dark shrink-0" />
                  <span className="font-mono">Active Studio Hours: 10:00 — 20:00 IST</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Inquiry Form (7 Cols) */}
          <div className="lg:col-span-7 bg-pearl-50/90 p-8 md:p-12 rounded-3xl border border-champagne-300/50 shadow-luxury-soft">
            <h2 className="font-serif-luxury text-3xl text-obsidian mb-2">
              Send an Atelier Inquiry
            </h2>
            <p className="text-xs text-obsidian/60 mb-6 font-sans">
              We respond to all inquiries within 2 hours during studio hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-obsidian/60 font-medium block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-300/60 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-obsidian/60 font-medium block">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91..."
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-300/60 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-obsidian/60 font-medium block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-300/60 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-obsidian/60 font-medium block">
                    Inquiry Reason
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-300/60 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                  >
                    <option value="custom-hamper">Custom Hamper & Polaroid Curation</option>
                    <option value="same-day-mumbai">Same-Day Mumbai Express Order</option>
                    <option value="bulk-gifting">Bulk Wedding / Festive Gifting</option>
                    <option value="order-status">Order Tracking Inquiry</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase tracking-wider text-obsidian/60 font-medium block">
                  Your Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you would like to curate or inquire about..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-white border border-champagne-300/60 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitted}
                  className="w-full py-4 px-8 rounded-full bg-obsidian text-pearl-100 text-xs uppercase tracking-widest font-medium hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2 shadow-luxury-soft"
                >
                  {isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-champagne-300" />
                      <span>Message Received</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Atelier</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
