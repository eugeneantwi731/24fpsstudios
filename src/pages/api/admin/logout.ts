import type { APIRoute } from 'astro';
import { getAdminSupabase } from '../../../lib/supabase-admin';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect, locals }) => {
  const token = cookies.get('admin_session')?.value;

  if (token) {
    const runtimeEnv = (locals as any).runtime?.env;
    const supabase = getAdminSupabase(runtimeEnv);
    await supabase.from('admin_sessions').delete().eq('token', token);
    cookies.delete('admin_session', { path: '/' });
  }

  return redirect('/admin');
};