// ============================================================
// Shared session + role check for admin API routes.
//
// Every protected /api/admin/* route should start by calling
// requireRole() to (a) confirm there's a valid, non-expired
// session cookie and (b) confirm the logged-in user's role is
// allowed to perform this action. Nothing about role is ever
// trusted from the client — it's always re-derived here from
// the session token, server-side, using the service-role client.
// ============================================================

import type { AstroCookies } from 'astro';
import { getAdminSupabase } from './supabase-admin';

export type AdminRole = 'admin' | 'editor';

export interface AuthedAdmin {
  id: string;
  username: string;
  role: AdminRole;
}

interface RequireRoleResult {
  ok: true;
  admin: AuthedAdmin;
  supabase: ReturnType<typeof getAdminSupabase>;
}

interface RequireRoleFailure {
  ok: false;
  status: number;
  error: string;
}

/**
 * Validates the admin_session cookie and, if allowedRoles is given,
 * confirms the admin's role is one of them. Returns a discriminated
 * union so callers can `if (!result.ok) return json(result)`.
 *
 * Usage:
 *   const auth = await requireRole({ cookies, locals });               // any logged-in admin/editor
 *   const auth = await requireRole({ cookies, locals }, ['admin']);    // admin only
 */
export async function requireRole(
  { cookies, locals }: { cookies: AstroCookies; locals: App.Locals },
  allowedRoles?: AdminRole[]
): Promise<RequireRoleResult | RequireRoleFailure> {
  const token = cookies.get('admin_session')?.value;
  if (!token) {
    return { ok: false, status: 401, error: 'Not authenticated' };
  }

  const runtimeEnv = (locals as any).runtime?.env;
  const supabase = getAdminSupabase(runtimeEnv);

  const { data: session } = await supabase
    .from('admin_sessions')
    .select('admin_id, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (!session || new Date(session.expires_at) < new Date()) {
    return { ok: false, status: 401, error: 'Session expired' };
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('id, username, role')
    .eq('id', session.admin_id)
    .maybeSingle();

  if (!adminUser) {
    return { ok: false, status: 401, error: 'Admin account not found' };
  }

  const role = (adminUser.role ?? 'admin') as AdminRole;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return { ok: false, status: 403, error: 'Insufficient permissions' };
  }

  return {
    ok: true,
    admin: { id: adminUser.id, username: adminUser.username, role },
    supabase,
  };
}

export function jsonError(status: number, error: string) {
  return new Response(JSON.stringify({ error }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function jsonOk(body: Record<string, unknown> = { success: true }, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
