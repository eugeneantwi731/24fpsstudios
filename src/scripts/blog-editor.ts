// src/scripts/blog-editor.ts
// Powers the Tiptap rich-text editor on /admin/blog/editor. Imported
// as a module <script> from editor.astro so npm packages (@tiptap/*)
// get bundled by Vite — this can't be a static /public/js/ file since
// those aren't processed for node_modules imports.

import { Editor } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';

interface EditState {
  isEdit: boolean;
  existingPost: any | null;
  postId: string | null;
}

const state: EditState = (window as any).__BLOG_EDIT__;

// ── SLUGIFY (mirrors src/lib/blog-utils.ts slugify — kept in sync
//    manually since this bundles separately from the API route) ──
function slugify(input: string): string {
  return (input || '')
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96);
}

// ── ELEMENTS ──
const titleInput = document.getElementById('title-input') as HTMLTextAreaElement;
const slugInput = document.getElementById('slug-input') as HTMLInputElement;
const excerptInput = document.getElementById('excerpt-input') as HTMLTextAreaElement;
const categorySelect = document.getElementById('category-select') as HTMLSelectElement;
const featuredCheckbox = document.getElementById('featured-checkbox') as HTMLInputElement;
const readMinutesInput = document.getElementById('read-minutes-input') as HTMLInputElement;
const statusToggle = document.getElementById('status-toggle') as HTMLElement;
const saveDraftBtn = document.getElementById('save-draft-btn') as HTMLButtonElement;
const publishBtn = document.getElementById('publish-btn') as HTMLButtonElement;
const previewBtn = document.getElementById('preview-btn') as HTMLButtonElement;
const saveDot = document.getElementById('save-dot') as HTMLElement;
const saveLabel = document.getElementById('save-label') as HTMLElement;
const formMsg = document.getElementById('form-msg') as HTMLElement;

let currentStatus: 'draft' | 'published' = state.existingPost?.status === 'published' ? 'published' : 'draft';
let slugManuallyEdited = !!state.existingPost; // don't auto-slug over an existing post's slug
let coverImageUrl: string | null = state.existingPost?.cover_image_url || null;
let tags: string[] = Array.isArray(state.existingPost?.tags) ? [...state.existingPost.tags] : [];

// ── AUTO-GROW TITLE TEXTAREA ──
function autoGrow(el: HTMLTextAreaElement) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}
titleInput.addEventListener('input', () => {
  autoGrow(titleInput);
  if (!slugManuallyEdited) {
    slugInput.value = slugify(titleInput.value);
  }
});
autoGrow(titleInput);

slugInput.addEventListener('input', () => {
  slugManuallyEdited = true;
  slugInput.value = slugify(slugInput.value);
});

// ── STATUS TOGGLE ──
function renderStatusToggle() {
  statusToggle.querySelectorAll('button').forEach((btn) => {
    const btnStatus = btn.getAttribute('data-status');
    btn.classList.toggle('is-active-draft', btnStatus === 'draft' && currentStatus === 'draft');
    btn.classList.toggle('is-active-published', btnStatus === 'published' && currentStatus === 'published');
  });
  publishBtn.textContent = currentStatus === 'published' ? 'Update' : 'Publish';
}
statusToggle.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('button');
  if (!btn) return;
  currentStatus = btn.getAttribute('data-status') as 'draft' | 'published';
  renderStatusToggle();
});
renderStatusToggle();

// ── TAGS ──
const tagsWrap = document.getElementById('tags-wrap') as HTMLElement;
const tagInput = document.getElementById('tag-input') as HTMLInputElement;

function renderTags() {
  tagsWrap.querySelectorAll('.tag-chip').forEach((el) => el.remove());
  tags.forEach((tag, i) => {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.innerHTML = `${escapeHtml(tag)}<button type="button" data-i="${i}" aria-label="Remove ${escapeHtml(tag)}"><svg viewBox="0 0 12 12" fill="none"><line x1="2" y1="2" x2="10" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><line x1="10" y1="2" x2="2" y2="10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;
    tagsWrap.insertBefore(chip, tagInput);
  });
}
function escapeHtml(s: string) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}
function addTag() {
  const val = tagInput.value.trim().replace(/,$/, '');
  if (val && !tags.includes(val)) { tags.push(val); renderTags(); }
  tagInput.value = '';
}
tagInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(); }
  if (e.key === 'Backspace' && !tagInput.value && tags.length) { tags.pop(); renderTags(); }
});
tagsWrap.addEventListener('click', (e) => {
  const btn = (e.target as HTMLElement).closest('button[data-i]') as HTMLElement;
  if (btn) { tags.splice(parseInt(btn.dataset.i || '0'), 1); renderTags(); }
});
renderTags();

// ── COVER IMAGE (upload or URL) ──
const coverZone = document.getElementById('cover-zone') as HTMLElement;
const coverFileInput = document.getElementById('cover-file-input') as HTMLInputElement;
const coverPlaceholder = document.getElementById('cover-placeholder') as HTMLElement;
const coverPreview = document.getElementById('cover-preview') as HTMLImageElement;
const coverRemoveBtn = document.getElementById('cover-remove-btn') as HTMLButtonElement;
const coverUrlInput = document.getElementById('cover-url-input') as HTMLInputElement;
const coverUrlApply = document.getElementById('cover-url-apply') as HTMLButtonElement;

function setCoverImage(url: string | null) {
  coverImageUrl = url;
  if (url) {
    coverPreview.src = url;
    coverPreview.style.display = 'block';
    coverPlaceholder.style.display = 'none';
    coverRemoveBtn.style.display = 'flex';
  } else {
    coverPreview.style.display = 'none';
    coverPlaceholder.style.display = 'block';
    coverRemoveBtn.style.display = 'none';
  }
}
if (coverImageUrl) setCoverImage(coverImageUrl);

async function uploadImageFile(file: File): Promise<string> {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch('/api/admin/blog/upload-image', { method: 'POST', body: fd });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || 'Image upload failed');
  return data.url as string;
}

coverFileInput.addEventListener('change', async () => {
  const file = coverFileInput.files?.[0];
  if (!file) return;
  coverPlaceholder.querySelector('p')!.textContent = 'Uploading…';
  try {
    const url = await uploadImageFile(file);
    setCoverImage(url);
  } catch (err: any) {
    showMsg(err?.message || 'Cover upload failed', 'error');
    coverPlaceholder.querySelector('p')!.textContent = 'Drag & drop or click to upload';
  }
});
coverZone.addEventListener('dragover', (e) => { e.preventDefault(); coverZone.classList.add('dragover'); });
coverZone.addEventListener('dragleave', () => coverZone.classList.remove('dragover'));
coverZone.addEventListener('drop', (e) => {
  e.preventDefault();
  coverZone.classList.remove('dragover');
  const file = e.dataTransfer?.files?.[0];
  if (file && file.type.startsWith('image/')) {
    coverFileInput.files = e.dataTransfer!.files;
    coverFileInput.dispatchEvent(new Event('change'));
  }
});
coverRemoveBtn.addEventListener('click', (e) => { e.stopPropagation(); setCoverImage(null); coverFileInput.value = ''; });
coverUrlApply.addEventListener('click', () => {
  const url = coverUrlInput.value.trim();
  if (url) { setCoverImage(url); coverUrlInput.value = ''; }
});

// ── TIPTAP EDITOR ──
const editorEl = document.getElementById('editor') as HTMLElement;
const toolbarEl = document.getElementById('toolbar') as HTMLElement;

const editor = new Editor({
  element: editorEl,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
    }),
    Link.configure({ openOnClick: false, autolink: true }),
    Image.configure({ inline: false, allowBase64: false }),
    Placeholder.configure({ placeholder: 'Start writing your story…' }),
  ],
  content: state.existingPost?.content_html || '',
  onTransaction: () => syncToolbarState(),
});

// ── TOOLBAR ──
type ToolbarBtn = { icon: string; title: string; isActive?: () => boolean; run: () => void };

const icons = {
  bold: `<svg viewBox="0 0 24 24" fill="none"><path d="M6 4h7a4 4 0 0 1 0 8H6zM6 12h8a4 4 0 0 1 0 8H6z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>`,
  italic: `<svg viewBox="0 0 24 24" fill="none"><path d="M10 4h6M6 20h6M14 4L8 20" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  strike: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16M8 6.5C8.5 5 10 4 12 4c2.5 0 4.5 1.3 4.5 3.2 0 1.4-1 2.3-2 2.8M8 17.3c.5 1.5 2 2.7 4 2.7 2.5 0 4.5-1.3 4.5-3.2 0-1.6-1.3-2.6-3-3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  h1: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 6v12M11 6v12M4 12h7M16 8l3-2v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  h2: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 6v12M11 6v12M4 12h7M15.5 9a2.5 2.5 0 1 1 4.3 1.8L15.5 16h5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  quote: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 7h4v4c0 3-2 5-4 5.5M14 7h4v4c0 3-2 5-4 5.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  ul: `<svg viewBox="0 0 24 24" fill="none"><circle cx="4.5" cy="6" r="1.3" fill="currentColor"/><circle cx="4.5" cy="12" r="1.3" fill="currentColor"/><circle cx="4.5" cy="18" r="1.3" fill="currentColor"/><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>`,
  ol: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><text x="1" y="8" font-size="6" fill="currentColor">1</text><text x="1" y="14" font-size="6" fill="currentColor">2</text><text x="1" y="20" font-size="6" fill="currentColor">3</text></svg>`,
  code: `<svg viewBox="0 0 24 24" fill="none"><path d="M8 9l-4 3 4 3M16 9l4 3-4 3M14 5l-4 14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  link: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 12a4 4 0 0 0 5.66 0l2.83-2.83a4 4 0 1 0-5.66-5.66l-1 1M15 12a4 4 0 0 0-5.66 0l-2.83 2.83a4 4 0 1 0 5.66 5.66l1-1" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" stroke-width="1.8"/><circle cx="8.5" cy="9.5" r="1.5" stroke="currentColor" stroke-width="1.6"/><path d="M21 15l-5-5-9 9" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>`,
  hr: `<svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  undo: `<svg viewBox="0 0 24 24" fill="none"><path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  redo: `<svg viewBox="0 0 24 24" fill="none"><path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

function buildToolbar() {
  const groups: ToolbarBtn[][] = [
    [
      { icon: icons.h1, title: 'Heading 1', isActive: () => editor.isActive('heading', { level: 1 }), run: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
      { icon: icons.h2, title: 'Heading 2', isActive: () => editor.isActive('heading', { level: 2 }), run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    ],
    [
      { icon: icons.bold, title: 'Bold', isActive: () => editor.isActive('bold'), run: () => editor.chain().focus().toggleBold().run() },
      { icon: icons.italic, title: 'Italic', isActive: () => editor.isActive('italic'), run: () => editor.chain().focus().toggleItalic().run() },
      { icon: icons.strike, title: 'Strikethrough', isActive: () => editor.isActive('strike'), run: () => editor.chain().focus().toggleStrike().run() },
    ],
    [
      { icon: icons.ul, title: 'Bullet list', isActive: () => editor.isActive('bulletList'), run: () => editor.chain().focus().toggleBulletList().run() },
      { icon: icons.ol, title: 'Numbered list', isActive: () => editor.isActive('orderedList'), run: () => editor.chain().focus().toggleOrderedList().run() },
      { icon: icons.quote, title: 'Quote', isActive: () => editor.isActive('blockquote'), run: () => editor.chain().focus().toggleBlockquote().run() },
      { icon: icons.code, title: 'Code block', isActive: () => editor.isActive('codeBlock'), run: () => editor.chain().focus().toggleCodeBlock().run() },
    ],
    [
      { icon: icons.link, title: 'Link', isActive: () => editor.isActive('link'), run: () => setLink() },
      { icon: icons.image, title: 'Insert image', run: () => insertImage() },
      { icon: icons.hr, title: 'Divider', run: () => editor.chain().focus().setHorizontalRule().run() },
    ],
    [
      { icon: icons.undo, title: 'Undo', run: () => editor.chain().focus().undo().run() },
      { icon: icons.redo, title: 'Redo', run: () => editor.chain().focus().redo().run() },
    ],
  ];

  toolbarEl.innerHTML = '';
  groups.forEach((group, gi) => {
    group.forEach((btn) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tb-btn';
      el.title = btn.title;
      el.innerHTML = btn.icon;
      el.dataset.title = btn.title;
      el.addEventListener('click', btn.run);
      toolbarEl.appendChild(el);
    });
    if (gi < groups.length - 1) {
      const sep = document.createElement('div');
      sep.className = 'tb-sep';
      toolbarEl.appendChild(sep);
    }
  });
}

function syncToolbarState() {
  toolbarEl.querySelectorAll('.tb-btn').forEach((btnEl) => {
    const title = (btnEl as HTMLElement).dataset.title;
    const map: Record<string, boolean> = {
      'Heading 1': editor.isActive('heading', { level: 1 }),
      'Heading 2': editor.isActive('heading', { level: 2 }),
      'Bold': editor.isActive('bold'),
      'Italic': editor.isActive('italic'),
      'Strikethrough': editor.isActive('strike'),
      'Bullet list': editor.isActive('bulletList'),
      'Numbered list': editor.isActive('orderedList'),
      'Quote': editor.isActive('blockquote'),
      'Code block': editor.isActive('codeBlock'),
      'Link': editor.isActive('link'),
    };
    if (title && title in map) {
      btnEl.classList.toggle('is-active', map[title]);
    }
  });
}

function setLink() {
  const previousUrl = editor.getAttributes('link').href;
  const url = window.prompt('Link URL', previousUrl || 'https://');
  if (url === null) return;
  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }
  editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
}

async function insertImage() {
  const inputEl = document.createElement('input');
  inputEl.type = 'file';
  inputEl.accept = 'image/*';
  inputEl.onchange = async () => {
    const file = inputEl.files?.[0];
    if (!file) return;
    try {
      showMsg('Uploading image…', 'success');
      const url = await uploadImageFile(file);
      editor.chain().focus().setImage({ src: url }).run();
      hideMsg();
    } catch (err: any) {
      showMsg(err?.message || 'Image upload failed', 'error');
    }
  };
  inputEl.click();
}

buildToolbar();

// ── SAVE ──
function showMsg(text: string, kind: 'error' | 'success') {
  formMsg.textContent = text;
  formMsg.className = `form-msg is-${kind}`;
}
function hideMsg() {
  formMsg.className = 'form-msg';
}
function setSaveIndicator(kind: 'saving' | 'saved' | 'error', label: string) {
  saveDot.className = `topbar__status-dot is-${kind}`;
  saveLabel.textContent = label;
}

function buildPayload(status: 'draft' | 'published') {
  const readMinutes = readMinutesInput.value ? parseInt(readMinutesInput.value, 10) : undefined;
  return {
    title: titleInput.value.trim(),
    slug: slugInput.value.trim(),
    excerpt: excerptInput.value.trim(),
    content_html: editor.getHTML(),
    cover_image_url: coverImageUrl,
    category: categorySelect.value,
    tags,
    status,
    featured: featuredCheckbox.checked,
    read_minutes: readMinutes,
  };
}

async function savePost(status: 'draft' | 'published') {
  hideMsg();

  if (!titleInput.value.trim()) {
    showMsg('Please add a title before saving.', 'error');
    titleInput.focus();
    return;
  }
  const plainText = editor.getText().trim();
  if (!plainText) {
    showMsg('Please write some content before saving.', 'error');
    return;
  }

  saveDraftBtn.disabled = true;
  publishBtn.disabled = true;
  setSaveIndicator('saving', 'Saving…');

  const payload = buildPayload(status);

  try {
    const url = state.isEdit ? `/api/admin/blog/${state.postId}` : '/api/admin/blog';
    const method = state.isEdit ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data?.error || 'Failed to save post');

    setSaveIndicator('saved', status === 'published' ? 'Published' : 'Draft saved');
    currentStatus = status;
    renderStatusToggle();

    if (!state.isEdit && data.id) {
      // Switch into edit mode in place so subsequent saves are PUTs,
      // not duplicate POSTs.
      state.isEdit = true;
      state.postId = data.id;
      const newUrl = `/admin/blog/editor?id=${data.id}`;
      window.history.replaceState({}, '', newUrl);
    }
    if (data.slug) slugInput.value = data.slug;
  } catch (err: any) {
    setSaveIndicator('error', 'Save failed');
    showMsg(err?.message || 'Something went wrong. Please try again.', 'error');
  } finally {
    saveDraftBtn.disabled = false;
    publishBtn.disabled = false;
  }
}

saveDraftBtn.addEventListener('click', () => savePost('draft'));
publishBtn.addEventListener('click', () => savePost('published'));

previewBtn.addEventListener('click', () => {
  const slug = slugInput.value.trim();
  if (!slug) {
    showMsg('Add a title or slug first so there is something to preview.', 'error');
    return;
  }
  if (currentStatus !== 'published') {
    showMsg('Publish the post first — preview links only work for live posts.', 'error');
    return;
  }
  window.open(`/feed/${slug}`, '_blank', 'noopener');
});

// ── WARN ON UNSAVED CLOSE ──
let dirty = false;
editor.on('update', () => { dirty = true; setSaveIndicator('saved', 'Unsaved changes'); });
[titleInput, slugInput, excerptInput].forEach((el) => el.addEventListener('input', () => { dirty = true; }));
window.addEventListener('beforeunload', (e) => {
  if (dirty) { e.preventDefault(); e.returnValue = ''; }
});
