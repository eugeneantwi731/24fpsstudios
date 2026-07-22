import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

// Only these fields can be edited through this endpoint. Anything
// else in the request body is ignored — this stops a crafted request
// from overwriting status, reviewed_by, id, etc.
const EDITABLE_FIELDS = new Set([
  'name',
  'nickname',
  'role',
  'category',
  'program',
  'bio',
  'email',
  'portfolio',
  'expertise',
  'socials',
]);

const CATEGORY_VALUES = ['faculty', 'alumni', 'student'];

// POST /api/admin/members/:id/edit
// body: { field: string, value: any }  — single-field edit, matches
// the inline "click Edit, save" UI pattern already in _id_.astro.
// Admin or editor: both can edit submission details/notes.
export const PATCH: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  let body: { field?: string; value?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const { field, value } = body;
  if (!field || !EDITABLE_FIELDS.has(field)) {
    return jsonError(400, `field must be one of: ${[...EDITABLE_FIELDS].join(', ')}`);
  }

  if (field === 'category' && typeof value === 'string' && !CATEGORY_VALUES.includes(value)) {
    return jsonError(400, `category must be one of: ${CATEGORY_VALUES.join(', ')}`);
  }

  const { supabase, admin } = auth;

  // Fetch current value + edit_log so we can append a history entry
  const { data: current, error: fetchError } = await supabase
    .from('member_submissions')
    .select(`${field}, edit_log`)
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !current) {
    return jsonError(404, 'Member submission not found');
  }

  const oldValue = (current as Record<string, unknown>)[field];
  const currentLog = Array.isArray((current as any).edit_log) ? (current as any).edit_log : [];

  const logEntry = {
    field,
    old_value: oldValue,
    new_value: value,
    by: admin.username,
    at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from('member_submissions')
    .update({
      [field]: value,
      edit_log: [...currentLog, logEntry],
    })
    .eq('id', id);

  if (updateError) {
    console.error('[edit] update failed:', updateError);
    return jsonError(500, 'Failed to save edit');
  }

  return jsonOk({ success: true, field, value });
};
