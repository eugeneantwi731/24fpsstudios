import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

const VALID_STATUSES = ['pending', 'approved', 'rejected'];

// POST /api/admin/members/:id/status
// body: { status: 'approved' | 'rejected' | 'pending' }
// Admin-only: approve/reject/reset is a gatekeeping action.
export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  let body: { status?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const newStatus = body.status;
  if (!newStatus || !VALID_STATUSES.includes(newStatus)) {
    return jsonError(400, `status must be one of: ${VALID_STATUSES.join(', ')}`);
  }

  const { supabase, admin } = auth;

  const { error } = await supabase
    .from('member_submissions')
    .update({
      status: newStatus,
      reviewed_by: admin.username,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[status] update failed:', error);
    return jsonError(500, 'Failed to update status');
  }

  return jsonOk({ success: true, status: newStatus });
};
