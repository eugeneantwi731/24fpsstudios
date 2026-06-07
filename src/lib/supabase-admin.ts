import { createClient } from '@supabase/supabase-js';

export function getAdminSupabase() {
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? '';
  const serviceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(`Missing Supabase config — URL: ${!!supabaseUrl}, KEY: ${!!serviceRoleKey}`);
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}