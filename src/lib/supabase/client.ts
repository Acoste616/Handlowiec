import { createBrowserClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side client for API routes
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

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