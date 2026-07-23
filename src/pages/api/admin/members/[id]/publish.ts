import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// POST /api/admin/members/:id/publish
// Copies an approved submission into the public `members` table,
// making it live on the public /members page. Admin or editor —
// per spec, publishing is not a gatekeeping action the way
// approve/reject/delete are, since the submission was already
// vetted at approval time.
export const POST: APIRoute = async ({ params, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  const { supabase, admin } = auth;

  const { data: submission, error: fetchError } = await supabase
    .from('member_submissions')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !submission) {
    return jsonError(404, 'Member submission not found');
  }

  if (submission.status !== 'approved') {
    return jsonError(400, 'Only approved submissions can be published');
  }

  // If already published, just flip published back to true rather
  // than creating a duplicate row (handles re-publish after unpublish).
  const { data: existing } = await supabase
    .from('members')
    .select('id')
    .eq('submission_id', id)
    .maybeSingle();

  if (existing) {
    const { error: updateError } = await supabase
      .from('members')
      .update({
        published: true,
        published_by: admin.username,
        published_at: new Date().toISOString(),
        unpublished_by: null,
        unpublished_at: null,
        // Re-sync fields in case they were edited after the last publish
        name: submission.name,
        nickname: submission.nickname ?? null,
        category: submission.category,
        program: submission.program ?? null,
        role: submission.role,
        expertise: submission.expertise ?? [],
        bio: submission.bio ?? null,
        email: submission.email ?? null,
        portfolio: submission.portfolio ?? null,
        socials: submission.socials ?? {},
        photo_url: submission.photo_url ?? null,
      })
      .eq('id', existing.id);

    if (updateError) {
      console.error('[publish] re-publish update failed:', updateError);
      return jsonError(500, 'Failed to publish member');
    }

    return jsonOk({ success: true, published: true, memberId: existing.id });
  }

  // Build a unique slug (name-based, with a numeric suffix on collision)
  const baseSlug = slugify(submission.name || 'member');
  let slug = baseSlug;
  let suffix = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data: collision } = await supabase
      .from('members')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();
    if (!collision) break;
    slug = `${baseSlug}-${suffix++}`;
  }

  const initials = (submission.name || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((w: string) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join('');

  const { data: inserted, error: insertError } = await supabase
    .from('members')
    .insert({
      submission_id: id,
      slug,
      name: submission.name,
      nickname: submission.nickname ?? null,
      initials,
      category: submission.category,
      program: submission.program ?? null,
      role: submission.role,
      expertise: submission.expertise ?? [],
      bio: submission.bio ?? null,
      email: submission.email ?? null,
      portfolio: submission.portfolio ?? null,
      socials: submission.socials ?? {},
      photo_url: submission.photo_url ?? null,
      published: true,
      published_by: admin.username,
      published_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (insertError) {
    console.error('[publish] insert failed:', insertError);
    return jsonError(500, 'Failed to publish member');
  }

  return jsonOk({ success: true, published: true, memberId: inserted.id });
};

// DELETE /api/admin/members/:id/publish  → unpublish (take down from public site)
// Keeps the row (so re-publishing doesn't lose data) but flips
// published=false, which the public page's RLS policy filters out.
export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  const { supabase, admin } = auth;

  const { error } = await supabase
    .from('members')
    .update({
      published: false,
      unpublished_by: admin.username,
      unpublished_at: new Date().toISOString(),
    })
    .eq('submission_id', id);

  if (error) {
    console.error('[unpublish] update failed:', error);
    return jsonError(500, 'Failed to unpublish member');
  }

  return jsonOk({ success: true, published: false });
};