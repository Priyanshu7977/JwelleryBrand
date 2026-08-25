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
  Navigation as NavigationIcon,
  ShieldCheck,
  HelpCircle,
} from 'lucide-react';
import { RevealOnScroll } from '../components/motion/RevealOnScroll';

// Official WhatsApp Brand Logo
const OfficialWhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#25D366" />
    <path
      d="M17.5 14.36c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.17.25-.65.8-.8.97-.15.17-.3.19-.55.07-.25-.13-1.07-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.15.17-.25.26-.42.08-.17.04-.32-.02-.44-.06-.13-.56-1.34-.77-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.42.06-.65.31-.23.25-.87.85-.87 2.08s.89 2.41 1.01 2.58c.13.17 1.76 2.68 4.25 3.76.59.26 1.06.41 1.42.53.6.19 1.14.16 1.57.1.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.19-.06-.11-.22-.17-.47-.29z"
      fill="#FFFFFF"
    />
  </svg>
);

// Official Google Gmail Brand Logo
const OfficialGmailIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <path
      d="M20.5 5.5v13a1.5 1.5 0 0 1-1.5 1.5H18V10.2L12 14.7 6 10.2V20H5a1.5 1.5 0 0 1-1.5-1.5v-13c0-1.7 1.9-2.7 3.3-1.6L12 8.7l5.2-3.8c1.4-1.1 3.3-.1 3.3 1.6z"
      fill="#4285F4"
    />
    <path d="M12 14.7l6-4.5V4l-6 4.5L6 4v6.2l6 4.5z" fill="#EA4335" />
    <path d="M18 4l2.5 1.8c.6.4 1 1.2 1 2V4h-3.5z" fill="#FBBC05" />
    <path d="M6 4L3.5 5.8c-.6.4-1 1.2-1 2V4H6z" fill="#34A853" />
  </svg>
);

// Official Phone / Call Logo
const OfficialPhoneIcon: React.FC<{ className?: string }> = ({ className = "w-10 h-10" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="#1C1917" />
    <path
      d="M7.8 9.9c1.3 2.5 3.3 4.5 5.8 5.8l1.9-1.9c.2-.2.6-.3.9-.2 1 .3 2 .5 3.1.5.5 0 .9.4.9.9v3c0 .5-.4.9-.9.9-8.8 0-16-7.2-16-16 0-.5.4-.9.9-.9h3c.5 0 .9.4.9.9 0 1.1.2 2.1.5 3.1.1.3 0 .7-.2.9l-1.9 1.9z"
      fill="#F5EFE6"
    />
  </svg>
);

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
  const [activeFaq, setActiveFaq] = useState<number | null>(0); // First open by default

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

  const sanitizeMessage = (val: string): string => {
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/<[^>]*>/g, '')
      .replace(/javascript:/gi, '')
      .replace(/onerror\s*=/gi, '')
      .replace(/onload\s*=/gi, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = formData.name.replace(/[^a-zA-Z\s'-]/g, '').trim();
    const cleanEmail = formData.email.trim();
    const cleanPhone = formData.phone.trim();
    const cleanMessage = sanitizeMessage(formData.message).trim();

    if (!cleanName || cleanName.length < 2) {
      showToast("Please enter your name (letters only).");
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      showToast("Please enter a valid email address.");
      return;
    }

    if (cleanPhone) {
      const digits = cleanPhone.replace(/\D/g, '');
      if (digits.length < 10) {
        showToast("Please enter a valid 10-digit mobile/WhatsApp number.");
        return;
      }
    }

    if (!cleanMessage || cleanMessage.length < 5) {
      showToast("Please write a message with at least 5 characters (scripts & HTML not allowed).");
      return;
    }

    setIsSubmitting(true);
    try {
      await contactService.submitInquiry({
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        topic: 'General Atelier Inquiry',
        message: cleanMessage
      });
      setIsSubmitted(true);
      showToast("Your message has been sent to our Mumbai Atelier ✨");
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch {
      const text = `Hello Celestia Atelier! ✨%0A%0A*Name:* ${encodeURIComponent(cleanName)}%0A*Email:* ${encodeURIComponent(cleanEmail)}%0A*Phone:* ${encodeURIComponent(cleanPhone)}%0A*Message:* ${encodeURIComponent(cleanMessage)}`;
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
      a: "After placing your order or sending an inquiry, our concierge sends you a private WhatsApp upload link where you can share your high-res photos for instant custom archival printing."
    },
    {
      q: "Can I customise hamper gift box colors and personal ribbon engravings?",
      a: "Yes! Every celebration hamper allows you to choose your velvet keepsake box color, double-satin ribbon tone, and custom wax-sealed calligraphy card."
    }
  ];

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-28 sm:pt-32 pb-20 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300 overflow-x-hidden relative">
      {/* Background Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[450px] sm:w-[650px] h-[280px] sm:h-[400px] bg-champagne-200/25 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-7xl mx-auto space-y-8 sm:space-y-10 relative z-10">
        
        {/* ========================================================================= */}
        {/* 1ST SECTION: PHYSICAL ATELIER GOOGLE MAP & DIRECT REACH CHANNELS          */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="w-full bg-white/95 rounded-3xl border border-champagne-300/70 shadow-luxury-soft overflow-hidden p-5 sm:p-7 space-y-6">
            
            {/* Map Header & Directions CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-gold-dark font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Physical Atelier Location • Mumbai MMXXVI</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-bold text-obsidian uppercase">
                  Bandra West Studio, <span className="font-semibold text-gold-dark">Mumbai</span>
                </h1>
                <p className="text-xs text-obsidian-soft">
                  Bandra West, Mumbai, Maharashtra 400050, India • Open Daily: 10:00 AM – 8:00 PM IST
                </p>
              </div>

              <a
                href="https://maps.google.com/?q=Bandra+West,+Mumbai,+Maharashtra+400050"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary h-11 px-6 text-xs uppercase font-bold tracking-wider inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-[0.98] transition-all shrink-0 self-start sm:self-auto"
              >
                <NavigationIcon className="w-3.5 h-3.5" />
                <span>Get Directions</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            {/* Embedded Interactive Google Map */}
            <div className="w-full h-[300px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden border border-champagne-300/60 bg-sand/30 relative shadow-inner">
              <iframe
                title="Celestia Atelier Mumbai Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30164.717145293214!2d72.81898748367503!3d19.05955963782787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c8e123f8d27b%3A0x437996b49a236a78!2sBandra%20West%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'contrast(1.02) saturate(0.95)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />

              {/* Floating Studio Info Pill */}
              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 p-3.5 rounded-xl bg-obsidian/90 backdrop-blur-md text-pearl-50 border border-champagne-400/40 text-xs shadow-xl max-w-sm space-y-1 pointer-events-none">
                <div className="flex items-center gap-1.5 font-bold text-champagne-300 font-mono text-[10px] uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" />
                  <span>Celestia Studio & Atelier</span>
                </div>
                <p className="text-[11px] text-pearl-100 leading-snug">
                  Bandra West, Mumbai 400050 • Same-Day Mumbai Express Dispatch Ready
                </p>
              </div>
            </div>

            {/* Direct Channels Quick Bar below Map */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
              {/* WhatsApp */}
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-white/95 border border-emerald-300/80 hover:border-emerald-500 hover:shadow-md hover:bg-emerald-50/40 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <OfficialWhatsAppIcon className="w-10 h-10 shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform" />
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-emerald-800 tracking-wider block">
                      WhatsApp Concierge
                    </span>
                    <span className="text-xs font-mono font-bold text-obsidian block">
                      {BRAND_INFO.whatsapp}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Email / Gmail */}
              <a
                href={`mailto:${BRAND_INFO.email}`}
                className="p-4 rounded-2xl bg-white/95 border border-champagne-300/80 hover:border-gold-dark hover:shadow-md hover:bg-amber-50/40 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-pearl-100 border border-champagne-200/80 flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <OfficialGmailIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-obsidian-soft tracking-wider block">
                      Email Atelier
                    </span>
                    <span className="text-xs font-mono font-bold text-obsidian block truncate max-w-[150px]">
                      {BRAND_INFO.email}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-gold-dark group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              {/* Phone */}
              <a
                href={`tel:${BRAND_INFO.phone}`}
                className="p-4 rounded-2xl bg-white/95 border border-champagne-300/80 hover:border-obsidian hover:shadow-md hover:bg-pearl-100/60 transition-all flex items-center justify-between group shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <OfficialPhoneIcon className="w-10 h-10 shrink-0 drop-shadow-sm group-hover:scale-105 transition-transform" />
                  <div>
                    <span className="text-[10px] uppercase font-mono font-bold text-obsidian/80 tracking-wider block">
                      Direct Helpline
                    </span>
                    <span className="text-xs font-mono font-bold text-obsidian block">
                      {BRAND_INFO.phone}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-obsidian group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>

          </div>
        </RevealOnScroll>

        {/* ========================================================================= */}
        {/* 2ND SECTION: SEND A MESSAGE FORM (2nd on page)                            */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={100}>
          <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/95 p-6 sm:p-8 lg:p-10 rounded-3xl border border-champagne-300/60 shadow-luxury-soft">
            
            {/* Left Narrative & Response Promise (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-champagne-100 border border-champagne-300/80 text-[10px] sm:text-[11px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
                <span>Atelier Concierge Desk</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-obsidian uppercase leading-tight">
                SEND A <span className="font-semibold text-gold-dark">MESSAGE</span>.
              </h2>

              <p className="text-xs sm:text-sm text-obsidian-soft leading-relaxed">
                Have a question regarding custom hampers, sizing, bulk orders, or urgent Mumbai dispatch? Leave us a note and our Bandra studio concierge will get back to you promptly.
              </p>

              <div className="space-y-2 pt-2 border-t border-champagne-300/40 text-xs">
                <div className="flex items-center gap-2 text-obsidian">
                  <Clock className="w-4 h-4 text-gold-dark shrink-0" />
                  <span className="font-medium">Average response time: <strong>Under 2 hours</strong> during studio hours</span>
                </div>
                <div className="flex items-center gap-2 text-obsidian">
                  <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0" />
                  <span className="font-medium">Direct personal assistance from our founder & design team</span>
                </div>
              </div>
            </div>

            {/* Right Message Form (7 cols) */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80 flex items-center justify-between">
                    <span>Full Name *</span>
                    <span className="text-[10px] text-obsidian-soft/70 font-normal">Letters only</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onBeforeInput={(e: any) => {
                      if (e.data && /[0-9]/.test(e.data)) {
                        e.preventDefault();
                      }
                    }}
                    onKeyDown={(e) => {
                      // Allow all control/editing keys: Backspace, Delete, Arrows, Tab, Enter, etc.
                      if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
                      if (!/[a-zA-Z\s'-]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    onInput={(e: React.FormEvent<HTMLInputElement>) => {
                      const clean = e.currentTarget.value.replace(/[^a-zA-Z\s'-]/g, '');
                      e.currentTarget.value = clean;
                      setFormData(prev => ({ ...prev, name: clean }));
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text');
                      const clean = paste.replace(/[^a-zA-Z\s'-]/g, '');
                      setFormData(prev => ({ ...prev, name: (prev.name + clean).replace(/[^a-zA-Z\s'-]/g, '') }));
                    }}
                    onChange={(e) => {
                      const textOnly = e.target.value.replace(/[^a-zA-Z\s'-]/g, '');
                      setFormData({ ...formData, name: textOnly });
                    }}
                    placeholder="e.g. Radhika Sharma"
                    required
                    autoComplete="name"
                    pattern="[a-zA-Z\s'-]+"
                    title="Full name must only contain letters"
                    className="w-full px-4 py-2.5 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80">Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                      placeholder="you@example.com"
                      required
                      autoComplete="email"
                      className="w-full px-4 py-2.5 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80 flex items-center justify-between">
                      <span>Phone / WhatsApp</span>
                      <span className="text-[10px] text-obsidian-soft/70 font-normal">Digits only</span>
                    </label>
                    <input
                      type="tel"
                      inputMode="tel"
                      value={formData.phone}
                      onBeforeInput={(e: any) => {
                        if (e.data && /[a-zA-Z]/.test(e.data)) {
                          e.preventDefault();
                        }
                      }}
                      onKeyDown={(e) => {
                        // Allow all control/editing keys: Backspace, Delete, Arrows, Tab, Enter, etc.
                        if (e.key.length > 1 || e.ctrlKey || e.metaKey) return;
                        if (!/[0-9+\s-]/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onInput={(e: React.FormEvent<HTMLInputElement>) => {
                        const clean = e.currentTarget.value.replace(/[^0-9+\s-]/g, '').slice(0, 16);
                        e.currentTarget.value = clean;
                        setFormData(prev => ({ ...prev, phone: clean }));
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const paste = e.clipboardData.getData('text');
                        const clean = paste.replace(/[^0-9+\s-]/g, '').slice(0, 16);
                        setFormData(prev => ({ ...prev, phone: clean }));
                      }}
                      onChange={(e) => {
                        const numericOnly = e.target.value.replace(/[^0-9+\s-]/g, '').slice(0, 16);
                        setFormData({ ...formData, phone: numericOnly });
                      }}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      pattern="[0-9+\s-]{10,16}"
                      title="Phone number must only contain digits"
                      className="w-full px-4 py-2.5 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] uppercase font-mono font-bold text-obsidian/80 flex items-center justify-between">
                    <span>Message *</span>
                    <span className="text-[10px] text-obsidian-soft/70 font-normal">Plain text only</span>
                  </label>
                  <textarea
                    value={formData.message}
                    onBeforeInput={(e: any) => {
                      if (e.data && /[<>]/.test(e.data)) {
                        e.preventDefault();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === '<' || e.key === '>') {
                        e.preventDefault();
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text');
                      const clean = sanitizeMessage(paste);
                      setFormData(prev => ({ ...prev, message: sanitizeMessage(prev.message + clean) }));
                    }}
                    onChange={(e) => setFormData({ ...formData, message: sanitizeMessage(e.target.value) })}
                    placeholder="How can our atelier help you today?"
                    required
                    rows={3}
                    maxLength={1000}
                    className="w-full px-4 py-2.5 rounded-xl bg-pearl-50 border border-champagne-300/70 text-xs text-obsidian focus:outline-none focus:border-gold-dark resize-none font-sans transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full h-11 flex items-center justify-center gap-2 text-xs uppercase font-bold tracking-widest shadow-md hover:shadow-lg active:scale-[0.98] transition-all"
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
        </RevealOnScroll>

        {/* ========================================================================= */}
        {/* 3RD SECTION: FAQS IN 1 CONTINUOUS SECTION (Full Width 1-Column Stack)     */}
        {/* ========================================================================= */}
        <RevealOnScroll direction="up" delay={150}>
          <div className="w-full bg-white/95 rounded-3xl border border-champagne-300/60 shadow-luxury-soft p-6 sm:p-8 lg:p-10 space-y-6">
            
            {/* FAQs Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-champagne-300/40 pb-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-gold-dark font-mono text-[10px] sm:text-[11px] uppercase tracking-wider font-bold">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Frequently Asked Questions</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-obsidian uppercase">
                  ATELIER <span className="font-semibold text-gold-dark">KNOWLEDGE & HELP</span>.
                </h3>
              </div>
              <p className="text-xs text-obsidian-soft max-w-md">
                Common inquiries regarding bespoke hampers, sizing, anti-tarnish warranty, and Mumbai express deliveries.
              </p>
            </div>

            {/* 1 Single Continuous Column FAQ List */}
            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                      isOpen
                        ? 'border-gold-dark bg-champagne-50/50 shadow-sm'
                        : 'border-champagne-300/60 bg-pearl-50/70 hover:bg-white'
                    }`}
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-obsidian transition-colors"
                    >
                      <span className="leading-snug">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-gold-dark' : 'text-obsidian/60'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs sm:text-sm text-obsidian-soft leading-relaxed border-t border-champagne-300/40 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default ContactPage;
