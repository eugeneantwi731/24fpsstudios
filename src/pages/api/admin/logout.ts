import type { APIRoute } from 'astro';
import { getAdminSupabase } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const token = cookies.get('admin_session')?.value;

  if (token) {
    const supabase = getAdminSupabase();
    await supabase.from('admin_sessions').delete().eq('token', token);
    cookies.delete('admin_session', { path: '/' });
  }

  return redirect('/admin');
};
