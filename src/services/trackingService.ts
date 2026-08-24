import {
  DeliveryEstimate,
  DeliveryStage,
  DeliveryTimelineEvent,
  DeliveryTracking,
} from '../types/backend';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TRACKING_STORAGE_KEY = 'celestia_delivery_tracking_registry';

/**
 * Calculates a dynamic delivery estimate based on shipping method and current IST time
 */
export function calculateDeliveryEstimate(
  shippingMethod: string,
  orderDate: Date = new Date()
): DeliveryEstimate {
  const isSameDay = shippingMethod.toLowerCase().includes('same-day') || shippingMethod.toLowerCase().includes('mumbai');

  if (isSameDay) {
    const currentHour = orderDate.getHours();
    const isBeforeCutoff = currentHour < 14; // 2:00 PM IST Cutoff

    const targetDate = new Date(orderDate);
    if (!isBeforeCutoff) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
    const dateFormatted = targetDate.toLocaleDateString('en-US', options);

    return {
      formattedRange: isBeforeCutoff ? `Today by 8:00 PM IST` : `Tomorrow (${dateFormatted}) by 2:00 PM IST`,
      isSameDay: true,
      minDays: 0,
      maxDays: 1,
      deliveryDateStart: targetDate.toISOString(),
      deliveryDateEnd: targetDate.toISOString(),
      cutoffInfo: isBeforeCutoff
        ? 'Same-day courier departs from Bandra Atelier at 4:30 PM'
        : 'Order placed after 2:00 PM cutoff • Priority morning dispatch',
    };
  }

  // Pan-India Express Air Delivery (2 to 3 days)
  const minDate = new Date(orderDate);
  minDate.setDate(minDate.getDate() + 2);

  const maxDate = new Date(orderDate);
  maxDate.setDate(maxDate.getDate() + 4);

  const minFormatted = minDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const maxFormatted = maxDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return {
    formattedRange: `${minFormatted} — ${maxFormatted}`,
    isSameDay: false,
    minDays: 2,
    maxDays: 4,
    deliveryDateStart: minDate.toISOString(),
    deliveryDateEnd: maxDate.toISOString(),
    cutoffInfo: 'Direct air cargo dispatch via Delhivery / Bluedart',
  };
}

/**
 * Builds standard 5-stage timeline progression for an order
 */
export function generateTimelineEvents(
  stage: DeliveryStage,
  orderDate: Date = new Date(),
  destinationCity: string = 'Mumbai'
): DeliveryTimelineEvent[] {
  const stages: DeliveryStage[] = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const currentIndex = stages.indexOf(stage);

  const formatTime = (hoursOffset: number) => {
    const d = new Date(orderDate.getTime() + hoursOffset * 3600 * 1000);
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (daysOffset: number) => {
    const d = new Date(orderDate.getTime() + daysOffset * 24 * 3600 * 1000);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  };

  return [
    {
      stage: 'confirmed',
      title: 'Order Confirmed & Payment Verified',
      description: 'Order registered in Celestia Mumbai Atelier order queue.',
      timestamp: `${formatDate(0)}, ${formatTime(0)}`,
      location: 'Mumbai Atelier Desk',
      completed: currentIndex >= 0,
    },
    {
      stage: 'packed',
      title: 'Inspected & Sealed with Gold Wax',
      description: 'Anti-tarnish calibration, velvet box packaging & custom Polaroid proofing.',
      timestamp: currentIndex >= 1 ? `${formatDate(0)}, ${formatTime(2)}` : 'Estimated +2 hrs',
      location: 'Bandra West Studio Lab',
      completed: currentIndex >= 1,
    },
    {
      stage: 'shipped',
      title: 'Dispatched via Air / Road Express',
      description: 'Airway bill generated and handover to premium courier network.',
      timestamp: currentIndex >= 2 ? `${formatDate(0)}, ${formatTime(4)}` : 'Estimated +4 hrs',
      location: 'Mumbai Air Logistics Hub',
      completed: currentIndex >= 2,
    },
    {
      stage: 'out_for_delivery',
      title: 'Out for Doorstep Delivery',
      description: 'Courier specialist dispatched for contactless handover.',
      timestamp: currentIndex >= 3 ? `${formatDate(1)}, 10:30 AM` : 'In Transit to Destination Hub',
      location: `${destinationCity} Delivery Center`,
      completed: currentIndex >= 3,
    },
    {
      stage: 'delivered',
      title: 'Delivered to Recipient',
      description: 'Signature verified and safely handed to recipient.',
      timestamp: currentIndex >= 4 ? `${formatDate(1)}, 03:15 PM` : 'Awaiting Delivery',
      location: `${destinationCity} Destination`,
      completed: currentIndex >= 4,
    },
  ];
}

/**
 * Creates or saves delivery tracking record in Supabase or Local Registry
 */
export async function saveDeliveryTracking(tracking: DeliveryTracking): Promise<void> {
  // If Supabase configured, save to Postgres
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from('delivery_tracking').upsert({
        order_id: tracking.orderId,
        tracking_number: tracking.trackingNumber,
        carrier: tracking.carrier,
        current_status: tracking.currentStatus,
        estimated_delivery_start: tracking.estimatedDelivery.deliveryDateStart,
        estimated_delivery_end: tracking.estimatedDelivery.deliveryDateEnd,
        destination_city: tracking.destinationCity,
        timeline_events: tracking.timeline,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('[TrackingService] Supabase upsert error:', err);
    }
  }

  // Always persist to local storage cache for offline resilient lookup
  try {
    const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
    const list: DeliveryTracking[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((t) => t.trackingNumber !== tracking.trackingNumber && t.orderId !== tracking.orderId);
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify([tracking, ...filtered]));
  } catch {}
}

/**
 * Fetches tracking by tracking number or order ID
 */
export async function getDeliveryTracking(query: string): Promise<DeliveryTracking | null> {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return null;

  // Check Supabase if configured
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .or(`tracking_number.ilike.%${cleanQuery}%,order_id.ilike.%${cleanQuery}%`)
        .maybeSingle();

      if (data && !error) {
        return {
          id: data.id,
          orderId: data.order_id,
          trackingNumber: data.tracking_number,
          carrier: data.carrier,
          currentStatus: data.current_status as DeliveryStage,
          destinationCity: data.destination_city,
          timeline: data.timeline_events || [],
          estimatedDelivery: {
            formattedRange: `${new Date(data.estimated_delivery_start).toLocaleDateString()} — ${new Date(data.estimated_delivery_end).toLocaleDateString()}`,
            isSameDay: data.carrier.includes('Mumbai'),
            minDays: 1,
            maxDays: 3,
            deliveryDateStart: data.estimated_delivery_start,
            deliveryDateEnd: data.estimated_delivery_end,
          },
          lastUpdated: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[TrackingService] Supabase fetch error:', err);
    }
  }

  // Fallback to Local Storage Registry
  try {
    const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
    if (raw) {
      const list: DeliveryTracking[] = JSON.parse(raw);
      const match = list.find(
        (t) =>
          t.trackingNumber.toUpperCase() === cleanQuery ||
          t.orderId.toUpperCase() === cleanQuery ||
          t.orderId.toUpperCase().includes(cleanQuery)
      );
      if (match) return match;
    }
  } catch {}

  // Fallback demo matching for legacy demo orders
  if (cleanQuery.includes('9921') || cleanQuery.includes('8941')) {
    return {
      orderId: 'ORD-2026-8941',
      trackingNumber: 'MUM-EXPRESS-9921',
      carrier: 'Mumbai Atelier Express',
      currentStatus: 'delivered',
      destinationCity: 'Bandra West, Mumbai',
      estimatedDelivery: calculateDeliveryEstimate('Mumbai Same-Day Express Courier'),
      timeline: generateTimelineEvents('delivered', new Date(Date.now() - 86400000), 'Bandra West, Mumbai'),
      lastUpdated: new Date().toISOString(),
    };
  }

  return null;
}
