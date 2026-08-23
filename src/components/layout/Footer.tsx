import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_INFO } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { Instagram, MessageCircle, Phone, Sparkles, Send, Check, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const { showToast } = useCart();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast("Please enter a valid email address.");
      return;
    }
    setIsSubscribed(true);
    showToast("Welcome to Celestia Private Circle ✨");
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{ backgroundColor: '#181411', color: '#FAF7F0' }}
      className="relative z-30 w-full border-t border-[#D8C39A]/40 pt-20 pb-12 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      {/* Ambient background noise & subtle warm gold radiance */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D8C39A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1500px] mx-auto space-y-16 relative z-10">
        
        {/* Grand Dramatic Brand Closing Statement */}
        <div className="text-center space-y-4 pb-12 border-b border-[#D8C39A]/25">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#28231F] border border-[#D8C39A]/40 text-xs uppercase font-mono tracking-widest text-[#D8C39A] font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-[#D8C39A]" />
            <span>The Mumbai Atelier MMXXVI</span>
          </div>

          <h2 className="font-serif-luxury text-4xl sm:text-6xl md:text-7xl text-[#FAF7F0] tracking-[0.06em] uppercase font-normal leading-tight max-w-5xl mx-auto">
            WHERE TIMELESS <span className="italic font-light text-[#D8C39A]">Charm</span> MEETS EVERYDAY <span className="italic font-light text-[#D8C39A]">Grace</span>.
          </h2>
        </div>

        {/* 4-Column Editorial Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-[#D8C39A]/25">
          
          {/* Brand Identity & Contact Channels (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <Link to="/" className="font-serif-luxury text-4xl sm:text-5xl text-[#FAF7F0] tracking-wider uppercase block hover:text-[#D8C39A] transition-colors">
                CEL<span className="italic font-light lowercase">estia</span>
              </Link>
              <p className="text-xs uppercase tracking-[0.32em] text-[#D8C39A] font-mono font-bold">
                redefined for all.
              </p>
            </div>

            <p className="text-sm text-[#EDE6DA] font-sans leading-relaxed max-w-sm">
              Artisanal bangles, anti-tarnish fine jewellery, and bespoke celebration hampers crafted with tenderness in Mumbai. Dispatched with love across India.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#28231F] hover:bg-[#D8C39A]/20 border border-[#D8C39A]/40 rounded-full transition-all text-[#D8C39A] hover:text-[#FAF7F0] shadow-md"
                aria-label="Celestia Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={BRAND_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[#28231F] hover:bg-emerald-950/80 border border-emerald-500/40 rounded-full transition-all text-emerald-400 shadow-md"
                aria-label="Celestia WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href={`tel:${BRAND_INFO.phone}`}
                className="p-3 bg-[#28231F] hover:bg-[#D8C39A]/20 border border-[#D8C39A]/40 rounded-full transition-all text-[#D8C39A] hover:text-[#FAF7F0] shadow-md"
                aria-label="Call Celestia Atelier"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore Atelier (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#D8C39A] font-bold">
              Explore Atelier
            </h3>
            <ul className="space-y-3 text-sm text-[#EDE6DA] font-sans">
              <li><Link to="/shop" className="hover:text-[#D8C39A] transition-colors block font-medium">The Collection</Link></li>
              <li><Link to="/collections" className="hover:text-[#D8C39A] transition-colors block font-medium">Collections Index</Link></li>
              <li><Link to="/gifting" className="hover:text-[#D8C39A] transition-colors block font-medium">Gifting Atelier</Link></li>
              <li><Link to="/the-world" className="hover:text-[#D8C39A] transition-colors block font-medium">The World</Link></li>
              <li><Link to="/community" className="hover:text-[#D8C39A] transition-colors block font-medium">Community Lookbook</Link></li>
              <li><Link to="/search" className="hover:text-[#D8C39A] transition-colors block font-medium">Search Catalogue</Link></li>
            </ul>
          </div>

          {/* Client Care & Portal (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#D8C39A] font-bold">
              Client Care & Portal
            </h3>
            <ul className="space-y-3 text-sm text-[#EDE6DA] font-sans">
              <li><Link to="/order-tracking" className="text-[#D8C39A] hover:text-[#FAF7F0] transition-colors font-bold flex items-center gap-1.5">
                <span>Order Tracking</span>
                <span className="text-[10px] uppercase px-2 py-0.5 rounded-full bg-[#D8C39A]/20 text-[#D8C39A] font-mono font-bold">Live</span>
              </Link></li>
              <li><Link to="/account" className="hover:text-[#D8C39A] transition-colors block font-medium">My Celestia Account</Link></li>
              <li><Link to="/contact" className="hover:text-[#D8C39A] transition-colors block font-medium">Contact Concierge</Link></li>
              <li><Link to="/shipping-returns" className="hover:text-[#D8C39A] transition-colors block font-medium">Shipping & Returns</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#D8C39A] transition-colors block font-medium">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-[#D8C39A] transition-colors block font-medium">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Private Circle Newsletter (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="text-xs uppercase font-mono tracking-widest text-[#D8C39A] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D8C39A]" />
              <span>Private Circle</span>
            </h3>
            <p className="text-sm text-[#EDE6DA] font-sans leading-relaxed">
              Receive secret archive drops, seasonal gift previews, and private Mumbai studio invitations.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex items-center gap-2 bg-[#28231F] rounded-full border border-[#D8C39A]/50 p-1.5 focus-within:border-[#D8C39A] transition-all">
                <input
                  type="email"
                  placeholder="Enter your email..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent px-4 py-2 text-sm font-sans text-[#FAF7F0] placeholder:text-[#A8978A] focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  className="h-10 px-5 bg-[#D8C39A] hover:bg-[#E7D8BC] text-[#181411] rounded-full transition-all shrink-0 font-bold text-xs uppercase tracking-wider flex items-center gap-1 shadow-md"
                  aria-label="Join newsletter"
                >
                  {isSubscribed ? <Check className="w-4 h-4 text-[#181411]" /> : <span>Join</span>}
                </button>
              </div>
            </form>

            <div className="text-xs text-[#EDE6DA] flex items-center gap-2 pt-1 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mumbai Studio Active: 10:00 — 20:00 IST</span>
            </div>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar with Smooth Back to Top */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#EDE6DA] font-sans">
          <div className="flex items-center gap-2 flex-wrap">
            <span>© {new Date().getFullYear()} CELestia Amor. All rights reserved.</span>
            <span>•</span>
            <span className="italic font-serif text-[#D8C39A]">redefined for all.</span>
          </div>

          <div className="flex items-center gap-6">
            <a href={BRAND_INFO.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-[#EDE6DA] hover:text-[#D8C39A] transition-colors font-medium">
              Instagram @celestiaamor.in
            </a>
            <a href={`tel:${BRAND_INFO.phone}`} className="text-[#EDE6DA] hover:text-[#D8C39A] transition-colors font-mono">
              +91 7718825792
            </a>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-xs uppercase font-mono tracking-wider text-[#D8C39A] hover:text-[#FAF7F0] transition-colors font-bold px-3 py-1.5 rounded-full border border-[#D8C39A]/40 bg-[#28231F]"
              aria-label="Back to Top"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
