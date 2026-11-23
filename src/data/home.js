// ============================================================
// Homepage content — edit here, not in index.astro.
//
// Sections that depend on content you don't have yet should stay
// empty; the page hides them until they're filled in.
// ============================================================

export const hero = {
  // Short line under the "Decode. Create. Inspire." lettering.
  sub: 'A student-led animation club and studio at KNUST, turning stories into motion.',

  // Demo reel for the "Watch demo reel" button.
  // Paste a YouTube link (https://youtu.be/... or https://www.youtube.com/watch?v=...)
  // or a path to a video file in /public (e.g. '/video/reel.mp4').
  // Leave empty until the reel exists — the button then shows a "coming soon" note.
  reelUrl: '',
};

// ── Trust bar + About zone (directly under the hero) ─────────
export const zone = {
  trust: {
    affiliation: { value: 'KNUST', label: 'Dept. of Communication Design' },
    founded: { value: '2025', label: 'Founded' },
    // The member count is read live from the database (published members only).
  },

  about: {
    label: 'About 24fps',
    title: 'A creative home for',
    titleAccent: 'storytellers.',
    body:
      "24fps is a student-led animation club and studio in KNUST's Department of Communication Design. " +
      'We give students hands-on experience in a production environment that mirrors the real industry: ' +
      'making original films together and building the skills to work in it.',
    cta: { label: 'Learn more', href: '/about' },
  },

  // The three pillars (same wording as the member ID-badge concept).
  pillars: [
    { key: 'decode',  title: 'Decode.',  text: 'We explore stories.' },
    { key: 'create',  title: 'Create.',  text: 'We craft with purpose.' },
    { key: 'inspire', title: 'Inspire.', text: 'We grow together.' },
  ],
};
