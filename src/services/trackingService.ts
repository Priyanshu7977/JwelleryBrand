import {
  DeliveryEstimate,
  DeliveryStage,
  DeliveryTimelineEvent,
  DeliveryTracking,
} from '../types/backend';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  formatOrderDateIST,
  formatOrderTimeIST,
  formatTimelineStampIST,
  getHourInIST,
} from '../utils/dateIST';

const TRACKING_STORAGE_KEY = 'celestia_delivery_tracking_registry';

/**
 * Calculates dynamic delivery date and realistic time window in IST
 */
export function calculateDeliveryEstimate(
  shippingMethod: string,
  orderDateInput: Date | string | number = new Date()
): DeliveryEstimate {
  const orderDate = new Date(orderDateInput);
  const isSameDay =
    shippingMethod.toLowerCase().includes('same-day') ||
    shippingMethod.toLowerCase().includes('mumbai');

  if (isSameDay) {
    const currentHourIST = getHourInIST(orderDate);
    const isBeforeCutoff = currentHourIST < 14; // 2:00 PM IST Cutoff

    const targetDate = new Date(orderDate);
    if (!isBeforeCutoff) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const estimatedDateFormatted = formatOrderDateIST(targetDate);
    const expectedTimeWindow = isBeforeCutoff
      ? 'Expected between 6:00 PM – 9:00 PM IST'
      : 'Expected between 10:00 AM – 2:00 PM IST';

    return {
      estimatedDateFormatted,
      expectedTimeWindow,
      formattedRange: `${estimatedDateFormatted} • ${expectedTimeWindow}`,
      isSameDay: true,
      minDays: 0,
      maxDays: 1,
      deliveryDateStart: targetDate.toISOString(),
      deliveryDateEnd: targetDate.toISOString(),
      cutoffInfo: isBeforeCutoff
        ? 'Same-day courier departs from Mumbai Atelier at 4:30 PM'
        : 'Priority morning dispatch (Order placed after 2:00 PM cutoff)',
    };
  }

  // Pan-India Express Air Delivery (typically 2 to 3 days from order date)
  const targetDate = new Date(orderDate);
  targetDate.setDate(targetDate.getDate() + 3);

  const estimatedDateFormatted = formatOrderDateIST(targetDate);
  const expectedTimeWindow = 'Expected between 10:00 AM – 8:00 PM IST';

  return {
    estimatedDateFormatted,
    expectedTimeWindow,
    formattedRange: `${estimatedDateFormatted} • ${expectedTimeWindow}`,
    isSameDay: false,
    minDays: 2,
    maxDays: 4,
    deliveryDateStart: targetDate.toISOString(),
    deliveryDateEnd: targetDate.toISOString(),
    cutoffInfo: 'Direct priority air cargo dispatch via Delhivery / Bluedart',
  };
}

/**
 * Builds standard 5-stage timeline progression with real IST timestamps
 */
export function generateTimelineEvents(
  stage: DeliveryStage = 'confirmed',
  orderDateInput: Date | string | number = new Date(),
  destinationCity: string = 'Mumbai'
): DeliveryTimelineEvent[] {
  const orderDate = new Date(orderDateInput);
  const stages: DeliveryStage[] = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const currentIndex = stages.indexOf(stage);

  // Calculate estimated offsets
  const packTime = new Date(orderDate.getTime() + 2.5 * 3600 * 1000);
  const shipTime = new Date(orderDate.getTime() + 5.5 * 3600 * 1000);
  const outDeliveryTime = new Date(orderDate.getTime() + 48 * 3600 * 1000);
  const deliveredTime = new Date(orderDate.getTime() + 54 * 3600 * 1000);

  return [
    {
      stage: 'confirmed',
      title: 'Order Confirmed',
      description: 'Order placed & payment verified in Mumbai Atelier queue.',
      timestamp: formatTimelineStampIST(orderDate),
      location: 'Mumbai Atelier Desk',
      completed: currentIndex >= 0,
    },
    {
      stage: 'packed',
      title: 'Order Packed',
      description: 'Anti-tarnish wax seal applied with custom velvet box packaging.',
      timestamp: currentIndex >= 1
        ? formatTimelineStampIST(packTime)
        : `${formatOrderDateIST(packTime)} • Estimated by ${formatOrderTimeIST(packTime)}`,
      location: 'Bandra West Studio Lab',
      completed: currentIndex >= 1,
    },
    {
      stage: 'shipped',
      title: 'Order Shipped',
      description: 'Airway bill generated and handed over to express delivery network.',
      timestamp: currentIndex >= 2
        ? formatTimelineStampIST(shipTime)
        : `${formatOrderDateIST(shipTime)} • Estimated by ${formatOrderTimeIST(shipTime)}`,
      location: 'Mumbai Air Logistics Hub',
      completed: currentIndex >= 2,
    },
    {
      stage: 'out_for_delivery',
      title: 'Out for Delivery',
      description: 'Courier specialist dispatched for contactless doorstep handover.',
      timestamp: currentIndex >= 3
        ? formatTimelineStampIST(outDeliveryTime)
        : `${formatOrderDateIST(outDeliveryTime)} • Expected between 10:00 AM – 1:00 PM`,
      location: `${destinationCity} Delivery Center`,
      completed: currentIndex >= 3,
    },
    {
      stage: 'delivered',
      title: 'Delivered',
      description: 'Safely delivered with contactless signature verification.',
      timestamp: currentIndex >= 4
        ? formatTimelineStampIST(deliveredTime)
        : `${formatOrderDateIST(deliveredTime)} • Expected between 10:00 AM – 8:00 PM IST`,
      location: `${destinationCity} Destination`,
      completed: currentIndex >= 4,
    },
  ];
}

/**
 * Saves or updates delivery tracking record in Supabase & Local Registry
 */
export async function saveDeliveryTracking(tracking: DeliveryTracking): Promise<void> {
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

  try {
    const raw = localStorage.getItem(TRACKING_STORAGE_KEY);
    const list: DeliveryTracking[] = raw ? JSON.parse(raw) : [];
    const filtered = list.filter((t) => t.trackingNumber !== tracking.trackingNumber && t.orderId !== tracking.orderId);
    localStorage.setItem(TRACKING_STORAGE_KEY, JSON.stringify([tracking, ...filtered]));
  } catch {}
}

/**
 * Fetches delivery tracking by tracking number or order ID
 */
export async function getDeliveryTracking(query: string): Promise<DeliveryTracking | null> {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return null;

  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('delivery_tracking')
        .select('*')
        .or(`tracking_number.ilike.%${cleanQuery}%,order_id.ilike.%${cleanQuery}%`)
        .maybeSingle();

      if (data && !error) {
        const estDelivery = calculateDeliveryEstimate(data.carrier, new Date(data.created_at));
        return {
          id: data.id,
          orderId: data.order_id,
          trackingNumber: data.tracking_number,
          carrier: data.carrier,
          currentStatus: data.current_status as DeliveryStage,
          destinationCity: data.destination_city,
          timeline: data.timeline_events || [],
          estimatedDelivery: estDelivery,
          lastUpdated: data.updated_at || new Date().toISOString(),
        };
      }
    } catch (err) {
      console.warn('[TrackingService] Supabase fetch error:', err);
    }
  }

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

  // Fallback demo matching
  if (cleanQuery.includes('9921') || cleanQuery.includes('8941')) {
    const seedDate = new Date(Date.now() - 86400000);
    return {
      orderId: 'ORD-2026-8941',
      trackingNumber: 'MUM-EXPRESS-9921',
      carrier: 'Mumbai Atelier Express',
      currentStatus: 'delivered',
      destinationCity: 'Bandra West, Mumbai',
      estimatedDelivery: calculateDeliveryEstimate('Mumbai Same-Day Express Courier', seedDate),
      timeline: generateTimelineEvents('delivered', seedDate, 'Bandra West, Mumbai'),
      lastUpdated: new Date().toISOString(),
    };
  }

  return null;
}
