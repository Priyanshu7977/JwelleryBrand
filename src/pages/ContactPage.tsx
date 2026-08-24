import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_INFO, FOUNDER_INFO, CUSTOMER_REVIEWS } from '../data/shopify-data';
import { useCart } from '../context/CartContext';
import { atelierSound } from '../utils/audioAtelier';
import {
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Send,
  Check,
  Clock,
  Calendar,
  ArrowRight,
  ShieldCheck,
  Copy,
  ExternalLink,
  ChevronDown,
  Instagram,
  Truck,
  Compass,
  Gift,
  Camera,
  Gem,
  Award,
  HelpCircle,
  User,
  ShoppingBag
} from 'lucide-react';

interface EnquiryCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
  defaultMsg: string;
}

export const ContactPage: React.FC = () => {
  const { showToast } = useCart();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    category: 'custom-hamper',
    preferredChannel: 'whatsapp' as 'whatsapp' | 'phone' | 'email',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);
  const [activeLocation, setActiveLocation] = useState<'bandra' | 'dispatch' | 'pan-india'>('bandra');
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState('');
  const [appointmentTime, setAppointmentTime] = useState('14:00');
  const [appointmentReason, setAppointmentReason] = useState('Bespoke Gifting & Hamper Curation');

  const enquiryCategories: EnquiryCategory[] = [
    {
      id: 'custom-hamper',
      title: 'Bespoke Celebration Hampers',
      subtitle: 'Velvet boxes, satin ribbons & bridesmaid curations',
      icon: Gift,
      tag: 'Gifting Studio',
      defaultMsg: 'Hi Celestia! I would like to curate a bespoke luxury gift hamper for an upcoming celebration.'
    },
    {
      id: 'jewellery-sizing',
      title: 'Fine Jewellery & Sizing Desk',
      subtitle: 'Bangle diameter (2.4, 2.6, 2.8) & anti-tarnish suites',
      icon: Gem,
      tag: 'Size & Styling',
      defaultMsg: 'Hi Celestia! I need assistance choosing the perfect bangle size and styling an anti-tarnish jewellery set.'
    },
    {
      id: 'polaroids-memories',
      title: 'Polaroids & Wax-Sealed Notes',
      subtitle: 'Fujifilm instant print specifications & handwritten letters',
      icon: Camera,
      tag: 'Personalisation',
      defaultMsg: 'Hi Celestia! I have custom photos I would like printed for the 20-pack retro Polaroids keepsake.'
    },
    {
      id: 'same-day-express',
      title: 'Mumbai Same-Day & Rush Orders',
      subtitle: 'Immediate courier dispatch across Mumbai & Thane',
      icon: Truck,
      tag: 'Express Dispatch',
      defaultMsg: 'Hi Celestia! I need an urgent same-day Mumbai delivery. Please confirm earliest courier dispatch.'
    }
  ];

  const faqs = [
    {
      question: "How does Mumbai Same-Day Express Delivery work?",
      answer: "Orders placed before 2:00 PM IST for Mumbai, Bandra, South Mumbai, Andheri, and Thane are hand-packed at our atelier and dispatched via dedicated express couriers on the same evening. You receive live WhatsApp tracking once our courier is en route."
    },
    {
      question: "Are your jewellery pieces 100% waterproof and anti-tarnish?",
      answer: "Yes. Our anti-tarnish fine jewellery pieces are crafted with premium surgical-grade stainless steel cores dipped in 18K gold and sealed with a protective molecular lacquer. They are rigorously tested against coastal humidity, sweat, perfumes, and daily water wear without color fading."
    },
    {
      question: "How do I provide my photos for the custom 20-pack retro Polaroids?",
      answer: "After placing your order on our site or through WhatsApp, our concierge desk sends you a private secure WhatsApp or Google Drive link where you can drop your 20 selected high-resolution photos. We color-correct each photo before printing on glossy Fujifilm instant emulsion."
    },
    {
      question: "Can I customize the ribbon color and handwritten wax-sealed letter?",
      answer: "Every bespoke hamper includes your choice of double-satin ribbon (Champagne Gold, Archival Blush, or Velvet Lavender) and a handwritten note inscribed in archival metallic ink, finished with warm gold wax stamped with the Celestia emblem."
    },
    {
      question: "What payment methods are supported for orders?",
      answer: "We support direct Instant UPI (Google Pay, PhonePe, Paytm, BHIM to 7718825792@okaxis), all major Credit & Debit cards, Net Banking, and direct WhatsApp concierge invoice checkout."
    },
    {
      question: "Do you ship Pan-India and internationally?",
      answer: "We deliver across all 28 Indian states with complimentary express air shipping on orders over ₹999. Typical Pan-India transit times range from 2 to 4 business days via Bluedart and Delhivery Express."
    }
  ];

  const handleCopy = (text: string, fieldName: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      showToast(`${fieldName} copied to clipboard ✨`);
      try {
        atelierSound.playBagSparkle();
      } catch {}
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      showToast(`Copied: ${text}`);
    }
  };

  const handleSelectCategory = (cat: EnquiryCategory) => {
    setFormData((prev) => ({
      ...prev,
      category: cat.id,
      message: prev.message.trim() === '' ? cat.defaultMsg : prev.message
    }));
    try {
      atelierSound.playBagSparkle();
    } catch {}
    // Smooth scroll to form
    const formEl = document.getElementById('atelier-inquiry-form');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      showToast("Please provide your name and contact number.");
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      showToast("Your inquiry has been submitted to the Mumbai Atelier ✨");
      try {
        atelierSound.playBagSparkle();
      } catch {}

      // If user preferred WhatsApp, offer immediate redirect
      if (formData.preferredChannel === 'whatsapp') {
        const msg = `Hello%20Celestia%20Atelier!%20✨%0A%0A*Name:*%20${encodeURIComponent(formData.name)}%0A*Phone:*%20${encodeURIComponent(formData.phone)}%0A*Email:*%20${encodeURIComponent(formData.email || 'N/A')}%0A*Topic:*%20${encodeURIComponent(formData.category)}%0A%0A*Message:*%20${encodeURIComponent(formData.message || 'I would like to inquire about your curated pieces.')}`;
        window.open(`https://wa.me/917718825792?text=${msg}`, '_blank');
      }

      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          category: 'custom-hamper',
          preferredChannel: 'whatsapp',
          message: ''
        });
      }, 4000);
    }, 1000);
  };

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appointmentDate) {
      showToast("Please select your preferred consultation date.");
      return;
    }
    const msg = `Hello%20Celestia%20Atelier!%20✨%0A%0AI%20would%20like%20to%20schedule%20a%20*Private%20Atelier%20Consultation*:%0A*Date:*%20${encodeURIComponent(appointmentDate)}%0A*Time:*%20${encodeURIComponent(appointmentTime)}%0A*Purpose:*%20${encodeURIComponent(appointmentReason)}%0A%0APlease%20confirm%20availability%20at%20your%20Bandra%20West%20Studio.`;
    window.open(`https://wa.me/917718825792?text=${msg}`, '_blank');
    setAppointmentModalOpen(false);
    showToast("Opening WhatsApp to confirm your atelier visit ✨");
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-36 sm:pt-40 md:pt-44 pb-32 px-4 sm:px-8 md:px-12 lg:px-20 selection:bg-champagne-300">
      {/* Soft Architectural Glows */}
      <div className="absolute top-24 left-1/4 w-[600px] h-[600px] bg-champagne-200/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[500px] h-[500px] bg-blush-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-20 sm:space-y-24">

        {/* ================================================================= */}
        {/* 1. CINEMATIC HERO: "COME FIND US"                                 */}
        {/* ================================================================= */}
        <section className="relative border-b border-champagne-300/40 pb-14 space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            
            <div className="space-y-4 max-w-3xl">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] uppercase tracking-monumental text-gold-dark font-semibold shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Act • Direct Line to Mumbai Atelier</span>
              </div>

              <h1 className="font-serif-luxury text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-obsidian uppercase font-normal leading-[0.9] tracking-tight">
                COME FIND <span className="italic font-light text-gold-dark lowercase">us.</span>
              </h1>

              <p className="text-sm sm:text-base text-obsidian/75 font-sans leading-relaxed max-w-2xl">
                From our coastal studio in Mumbai to doorstep unboxings across India. Whether curating a bespoke bridesmaid hamper, sizing an artisanal bangle stack, or scheduling same-day dispatch, our atelier concierge is at your service.
              </p>
            </div>

            {/* Quick Status & Response Stat Pills */}
            <div className="flex flex-wrap lg:flex-col gap-3 lg:items-end shrink-0">
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-sans shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-semibold">Atelier Live</span>
                <span className="text-emerald-700 font-mono">• &lt; 15 min reply</span>
              </div>

              <div className="inline-flex items-center gap-2 px-4 py-2 bg-pearl-50 border border-champagne-300/60 rounded-2xl text-xs text-obsidian/80 font-sans shadow-sm">
                <Truck className="w-3.5 h-3.5 text-gold-dark" />
                <span>Mumbai Same-Day Cutoff: <strong>2:00 PM IST</strong></span>
              </div>
            </div>

          </div>

          {/* 4 Trust Pillar Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 pt-4">
            <div className="p-4 rounded-2xl bg-pearl-50/90 border border-champagne-300/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center text-gold-dark shrink-0">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury text-sm text-obsidian font-bold">1:1 Concierge</p>
                <p className="text-[10px] text-obsidian/60 font-mono">Personalized Attention</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-pearl-50/90 border border-champagne-300/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center text-gold-dark shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury text-sm text-obsidian font-bold">Same-Day Mumbai</p>
                <p className="text-[10px] text-obsidian/60 font-mono">Express Courier Flight</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-pearl-50/90 border border-champagne-300/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center text-gold-dark shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury text-sm text-obsidian font-bold">100% Anti-Tarnish</p>
                <p className="text-[10px] text-obsidian/60 font-mono">Guaranteed Durability</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-pearl-50/90 border border-champagne-300/60 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-champagne-100 flex items-center justify-center text-gold-dark shrink-0">
                <Gift className="w-5 h-5" />
              </div>
              <div>
                <p className="font-serif-luxury text-sm text-obsidian font-bold">Wax Seal Packaging</p>
                <p className="text-[10px] text-obsidian/60 font-mono">Archival Double Satin</p>
              </div>
            </div>
          </div>
        </section>


        {/* ================================================================= */}
        {/* 2. THREE PRIMARY CONCIERGE CHANNELS (WhatsApp, Voice, Email)      */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Direct Channels
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian uppercase">
                ATELIER <span className="italic font-light text-gold-dark">Desks</span>.
              </h2>
            </div>
            <p className="text-xs text-obsidian/60 font-sans max-w-sm">
              Connect instantly with our lead curators in Mumbai via your preferred medium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* WhatsApp Card */}
            <div className="relative p-7 rounded-3xl bg-pearl-50 border border-emerald-300/60 shadow-luxury-soft flex flex-col justify-between space-y-6 group hover:border-emerald-500 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-inner">
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 text-[10px] font-mono font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Instant Dispatch
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-luxury text-2xl text-obsidian font-semibold">
                    WhatsApp Concierge
                  </h3>
                  <p className="text-xs text-obsidian/70 font-sans mt-1 leading-relaxed">
                    Fastest response for custom polaroid uploads, urgent deliveries, and live jewellery video previews.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-emerald-200/80 flex items-center justify-between">
                  <span className="font-mono text-xs text-obsidian font-bold">
                    {BRAND_INFO.whatsapp}
                  </span>
                  <button
                    onClick={() => handleCopy(BRAND_INFO.whatsapp, 'WhatsApp Number')}
                    className="p-1 text-emerald-800 hover:text-emerald-950 transition-colors"
                    title="Copy phone number"
                  >
                    {copiedField === 'WhatsApp Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-full bg-emerald-800 hover:bg-emerald-900 text-pearl-50 text-xs uppercase font-mono tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.01]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Open WhatsApp Desk</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>

            {/* Direct Voice Line Card */}
            <div className="relative p-7 rounded-3xl bg-pearl-50 border border-champagne-300/70 shadow-luxury-soft flex flex-col justify-between space-y-6 group hover:border-gold-dark transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-gold-dark flex items-center justify-center shadow-inner">
                    <Phone className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-obsidian/60 bg-white px-2.5 py-0.5 rounded-full border border-champagne-300/40">
                    10:00 — 20:00 IST
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-luxury text-2xl text-obsidian font-semibold">
                    Atelier Direct Line
                  </h3>
                  <p className="text-xs text-obsidian/70 font-sans mt-1 leading-relaxed">
                    Speak directly with a specialist regarding sizing calibration, bridal bespoke orders, or order tracking.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-champagne-300/60 flex items-center justify-between">
                  <span className="font-mono text-xs text-obsidian font-bold">
                    {BRAND_INFO.phone}
                  </span>
                  <button
                    onClick={() => handleCopy(BRAND_INFO.phone, 'Phone Number')}
                    className="p-1 text-gold-dark hover:text-obsidian transition-colors"
                    title="Copy phone number"
                  >
                    {copiedField === 'Phone Number' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <a
                href={`tel:${BRAND_INFO.phone}`}
                className="w-full py-3.5 px-6 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 text-xs uppercase font-mono tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.01]"
              >
                <Phone className="w-4 h-4" />
                <span>Call Concierge Line</span>
              </a>
            </div>

            {/* Email Inbox Card */}
            <div className="relative p-7 rounded-3xl bg-pearl-50 border border-champagne-300/70 shadow-luxury-soft flex flex-col justify-between space-y-6 group hover:border-gold-dark transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-champagne-100 text-gold-dark flex items-center justify-center shadow-inner">
                    <Mail className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-obsidian/60 bg-white px-2.5 py-0.5 rounded-full border border-champagne-300/40">
                    &lt; 2hr SLA
                  </span>
                </div>

                <div>
                  <h3 className="font-serif-luxury text-2xl text-obsidian font-semibold">
                    Private Atelier Inbox
                  </h3>
                  <p className="text-xs text-obsidian/70 font-sans mt-1 leading-relaxed">
                    For corporate gifting proposals, PR collaborations, high-volume celebrations, and detailed queries.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-champagne-300/60 flex items-center justify-between">
                  <span className="font-sans text-xs text-obsidian font-medium truncate max-w-[200px]">
                    {BRAND_INFO.email}
                  </span>
                  <button
                    onClick={() => handleCopy(BRAND_INFO.email, 'Email Address')}
                    className="p-1 text-gold-dark hover:text-obsidian transition-colors"
                    title="Copy email address"
                  >
                    {copiedField === 'Email Address' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <a
                href={`mailto:${BRAND_INFO.email}?subject=Celestia%20Atelier%20Inquiry`}
                className="w-full py-3.5 px-6 rounded-full border border-champagne-300/80 bg-white hover:bg-champagne-100/60 text-obsidian text-xs uppercase font-mono tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm transition-all group-hover:scale-[1.01]"
              >
                <Mail className="w-4 h-4" />
                <span>Compose Email</span>
              </a>
            </div>

          </div>
        </section>


        {/* ================================================================= */}
        {/* 3. INTERACTIVE MUMBAI ATELIER MAP & GEOGRAPHY PULSE               */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="bg-obsidian text-pearl-100 rounded-3xl p-8 sm:p-12 md:p-16 border border-champagne-400/40 shadow-2xl relative overflow-hidden">
            {/* Background Texture & Compass Watermark */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 opacity-10 pointer-events-none text-champagne-300">
              <Compass className="w-full h-full stroke-[0.5]" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
              
              {/* Left Details */}
              <div className="lg:col-span-6 space-y-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-champagne-400/30 text-[10px] font-mono uppercase tracking-widest text-champagne-300">
                    <MapPin className="w-3 h-3 text-gold" />
                    <span>Mumbai Atelier & Dispatch Grid</span>
                  </div>
                  <h2 className="font-serif-luxury text-4xl sm:text-5xl text-pearl-50 uppercase">
                    CRAFTED ON THE <span className="italic font-light text-champagne-300">Coast</span>.
                  </h2>
                  <p className="text-xs sm:text-sm text-pearl-200/80 font-sans leading-relaxed">
                    Our creative studio operates from Bandra West, Mumbai. Every single parcel is inspected under natural coastal daylight, sealed with gold wax, and handed directly to express flight and road couriers.
                  </p>
                </div>

                {/* Interactive Location Hub Selector */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => setActiveLocation('bandra')}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                      activeLocation === 'bandra'
                        ? 'bg-white/15 border-champagne-300 text-pearl-50 shadow-lg'
                        : 'bg-white/5 border-white/10 text-pearl-200/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-champagne-300 text-obsidian flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      01
                    </div>
                    <div>
                      <p className="font-serif-luxury text-base font-semibold text-pearl-50">
                        Bandra West Creative Studio & Workshop
                      </p>
                      <p className="text-xs text-pearl-200/70 font-sans mt-0.5">
                        Design lab, personalised polaroid darkroom printing, and archival wax sealing.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveLocation('dispatch')}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                      activeLocation === 'dispatch'
                        ? 'bg-white/15 border-champagne-300 text-pearl-50 shadow-lg'
                        : 'bg-white/5 border-white/10 text-pearl-200/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-champagne-300 text-obsidian flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      02
                    </div>
                    <div>
                      <p className="font-serif-luxury text-base font-semibold text-pearl-50">
                        Mumbai Express Dispatch Gateway
                      </p>
                      <p className="text-xs text-pearl-200/70 font-sans mt-0.5">
                        Same-day courier dispatch across South Mumbai, Western & Central Suburbs, and Navi Mumbai.
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveLocation('pan-india')}
                    className={`w-full p-4 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                      activeLocation === 'pan-india'
                        ? 'bg-white/15 border-champagne-300 text-pearl-50 shadow-lg'
                        : 'bg-white/5 border-white/10 text-pearl-200/70 hover:bg-white/10'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-champagne-300 text-obsidian flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                      03
                    </div>
                    <div>
                      <p className="font-serif-luxury text-base font-semibold text-pearl-50">
                        Pan-India Air Logistics Network
                      </p>
                      <p className="text-xs text-pearl-200/70 font-sans mt-0.5">
                        Daily air cargo dispatches via Delhivery & Bluedart to Delhi, Bengaluru, Hyderabad, and all states.
                      </p>
                    </div>
                  </button>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 pt-2">
                  <a
                    href="https://maps.google.com/?q=Bandra+West+Mumbai"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-champagne-300 hover:bg-champagne-200 text-obsidian text-xs uppercase font-mono tracking-widest font-bold flex items-center gap-2 shadow-md transition-all"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                  </a>

                  <button
                    onClick={() => setAppointmentModalOpen(true)}
                    className="px-6 py-3 rounded-full border border-champagne-400/60 bg-transparent hover:bg-white/10 text-pearl-100 text-xs uppercase font-mono tracking-widest font-semibold flex items-center gap-2 transition-all"
                  >
                    <Calendar className="w-4 h-4 text-champagne-300" />
                    <span>Book Private Consultation</span>
                  </button>
                </div>
              </div>

              {/* Right Stylized Interactive Radar Graphic */}
              <div className="lg:col-span-6 relative">
                <div className="relative aspect-square max-w-md mx-auto rounded-3xl bg-[#120F0D] border border-champagne-400/30 p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
                  
                  {/* Grid Lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px]" />
                  
                  {/* Pulse Rings */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full border border-champagne-400/20 animate-ping opacity-40 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 rounded-full border border-champagne-300/30" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-champagne-300/10 border border-champagne-300/50" />

                  {/* Header info */}
                  <div className="relative z-10 flex items-center justify-between text-xs font-mono text-champagne-300/90">
                    <span className="tracking-widest">19.0596° N, 72.8295° E</span>
                    <span className="inline-flex items-center gap-1.5 bg-emerald-950/80 border border-emerald-600/50 text-emerald-400 px-2.5 py-0.5 rounded-full text-[10px]">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      LIVE STUDIO
                    </span>
                  </div>

                  {/* Central Atelier Beacon */}
                  <div className="relative z-10 text-center my-auto space-y-2">
                    <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-champagne-200 to-gold-dark text-obsidian flex items-center justify-center shadow-[0_0_30px_rgba(216,195,154,0.6)] animate-bounce-short">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif-luxury text-xl text-pearl-50">
                        {activeLocation === 'bandra' && 'Bandra West Atelier'}
                        {activeLocation === 'dispatch' && 'Western Express Hub'}
                        {activeLocation === 'pan-india' && 'Air Logistics Gateway'}
                      </h4>
                      <p className="text-[11px] font-mono text-champagne-200/80">
                        Mumbai • Dispatches Active
                      </p>
                    </div>
                  </div>

                  {/* Bottom Stats */}
                  <div className="relative z-10 grid grid-cols-2 gap-2 pt-4 border-t border-white/10 text-xs font-mono">
                    <div className="bg-white/5 p-2.5 rounded-xl">
                      <span className="text-pearl-200/60 block text-[9px] uppercase">Daily Parcels</span>
                      <span className="text-pearl-100 font-bold">1,000+ Dispatched</span>
                    </div>
                    <div className="bg-white/5 p-2.5 rounded-xl text-right">
                      <span className="text-pearl-200/60 block text-[9px] uppercase">Avg Fulfillment</span>
                      <span className="text-emerald-400 font-bold">&lt; 4 Hours</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================================================================= */}
        {/* 4. SPECIALIZED ENQUIRY SELECTOR DESKS                             */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
              Specialized Guidance
            </span>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-obsidian uppercase">
              SELECT YOUR <span className="italic font-light text-gold-dark">Curiosity</span>.
            </h2>
            <p className="text-xs sm:text-sm text-obsidian/70 font-sans">
              Tap a specialized concierge desk below to pre-configure your inquiry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {enquiryCategories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = formData.category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat)}
                  className={`p-6 rounded-3xl text-left border transition-all flex flex-col justify-between space-y-4 group ${
                    isSelected
                      ? 'bg-champagne-100/80 border-gold-dark shadow-luxury-soft scale-[1.02]'
                      : 'bg-pearl-50/80 border-champagne-300/50 hover:bg-white hover:border-champagne-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-obsidian text-pearl-100' : 'bg-champagne-100 text-gold-dark group-hover:bg-obsidian group-hover:text-pearl-100'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] uppercase font-mono tracking-wider text-gold-dark font-bold bg-white px-2 py-0.5 rounded-full border border-champagne-300/40">
                      {cat.tag}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif-luxury text-lg text-obsidian font-semibold leading-snug">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-obsidian/65 font-sans leading-relaxed">
                      {cat.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-champagne-300/30 flex items-center justify-between text-xs font-mono font-medium text-gold-dark">
                    <span>{isSelected ? '✓ Selected' : 'Inquire Now'}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>
        </section>


        {/* ================================================================= */}
        {/* 5. CONTACT FORM (LEFT) + EDITORIAL ATELIER IMAGE (RIGHT)           */}
        {/* ================================================================= */}
        <section id="atelier-inquiry-form" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-stretch">
            
            {/* Left Form (7 Cols) */}
            <div className="lg:col-span-7 bg-pearl-50/95 p-6 sm:p-10 md:p-12 rounded-3xl border border-champagne-300/70 shadow-luxury-soft flex flex-col justify-between space-y-6">
              
              <div className="space-y-2 border-b border-champagne-300/40 pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                    Official Concierge Form
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gold-dark" />
                  <span className="text-xs font-serif italic text-obsidian/60">Mumbai Studio</span>
                </div>
                <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian uppercase">
                  SUBMIT AN ATELIER <span className="italic font-light text-gold-dark">Inquiry</span>.
                </h2>
                <p className="text-xs text-obsidian/70 font-sans">
                  Direct personal attention. We review every note and reply within 2 hours during studio operations.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-bold block font-mono">
                      Your Full Name *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Radhika Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 pl-10 rounded-2xl bg-white border border-champagne-300/80 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark shadow-sm transition-all"
                      />
                      <User className="w-4 h-4 text-obsidian/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-bold block font-mono">
                      WhatsApp / Contact Phone *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3.5 pl-10 rounded-2xl bg-white border border-champagne-300/80 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark shadow-sm transition-all"
                      />
                      <Phone className="w-4 h-4 text-obsidian/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                {/* Email & Preferred Channel */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-bold block font-mono">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="radhika@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3.5 pl-10 rounded-2xl bg-white border border-champagne-300/80 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark shadow-sm transition-all"
                      />
                      <Mail className="w-4 h-4 text-obsidian/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-bold block font-mono">
                      Preferred Reply Channel
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredChannel: 'whatsapp' })}
                        className={`py-3 px-2 rounded-xl text-[10px] font-mono uppercase font-bold border transition-all flex items-center justify-center gap-1 ${
                          formData.preferredChannel === 'whatsapp'
                            ? 'bg-emerald-800 text-white border-emerald-800 shadow-sm'
                            : 'bg-white text-obsidian/70 border-champagne-300/60 hover:bg-champagne-50'
                        }`}
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredChannel: 'phone' })}
                        className={`py-3 px-2 rounded-xl text-[10px] font-mono uppercase font-bold border transition-all flex items-center justify-center gap-1 ${
                          formData.preferredChannel === 'phone'
                            ? 'bg-obsidian text-white border-obsidian shadow-sm'
                            : 'bg-white text-obsidian/70 border-champagne-300/60 hover:bg-champagne-50'
                        }`}
                      >
                        <Phone className="w-3 h-3" />
                        <span>Phone</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredChannel: 'email' })}
                        className={`py-3 px-2 rounded-xl text-[10px] font-mono uppercase font-bold border transition-all flex items-center justify-center gap-1 ${
                          formData.preferredChannel === 'email'
                            ? 'bg-gold-dark text-white border-gold-dark shadow-sm'
                            : 'bg-white text-obsidian/70 border-champagne-300/60 hover:bg-champagne-50'
                        }`}
                      >
                        <Mail className="w-3 h-3" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Inquiry Category Pills */}
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-bold block font-mono">
                    Select Consultation Topic
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {enquiryCategories.map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, category: cat.id })}
                        className={`px-3 py-1.5 rounded-full text-xs font-sans transition-all border ${
                          formData.category === cat.id
                            ? 'bg-obsidian text-pearl-100 border-obsidian shadow-sm font-semibold'
                            : 'bg-white text-obsidian/70 border-champagne-300/60 hover:bg-champagne-100/50'
                        }`}
                      >
                        {cat.title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message Box */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-[11px] uppercase tracking-wider text-obsidian/70 font-bold block font-mono">
                      Your Message or Custom Request
                    </label>
                    <span className="text-[10px] font-mono text-obsidian/50">
                      {formData.message.length}/500 chars
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={500}
                    placeholder="Describe your bespoke curation, wrist diameter, celebration date, or delivery instructions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-white border border-champagne-300/80 font-sans text-xs text-obsidian focus:outline-none focus:border-gold-dark shadow-sm transition-all leading-relaxed"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-8 rounded-full bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold hover:bg-obsidian-200 transition-all flex items-center justify-center gap-2.5 shadow-luxury-soft group"
                  >
                    {isSubmitting ? (
                      <span>Connecting with Atelier...</span>
                    ) : isSubmitted ? (
                      <>
                        <Check className="w-4 h-4 text-champagne-300" />
                        <span>Inquiry Dispatched Successfully</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-champagne-300 group-hover:translate-x-1 transition-transform" />
                        <span>Transmit Inquiry to Mumbai Atelier</span>
                      </>
                    )}
                  </button>
                </div>

              </form>

            </div>

            {/* Right Editorial Showcase Card (5 Cols) */}
            <div className="lg:col-span-5 relative flex flex-col justify-between rounded-3xl overflow-hidden bg-obsidian text-pearl-100 border border-champagne-400/40 shadow-2xl p-6 sm:p-8 space-y-6">
              
              {/* Top Founder & Atelier Portrait Frame */}
              <div className="relative aspect-[4/4.5] rounded-2xl overflow-hidden bg-sand/30 border border-champagne-400/30 shadow-inner group">
                <img
                  src={FOUNDER_INFO.image}
                  alt={FOUNDER_INFO.altText}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />
                
                {/* Gradient Foil Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />

                {/* Floating Authenticity Badge */}
                <div className="absolute top-4 left-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-obsidian/85 backdrop-blur-md border border-champagne-300/40 text-[10px] font-mono uppercase tracking-widest text-champagne-300 font-bold">
                    <Award className="w-3.5 h-3.5 text-gold-dark" />
                    Mumbai Atelier Approved
                  </span>
                </div>

                {/* Bottom Signature Quote on Image */}
                <div className="absolute bottom-4 left-4 right-4 text-pearl-100 space-y-1">
                  <p className="font-serif italic text-base text-champagne-200">
                    {FOUNDER_INFO.quote}
                  </p>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-pearl-300">
                    — {FOUNDER_INFO.title}, CELestia Amor
                  </p>
                </div>
              </div>

              {/* Story Highlights */}
              <div className="space-y-3 pt-2 text-xs font-sans text-pearl-200/80 leading-relaxed">
                <div className="flex items-center gap-2 text-champagne-300 font-mono text-[11px] font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The 100% Anti-Tarnish Commitment</span>
                </div>
                <p>
                  Every ring, bangle, and pendant is personally examined in our Mumbai studio prior to boxing. When you message our desk, you speak with the artisans who pack your pieces.
                </p>
              </div>

              {/* Instant WhatsApp Quick Card */}
              <div className="p-4 bg-white/10 rounded-2xl border border-champagne-300/30 flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-mono tracking-wider text-champagne-300 font-bold">
                    Have a quick question?
                  </p>
                  <p className="font-serif text-sm text-pearl-50">
                    WhatsApp us directly
                  </p>
                </div>

                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-obsidian text-[11px] uppercase font-mono font-bold flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat</span>
                </a>
              </div>

            </div>

          </div>
        </section>


        {/* ================================================================= */}
        {/* 6. VISIT THE ATELIER & PRIVATE APPOINTMENTS                       */}
        {/* ================================================================= */}
        <section className="bg-pearl-50/90 rounded-3xl p-8 sm:p-12 border border-champagne-300/60 shadow-sm space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-champagne-300/40 pb-6">
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Private In-Person Sessions
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian uppercase">
                VISIT THE MUMBAI <span className="italic font-light text-gold-dark">Atelier</span>.
              </h2>
              <p className="text-xs sm:text-sm text-obsidian/70 font-sans max-w-xl">
                We welcome private appointments for bespoke wedding bridal suites, personalized curation sessions, and custom hamper unboxing consultations.
              </p>
            </div>

            <button
              onClick={() => setAppointmentModalOpen(true)}
              className="px-8 py-4 rounded-full bg-obsidian hover:bg-obsidian-200 text-pearl-100 text-xs uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-2 shadow-luxury-soft shrink-0 transition-all"
            >
              <Calendar className="w-4 h-4 text-champagne-300" />
              <span>Schedule Private Visit</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-sans">
            
            {/* Timings */}
            <div className="p-6 bg-white rounded-2xl border border-champagne-300/50 space-y-2">
              <div className="flex items-center gap-2 text-gold-dark font-mono font-bold text-xs uppercase">
                <Clock className="w-4 h-4" />
                <span>Operating Timings</span>
              </div>
              <div className="space-y-1 text-obsidian/80">
                <p><strong>Monday — Saturday:</strong> 10:00 AM — 8:00 PM IST</p>
                <p><strong>Sunday:</strong> 11:00 AM — 6:00 PM IST</p>
                <p className="text-[10px] text-emerald-800 font-mono mt-1">Same-Day couriers depart daily at 4:30 PM</p>
              </div>
            </div>

            {/* Studio Address */}
            <div className="p-6 bg-white rounded-2xl border border-champagne-300/50 space-y-2">
              <div className="flex items-center gap-2 text-gold-dark font-mono font-bold text-xs uppercase">
                <MapPin className="w-4 h-4" />
                <span>Atelier Location</span>
              </div>
              <div className="space-y-1 text-obsidian/80">
                <p className="font-semibold text-obsidian">CELestia Amor Atelier</p>
                <p>Bandra West, Mumbai, Maharashtra 400050</p>
                <p className="text-[10px] text-obsidian/60 font-mono">By appointment for bespoke consultation</p>
              </div>
            </div>

            {/* Consultation Benefits */}
            <div className="p-6 bg-white rounded-2xl border border-champagne-300/50 space-y-2">
              <div className="flex items-center gap-2 text-gold-dark font-mono font-bold text-xs uppercase">
                <Sparkles className="w-4 h-4" />
                <span>What To Expect</span>
              </div>
              <div className="space-y-1 text-obsidian/80">
                <p>• Live bangle diameter measurement try-on</p>
                <p>• Velvet box & double satin ribbon selection</p>
                <p>• Instant test Polaroid photo emulsion proofing</p>
              </div>
            </div>

          </div>
        </section>


        {/* ================================================================= */}
        {/* 7. PREMIUM FAQ ACCORDION                                          */}
        {/* ================================================================= */}
        <section className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pearl-50 border border-champagne-300/70 text-[10px] font-mono uppercase tracking-widest text-gold-dark font-semibold shadow-sm">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Questions & Answers</span>
            </div>
            <h2 className="font-serif-luxury text-3xl sm:text-5xl text-obsidian uppercase">
              FREQUENTLY <span className="italic font-light text-gold-dark">Asked</span>.
            </h2>
            <p className="text-xs sm:text-sm text-obsidian/70 font-sans">
              Everything you need to know about our Mumbai dispatch, bespoke packaging, and care.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white border-gold-dark shadow-luxury-soft'
                      : 'bg-pearl-50/80 border-champagne-300/50 hover:bg-white hover:border-champagne-400'
                  }`}
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                  >
                    <span className="font-serif-luxury text-base sm:text-lg text-obsidian font-semibold">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-5 h-5 text-gold-dark shrink-0 transition-transform duration-300 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-obsidian/75 font-sans leading-relaxed border-t border-champagne-200/40">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>


        {/* ================================================================= */}
        {/* 8. INSTAGRAM & CUSTOMER UNBOXING HIGHLIGHTS                       */}
        {/* ================================================================= */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-champagne-300/40 pb-6">
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-gold-dark font-bold">
                Live Community Feed
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl text-obsidian uppercase">
                UNBOXING <span className="italic font-light text-gold-dark">Praise</span>.
              </h2>
            </div>

            <a
              href={BRAND_INFO.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-obsidian font-bold hover:text-gold-dark transition-colors"
            >
              <Instagram className="w-4 h-4 text-rose-600" />
              <span>Follow @celestiaamor.in</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.slice(0, 3).map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-3xl bg-pearl-50 border border-champagne-300/50 shadow-sm space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-bold">
                      {rev.tag}
                    </span>
                    <span className="text-amber-500 font-bold">★★★★★</span>
                  </div>

                  <p className="font-serif italic text-sm text-obsidian/85 leading-relaxed">
                    "{rev.comment}"
                  </p>
                </div>

                <div className="pt-3 border-t border-champagne-300/30 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-serif-luxury font-bold text-obsidian">{rev.author}</p>
                    <p className="text-[10px] text-obsidian/50">{rev.location}</p>
                  </div>
                  <span className="text-[9px] font-mono text-gold-dark uppercase font-semibold">
                    Verified Order
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>


        {/* ================================================================= */}
        {/* 9. FINAL CINEMATIC CTA BANNER                                     */}
        {/* ================================================================= */}
        <section className="bg-obsidian text-pearl-100 rounded-3xl p-10 sm:p-14 md:p-20 text-center space-y-8 border border-champagne-400/40 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#D8C39A_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest-luxury text-champagne-300 font-bold">
              Begin Your Celestia Journey
            </span>

            <h2 className="font-serif-luxury text-4xl sm:text-6xl text-pearl-50 uppercase leading-tight">
              WEAR YOUR <span className="italic font-light text-champagne-300">World</span>.
            </h2>

            <p className="text-xs sm:text-sm text-pearl-200/80 font-sans max-w-lg mx-auto leading-relaxed">
              Explore 400+ handcrafted pieces, curated velvet celebration boxes, and personal polaroid memories packed with love in Mumbai.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-champagne-300 hover:bg-champagne-200 text-obsidian text-xs uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Explore Entire Runway</span>
              </Link>

              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-champagne-300/80 bg-transparent hover:bg-white/10 text-pearl-50 text-xs uppercase font-mono tracking-widest font-semibold flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>WhatsApp Atelier Desk</span>
              </a>
            </div>
          </div>
        </section>

      </div>

      {/* =================================================================== */}
      {/* MODAL: PRIVATE ATELIER CONSULTATION SCHEDULER                       */}
      {/* =================================================================== */}
      {appointmentModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div
            onClick={() => setAppointmentModalOpen(false)}
            className="fixed inset-0 bg-obsidian/60 backdrop-blur-md transition-opacity"
          />

          <div className="relative w-full max-w-lg bg-pearl-50 rounded-3xl shadow-2xl p-6 sm:p-8 z-10 border border-champagne-300 space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-champagne-300/40 pb-4">
              <div className="flex items-center gap-2.5">
                <Calendar className="w-5 h-5 text-gold-dark" />
                <h3 className="font-serif-luxury text-2xl text-obsidian font-bold">
                  Book Atelier Visit
                </h3>
              </div>
              <button
                onClick={() => setAppointmentModalOpen(false)}
                className="text-xs font-mono text-obsidian/60 hover:text-obsidian p-1"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={handleBookAppointment} className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                  Select Preferred Date *
                </label>
                <input
                  type="date"
                  required
                  value={appointmentDate}
                  onChange={(e) => setAppointmentDate(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-champagne-300 text-obsidian font-sans text-xs focus:outline-none focus:border-gold-dark shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                  Select Preferred Time *
                </label>
                <select
                  value={appointmentTime}
                  onChange={(e) => setAppointmentTime(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-champagne-300 text-obsidian font-sans text-xs focus:outline-none focus:border-gold-dark shadow-sm"
                >
                  <option value="11:00">11:00 AM — Morning Slot</option>
                  <option value="14:00">02:00 PM — Afternoon Slot</option>
                  <option value="16:30">04:30 PM — Sunset Slot</option>
                  <option value="18:30">06:30 PM — Evening Slot</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] uppercase font-mono tracking-wider text-obsidian/70 font-bold block">
                  Consultation Focus
                </label>
                <select
                  value={appointmentReason}
                  onChange={(e) => setAppointmentReason(e.target.value)}
                  className="w-full p-3.5 rounded-2xl bg-white border border-champagne-300 text-obsidian font-sans text-xs focus:outline-none focus:border-gold-dark shadow-sm"
                >
                  <option value="Bespoke Gifting & Hamper Curation">Bespoke Gifting & Hamper Curation</option>
                  <option value="Bridal Jewellery & Bangle Stack Sizing">Bridal Jewellery & Bangle Stack Sizing</option>
                  <option value="Personalised Polaroids Proofing">Personalised Polaroids Proofing</option>
                  <option value="Corporate / Bulk Celebration Inquiries">Corporate / Bulk Celebration Inquiries</option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-full bg-emerald-800 hover:bg-emerald-900 text-pearl-50 text-xs uppercase font-mono tracking-widest font-bold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Confirm via WhatsApp Concierge</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ContactPage;
