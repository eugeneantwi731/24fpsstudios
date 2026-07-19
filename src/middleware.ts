import { defineMiddleware } from 'astro:middleware';
import { getAdminSupabase } from './lib/supabase-admin';

const PUBLIC_ADMIN_PATHS = [
  '/admin',
  '/admin/',
  '/admin/setup',
  '/admin/setup/',
];

const PUBLIC_API_PATHS = [
  '/api/admin/login',
  '/api/admin/logout',
  '/api/admin/setup',
];

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  const isAdminRoute = pathname.startsWith('/admin') || pathname.startsWith('/api/admin');
  if (!isAdminRoute) return next();

  const isPublic =
    PUBLIC_ADMIN_PATHS.includes(pathname) ||
    PUBLIC_API_PATHS.some(p => pathname.startsWith(p));

  if (isPublic) return next();

  // ── Check session cookie ──────────────────────────────────────────────────
  const token = context.cookies.get('admin_session')?.value;

  if (!token) {
    return context.redirect('/admin');
  }

  const runtimeEnv = (context.locals as any).runtime?.env;
  const supabase = getAdminSupabase(runtimeEnv);

  const { data: session } = await supabase
    .from('admin_sessions')
    .select('*, admin_users(*)')
    .eq('token', token)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (!session || !session.admin_users) {
    context.cookies.delete('admin_session', { path: '/' });
    return context.redirect('/admin');
  }

  // Attach user to locals for use in any admin page
  context.locals.adminUser = {
    id: session.admin_users.id,
    username: session.admin_users.username,
    role: session.admin_users.role,
  };

  return next();
});