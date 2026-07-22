import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

// POST /api/admin/members/:id/notes
// body: { notes: string }
// Admin or editor.
export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  let body: { notes?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const { supabase } = auth;

  const { error } = await supabase
    .from('member_submissions')
    .update({ admin_notes: body.notes ?? '' })
    .eq('id', id);

  if (error) {
    console.error('[notes] update failed:', error);
    return jsonError(500, 'Failed to save notes');
  }

  return jsonOk({ success: true });
};
