import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('http') &&
    !supabaseUrl.includes('your-supabase-project')
  );
};

// Create client if configured, otherwise null
export const supabase: SupabaseClient | null = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

/**
 * Log Supabase initialization status once for developer clarity
 */
if (import.meta.env.DEV) {
  if (isSupabaseConfigured()) {
    console.info('✨ [Celestia] Supabase Backend connected successfully.');
  } else {
    console.info(
      '📦 [Celestia] Supabase keys not set in .env. Running on Resilient Atelier Local Adapter.'
    );
  }
}
