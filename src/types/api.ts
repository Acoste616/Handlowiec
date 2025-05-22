export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message: string;
  errors?: Record<string, string[]>;
  timestamp: string;
}

export interface ApiError {
  message: string;
  code: string;
  statusCode: number;
  details?: any;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

export type ServiceStatus = 'connected' | 'disconnected';

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  services: {
    database: ServiceStatus;
    email: ServiceStatus;
    googleSheets: ServiceStatus;
    hubspot: ServiceStatus;
    slack: ServiceStatus;
  };
  timestamp: string;
  version: string;
}

export interface LeadAnalytics {
  totalLeads: number;
  leadsToday: number;
  leadsThisWeek: number;
  leadsThisMonth: number;
  conversionRate: number;
  topSources: Array<{
    source: string;
    count: number;
    percentage: number;
  }>;
  topCompanies: Array<{
    company: string;
    count: number;
  }>;
}

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType: string;
  }>;
}

export interface SlackNotification {
  channel?: string;
  username?: string;
  text: string;
  attachments?: Array<{
    color: string;
    title: string;
    fields: Array<{
      title: string;
      value: string;
      short: boolean;
    }>;
  }>;
} 