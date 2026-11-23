// Depth-of-field scrolling.
//
// Anything marked data-dof behaves like a subject under a camera lens:
//  - far from the centre of the screen it is slightly oversized, faded and out of focus
//  - as you scroll toward it, it shrinks to its real size, sharpens and fades in
//  - as you scroll past it, it softens, grows and fades out again
//
// It is driven by the scroll position (not triggered once), so it works in both
// directions and scrolling back reverses it exactly.

const els = Array.from(document.querySelectorAll<HTMLElement>('[data-dof]'));
const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (els.length > 0 && !calm) {
  const DEAD_ZONE = 0.42;  // most of the screen is fully in focus; only the edges soften
  const small = () => window.innerWidth <= 960;
  const maxScale = () => (small() ? 0.03 : 0.06);   // barely bigger when out of focus (no extra space)
  const maxBlur = () => (small() ? 6 : 12);

  const smooth = (t: number) => t * t * (3 - 2 * t);
  const scales = new WeakMap<HTMLElement, number>();
  let queued = false;

  const update = () => {
    queued = false;
    const vh = window.innerHeight;
    const blurPx = maxBlur();
    const MAX_SCALE = maxScale();

    for (const el of els) {
      const r = el.getBoundingClientRect();
      const s0 = scales.get(el) ?? 1;
      const height = r.height / s0;                       // layout height without our own scale
      const centre = r.top + r.height / 2;                // scaling keeps the centre where it is

      // 0 = element centred on screen, 1 = element just outside the screen edge
      const d = Math.abs(centre - vh / 2) / (vh / 2 + height / 2);
      const e = smooth(Math.min(1, Math.max(0, (d - DEAD_ZONE) / (1 - DEAD_ZONE))));

      const scale = 1 + MAX_SCALE * e;
      scales.set(el, scale);

      el.style.scale = e > 0 ? String(scale) : '';
      el.style.opacity = e > 0 ? String(Math.max(0, 1 - Math.pow(e, 1.35))) : '';
      el.style.filter = e > 0.004 ? `blur(${(blurPx * e).toFixed(2)}px)` : '';
      el.style.pointerEvents = e > 0.85 ? 'none' : '';
      el.style.willChange = e > 0 && e < 1 ? 'filter, opacity, scale' : '';
    }
  };

  const queue = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(update);
    }
  };

  window.addEventListener('scroll', queue, { passive: true });
  window.addEventListener('resize', queue);
  window.addEventListener('load', queue);
  window.addEventListener('pageshow', queue);
  update();
}
