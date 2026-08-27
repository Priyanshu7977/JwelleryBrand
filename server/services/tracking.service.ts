import { FulfillmentStatus, TrackingEventEntity } from '../types/index';

const TIMEZONE = 'Asia/Kolkata';

export function getNowIST(): Date {
  return new Date();
}

export function formatOrderDateIST(dateInput: Date | string): string {
  const d = new Date(dateInput);
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function formatOrderTimeIST(dateInput: Date | string): string {
  const d = new Date(dateInput);
  const timeStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
  return `${timeStr} IST`;
}

export function calculateDeliveryWindow(shippingMethod: string, orderDate = new Date()): {
  isSameDay: boolean;
  start: Date;
  end: Date;
  formatted: string;
} {
  const isMumbaiSameDay = shippingMethod.toLowerCase().includes('same-day') || shippingMethod.toLowerCase().includes('mumbai');

  // Convert current date to IST hour
  const istFormatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    hour12: false,
  });
  const currentHourIST = parseInt(istFormatter.format(orderDate), 10);

  if (isMumbaiSameDay) {
    if (currentHourIST < 13) {
      // Pre-cutoff: Delivered evening same day
      const eveningDelivery = new Date(orderDate);
      return {
        isSameDay: true,
        start: eveningDelivery,
        end: eveningDelivery,
        formatted: `Delivered Today by 9:00 PM IST (${formatOrderDateIST(eveningDelivery)})`,
      };
    } else {
      // Post-cutoff: Priority dispatch next morning
      const nextMorning = new Date(orderDate.getTime() + 24 * 60 * 60 * 1000);
      return {
        isSameDay: false,
        start: nextMorning,
        end: nextMorning,
        formatted: `Delivered Tomorrow by 1:00 PM IST (${formatOrderDateIST(nextMorning)})`,
      };
    }
  }

  // Standard Pan-India express air delivery: 2-3 days
  const start = new Date(orderDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  const end = new Date(orderDate.getTime() + 4 * 24 * 60 * 60 * 1000);
  return {
    isSameDay: false,
    start,
    end,
    formatted: `Estimated between ${formatOrderDateIST(start)} – ${formatOrderDateIST(end)}`,
  };
}

export function getFulfillmentProgress(stage: FulfillmentStatus): { completedMilestones: number; totalMilestones: number; percentage: number } {
  const stages: FulfillmentStatus[] = ['confirmed', 'packed', 'shipped', 'out_for_delivery', 'delivered'];
  const idx = stages.indexOf(stage);
  const completedMilestones = idx >= 0 ? idx + 1 : 1;
  return {
    completedMilestones,
    totalMilestones: 5,
    percentage: Math.round((completedMilestones / 5) * 100),
  };
}
