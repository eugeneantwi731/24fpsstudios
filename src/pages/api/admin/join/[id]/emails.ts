import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

// GET /api/admin/join/:id/emails
// Returns the send history for this applicant (most recent first).
export const GET: APIRoute = async ({ params, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals });
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing submission id');

  const { supabase } = auth;

  const { data, error } = await supabase
    .from('join_submission_emails')
    .select('id, sent_by, to_email, subject, body, status, error_message, created_at')
    .eq('submission_id', id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[join/emails] fetch failed:', error);
    return jsonError(500, 'Failed to load email history');
  }

  return jsonOk({ emails: data ?? [] });
};
