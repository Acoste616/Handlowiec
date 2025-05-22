import { z } from 'zod';

// Custom Polish phone validation
const polishPhoneRegex = /^(\+48)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}[\s\-]?[0-9]{3}$/;

// Lead form validation schema
export const leadFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Imię musi mieć minimum 2 znaki')
    .max(50, 'Imię może mieć maksymalnie 50 znaków')
    .regex(/^[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ\s]+$/, 'Imię może zawierać tylko litery'),
  
  company: z
    .string()
    .min(2, 'Nazwa firmy musi mieć minimum 2 znaki')
    .max(100, 'Nazwa firmy może mieć maksymalnie 100 znaków'),
  
  email: z
    .string()
    .email('Nieprawidłowy format e-mail')
    .max(254, 'E-mail może mieć maksymalnie 254 znaki'),
  
  phone: z
    .string()
    .regex(polishPhoneRegex, 'Nieprawidłowy format telefonu (wymagany polski numer)')
    .transform((val) => val.replace(/[\s\-]/g, '')),
  
  message: z
    .string()
    .min(10, 'Wiadomość musi mieć minimum 10 znaków')
    .max(500, 'Wiadomość może mieć maksymalnie 500 znaków'),
  
  consent: z
    .boolean()
    .refine((val) => val === true, 'Zgoda na przetwarzanie danych jest wymagana'),
  
  // Optional fields for tracking
  source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
});

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.any().optional(),
  errors: z.record(z.string(), z.array(z.string())).optional(),
  timestamp: z.string(),
});

// Google Sheets row validation
export const googleSheetsRowSchema = z.object({
  timestamp: z.string(),
  firstName: z.string(),
  company: z.string(),
  email: z.string().email(),
  phone: z.string(),
  message: z.string(),
  source: z.string(),
  utm_campaign: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'closed']).default('new'),
  notes: z.string().optional(),
});

// HubSpot contact validation
export const hubspotContactSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string().optional(),
  company: z.string(),
  phone: z.string(),
  message: z.string(),
  lifecyclestage: z.string().default('lead'),
  lead_source: z.string(),
  utm_campaign: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_content: z.string().optional(),
});

// Environment validation
export const envSchema = z.object({
  GOOGLE_SHEETS_ID: z.string().min(1, 'Google Sheets ID is required'),
  GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().email('Invalid service account email'),
  GOOGLE_PRIVATE_KEY: z.string().min(1, 'Google private key is required'),
  HUBSPOT_ACCESS_TOKEN: z.string().optional(),
  SMTP_USER: z.string().email('Invalid SMTP user email'),
  SMTP_PASSWORD: z.string().min(1, 'SMTP password is required'),
  SLACK_WEBHOOK_URL: z.string().url('Invalid Slack webhook URL').optional(),
});

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string().min(1),
  maxRequests: z.number().positive(),
  windowMs: z.number().positive(),
});

// Analytics event validation
export const analyticsEventSchema = z.object({
  event: z.string().min(1),
  properties: z.record(z.any()).optional(),
  timestamp: z.number().optional(),
  userId: z.string().optional(),
  sessionId: z.string().optional(),
});

// Form field validation helpers
export const validateField = {
  firstName: (value: string) => {
    try {
      leadFormSchema.shape.firstName.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Nieprawidłowa wartość' };
    }
  },
  
  company: (value: string) => {
    try {
      leadFormSchema.shape.company.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Nieprawidłowa wartość' };
    }
  },
  
  email: (value: string) => {
    try {
      leadFormSchema.shape.email.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Nieprawidłowa wartość' };
    }
  },
  
  phone: (value: string) => {
    try {
      leadFormSchema.shape.phone.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Nieprawidłowa wartość' };
    }
  },
  
  message: (value: string) => {
    try {
      leadFormSchema.shape.message.parse(value);
      return { isValid: true, error: null };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { isValid: false, error: error.errors[0].message };
      }
      return { isValid: false, error: 'Nieprawidłowa wartość' };
    }
  },
};

// Type exports
export type LeadFormData = z.infer<typeof leadFormSchema>;
export type ApiResponse = z.infer<typeof apiResponseSchema>;
export type GoogleSheetsRow = z.infer<typeof googleSheetsRowSchema>;
export type HubSpotContact = z.infer<typeof hubspotContactSchema>;
export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>; 