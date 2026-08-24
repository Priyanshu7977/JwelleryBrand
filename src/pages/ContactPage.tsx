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
  ExternalLink
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();

  // Form State
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
      // Fallback: Open WhatsApp with prefilled message
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
    <div className="w-full min-h-screen bg-pearl-100 pt-24 sm:pt-28 md:pt-36 pb-20 sm:pb-24 px-4 sm:px-6 md:px-10 lg:px-16 selection:bg-champagne-300">
      {/* Ambient background glows */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[280px] sm:h-[400px] bg-champagne-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1140px] mx-auto space-y-8 sm:space-y-12 md:space-y-14 relative z-10">
        
        {/* ================================================================= */}
        {/* 1. EDITORIAL HEADER (Compact & Prominent)                          */}
        {/* ================================================================= */}
        <div className="text-center space-y-2 sm:space-y-3 max-w-xl mx-auto animate-fade-in pt-1 sm:pt-0">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/90 border border-champagne-300/80 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Atelier Desk • Mumbai</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-obsidian uppercase font-normal tracking-tight leading-tight">
            CONTACT <span className="italic font-light text-gold-dark lowercase">us</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed max-w-md mx-auto">
            Have a question regarding custom hampers, sizing, or urgent Mumbai dispatch? Fill in the form below or connect directly with our atelier team.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 2. CORE TWO-COLUMN EDITORIAL CONTACT SECTION                      */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Reach Us Cards (5 cols) */}
          <div className="w-full lg:col-span-5 space-y-4">
            
            <div className="space-y-1">
              <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Get In Touch
              </span>
              <h2 className="font-serif-luxury text-xl sm:text-2xl md:text-3xl text-obsidian uppercase">
                DIRECT <span className="italic font-light text-gold-dark">Channels</span>.
              </h2>
              <p className="text-xs text-obsidian/70 font-sans leading-relaxed">
                We review every inquiry and reply within 2 hours during studio operations.
              </p>
            </div>

            {/* Direct Cards (Equal Height & Full Readability) */}
            <div className="space-y-3 pt-1">
              
              {/* WhatsApp Card */}
              <div className="min-h-[72px] p-3.5 sm:p-4 rounded-2xl bg-white border border-emerald-300/60 shadow-sm hover:border-emerald-500 transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-emerald-800 font-bold block leading-tight">
                      WhatsApp Concierge
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-obsidian block">
                      {BRAND_INFO.whatsapp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.whatsapp, 'WhatsApp Number')}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-pearl-100 transition-colors"
                    title="Copy number"
                    aria-label="Copy WhatsApp number"
                  >
                    {copiedField === 'WhatsApp Number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={BRAND_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-emerald-800 hover:bg-emerald-900 text-pearl-100 flex items-center justify-center transition-colors shadow-sm"
                    title="Open WhatsApp"
                    aria-label="Open WhatsApp chat"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Email Card (Full Email Readable Without Truncation) */}
              <div className="min-h-[72px] p-3.5 sm:p-4 rounded-2xl bg-white border border-champagne-300/60 shadow-sm hover:border-gold-dark transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-champagne-100/70 text-gold-dark flex items-center justify-center shrink-0 shadow-xs">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-gold-dark font-bold block leading-tight">
                      Email Inquiry
                    </span>
                    <span className="text-xs sm:text-sm font-sans font-medium text-obsidian block break-all sm:break-normal">
                      {BRAND_INFO.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.email, 'Email Address')}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-pearl-100 transition-colors"
                    title="Copy email"
                    aria-label="Copy email address"
                  >
                    {copiedField === 'Email Address' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-obsidian hover:bg-obsidian-200 text-pearl-100 flex items-center justify-center transition-colors shadow-sm"
                    title="Compose email"
                    aria-label="Compose email"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Phone Line Card */}
              <div className="min-h-[72px] p-3.5 sm:p-4 rounded-2xl bg-white border border-champagne-300/60 shadow-sm hover:border-gold-dark transition-all flex items-center justify-between gap-3 group">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-champagne-100/70 text-gold-dark flex items-center justify-center shrink-0 shadow-xs">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-wider text-gold-dark font-bold block leading-tight">
                      Atelier Helpline
                    </span>
                    <span className="text-xs sm:text-sm font-mono font-semibold text-obsidian block">
                      {BRAND_INFO.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.phone, 'Phone Number')}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center text-obsidian/60 hover:text-obsidian hover:bg-pearl-100 transition-colors"
                    title="Copy phone"
                    aria-label="Copy phone number"
                  >
                    {copiedField === 'Phone Number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`tel:${BRAND_INFO.phone}`}
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-obsidian hover:bg-obsidian-200 text-pearl-100 flex items-center justify-center transition-colors shadow-sm"
                    title="Call atelier"
                    aria-label="Call atelier helpline"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Location & Hours Card */}
              <div className="p-4 rounded-2xl bg-pearl-50 border border-champagne-300/70 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <div className="text-xs sm:text-sm text-obsidian/85 leading-snug font-sans">
                    <strong className="text-obsidian block font-medium">Celestia Atelier & Studio</strong>
                    Bandra West, Mumbai, Maharashtra 400050, India
                  </div>
                </div>

                <div className="flex items-center gap-2.5 pt-2 border-t border-champagne-300/40 text-[11px] sm:text-xs text-obsidian/80 font-sans">
                  <Clock className="w-3.5 h-3.5 text-gold-dark shrink-0" />
                  <span>Mon — Sat: 10:00 AM – 8:00 PM IST</span>
                </div>
              </div>

            </div>

            {/* Social Link */}
            <div className="pt-1">
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-obsidian hover:text-gold-dark font-bold transition-colors"
              >
                <Instagram className="w-4 h-4 text-rose-600" />
                <span>Follow @celestiaamor.in on Instagram →</span>
              </a>
            </div>

          </div>

          {/* Right Column: Full-Width Clean Contact Form (7 cols) */}
          <div className="w-full lg:col-span-7 bg-white p-5 sm:p-8 md:p-10 rounded-3xl border border-champagne-300/80 shadow-luxury-soft space-y-5">
            
            <div className="space-y-1 border-b border-champagne-300/40 pb-3.5">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian uppercase">
                SEND A <span className="italic font-light text-gold-dark">Message</span>.
              </h2>
              <p className="text-xs sm:text-sm text-obsidian/70 font-sans">
                Leave us a note and we will get back to you promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-obsidian/75 font-bold block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-sm text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-obsidian/75 font-bold block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-sm text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-obsidian/75 font-bold block">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-sm text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] sm:text-xs uppercase font-mono tracking-wider text-obsidian/75 font-bold block">
                  Message *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-sm text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm leading-relaxed resize-y"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 text-xs sm:text-sm uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-luxury-soft group disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <span>Sending message...</span>
                  ) : isSubmitted ? (
                    <>
                      <Check className="w-4 h-4 text-champagne-300" />
                      <span>Message Sent Successfully</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-champagne-300 group-hover:translate-x-1 transition-transform" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>

        </div>

        {/* ================================================================= */}
        {/* 3. CLEAN RESPONSIVE MAP SECTION (FIND US IN MUMBAI)               */}
        {/* ================================================================= */}
        <div className="pt-2 sm:pt-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-champagne-300/40 pb-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                <span>Geographic Location</span>
              </div>
              <h3 className="font-serif-luxury text-xl sm:text-2xl text-obsidian uppercase">
                FIND US IN <span className="italic font-light text-gold-dark">Mumbai</span>.
              </h3>
            </div>
            <p className="text-xs text-obsidian/60 font-sans">
              Bandra West Studio • Dispatched across India
            </p>
          </div>

          <div className="rounded-3xl bg-white border border-champagne-300/70 shadow-sm overflow-hidden">
            {/* Embedded Google Map */}
            <div className="relative w-full h-[220px] sm:h-[280px] md:h-[320px] bg-sand/30 overflow-hidden">
              <iframe
                title="Celestia Mumbai Atelier Map"
                src="https://maps.google.com/maps?q=Bandra%20West,%20Mumbai,%20Maharashtra%20400050,%20India&t=&z=14&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            {/* Map Action Footer */}
            <div className="p-4 bg-pearl-50/90 border-t border-champagne-300/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-xs font-mono text-obsidian/80 text-center sm:text-left">
                Bandra West, Mumbai, Maharashtra 400050, India
              </span>
              <a
                href="https://maps.google.com/?q=Bandra+West+Mumbai+400050"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 text-xs uppercase font-mono tracking-wider font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-champagne-300" />
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 4. CLEAN MINIMAL FAQ SECTION                                      */}
        {/* ================================================================= */}
        <div className="pt-4 sm:pt-6 border-t border-champagne-300/40 space-y-4 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
              Quick Answers
            </span>
            <h3 className="font-serif-luxury text-xl sm:text-2xl text-obsidian uppercase">
              FREQUENTLY <span className="italic font-light text-gold-dark">Asked</span>.
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-champagne-300/60 overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 font-serif-luxury text-sm sm:text-base text-obsidian font-semibold"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-dark shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>

                {activeFaq === i && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed border-t border-champagne-200/40">
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
