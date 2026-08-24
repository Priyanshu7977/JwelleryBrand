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
  ShieldCheck,
  Truck
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
      a: "Orders placed before 2:00 PM IST across Mumbai & Thane are hand-packed and dispatched via express courier on the same evening."
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
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-28 px-5 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      {/* Ambient background glows */}
      <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[650px] h-[400px] bg-champagne-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1200px] mx-auto space-y-16 sm:space-y-20 relative z-10">
        
        {/* ================================================================= */}
        {/* 1. EDITORIAL HEADER (Basic, Minimal & High-Fashion)               */}
        {/* ================================================================= */}
        <div className="text-center space-y-4 max-w-2xl mx-auto animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-champagne-300/80 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-semibold shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            <span>Atelier Desk • Mumbai</span>
          </div>

          <h1 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-obsidian uppercase font-normal tracking-tight leading-none">
            CONTACT <span className="italic font-light text-gold-dark lowercase">us</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/70 font-sans leading-relaxed">
            Have a question regarding custom hampers, sizing, or urgent Mumbai dispatch? Fill in the form below or connect directly with our team.
          </p>
        </div>

        {/* ================================================================= */}
        {/* 2. CORE TWO-COLUMN EDITORIAL CONTACT SECTION                      */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Direct Reach Us Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Get In Touch
              </span>
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian uppercase">
                DIRECT <span className="italic font-light text-gold-dark">Channels</span>.
              </h2>
              <p className="text-xs text-obsidian/70 font-sans leading-relaxed">
                We review every inquiry and reply within 2 hours during studio operations.
              </p>
            </div>

            {/* Direct Cards */}
            <div className="space-y-3.5 pt-2">
              
              {/* WhatsApp Card */}
              <div className="p-5 rounded-2xl bg-white border border-emerald-300/50 shadow-sm hover:border-emerald-500 transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-emerald-800 font-bold block">
                      WhatsApp Concierge
                    </span>
                    <span className="text-xs font-mono font-semibold text-obsidian">
                      {BRAND_INFO.whatsapp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.whatsapp, 'WhatsApp Number')}
                    className="p-2 text-obsidian/60 hover:text-obsidian rounded-lg hover:bg-pearl-100 transition-colors"
                    title="Copy number"
                  >
                    {copiedField === 'WhatsApp Number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={BRAND_INFO.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-emerald-800 hover:bg-emerald-900 text-pearl-100 rounded-lg transition-colors shadow-sm"
                    title="Open WhatsApp"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-5 rounded-2xl bg-white border border-champagne-300/60 shadow-sm hover:border-gold-dark transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-champagne-100/70 text-gold-dark flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gold-dark font-bold block">
                      Email Inquiry
                    </span>
                    <span className="text-xs font-sans font-medium text-obsidian truncate max-w-[170px] sm:max-w-[210px] block">
                      {BRAND_INFO.email}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.email, 'Email Address')}
                    className="p-2 text-obsidian/60 hover:text-obsidian rounded-lg hover:bg-pearl-100 transition-colors"
                    title="Copy email"
                  >
                    {copiedField === 'Email Address' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`mailto:${BRAND_INFO.email}`}
                    className="p-2 bg-obsidian hover:bg-obsidian-200 text-pearl-100 rounded-lg transition-colors shadow-sm"
                    title="Compose email"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Phone Line Card */}
              <div className="p-5 rounded-2xl bg-white border border-champagne-300/60 shadow-sm hover:border-gold-dark transition-all flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-champagne-100/70 text-gold-dark flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-wider text-gold-dark font-bold block">
                      Atelier Helpline
                    </span>
                    <span className="text-xs font-mono font-semibold text-obsidian">
                      {BRAND_INFO.phone}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(BRAND_INFO.phone, 'Phone Number')}
                    className="p-2 text-obsidian/60 hover:text-obsidian rounded-lg hover:bg-pearl-100 transition-colors"
                    title="Copy phone"
                  >
                    {copiedField === 'Phone Number' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a
                    href={`tel:${BRAND_INFO.phone}`}
                    className="p-2 bg-obsidian hover:bg-obsidian-200 text-pearl-100 rounded-lg transition-colors shadow-sm"
                    title="Call atelier"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Location & Hours Card */}
              <div className="p-5 rounded-2xl bg-pearl-50 border border-champagne-300/60 space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
                  <div className="text-xs text-obsidian/80 leading-relaxed font-sans">
                    <strong className="text-obsidian block">Celestia Atelier & Studio</strong>
                    Bandra West, Mumbai, Maharashtra 400050, India
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-champagne-300/30 text-xs text-obsidian/75 font-sans">
                  <Clock className="w-4 h-4 text-gold-dark shrink-0" />
                  <span>Mon — Sat: 10:00 AM – 8:00 PM IST</span>
                </div>
              </div>

            </div>

            {/* Social Link */}
            <div className="pt-2">
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

          {/* Right Column: Clean Animated Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-10 md:p-12 rounded-3xl border border-champagne-300/80 shadow-luxury-soft space-y-6">
            
            <div className="space-y-1.5 border-b border-champagne-300/40 pb-5">
              <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian uppercase">
                SEND A <span className="italic font-light text-gold-dark">Message</span>.
              </h2>
              <p className="text-xs text-obsidian/70 font-sans">
                Leave us a note and we will get back to you promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-xs text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm"
                />
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-xs text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-xs text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                  Message *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full p-4 rounded-xl bg-pearl-50/60 border border-champagne-300/80 font-sans text-xs text-obsidian placeholder:text-obsidian/40 focus:outline-none focus:border-gold-dark focus:bg-white transition-all shadow-sm leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-8 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold transition-all flex items-center justify-center gap-2 shadow-luxury-soft group disabled:opacity-70"
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
        {/* 3. CLEAN MINIMAL FAQ SECTION                                      */}
        {/* ================================================================= */}
        <div className="pt-8 border-t border-champagne-300/40 space-y-6 max-w-3xl mx-auto">
          <div className="text-center space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
              Quick Answers
            </span>
            <h3 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian uppercase">
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
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-serif-luxury text-sm sm:text-base text-obsidian font-semibold"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-gold-dark shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180' : ''}`} />
                </button>

                {activeFaq === i && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-obsidian/75 font-sans leading-relaxed border-t border-champagne-200/40">
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
