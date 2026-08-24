import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { getDeliveryTracking } from '../services/trackingService';
import { DeliveryTracking } from '../types/backend';

export const OrderTrackingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { trackingId: routeTrackingId } = useParams<{ trackingId?: string }>();

  const initialQuery = routeTrackingId || searchParams.get('id') || searchParams.get('tracking') || 'ORD-2026-8941';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [trackingData, setTrackingData] = useState<DeliveryTracking | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTrack = async (queryToSearch: string) => {
    const clean = queryToSearch.trim();
    if (!clean) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const result = await getDeliveryTracking(clean);
      if (result) {
        setTrackingData(result);
      } else {
        setTrackingData(null);
        setErrorMessage(`No active dispatch record found for "${clean}". Please check your order ID.`);
      }
    } catch {
      setTrackingData(null);
      setErrorMessage("Could not connect to tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-24 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header & Search Bar */}
        <div className="text-center space-y-3 max-w-2xl mx-auto border-b border-champagne-300/40 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pearl-50 border border-champagne-300/80 text-[11px] font-mono uppercase tracking-widest text-gold-dark font-bold shadow-sm">
            <Truck className="w-3.5 h-3.5" />
            <span>Live Carrier & Atelier Tracking</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl text-obsidian font-bold uppercase leading-[1.05]">
            TRACK YOUR <span className="italic font-normal text-gold-dark">Parcel</span>.
          </h1>

          <p className="text-xs sm:text-sm text-obsidian/70">
            Real-time status for your Mumbai same-day delivery or Pan-India express air cargo.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(searchQuery);
            }}
            className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-full border border-champagne-300/80 max-w-md mx-auto shadow-inner mt-4 focus-within:border-gold-dark"
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
              className="px-4 py-1.5 bg-obsidian text-pearl-100 text-xs uppercase font-bold rounded-full hover:bg-obsidian-200 transition-colors shrink-0"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Tracking Details Display */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm text-center">
            {errorMessage}
          </div>
        )}

        {trackingData && (
          <div className="bg-white/95 p-6 sm:p-10 rounded-3xl border border-champagne-300/60 shadow-luxury-soft space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-300/40 pb-4">
              <div>
                <span className="text-[11px] font-mono uppercase text-gold-dark font-bold block">
                  Tracking Number
                </span>
                <span className="text-lg sm:text-xl font-bold text-obsidian font-mono">
                  {trackingData.trackingNumber}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-mono px-3 py-1 bg-champagne-100 text-obsidian font-bold rounded-full">
                  Carrier: {trackingData.carrier}
                </span>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm uppercase font-mono tracking-wider text-obsidian font-bold">
                Shipment Milestones
              </h3>

              <div className="space-y-3">
                {trackingData.timeline.map((evt, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="mt-0.5">
                      {idx === 0 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <Clock className="w-5 h-5 text-obsidian-muted shrink-0" />
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs sm:text-sm font-bold text-obsidian">{evt.title}</p>
                      <p className="text-xs text-obsidian-soft">{evt.description}</p>
                      <p className="text-[10px] font-mono text-obsidian-muted">{evt.timestamp} • {evt.location}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingPage;
