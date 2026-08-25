import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import {
  Truck,
  CheckCircle2,
  Clock,
  Search,
  MapPin,
  Sparkles,
  Package,
  Calendar,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Send,
  AlertCircle
} from 'lucide-react';
import { getDeliveryTracking } from '../services/trackingService';
import { DeliveryTracking, DeliveryStage } from '../types/backend';
import { BRAND_INFO } from '../data/shopify-data';

const STAGES_ORDER: { key: DeliveryStage; label: string; icon: any }[] = [
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle2 },
  { key: 'packed', label: 'Handcrafted', icon: Package },
  { key: 'shipped', label: 'Dispatched', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Clock },
  { key: 'delivered', label: 'Delivered', icon: Sparkles }
];

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
        setErrorMessage(`No active parcel record found for "${clean}". Please verify your order number or phone.`);
      }
    } catch {
      setTrackingData(null);
      setErrorMessage("Could not connect to live tracking service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const currentStageIndex = trackingData
    ? STAGES_ORDER.findIndex((s) => s.key === trackingData.currentStatus)
    : 0;

  const handleWhatsAppHelp = () => {
    const msg = `Hello%20Celestia%20Team!%20✨%0A%0AI%20need%20an%20update%20regarding%20my%20order%20tracking:%0A*Tracking%20Number:*%20${trackingData?.trackingNumber || searchQuery}%0A*Order%20ID:*%20${trackingData?.orderId || searchQuery}%0A%0APlease%20assist%20me%20with%20the%20dispatch%20status.`;
    window.open(`https://wa.me/917718825792?text=${msg}`, '_blank');
  };

  return (
    <div className="w-full min-h-screen bg-pearl-100 pt-32 sm:pt-36 md:pt-40 pb-28 px-4 sm:px-6 md:px-10 lg:px-14 selection:bg-champagne-300">
      <div className="max-w-4xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header & Live Search Bar */}
        <div className="text-center space-y-3 max-w-2xl mx-auto border-b border-champagne-300/40 pb-6 sm:pb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-champagne-300/80 text-[11px] font-mono uppercase tracking-widest text-gold-dark font-bold shadow-xs">
            <Truck className="w-3.5 h-3.5" />
            <span>5-Stage Real-Time Dispatch Tracking</span>
          </div>

          <h1 className="site-main-title text-obsidian font-serif-luxury">
            Track your <span className="font-zapfino text-champagne-400 font-normal tracking-normal lowercase inline-block px-1">parcel</span>
          </h1>

          <p className="text-xs sm:text-sm text-obsidian-soft max-w-md mx-auto leading-relaxed">
            Real-time status for your Mumbai same-day priority courier or Pan-India express air cargo.
          </p>

          {/* Search Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleTrack(searchQuery);
            }}
            className="flex items-center gap-2 bg-white p-1.5 pl-4 rounded-full border border-champagne-300 max-w-md mx-auto shadow-md mt-5 focus-within:border-gold-dark"
          >
            <Search className="w-4 h-4 text-gold-dark shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.replace(/[^a-zA-Z0-9_\-\s]/g, '').trim())}
              placeholder="Enter Order # or Tracking ID (e.g. ORD-2026-8941)..."
              className="w-full text-xs font-mono text-obsidian focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-obsidian text-pearl-100 text-xs uppercase font-mono font-bold tracking-wider rounded-full hover:bg-obsidian-200 transition-colors shrink-0 cursor-pointer shadow-xs"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center justify-center gap-2 text-center animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Live Tracking Information Card */}
        {trackingData && (
          <div className="bg-white/95 p-6 sm:p-10 rounded-3xl border border-champagne-300/70 shadow-luxury-soft space-y-8 animate-fade-in">
            
            {/* Top Bar: IDs & Estimated Arrival */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-champagne-200 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-gold-dark font-bold">
                    Order Reference
                  </span>
                  <span className="text-xs font-mono font-bold text-obsidian bg-champagne-100 px-2 py-0.5 rounded-full">
                    {trackingData.orderId}
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-mono font-bold text-obsidian">
                  AWB: {trackingData.trackingNumber}
                </h2>
                <p className="text-xs text-obsidian-soft font-sans flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold-dark" />
                  <span>Destination: {trackingData.destinationCity}</span>
                </p>
              </div>

              <div className="sm:text-right space-y-1 bg-pearl-50 p-3.5 sm:p-4 rounded-2xl border border-champagne-200">
                <span className="text-[10px] font-mono uppercase text-emerald-800 font-bold flex items-center sm:justify-end gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Estimated Delivery</span>
                </span>
                <p className="text-sm sm:text-base font-bold text-obsidian font-serif">
                  {trackingData.estimatedDelivery.estimatedDateFormatted}
                </p>
                <p className="text-[11px] text-obsidian-soft font-sans">
                  {trackingData.estimatedDelivery.expectedTimeWindow}
                </p>
              </div>
            </div>

            {/* 5-Stage Visual Stepper Timeline */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs uppercase font-mono tracking-widest text-gold-dark font-bold">
                  Live Dispatch Progression (5 Stages)
                </h3>
                <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                  Stage {currentStageIndex + 1} of 5: {STAGES_ORDER[currentStageIndex]?.label}
                </span>
              </div>

              {/* Visual Stepper Nodes */}
              <div className="relative pt-4 pb-2">
                {/* Horizontal Progress Bar Track */}
                <div className="hidden sm:block absolute top-8 left-6 right-6 h-1 bg-sand rounded-full -z-0">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-gold-dark transition-all duration-700 rounded-full"
                    style={{ width: `${(currentStageIndex / (STAGES_ORDER.length - 1)) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-2 relative z-10">
                  {STAGES_ORDER.map((stg, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isCurrent = idx === currentStageIndex;
                    const Icon = stg.icon;

                    return (
                      <div
                        key={stg.key}
                        className={`flex flex-col items-center text-center p-3 rounded-2xl border transition-all ${
                          isCurrent
                            ? 'bg-champagne-100 border-gold-dark shadow-sm scale-105'
                            : isCompleted
                            ? 'bg-white border-emerald-200'
                            : 'bg-pearl-50 border-champagne-200 opacity-60'
                        }`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                            isCurrent
                              ? 'bg-gold-dark text-pearl-100 shadow-md animate-pulse'
                              : isCompleted
                              ? 'bg-emerald-600 text-white'
                              : 'bg-sand text-obsidian-soft'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-bold text-obsidian leading-tight">
                          {stg.label}
                        </span>
                        <span className="text-[9px] font-mono text-obsidian-soft mt-0.5">
                          {isCurrent ? 'Active Now' : isCompleted ? 'Completed' : 'Pending'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Detailed Shipment Milestones Feed */}
            <div className="space-y-4 pt-4 border-t border-champagne-200">
              <h3 className="text-xs uppercase font-mono tracking-widest text-obsidian font-bold">
                Carrier Activity Logs ({trackingData.carrier})
              </h3>

              <div className="space-y-3">
                {trackingData.timeline.map((evt, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 items-start p-3 bg-pearl-50/70 rounded-2xl border border-champagne-200"
                  >
                    <div className="mt-0.5">
                      {idx === 0 ? (
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-xs">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-sand flex items-center justify-center text-obsidian/50">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-0.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <p className="text-xs sm:text-sm font-bold text-obsidian">{evt.title}</p>
                        <span className="text-[10px] font-mono text-obsidian-soft">{evt.timestamp}</span>
                      </div>
                      <p className="text-xs text-obsidian-soft">{evt.description}</p>
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-gold-dark font-semibold">
                        <MapPin className="w-3 h-3" />
                        <span>{evt.location}</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Post-Purchase Concierge Assistance Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-champagne-50/80 rounded-2xl border border-champagne-300">
              <div className="space-y-0.5 text-center sm:text-left">
                <p className="text-xs uppercase font-mono tracking-wider text-obsidian font-bold">
                  Need Help with your Delivery?
                </p>
                <p className="text-xs text-obsidian-soft">
                  Connect with our Mumbai studio dispatcher via WhatsApp for real-time live assistance.
                </p>
              </div>

              <button
                onClick={handleWhatsAppHelp}
                className="w-full sm:w-auto px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-pearl-50 text-xs uppercase font-mono font-bold tracking-wider rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shrink-0"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Courier Support</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default OrderTrackingPage;
