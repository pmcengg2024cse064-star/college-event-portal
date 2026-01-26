import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client (with service role key for admin operations)
// Only create this if we're on the server
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

if (typeof window === 'undefined') {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (supabaseServiceRoleKey) {
    supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
  }
}

export { supabaseAdmin };

// Types for our database
export interface Event {
  id: string;
  title: string;
  description: string;
  short_description: string;
  poster_url: string;
  date: string;
  time: string;
  venue: string;
  registration_deadline: string;
  max_registrations: number;
  current_registrations: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  student_name: string;
  register_number: string;
  department: string;
  email: string;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  created_at: string;
}
