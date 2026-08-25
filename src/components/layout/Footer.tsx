import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BRAND_INFO } from '../../data/shopify-data';
import { useCart } from '../../context/CartContext';
import { Instagram, MessageCircle, Phone, Sparkles, Send, Check, ArrowUp, Mail, MapPin } from 'lucide-react';
import { RevealOnScroll } from '../motion/RevealOnScroll';

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
      className="relative z-30 w-full border-t border-[#D8C39A]/40 pt-16 sm:pt-20 pb-12 px-4 sm:px-6 md:px-10 lg:px-14 overflow-hidden selection:bg-champagne-300 selection:text-obsidian"
    >
      {/* Ambient background noise & subtle warm gold radiance */}
      <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#D8C39A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16 relative z-10">
        
        {/* Grand Dramatic Brand Closing Statement */}
        <RevealOnScroll direction="up" delay={0}>
          <div className="text-center space-y-4 pb-10 sm:pb-12 border-b border-[#D8C39A]/25">
            <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-[#28231F] border border-[#D8C39A]/40 text-[11px] sm:text-xs uppercase font-mono tracking-widest text-[#D8C39A] font-bold shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-[#D8C39A]" />
              <span>The Mumbai Atelier MMXXVI</span>
            </div>

            <h2 className="text-3xl sm:text-5xl md:text-6xl text-[#FAF7F0] font-bold leading-[1.08] max-w-4xl mx-auto">
              Where timeless <span className="font-zapfino text-[#D8C39A] font-normal tracking-normal lowercase inline-block px-1">charm</span> meets everyday <span className="font-zapfino text-[#D8C39A] font-normal tracking-normal lowercase inline-block px-1">grace</span>.
            </h2>
          </div>
        </RevealOnScroll>

        {/* 4-Column Editorial Matrix */}
        <RevealOnScroll direction="up" delay={150}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 sm:pb-16 border-b border-[#D8C39A]/25">
            
            {/* Brand Identity & Social Icons (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div className="space-y-1.5">
                <Link to="/" className="text-4xl sm:text-5xl text-[#FAF7F0] tracking-wider uppercase block hover:text-[#D8C39A] transition-colors font-bold">
                  CEL<span className="font-light lowercase text-[#D8C39A]">estia</span>
                </Link>
                <p className="text-xs uppercase tracking-[0.32em] text-[#D8C39A] font-mono font-bold">
                  redefined for all.
                </p>
              </div>

              <p className="text-sm text-[#EDE6DA] leading-relaxed max-w-sm">
                Artisanal bangles, anti-tarnish fine jewellery, and custom gift hampers crafted with tenderness in Mumbai. Dispatched with love across India.
              </p>

              <div className="flex items-center gap-3 pt-2">
                <a
                  href={BRAND_INFO.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#28231F] hover:bg-[#D8C39A]/20 border border-[#D8C39A]/40 rounded-full transition-all text-[#D8C39A] hover:text-[#FAF7F0] shadow-md hover:scale-110"
                  aria-label="Celestia Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a
                  href={BRAND_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-[#28231F] hover:bg-emerald-950/80 border border-emerald-500/40 rounded-full transition-all text-emerald-400 shadow-md hover:scale-110"
                  aria-label="Celestia WhatsApp Concierge"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a
                  href={`tel:${BRAND_INFO.phone}`}
                  className="p-3 bg-[#28231F] hover:bg-[#D8C39A]/20 border border-[#D8C39A]/40 rounded-full transition-all text-[#D8C39A] hover:text-[#FAF7F0] shadow-md hover:scale-110"
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
              <ul className="space-y-3 text-sm text-[#EDE6DA]">
                <li><Link to="/shop" className="hover:text-[#D8C39A] transition-colors block font-medium">The Collection</Link></li>
                <li><Link to="/collections" className="hover:text-[#D8C39A] transition-colors block font-medium">Collections Index</Link></li>
                <li><Link to="/gifting" className="hover:text-[#D8C39A] transition-colors block font-medium">Gifting Atelier</Link></li>
                <li><Link to="/blog" className="hover:text-[#D8C39A] transition-colors block font-medium">Blog</Link></li>
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
              <ul className="space-y-3 text-sm text-[#EDE6DA]">
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
              <p className="text-sm text-[#EDE6DA] leading-relaxed">
                Receive secret archive drops, seasonal gift previews, and private Mumbai studio invitations.
              </p>

              <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full h-11 pl-4 pr-24 rounded-full bg-[#28231F] border border-[#D8C39A]/40 text-xs text-[#FAF7F0] placeholder-[#EDE6DA]/50 focus:outline-none focus:border-[#D8C39A] transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 rounded-full bg-[#D8C39A] text-[#1E1A17] text-[11px] uppercase font-bold tracking-wider hover:bg-[#E5D2AD] active:scale-[0.96] transition-all flex items-center gap-1 shadow-sm"
                  >
                    {isSubscribed ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span>Join</span>
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-[#EDE6DA]/60 flex items-center gap-1.5 font-mono pt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>Mumbai Studio Concierge: 10 AM – 8 PM IST</span>
                </p>
              </form>
            </div>

          </div>
        </RevealOnScroll>

        {/* Direct Studio Helpline & Copyright Bar */}
        <RevealOnScroll direction="up" delay={200}>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 text-xs text-[#EDE6DA]/80">
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 justify-center md:justify-start">
              <a
                href={BRAND_INFO.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#28231F] border border-[#D8C39A]/30 hover:border-[#D8C39A] text-[#EDE6DA] hover:text-[#FAF7F0] transition-colors"
              >
                <Instagram className="w-3.5 h-3.5 text-[#D8C39A]" />
                <span className="font-mono text-[11px]">@celestiaamor.in</span>
              </a>

              <a
                href={`tel:${BRAND_INFO.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#28231F] border border-[#D8C39A]/30 hover:border-[#D8C39A] text-[#EDE6DA] hover:text-[#FAF7F0] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D8C39A]" />
                <span className="font-mono text-[11px]">+91 7718825792</span>
              </a>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={scrollToTop}
                className="px-4 py-2 rounded-full bg-[#28231F] hover:bg-[#D8C39A]/20 border border-[#D8C39A]/40 text-[#D8C39A] hover:text-[#FAF7F0] text-[11px] uppercase font-mono tracking-widest transition-all flex items-center gap-1.5"
              >
                <span>Back To Top</span>
                <ArrowUp className="w-3 h-3" />
              </button>
            </div>
          </div>

          <div className="pt-8 text-center md:text-left text-[11px] text-[#EDE6DA]/50 font-mono flex flex-col sm:flex-row justify-between items-center gap-2">
            <span>© 2026 Celestia Atelier & Fine Adornments. Handcrafted in Mumbai.</span>
            <span>Same-Day Mumbai Express Delivery • Pan-India Free Shipping</span>
          </div>
        </RevealOnScroll>

      </div>
    </footer>
  );
};

export default Footer;
