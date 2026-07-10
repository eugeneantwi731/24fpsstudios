import type { APIRoute } from 'astro';
import { getAdminSupabase } from '../../../lib/supabase-admin';
import { verifyPassword, generateSessionToken } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const form = await request.formData();
  const username = form.get('username')?.toString().trim().toLowerCase();
  const password = form.get('password')?.toString();

  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Missing fields' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    });
  }

  const runtimeEnv = (locals as any).runtime?.env;
  const supabase = getAdminSupabase(runtimeEnv);

  const { data: user, error: fetchError } = await supabase
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .maybeSingle();

  console.log('[login] user:', user, 'fetchError:', fetchError);

  const dummyHash = '0'.repeat(32) + ':' + '0'.repeat(64);
  const valid = user
    ? await verifyPassword(password, user.password_hash)
    : await verifyPassword(password, dummyHash).then(() => false);

  console.log('[login] valid:', valid);

  if (!user || !valid) {
    return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
      status: 401, headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  await supabase.from('admin_sessions').insert({
    admin_id:   user.id,
    token,
    expires_at: expiresAt.toISOString(),
  });

  cookies.set('admin_session', token, {
    path:     '/',
    httpOnly: true,
    secure:   true,
    sameSite: 'lax',
    expires:  expiresAt,
  });

  return new Response(JSON.stringify({ success: true }), {
    status: 200, headers: { 'Content-Type': 'application/json' },
  });
};