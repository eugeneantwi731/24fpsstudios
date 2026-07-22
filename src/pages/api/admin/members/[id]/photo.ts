import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../../lib/admin-auth';

export const prerender = false;

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// POST /api/admin/members/:id/photo
// multipart/form-data with a "photo" file field.
// Admin or editor. Uploads to Supabase Storage using the service-role
// key (server-side), then updates member_submissions.photo_url — this
// replaces the old client-side upload that used the exposed anon key.
export const POST: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing member id');

  const form = await request.formData();
  const file = form.get('photo');

  if (!(file instanceof File)) {
    return jsonError(400, 'Missing photo file');
  }
  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError(400, 'Photo must be JPEG, PNG, or WebP');
  }
  if (file.size > MAX_BYTES) {
    return jsonError(400, 'Photo must be under 8MB');
  }

  const { supabase } = auth;

  const { data: submission, error: fetchError } = await supabase
    .from('member_submissions')
    .select('name')
    .eq('id', id)
    .maybeSingle();

  if (fetchError || !submission) {
    return jsonError(404, 'Member submission not found');
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const slug = slugify(submission.name || 'member');
  const path = `${Date.now()}-${slug}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('member-photos')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error('[photo] upload failed:', uploadError);
    return jsonError(500, 'Photo upload failed');
  }

  const { data: publicUrlData } = supabase.storage.from('member-photos').getPublicUrl(path);
  const photoUrl = publicUrlData.publicUrl;

  const { error: updateError } = await supabase
    .from('member_submissions')
    .update({ photo_url: photoUrl })
    .eq('id', id);

  if (updateError) {
    console.error('[photo] failed to save photo_url:', updateError);
    return jsonError(500, 'Photo uploaded but failed to save reference');
  }

  return jsonOk({ success: true, photo_url: photoUrl });
};
