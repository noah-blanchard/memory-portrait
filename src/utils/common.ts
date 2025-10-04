/**
 * Common utility functions used across the application
 */

/**
 * Normalize whitespace in a string by replacing multiple spaces with single spaces and trimming
 */
export function normalizeWhitespace(s: string): string {
  return s.replace(/\s+/g, ' ').trim();
}

/**
 * Strip non-digit characters from a phone number, keeping only digits and +
 */
export function stripPhone(s: string): string {
  return s.replace(/[^\d+]/g, '');
}

/**
 * Merge a date with a time string (HH:MM format)
 */
export function mergeDateTime(date: Date, timeString: string): Date {
  const [hours, minutes] = timeString.split(':').map((n) => parseInt(n, 10));
  const result = new Date(date);
  result.setHours(hours, minutes, 0, 0);
  return result;
}

/**
 * Convert milliseconds to hours and minutes
 */
export function msToHoursMinutes(ms: number): { hours: number; minutes: number } {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes };
}

/**
 * Round a number to 2 decimal places
 */
export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Round up to the nearest hour with validation
 */
export function ceilHours(h: number): number {
  if (!Number.isFinite(h) || h <= 0) {
    return 1;
  }
  return Math.ceil(h);
}

/**
 * Format a date to ISO string for API usage
 */
export function formatDateForApi(date: Date): string {
  return date.toISOString();
}

/**
 * Check if a value is a valid email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Check if a value is a valid WeChat ID
 */
export function isValidWeChatId(wechatId: string): boolean {
  const wechatRegex = /^[A-Za-z][-_A-Za-z0-9]{5,19}$/;
  return wechatRegex.test(wechatId);
}

/**
 * Check if a value is a valid Instagram handle
 */
export function isValidInstagramHandle(handle: string): boolean {
  const instagramRegex = /^(?!.*\.\.)(?!.*\.$)[A-Za-z0-9._]{1,30}$/;
  return instagramRegex.test(handle);
}

/**
 * Check if a value is a valid phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const stripped = stripPhone(phone);
  const phoneRegex = /^\+?[1-9]\d{7,14}$/;
  return phoneRegex.test(stripped);
}

/**
 * Validate contact information based on method
 */
export function validateContact(method: string, contact: string): boolean {
  switch (method) {
    case 'email':
      return isValidEmail(contact);
    case 'wechat':
      return isValidWeChatId(contact);
    case 'instagram':
      return isValidInstagramHandle(contact);
    case 'phone':
      return isValidPhoneNumber(contact);
    default:
      return false;
  }
}

/**
 * Generate a unique ID (simple implementation)
 */
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
