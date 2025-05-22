import { z } from 'zod';

export interface LeadFormData {
  firstName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  source?: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
}

export interface FormSubmissionResponse {
  success: boolean;
  message: string;
  leadId?: string;
  errors?: Record<string, string[]>;
}

export interface FormValidationError {
  field: string;
  message: string;
}

export interface FormState {
  isSubmitting: boolean;
  isSuccess: boolean;
  error: string | null;
  data: LeadFormData | null;
}

export type FormStep = 'form' | 'submitting' | 'success' | 'error';

export interface GoogleSheetsLead {
  timestamp: string;
  firstName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
  source: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  notes?: string;
}

export interface HubSpotContact {
  email: string;
  firstName: string;
  lastName?: string;
  company: string;
  phone: string;
  message: string;
  lifecyclestage: string;
  lead_source: string;
  utm_campaign?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_content?: string;
}

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Imię i nazwisko jest wymagane'),
  email: z.string().email('Nieprawidłowy adres email'),
  phone: z.string().min(9, 'Nieprawidłowy numer telefonu'),
  company: z.string().min(2, 'Nazwa firmy jest wymagana'),
  message: z.string().min(10, 'Wiadomość musi mieć minimum 10 znaków'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'Musisz zaakceptować regulamin',
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>; 