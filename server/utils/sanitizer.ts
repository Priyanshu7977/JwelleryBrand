export function sanitizeString(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/javascript:[^"']*/gi, '')
    .replace(/<[^>]*>/g, '') // Strip remaining HTML tags
    .trim();
}

export function validateCouponCode(coupon: string): { valid: boolean; sanitized: string; error?: string } {
  if (!coupon || typeof coupon !== 'string') {
    return { valid: false, sanitized: '', error: 'Coupon cannot be empty' };
  }

  // Check for malicious angle brackets or HTML tags
  if (/[<>]/.test(coupon)) {
    return { valid: false, sanitized: '', error: 'Coupon contains illegal characters' };
  }

  // Strictly alphanumeric without spaces
  const cleaned = coupon.trim().toUpperCase();
  if (/\s/.test(cleaned) || !/^[A-Z0-9_-]+$/.test(cleaned)) {
    return { valid: false, sanitized: '', error: 'Coupon format is invalid' };
  }

  return { valid: true, sanitized: cleaned };
}

export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') {
    return sanitizeString(obj) as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }
  if (obj !== null && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      result[key] = sanitizeObject(value);
    }
    return result as T;
  }
  return obj;
}
