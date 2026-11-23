// Helpers for showing members on the homepage.
//
// The `members` table is filled by a public form, so names and roles arrive in all
// sorts of shapes (ALL CAPS, three given names, a list of roles, a stray "#"). These
// helpers turn rows into tidy display values and pick who to show.

export interface PublicMember {
  slug: string;
  name: string;
  role: string | null;
  category: string;
  photo_url: string | null;
}

export interface HomePerson {
  slug: string;
  name: string;
  role: string;
  photo: string | null;
  initials: string;
  tone: 'yellow' | 'teal' | 'pink' | 'purple';
}

const norm = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const isShouting = (s: string) => s.length > 3 && s === s.toUpperCase() && /[A-Z]/.test(s);
const titleCase = (s: string) => s.toLowerCase().replace(/(^|[\s\-'/])([a-z])/g, (_, a, b) => a + b.toUpperCase());

/** One entry per person. Rows must be oldest-first so a re-submission replaces the old one. */
export function dedupeMembers(rows: PublicMember[]): PublicMember[] {
  const seen = new Map<string, PublicMember>();
  for (const m of rows) if (m.name?.trim()) seen.set(norm(m.name), m);
  return [...seen.values()];
}

/** "Eugene Ampadu Antwi" -> "Eugene Antwi"; ALL CAPS names get normal capitals. */
export function displayName(full: string): string {
  const clean = full.trim().replace(/\s+/g, ' ');
  const parts = (isShouting(clean) ? titleCase(clean) : clean).split(' ');
  return parts.length <= 2 ? parts.join(' ') : `${parts[0]} ${parts[parts.length - 1]}`;
}

/** First role only, tidy capitals, never longer than ~26 characters. */
export function displayRole(role: string | null): string {
  if (!role) return '';
  let r = role.replace(/^[#\s]+/, '').split(/[,&;]| and /i)[0].trim().replace(/\s+/g, ' ');
  if (isShouting(r)) r = titleCase(r);
  r = r.replace(/\b(\d)d\b/gi, '$1D');
  r = r.charAt(0).toUpperCase() + r.slice(1);
  return r.length > 26 ? r.slice(0, 25).trimEnd() + '…' : r;
}

function initialsOf(name: string): string {
  return name.split(/\s+/).filter(Boolean).map((w) => w[0]?.toUpperCase()).slice(0, 2).join('');
}

// Fisher-Yates shuffle: a fresh random order on every call
function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const TONES: HomePerson['tone'][] = ['yellow', 'teal', 'pink', 'purple', 'yellow'];

/** A random selection of members who have a photo. Different on every page load, so
 *  every visitor (and every refresh) sees a different set. */
export function pickForHome(all: PublicMember[], count = 5): HomePerson[] {
  const withPhoto = dedupeMembers(all).filter((m) => m.photo_url);
  return shuffle(withPhoto)
    .slice(0, count)
    .map((m, i) => {
      const name = displayName(m.name);
      return {
        slug: m.slug,
        name,
        role: displayRole(m.role),
        photo: m.photo_url,
        initials: initialsOf(name),
        tone: TONES[i % TONES.length],
      };
    });
}
