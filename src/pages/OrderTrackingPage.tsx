import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Video,
  Search,
  MessageCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { BRAND_INFO } from '../data/shopify-data';
import { getDeliveryTracking } from '../services/trackingService';
import { DeliveryTracking } from '../types/backend';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { trackingId: routeTrackingId } = useParams<{ trackingId?: string }>();

  const initialQuery = routeTrackingId || searchParams.get('id') || searchParams.get('tracking') || 'ORD-2026-8941';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [trackingData, setTrackingData] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTrack = async (queryToSearch: string) => {
    const clean = queryToSearch.trim();
    if (!clean) return;

    setLoading(true);
    setErrorMessage(null);
    setSearched(true);

    try {
      const result = await getDeliveryTracking(clean);
      if (result) {
        setTrackingData(result);
      } else {
        setTrackingData(null);
        setErrorMessage(`No active dispatch record found for "${clean}". Please check your order ID.`);
      }
    } catch (err) {
      setTrackingData(null);
      setErrorMessage("Could not connect to tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Perform initial search on mount if query present
  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-32 px-4 sm:px-6 md:px-12 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header & Search Bar */}
        <div className="text-center space-y-4 max-w-2xl mx-auto border-b border-champagne-300/40 pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pearl-50 border border-champagne-300/80 text-[10px] sm:text-xs font-mono uppercase tracking-widest text-gold-dark font-bold shadow-sm">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Carrier & Atelier Tracking</span>
          </div>

          <h1 className="font-serif-luxury text-3xl sm:text-5xl md:text-6xl text-obsidian uppercase">
            TRACK YOUR <span className="italic font-light text-gold-dark">Parcel</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/70 font-sans">
            Real-time status for your Mumbai same-day delivery or Pan-India express air cargo.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(searchQuery);
            }}
            className="flex items-center gap-2 bg-white px-4 py-2 sm:py-2.5 rounded-full border border-champagne-300/80 max-w-md mx-auto shadow-inner mt-4 focus-within:border-gold-dark"
          >
            <Search className="w-4 h-4 text-gold-dark shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter Order # or Tracking ID (e.g. ORD-2026-8941)..."
              className="w-full text-xs font-mono text-obsidian focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-obsidian text-pearl-100 text-xs uppercase font-mono tracking-wider font-bold rounded-full hover:bg-obsidian-200 transition-all shrink-0 cursor-pointer shadow-sm"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="p-12 text-center space-y-3 bg-pearl-50/80 rounded-3xl border border-champagne-300/50">
            <div className="w-10 h-10 rounded-full border-2 border-gold-dark border-t-transparent animate-spin mx-auto" />
            <p className="text-xs font-mono text-obsidian/60">Contacting Logistics Gateway...</p>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && !loading && (
          <div className="p-6 bg-amber-50/90 border border-amber-300/80 rounded-3xl text-center space-y-3 shadow-sm">
            <AlertCircle className="w-8 h-8 text-amber-700 mx-auto" />
            <p className="text-sm font-serif text-amber-900 font-semibold">{errorMessage}</p>
            <p className="text-xs font-sans text-amber-800/70 max-w-sm mx-auto">
              Please verify your order number in your receipt email, or reach out to our concierge for assistance.
            </p>
          </div>
        )}

        {/* Active Tracking Display */}
        {trackingData && !loading && (
          <div className="bg-pearl-50/98 p-6 sm:p-10 md:p-12 rounded-3xl border border-champagne-300/80 shadow-2xl space-y-8 animate-fade-in">
            
            {/* Status Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                    Tracking ID: {trackingData.trackingNumber}
                  </span>
                  <span className="text-xs text-obsidian/40">•</span>
                  <span className="text-xs font-mono font-medium text-obsidian/70">
                    Order {trackingData.orderId}
                  </span>
                </div>
                <h2 className="font-serif-luxury text-2xl sm:text-3xl text-obsidian">
                  {trackingData.carrier}
                </h2>
                <p className="text-xs text-obsidian/60 flex items-center gap-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Destination: {trackingData.destinationCity}</span>
                </p>
              </div>

              <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
                trackingData.currentStatus === 'delivered'
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-champagne-200 text-obsidian border border-champagne-300'
              }`}>
                <CheckCircle2 className="w-4 h-4" />
                <span>{trackingData.currentStatus.replace('_', ' ')}</span>
              </span>
            </div>

            {/* Estimated Delivery Window */}
            <div className="p-4 sm:p-5 bg-white/90 rounded-2xl border border-champagne-300/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[10px] uppercase font-mono text-obsidian/50 block">Estimated Arrival</span>
                <span className="font-serif-luxury text-lg sm:text-xl font-bold text-gold-dark">
                  {trackingData.estimatedDelivery?.formattedRange}
                </span>
              </div>
              <span className="text-xs text-obsidian/60 font-sans bg-pearl-100 px-3 py-1 rounded-full border border-champagne-200 self-start sm:self-auto">
                {trackingData.estimatedDelivery?.cutoffInfo || 'Live courier dispatch'}
              </span>
            </div>

            {/* Live Vertical Timeline Progress */}
            <div className="relative pl-6 md:pl-8 space-y-6 before:absolute before:left-2 md:before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gold-dark/30">
              {trackingData.timeline.map((event, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div className={`absolute -left-6 md:-left-8 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ring-4 ring-pearl-50 ${
                    event.completed
                      ? 'bg-emerald-700 text-white'
                      : 'bg-champagne-200 text-obsidian/60'
                  }`}>
                    {event.completed ? '✓' : idx + 1}
                  </div>
                  <div className="space-y-0.5">
                    <div className="flex flex-wrap items-baseline gap-2.5">
                      <h3 className={`font-serif text-base sm:text-lg ${
                        event.completed ? 'text-obsidian font-bold' : 'text-obsidian/50'
                      }`}>
                        {event.title}
                      </h3>
                      <span className="font-mono text-[11px] text-gold-dark font-semibold">
                        {event.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-obsidian/65 font-sans">
                      {event.description}
                    </p>
                    <p className="text-[10px] font-mono text-obsidian/40">
                      📍 {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Unboxing Policy Reassurance */}
            <div className="p-4 bg-champagne-100/60 rounded-2xl border border-champagne-300/50 space-y-1.5 text-xs text-obsidian/80">
              <p className="flex items-center gap-1.5 font-bold text-obsidian">
                <Video className="w-4 h-4 text-gold-dark" />
                <span>Unboxing Video Requirement</span>
              </p>
              <p className="leading-relaxed text-[11px]">
                Please record an uncut unboxing video starting from the sealed outer package in the rare event of transit damage.
              </p>
            </div>

            {/* Concierge Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <a
                href={`${BRAND_INFO.whatsappUrl}&text=Hello%20Celestia,%20inquiry%20regarding%20Tracking%20${trackingData.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-full bg-emerald-800 text-pearl-50 text-xs uppercase font-mono tracking-widest font-semibold hover:bg-emerald-900 transition-all shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Contact Dispatch Concierge on WhatsApp</span>
              </a>

              <Link
                to="/account/orders"
                className="w-full sm:w-auto px-6 py-3.5 rounded-full border border-champagne-300/80 bg-white hover:bg-champagne-100/60 text-obsidian text-xs uppercase font-mono tracking-widest font-bold text-center transition-all"
              >
                All Orders
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
