// src/pages/api/admin/blog/index.ts
// GET  /api/admin/blog        → list all posts (any status), for the admin table
// POST /api/admin/blog        → create a new post
//
// Both require a valid admin_session cookie. Create is allowed for
// both 'admin' and 'editor' roles per product decision.

import type { APIRoute } from 'astro';
import { requireRole, jsonError, jsonOk } from '../../../../lib/admin-auth';
import { slugify, estimateReadMinutes, sanitizeContentHtml } from '../../../../lib/blog-utils';

export const prerender = false;

export const GET: APIRoute = async ({ cookies, locals, url }) => {
  const auth = await requireRole({ cookies, locals });
  if (!auth.ok) return jsonError(auth.status, auth.error);

  const statusFilter = url.searchParams.get('status'); // 'draft' | 'published' | null (all)

  let query = auth.supabase
    .from('blog_posts')
    .select('id, slug, title, excerpt, cover_image_url, category, tags, status, featured, author_name, published_at, created_at, updated_at')
    .order('updated_at', { ascending: false });

  if (statusFilter && ['draft', 'published'].includes(statusFilter)) {
    query = query.eq('status', statusFilter);
  }

  const { data, error } = await query;

  if (error) {
    return jsonError(500, `Failed to load posts: ${error.message}`);
  }

  return jsonOk({ posts: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const auth = await requireRole({ cookies, locals }, ['admin', 'editor']);
  if (!auth.ok) return jsonError(auth.status, auth.error);

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

  // ── Validation ──
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

  const slug = slugify(slugInput && slugInput.trim() ? slugInput : title);
  if (!slug) {
    return jsonError(400, 'Could not generate a valid slug from the title — please set one manually');
  }

  // Slug must be unique
  const { data: existing } = await auth.supabase
    .from('blog_posts')
    .select('id')
    .eq('slug', slug)
    .maybeSingle();

  if (existing) {
    return jsonError(409, `A post with the slug "${slug}" already exists. Please choose a different title or slug.`);
  }

  const finalStatus = status === 'published' ? 'published' : 'draft';
  const cleanHtml = sanitizeContentHtml(content_html);

  const { data, error } = await auth.supabase
    .from('blog_posts')
    .insert({
      slug,
      title: title.trim(),
      excerpt: typeof excerpt === 'string' ? excerpt.trim() || null : null,
      content_html: cleanHtml,
      cover_image_url: typeof cover_image_url === 'string' ? cover_image_url.trim() || null : null,
      category: typeof category === 'string' && category.trim() ? category.trim() : 'general',
      tags: Array.isArray(tags) ? tags.filter((t) => typeof t === 'string' && t.trim()) : [],
      status: finalStatus,
      featured: featured === true,
      read_minutes: Number.isFinite(read_minutes) ? read_minutes : estimateReadMinutes(cleanHtml),
      author_id: auth.admin.id,
      author_name: auth.admin.username,
      published_at: finalStatus === 'published' ? new Date().toISOString() : null,
    })
    .select('id, slug')
    .single();

  if (error) {
    return jsonError(500, `Failed to create post: ${error.message}`);
  }

  return jsonOk({ success: true, id: data.id, slug: data.slug }, 201);
};
