// src/pages/api/admin/blog/[id].ts
// GET    /api/admin/blog/:id  → fetch one post (for the edit screen)
// PUT    /api/admin/blog/:id  → update a post
// DELETE /api/admin/blog/:id  → delete a post
//
// All require a valid admin_session cookie. Update/delete allowed
// for both 'admin' and 'editor' roles per product decision — if you
// later want editors restricted to their own posts, that check goes
// right after requireRole() below (compare auth.admin.id to the
// fetched post's author_id).

import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../lib/admin-auth';
import { slugify, estimateReadMinutes, sanitizeContentHtml } from '../../../../lib/blog-utils';

export const prerender = false;

export const GET: APIRoute = async ({ params, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals });
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing post id');

  const { data, error } = await auth.supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) return jsonError(500, `Failed to load post: ${error.message}`);
  if (!data) return jsonError(404, 'Post not found');

  return jsonOk({ post: data });
};

export const PUT: APIRoute = async ({ params, request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing post id');

  const { data: existingPost, error: fetchError } = await auth.supabase
    .from('blog_posts')
    .select('id, slug, status, published_at')
    .eq('id', id)
    .maybeSingle();

  if (fetchError) return jsonError(500, `Failed to load post: ${fetchError.message}`);
  if (!existingPost) return jsonError(404, 'Post not found');

  let body: Record<string, any>;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'Invalid JSON body');
  }

  const {
    title,
    slug: slugInput,
    excerpt,
    content_html,
    cover_image_url,
    category,
    tags,
    status,
    featured,
    read_minutes,
  } = body;

  if (typeof title !== 'string' || !title.trim()) {
    return jsonError(400, 'Title is required');
  }
  if (typeof content_html !== 'string' || !content_html.trim()) {
    return jsonError(400, 'Post content cannot be empty');
  }
  if (status && !['draft', 'published'].includes(status)) {
    return jsonError(400, 'Status must be draft or published');
  }
  if (tags !== undefined && !Array.isArray(tags)) {
    return jsonError(400, 'Tags must be an array of strings');
  }

  // Recompute slug only if the title or an explicit slug changed enough
  // to matter; otherwise keep the existing one so published URLs don't break.
  const desiredSlug = slugify(slugInput && slugInput.trim() ? slugInput : title);
  if (!desiredSlug) {
    return jsonError(400, 'Could not generate a valid slug — please set one manually');
  }

  if (desiredSlug !== existingPost.slug) {
    const { data: clash } = await auth.supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', desiredSlug)
      .neq('id', id)
      .maybeSingle();

    if (clash) {
      return jsonError(409, `A different post already uses the slug "${desiredSlug}".`);
    }
  }

  const finalStatus = status === 'published' ? 'published' : 'draft';
  const cleanHtml = sanitizeContentHtml(content_html);

  // Only stamp published_at the first time a post goes live — editing
  // an already-published post shouldn't bump it back to "just now".
  const wasPublished = existingPost.status === 'published';
  const nowPublishing = finalStatus === 'published';
  const published_at =
    nowPublishing && !wasPublished
      ? new Date().toISOString()
      : nowPublishing
      ? existingPost.published_at
      : null;

  const { error } = await auth.supabase
    .from('blog_posts')
    .update({
      slug: desiredSlug,
      title: title.trim(),
      excerpt: typeof excerpt === 'string' ? excerpt.trim() || null : null,
      content_html: cleanHtml,
      cover_image_url: typeof cover_image_url === 'string' ? cover_image_url.trim() || null : null,
      category: typeof category === 'string' && category.trim() ? category.trim() : 'general',
      tags: Array.isArray(tags) ? tags.filter((t) => typeof t === 'string' && t.trim()) : [],
      status: finalStatus,
      featured: featured === true,
      read_minutes: Number.isFinite(read_minutes) ? read_minutes : estimateReadMinutes(cleanHtml),
      published_at,
    })
    .eq('id', id);

  if (error) return jsonError(500, `Failed to update post: ${error.message}`);

  return jsonOk({ success: true, slug: desiredSlug });
};

export const DELETE: APIRoute = async ({ params, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const { id } = params;
  if (!id) return jsonError(400, 'Missing post id');

  const { error } = await auth.supabase.from('blog_posts').delete().eq('id', id);

  if (error) return jsonError(500, `Failed to delete post: ${error.message}`);

  return jsonOk({ success: true });
};
