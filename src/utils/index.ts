import { type ClassValue, clsx } from 'clsx';

/**
 * Utility function for merging Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Format phone number to Polish standard
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.startsWith('48')) {
    return `+${cleaned}`;
  }
  
  if (cleaned.startsWith('0')) {
    return `+48${cleaned.slice(1)}`;
  }
  
  if (cleaned.length === 9) {
    return `+48${cleaned}`;
  }
  
  return phone;
}

/**
 * Validate Polish NIP number
 */
export function validateNIP(nip: string): boolean {
  const cleaned = nip.replace(/[-\s]/g, '');
  
  if (cleaned.length !== 10 || !/^\d{10}$/.test(cleaned)) {
    return false;
  }
  
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  let sum = 0;
  
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cleaned[i]) * weights[i];
  }
  
  const checksum = sum % 11;
  const lastDigit = parseInt(cleaned[9]);
  
  return checksum === lastDigit;
}

/**
 * Extract UTM parameters from URL
 */
export function extractUTMParams(url: string): Record<string, string> {
  const urlObj = new URL(url);
  const params: Record<string, string> = {};
  
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
    const value = urlObj.searchParams.get(param);
    if (value) {
      params[param] = value;
    }
  });
  
  return params;
}

/**
 * Generate unique tracking ID
 */
export function generateTrackingId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Format timestamp for Polish locale
 */
export function formatTimestamp(date: Date = new Date()): string {
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Slugify string for URL
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Remove multiple hyphens
    .trim();
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Check if user is in Poland timezone
 */
export function isPolishTimezone(): boolean {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone === 'Europe/Warsaw';
}

/**
 * Get business hours status
 */
export function isBusinessHours(): boolean {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  // Monday to Friday, 9 AM to 6 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
}

/**
 * Format currency in PLN
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: 'PLN',
  }).format(amount);
}

/**
 * Calculate estimated response time
 */
export function getEstimatedResponseTime(): string {
  if (isBusinessHours()) {
    return '15 minut';
  }
  
  const now = new Date();
  const nextBusinessDay = new Date(now);
  
  // If it's weekend, set to next Monday
  if (now.getDay() === 0) { // Sunday
    nextBusinessDay.setDate(now.getDate() + 1);
  } else if (now.getDay() === 6) { // Saturday
    nextBusinessDay.setDate(now.getDate() + 2);
  } else {
    nextBusinessDay.setDate(now.getDate() + 1);
  }
  
  nextBusinessDay.setHours(9, 0, 0, 0);
  
  return `jutro o ${nextBusinessDay.toLocaleTimeString('pl-PL', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })}`;
}

/**
 * Rate limiting helper
 */
export function createRateLimiter(maxRequests: number, windowMs: number) {
  const requests = new Map<string, { count: number; resetTime: number }>();
  
  return {
    check: (identifier: string): { allowed: boolean; remaining: number; resetTime: number } => {
      const now = Date.now();
      const entry = requests.get(identifier);
      
      if (!entry || now > entry.resetTime) {
        requests.set(identifier, {
          count: 1,
          resetTime: now + windowMs,
        });
        return { allowed: true, remaining: maxRequests - 1, resetTime: now + windowMs };
      }
      
      if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetTime: entry.resetTime };
      }
      
      entry.count++;
      return { 
        allowed: true, 
        remaining: maxRequests - entry.count, 
        resetTime: entry.resetTime 
      };
    },
    
    reset: (identifier: string): void => {
      requests.delete(identifier);
    },
  };
} 