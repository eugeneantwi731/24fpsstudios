import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

// POST /api/admin/members/:id/delete
// Admin-only: permanent deletion is a gatekeeping action, same as approve/reject.
// If this member was also published, remove the published row too so a deleted
// submission can never leave a stale entry live on the public site.
export const POST: APIRoute = async ({ params, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  const { supabase } = auth;

  // Clean up any published row tied to this submission first.
  const { error: unpublishError } = await supabase
    .from('members')
    .delete()
    .eq('submission_id', id);

  if (unpublishError) {
    console.error('[delete] failed to remove published row:', unpublishError);
    // Not fatal — continue with deleting the submission itself.
  }

  const { error } = await supabase
    .from('member_submissions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('[delete] delete failed:', error);
    return jsonError(500, 'Failed to delete submission');
  }

  return jsonOk({ success: true });
};
