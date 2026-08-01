// src/lib/blog-utils.ts
// Shared helpers for blog post creation/editing. Used by both the
// admin API routes and (slug generation only) client-side in the
// editor for the live slug preview.

/**
 * Turns "Behind the Frames: Our First Student Short Film" into
 * "behind-the-frames-our-first-student-short-film".
 */
export function slugify(input: string): string {
  return (input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

/**
 * Strips HTML tags and estimates reading time at ~200 words/min,
 * minimum 1 minute. Used as a fallback when the editor doesn't
 * manually set read_minutes.
 */
export function estimateReadMinutes(html: string): number {
  const text = (html || '').replace(/<[^>]*>/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/**
 * Very small allow-list HTML sanitizer for Tiptap output.
 *
 * Tiptap's own output is already well-formed (it's generated from a
 * structured document, not pasted raw HTML), so this is a defense-in-depth
 * pass — it strips anything that could smuggle in a script/event handler
 * if the request body were ever crafted by hand rather than sent by the
 * editor (e.g. someone hitting the API directly with a curl request).
 *
 * This is NOT a full sanitizer library. It intentionally only removes the
 * dangerous bits (script/style/iframe/object/embed tags, on* attributes,
 * javascript: URLs) rather than trying to validate a full allow-list of
 * every tag/attribute, since Tiptap's vocabulary is already constrained.
 */
export function sanitizeContentHtml(html: string): string {
  let out = html || '';

  // Strip dangerous elements entirely (including their content)
  out = out.replace(/<(script|style|iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '');
  out = out.replace(/<(script|style|iframe|object|embed)[^>]*\/?>/gi, '');

  // Strip on* event handler attributes (onclick=, onerror=, etc.)
  out = out.replace(/\son\w+\s*=\s*(".*?"|'.*?'|[^\s>]+)/gi, '');

  // Strip javascript: and data:text/html URLs in href/src
  out = out.replace(/(href|src)\s*=\s*(["'])\s*(javascript:|data:text\/html)[^"']*\2/gi, '$1="#"');

  return out.trim();
}

export const BLOG_CATEGORIES = [
  { value: 'animation', label: 'Animation' },
  { value: '3d', label: '3D' },
  { value: 'illustration', label: 'Illustration' },
  { value: 'vfx', label: 'VFX' },
  { value: 'studio', label: 'Studio' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'events', label: 'Events' },
  { value: 'motion', label: 'Motion' },
  { value: 'tech', label: 'Tech' },
  { value: 'community', label: 'Community' },
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number]['value'];
