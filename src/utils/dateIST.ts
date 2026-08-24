/**
 * Precision IST (Asia/Kolkata) Date & Time Formatting Utilities
 */

const TIMEZONE = 'Asia/Kolkata';

/**
 * Formats date in IST: e.g. "28 Aug 2026"
 */
export function formatOrderDateIST(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'Today';

  return new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
}

/**
 * Formats time in IST: e.g. "10:42 PM IST"
 */
export function formatOrderTimeIST(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '10:00 AM IST';

  const timeStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  return `${timeStr} IST`;
}

/**
 * Formats short date and time for timeline: e.g. "28 Aug • 10:42 PM"
 */
export function formatTimelineStampIST(dateInput: Date | string | number): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return 'Today';

  const datePart = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    day: 'numeric',
    month: 'short',
  }).format(d);

  const timePart = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);

  return `${datePart} • ${timePart}`;
}

/**
 * Returns the current IST hour (0-23)
 */
export function getHourInIST(dateInput: Date = new Date()): number {
  const hourStr = new Intl.DateTimeFormat('en-IN', {
    timeZone: TIMEZONE,
    hour: 'numeric',
    hour12: false,
  }).format(dateInput);

  return parseInt(hourStr, 10);
}
