/**
 * Celestia Atelier Security & Input Sanitization Utilities
 * Prevents XSS, script injection, iframe embedding, and malicious tag execution across all input fields.
 */

export const sanitizeGeneralText = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:\s*text\/html/gi, '')
    .replace(/vbscript:/gi, '')
    .replace(/on\w+\s*=/gi, '');
};

export const sanitizeEmail = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[<>"'\s]/g, '')
    .replace(/javascript:/gi, '');
};

export const sanitizeAlphaNumeric = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/[^a-zA-Z0-9_-]/g, '');
};

export const sanitizePhone = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/[^0-9+\s\-()]/g, '');
};

export const sanitizePassword = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/[<>]/g, '');
};

/**
 * Strict Alphanumeric Coupon Sanitizer
 * Strips all HTML tags, script, iframe, symbols, punctuation, spaces, quotes, brackets (< > / \ " ' = ` ; etc.)
 * Strictly preserves ONLY letters (A-Z) and numbers (0-9).
 */
export const sanitizeCouponCode = (val: string): string => {
  if (!val) return '';
  return val
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 20);
};

