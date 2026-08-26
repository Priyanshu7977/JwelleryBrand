import React, { useState, useEffect } from 'react';
import { FEATURED_PRODUCTS } from '../../data/shopify-data';
import { Sparkles, X, CheckCircle2, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface LiveEvent {
  id: string;
  name: string;
  city: string;
  productTitle: string;
  productImage: string;
  timeAgo: string;
  actionText: string;
}

const SAMPLE_BUYERS = [
  { name: 'Aanya S.', city: 'Bandra, Mumbai', productIndex: 0, actionText: 'ordered' },
  { name: 'Rhea M.', city: 'Juhu, Mumbai', productIndex: 1, actionText: 'unboxed' },
  { name: 'Kabir & Tanvi', city: 'South Delhi', productIndex: 3, actionText: 'customised a Hamper with Polaroids' },
  { name: 'Ananya D.', city: 'Indiranagar, Bengaluru', productIndex: 0, actionText: 'ordered' },
  { name: 'Pooja K.', city: 'Colaba, Mumbai', productIndex: 2, actionText: 'saved to Bag with code CELESTIA10' },
  { name: 'Simran B.', city: 'Koregaon Park, Pune', productIndex: 4, actionText: 'ordered for Same-Day dispatch' },
];

export const LiveShopperActivityToast: React.FC = () => {
  const location = useLocation();
  const [currentEvent, setCurrentEvent] = useState<LiveEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Exclude checkout, success, and tracking from social proof popups
  const isExcluded = ['/checkout', '/order-success', '/order-tracking'].some(p => location.pathname.startsWith(p));

  useEffect(() => {
    if (isDismissed || isExcluded) return;

    let eventIndex = 0;
    const triggerNextEvent = () => {
      const buyer = SAMPLE_BUYERS[eventIndex % SAMPLE_BUYERS.length];
      const prod = FEATURED_PRODUCTS[buyer.productIndex] || FEATURED_PRODUCTS[0];

      setCurrentEvent({
        id: `ev-${Date.now()}`,
        name: buyer.name,
        city: buyer.city,
        productTitle: prod.title,
        productImage: prod.images.hero,
        timeAgo: `${Math.floor(Math.random() * 4) + 1}m ago`,
        actionText: buyer.actionText,
      });

      setIsVisible(true);

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);

      eventIndex++;
    };

    // First appearance after 6 seconds
    const initialTimer = setTimeout(triggerNextEvent, 6000);

    // Subsequent appearances every 16 seconds
    const intervalTimer = setInterval(triggerNextEvent, 16000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(intervalTimer);
    };
  }, [isDismissed, isExcluded, location.pathname]);

  if (!currentEvent || !isVisible || isExcluded) return null;

  return (
    <div className="fixed bottom-5 left-4 sm:left-6 mb-safe z-[120] max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3 sm:p-3.5 shadow-2xl border border-champagne-300/80 animate-slide-in flex items-center gap-3 selection:bg-champagne-300">
      {/* Product Mini Image */}
      <div className="w-11 h-11 rounded-xl overflow-hidden bg-sand shrink-0 border border-champagne-200 relative">
        <img
          src={currentEvent.productImage}
          alt={currentEvent.productTitle}
          className="w-full h-full object-cover"
        />
        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-600 border border-white flex items-center justify-center">
          <Sparkles className="w-2 h-2 text-white" />
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0 text-left space-y-0.5">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-obsidian-soft">
          <span className="font-bold text-obsidian">{currentEvent.name}</span>
          <span>•</span>
          <span className="flex items-center gap-0.5 text-gold-dark font-medium truncate">
            <MapPin className="w-2.5 h-2.5" />
            {currentEvent.city}
          </span>
        </div>

        <p className="text-xs text-obsidian font-serif font-bold truncate">
          {currentEvent.actionText} {currentEvent.productTitle}
        </p>

        <div className="flex items-center gap-1 text-[9px] font-mono text-emerald-800 font-bold">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
          <span>Verified Atelier Activity • {currentEvent.timeAgo}</span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => {
          setIsVisible(false);
          setIsDismissed(true);
        }}
        className="p-1 text-obsidian-muted hover:text-obsidian rounded-full transition-colors cursor-pointer self-start -mr-1 -mt-1"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default LiveShopperActivityToast;
