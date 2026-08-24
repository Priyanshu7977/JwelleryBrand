import React, { useState } from 'react';
import { BRAND_INFO } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { contactService } from '../services/contactService';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  Check,
  Clock,
  Instagram,
  Copy,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(label);
      showToast(`${label} copied to clipboard ✨`);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      showToast(`Copied: ${text}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showToast("Please fill in your name, email, and message.");
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submitInquiry({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        topic: 'General Atelier Inquiry',
        message: formData.message
      });
      setIsSubmitted(true);
      showToast("Your message has been sent to our Mumbai Atelier ✨");
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      const text = `Hello Celestia Atelier! ✨%0A%0A*Name:* ${encodeURIComponent(formData.name)}%0A*Email:* ${encodeURIComponent(formData.email)}%0A*Phone:* ${encodeURIComponent(formData.phone)}%0A*Message:* ${encodeURIComponent(formData.message)}`;
      window.open(`https://wa.me/917718825792?text=${text}`, '_blank');
      showToast("Opening WhatsApp to connect directly with our atelier ✨");
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: "How does Mumbai Same-Day Express Delivery work?",
      a: "Orders placed before 2:00 PM IST across Mumbai & Thane are hand-packed at our Bandra West studio and dispatched via express courier on the same evening."
    },
    {
      q: "Are your jewellery pieces anti-tarnish and waterproof?",
      a: "Yes. All our fine jewellery pieces are crafted with 18K gold dipping over surgical-grade stainless steel cores, rigorously tested against water, perfumes, and daily wear."
    },
    {
      q: "How do I share photos for custom Polaroids or bespoke hampers?",
      a: "After placing your order or sending an inquiry, our concierge sends you a private WhatsApp upload link where you can share your high-res photos."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-20 sm:pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300 overflow-x-hidden relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[280px] sm:h-[400px] bg-champagne-200/25 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        
        {/* Compact Editorial Header */}
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-champagne-300/80 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Atelier Desk • Mumbai</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-tight">
            CONTACT <span className="italic font-normal text-gold-dark lowercase">us</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/75 leading-relaxed">
            Have a question regarding custom hampers, sizing, or urgent Mumbai dispatch? Connect directly with our atelier team.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
          
          {/* Left Column: Direct Channels (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Get In Touch
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-obsidian uppercase">
                DIRECT <span className="italic font-normal text-gold-dark">Channels</span>.
              </h2>
            </div>

            {/* Channels */}
            <div className="space-y-2.5">
              {/* WhatsApp Card */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-emerald-300/60 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 block">
                      WhatsApp Concierge
                    </span>
                    <span className="text-xs font-mono font-bold text-obsidian truncate block">
                      {BRAND_INFO.whatsapp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.whatsapp, 'WhatsApp Number')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-pearl-100 transition-colors"
                    title="Copy number"
                  >
                    {copiedField === 'WhatsApp Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={BRAND_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-pearl-100 flex items-center justify-center transition-colors shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-champagne-300/60 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-gold-dark flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-gold-dark block">
                      Email Inquiry
                    </span>
                    <span className="text-xs font-mono font-bold text-obsidian truncate block">
                      {BRAND_INFO.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.email, 'Email Address')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-pearl-100 transition-colors"
                  >
                    {copiedField === 'Email Address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="w-8 h-8 rounded-lg bg-obsidian text-pearl-100 flex items-center justify-center hover:bg-obsidian-200 transition-colors shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Phone Card */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-champagne-300/60 shadow-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-9 h-9 rounded-xl bg-champagne-100 text-obsidian flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-mono font-bold text-obsidian/70 block">
                      Atelier Helpline
                    </span>
                    <span className="text-xs font-mono font-bold text-obsidian truncate block">
                      {BRAND_INFO.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.phone, 'Phone Number')}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-pearl-100 transition-colors"
                  >
                    {copiedField === 'Phone Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <a
                    href={`tel:${BRAND_INFO.phone}`}
                    className="w-8 h-8 rounded-lg bg-obsidian text-pearl-100 flex items-center justify-center hover:bg-obsidian-200 transition-colors shadow-sm"
                  >
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Studio Location Card */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-white border border-champagne-300/60 shadow-sm flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-champagne-100 text-obsidian flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-gold-dark" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-obsidian/70 block">
                    Celestia Atelier & Studio
                  </span>
                  <span className="text-xs text-obsidian font-medium">
                    Bandra West, Mumbai, Maharashtra 400050, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Send A Message Form (7 cols) */}
          <div className="lg:col-span-7 bg-white/95 p-5 sm:p-7 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-4">
            <div className="space-y-0.5">
              <h2 className="text-xl sm:text-2xl font-bold text-obsidian uppercase">
                SEND A <span className="italic font-normal text-gold-dark">Message</span>.
              </h2>
              <p className="text-xs text-obsidian-soft">
                Leave us a note and we will get back to you promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  required
                  className="w-full px-3.5 py-2 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80">Email Address *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we help you today?"
                  required
                  rows={3}
                  className="w-full px-3.5 py-2 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark resize-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full h-11 flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest shadow-md"
              >
                {isSubmitting ? (
                  <span>Sending Message...</span>
                ) : isSubmitted ? (
                  <span>Sent Successfully! ✨</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message to Atelier</span>
                  </>
                )}
              </button>
            </form>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="space-y-3 pt-6 border-t border-champagne-300/40">
          <h3 className="text-center text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
            Frequently Asked Questions
          </h3>

          <div className="max-w-2xl mx-auto space-y-2">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/90 rounded-2xl border border-champagne-300/60 overflow-hidden"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-3.5 text-left flex items-center justify-between text-xs sm:text-sm font-bold text-obsidian"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-180 text-gold-dark' : 'text-obsidian/60'}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-3.5 pb-3.5 text-xs text-obsidian-soft leading-relaxed border-t border-champagne-300/40 pt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContactPage;
