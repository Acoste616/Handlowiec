import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

// Real Supabase configuration with fallback values for build time
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dchwetwqmmeqyxlcqlac.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxNTU3MTksImV4cCI6MjA2MzczMTcxOX0.pdxKSoJvgpxHWaerbMNfbP9ZNtRVc6JTr6HSCsGnIp4';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaHdldHdxbW1lcXl4bGNxbGFjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODE1NTcxOSwiZXhwIjoyMDYzNzMxNzE5fQ.w2JsLB9IBkDmgLh8X4nuNPhSoN2zg2FgI-2A67tC3lE';

// Helper function to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_KEY
  );
}

// Safe client creation functions
export function createSupabaseClient() {
  if (typeof window === 'undefined') {
    // Server-side - return null during build
    if (process.env.NODE_ENV === 'production' && !isSupabaseConfigured()) {
      return null;
    }
  }
  
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export function createSupabaseAdminClient() {
  // During build time, return null if not configured
  if (process.env.NODE_ENV === 'production' && !isSupabaseConfigured()) {
    return null;
  }
  
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Lazy initialization
let _supabase: any = null;
let _supabaseAdmin: any = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createSupabaseClient();
  }
  return _supabase;
}

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    _supabaseAdmin = createSupabaseAdminClient();
  }
  return _supabaseAdmin;
}

// Legacy exports - only initialize if not in build mode
export const supabase = typeof window !== 'undefined' || isSupabaseConfigured() 
  ? getSupabase() 
  : null;

export const supabaseAdmin = isSupabaseConfigured() 
  ? getSupabaseAdmin() 
  : null;

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          client_id: string | null;
          role: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          client_id?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          client_id?: string | null;
          role?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          name: string;
          domain: string;
          settings: any;
          subscription_plan: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          domain: string;
          settings?: any;
          subscription_plan?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          domain?: string;
          settings?: any;
          subscription_plan?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          client_id: string;
          first_name: string;
          last_name: string;
          company: string;
          email: string;
          phone: string | null;
          status: string;
          priority: string;
          assigned_to: string | null;
          estimated_value: number | null;
          closing_probability: number;
          timeline: any;
          source: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          first_name: string;
          last_name: string;
          company: string;
          email: string;
          phone?: string | null;
          status?: string;
          priority?: string;
          assigned_to?: string | null;
          estimated_value?: number | null;
          closing_probability?: number;
          timeline?: any;
          source?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          first_name?: string;
          last_name?: string;
          company?: string;
          email?: string;
          phone?: string | null;
          status?: string;
          priority?: string;
          assigned_to?: string | null;
          estimated_value?: number | null;
          closing_probability?: number;
          timeline?: any;
          source?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string | null;
          type: string;
          description: string;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id?: string | null;
          type: string;
          description: string;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          user_id?: string | null;
          type?: string;
          description?: string;
          metadata?: any;
          created_at?: string;
        };
      };
      team_rotations: {
        Row: {
          id: string;
          client_id: string;
          user_id: string;
          rotation_type: string;
          start_date: string;
          end_date: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          user_id: string;
          rotation_type: string;
          start_date: string;
          end_date: string;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          user_id?: string;
          rotation_type?: string;
          start_date?: string;
          end_date?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
}; 