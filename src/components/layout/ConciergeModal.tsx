import React from 'react';
import { useCart } from '../../context/CartContext';
import { BRAND_INFO } from '../../data/shopify-data';
import { X, MessageCircle, Mail, Sparkles, Gift, Truck, Package, Heart, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ConciergeModal: React.FC = () => {
  const { isConciergeOpen, setIsConciergeOpen } = useCart();

  if (!isConciergeOpen) return null;

  const conciergeOptions = [
    {
      icon: <Gift className="w-5 h-5 text-gold-dark" />,
      title: 'Curate a Bespoke Hamper',
      desc: 'Get personal recommendations & custom Polaroid printing assistance.',
      action: () => {
        setIsConciergeOpen(false);
        window.open(`https://wa.me/917718825792?text=Hello%20Celestia!%20I%20would%20like%20to%20curate%20a%20custom%20gift%20hamper%20with%20personal%20Polaroids.`, '_blank');
      }
    },
    {
      icon: <Truck className="w-5 h-5 text-emerald-800" />,
      title: 'Same-Day Mumbai Express Delivery',
      desc: 'Order before 2 PM for doorstep hand-delivery across Mumbai.',
      action: () => {
        setIsConciergeOpen(false);
        window.open(`https://wa.me/917718825792?text=Hello%20Celestia!%20I%20need%20Same-Day%20Mumbai%20Express%20Delivery%20for%20my%20order.`, '_blank');
      }
    },
    {
      icon: <Compass className="w-5 h-5 text-gold-dark" />,
      title: 'Jewellery Sizing & Styling Advice',
      desc: 'Bangle size guide (2.4 / 2.6 / 2.8) and anti-tarnish ring stacks.',
      action: () => {
        setIsConciergeOpen(false);
        window.open(`https://wa.me/917718825792?text=Hello%20Celestia!%20I%20would%20like%20guidance%20on%20bangle%20sizing%20and%20jewellery%20styling.`, '_blank');
      }
    },
    {
      icon: <Package className="w-5 h-5 text-gold-dark" />,
      title: 'Track My Atelier Dispatch',
      desc: 'Check live status of your Pan-India or Mumbai courier parcel.',
      action: () => {
        setIsConciergeOpen(false);
        window.location.href = '/order-tracking';
      }
    }
  ];

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={() => setIsConciergeOpen(false)}
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-pearl-50/98 rounded-3xl p-6 sm:p-8 border border-champagne-300/80 shadow-2xl space-y-6 z-10 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-champagne-300/40 pb-4">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-monumental text-gold-dark font-semibold">
              Mumbai Atelier Desk
            </span>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian uppercase">
              HOW CAN WE <span className="italic font-light text-gold-dark">Help?</span>
            </h2>
            <p className="text-xs text-obsidian/60 font-sans">
              Personalized assistance from our team • Active 10:00 — 20:00 IST
            </p>
          </div>

          <button
            onClick={() => setIsConciergeOpen(false)}
            className="p-2 text-obsidian/60 hover:text-obsidian rounded-full hover:bg-champagne-100/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options */}
        <div className="space-y-3">
          {conciergeOptions.map((opt, i) => (
            <button
              key={i}
              onClick={opt.action}
              className="w-full p-4 rounded-2xl bg-white border border-champagne-300/50 hover:border-gold-dark hover:bg-champagne-100/40 transition-all text-left flex items-start gap-3.5 group shadow-sm"
            >
              <div className="p-2.5 rounded-xl bg-pearl-100 group-hover:scale-110 transition-transform shrink-0">
                {opt.icon}
              </div>
              <div className="space-y-0.5">
                <h3 className="font-serif-luxury text-base text-obsidian group-hover:text-gold-dark transition-colors">
                  {opt.title}
                </h3>
                <p className="text-xs text-obsidian/65 font-sans leading-relaxed">
                  {opt.desc}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Direct WhatsApp Quick Bar */}
        <div className="pt-2">
          <a
            href={BRAND_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsConciergeOpen(false)}
            className="w-full h-12 px-6 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase tracking-widest font-semibold hover:bg-emerald-900 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Directly on WhatsApp (+91 7718825792)</span>
          </a>
        </div>

      </div>
    </div>
  );
};
