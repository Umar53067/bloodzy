import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Client Configuration
 * Replace these with your actual Supabase credentials from supabase.com
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const SUPABASE_KEY = SUPABASE_PUBLISHABLE_KEY || SUPABASE_ANON_KEY || 'YOUR_ANON_KEY';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.warn(
    'Supabase credentials not configured. Please set VITE_SUPABASE_URL and either VITE_SUPABASE_PUBLISHABLE_KEY or VITE_SUPABASE_ANON_KEY in your .env file'
  );
}

if (SUPABASE_KEY?.startsWith('sb_secret_')) {
  console.error('Detected Supabase secret key in frontend env. Use VITE_SUPABASE_PUBLISHABLE_KEY (or legacy VITE_SUPABASE_ANON_KEY) only.');
}

// Create and export Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/**
 * Helper function to check if Supabase is properly configured
 */
export const isSupabaseConfigured = () => {
  return Boolean(
    SUPABASE_URL &&
    SUPABASE_KEY &&
    SUPABASE_URL !== 'https://YOUR_PROJECT.supabase.co' &&
    !SUPABASE_KEY.startsWith('sb_secret_')
  );
};
