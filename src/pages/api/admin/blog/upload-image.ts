// src/pages/api/admin/blog/upload-image.ts
// POST /api/admin/blog/upload-image
// multipart/form-data with a single "file" field.
//
// Used for both the post's cover image and images dropped inline
// into the Tiptap editor body. Unlike the member-photo upload (which
// posts straight from the browser to Storage using the anon key,
// since that's a public unauthenticated form), this route requires
// an admin_session cookie and uploads server-side with the
// service-role key — only logged-in admins/editors can write to
// the blog-images bucket.

import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../lib/admin-auth';

export const prerender = false;

const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return jsonError(400, 'Expected multipart/form-data');
  }

  const file = form.get('file');
  if (!(file instanceof File)) {
    return jsonError(400, 'No file provided (expected "file" field)');
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return jsonError(400, `Unsupported file type "${file.type}". Use JPEG, PNG, WebP, or GIF.`);
  }

  if (file.size > MAX_BYTES) {
    return jsonError(400, `File too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Max is 8MB.`);
  }

  const ext = file.type === 'image/jpeg' ? 'jpg'
    : file.type === 'image/png' ? 'png'
    : file.type === 'image/webp' ? 'webp'
    : 'gif';

  const safeStem = file.name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';

  const path = `${Date.now()}-${safeStem}.${ext}`;

  const { error: uploadError } = await auth.supabase.storage
    .from('blog-images')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return jsonError(500, `Upload failed: ${uploadError.message}`);
  }

  const { data: publicUrlData } = auth.supabase.storage.from('blog-images').getPublicUrl(path);

  return jsonOk({ success: true, url: publicUrlData.publicUrl, path });
};
