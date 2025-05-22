/**
 * Format current timestamp in Polish locale
 */
export function formatTimestamp(): string {
  return new Date().toLocaleString('pl-PL', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Sanitize string input to prevent XSS and other security issues
 */
export function sanitizeString(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove on* event handlers
    .replace(/data:/gi, ''); // Remove data: protocol
}

/**
 * Generate a random string of specified length
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Format phone number to E.164 format
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';
  
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // If number starts with 48 (Poland), remove it
  const cleanNumber = digits.startsWith('48') ? digits.slice(2) : digits;
  
  // Add +48 prefix if not present
  return `+48${cleanNumber}`;
}

/**
 * Validate email address format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
 * Format date in Polish locale
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('pl-PL', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

/**
 * Get estimated response time based on current time
 * Returns time in format "do HH:MM" or "jutro do HH:MM"
 */
export function getEstimatedResponseTime(): string {
  const now = new Date();
  const hour = now.getHours();
  
  // If it's after 17:00, set response time to tomorrow
  if (hour >= 17) {
    return 'jutro do 12:00';
  }
  
  // If it's before 9:00, set response time to today at 12:00
  if (hour < 9) {
    return 'do 12:00';
  }
  
  // Otherwise, set response time to 2 hours from now
  const responseTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  return `do ${responseTime.getHours()}:${responseTime.getMinutes().toString().padStart(2, '0')}`;
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
} 