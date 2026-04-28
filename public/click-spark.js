// ===================================================
// 24fps — Magic Sparkle Click Effect
// Uses the EXACT SVG path from the provided star_spark.svg,
// scaled to the desired size. No redrawn geometry — the
// actual path data is replayed on canvas.
// ===================================================

class ClickSpark {

  constructor(options = {}) {
    this.config = {
      starCount: options.starCount || 9,
      minSize:   options.minSize   || 4,
      maxSize:   options.maxSize   || 13,
      minRadius: options.minRadius || 20,
      maxRadius: options.maxRadius || 55,
      duration:  options.duration  || 800,
      excludeSelectors: options.excludeSelectors || [],
    };

    this.canvas = null;
    this.ctx    = null;
    this.sparks = [];
    this.rafId  = null;
    this._init();
  }

  _init() {
    this._createCanvas();
    this._bindEvents();
    this._loop();
  }

  _createCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'spark-canvas';
    Object.assign(this.canvas.style, {
      position:      'fixed',
      top:           '0',
      left:          '0',
      width:         '100vw',
      height:        '100vh',
      pointerEvents: 'none',
      zIndex:        '99999',
    });
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this._resize();
  }

  _resize() {
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width  = window.innerWidth  * dpr;
    this.canvas.height = window.innerHeight * dpr;
    this.canvas.style.width  = window.innerWidth  + 'px';
    this.canvas.style.height = window.innerHeight + 'px';
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  _bindEvents() {
    document.addEventListener('click', e => this._onClick(e));
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => this._resize(), 100);
    });
  }

  _onClick(e) {
    for (const sel of this.config.excludeSelectors) {
      if (e.target.closest(sel)) return;
    }
    const now = performance.now();
    for (let i = 0; i < this.config.starCount; i++) {
      this.sparks.push({
        x:         e.clientX,
        y:         e.clientY,
        angle:     Math.random() * Math.PI * 2,
        radius:    this._rand(this.config.minRadius, this.config.maxRadius),
        size:      this._rand(this.config.minSize, this.config.maxSize),
        tilt:      (Math.random() - 0.5) * 0.5,
        startTime: now + Math.random() * 80,
      });
    }
  }

  _loop() {
    const draw = (ts) => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.sparks = this.sparks.filter(s => {
        const elapsed = ts - s.startTime;
        if (elapsed < 0) return true;
        if (elapsed >= this.config.duration) return false;

        const p       = elapsed / this.config.duration;
        const eased   = 1 - Math.pow(1 - p, 3);
        const dist    = eased * s.radius;
        const cx      = s.x + dist * Math.cos(s.angle);
        const cy      = s.y + dist * Math.sin(s.angle);
        const sizeMod = p < 0.3 ? p / 0.3 : 1 - ((p - 0.3) / 0.7);
        const size    = s.size * sizeMod;
        const opacity = p < 0.6 ? 1 : 1 - ((p - 0.6) / 0.4);
        const rot     = p * Math.PI * 0.5 + s.tilt;

        this._drawSparkle(cx, cy, size, rot, opacity);
        return true;
      });

      this.rafId = requestAnimationFrame(draw);
    };
    this.rafId = requestAnimationFrame(draw);
  }

  // ── DRAW ───────────────────────────────────────────
  // Renders the SVG sparkle at position (cx,cy), scaled to `r`,
  // rotated, and faded. The SVG viewBox is "0 0 1.9 2.45" and
  // the sparkle centre sits at approximately (0.95, 1.225).
  // We translate so the centre is at origin, then scale uniformly.

  _drawSparkle(cx, cy, r, rotation, opacity) {
    if (r < 0.5) return;
    const ctx = this.ctx;

    // SVG viewBox: 0 0 1.9 2.45  — centre at (0.95, 1.225)
    // We want the sparkle to fit within radius r, so scale = r / half-height
    const svgW = 1.9;
    const svgH = 2.45;
    const scale = (r * 2) / Math.max(svgW, svgH);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotation);
    ctx.scale(scale, scale);
    // Shift so SVG centre (0.95, 1.225) is at canvas origin
    ctx.translate(-svgW / 2, -svgH / 2);

    ctx.globalAlpha  = opacity;
    ctx.strokeStyle  = '#E8386D';
    ctx.fillStyle    = '#E8386D';
    ctx.lineWidth    = 0.04 / scale; // stays visually consistent across sizes
    ctx.lineCap      = 'round';
    ctx.lineJoin     = 'round';

    // ── PATH 1: the wispy detail lines (first <path> in SVG) ──
    // This is the pencil-sketch texture around the sparkle center.
    ctx.beginPath();
    this._path1(ctx);
    ctx.fill();

    // ── PATH 2: the main sparkle shape (second <path> in SVG) ──
    // This is the actual 4-point star with concave arms.
    ctx.beginPath();
    this._path2(ctx);
    ctx.fill();

    ctx.restore();
  }

  // Path 1 — wispy sketch lines (verbatim from SVG, relative commands expanded)
  _path1(ctx) {
    ctx.moveTo(0.9, 0.71);
    ctx.bezierCurveTo(0.89,0.74, 0.88,0.77, 0.87,0.80);
    ctx.lineTo(0.87,0.81);
    ctx.bezierCurveTo(0.86,0.90, 0.86,1.08, 0.89,1.35);
    ctx.bezierCurveTo(0.91,1.60, 0.92,1.72, 0.91,1.71);
    ctx.bezierCurveTo(0.91,1.71, 0.90,1.67, 0.88,1.61);
    ctx.bezierCurveTo(0.87,1.55, 0.85,1.50, 0.85,1.46);
    ctx.bezierCurveTo(0.82,1.27, 0.80,1.11, 0.79,0.97);
    ctx.bezierCurveTo(0.78,0.99, 0.77,1.01, 0.76,1.02);
    ctx.bezierCurveTo(0.76,1.10, 0.77,1.20, 0.78,1.30);
    ctx.bezierCurveTo(0.80,1.49, 0.81,1.62, 0.82,1.71);
    ctx.bezierCurveTo(0.83,1.73, 0.84,1.74, 0.84,1.76);
    ctx.bezierCurveTo(0.83,1.68, 0.82,1.57, 0.81,1.43);
    ctx.bezierCurveTo(0.79,1.26, 0.78,1.15, 0.78,1.11);
    ctx.lineTo(0.77,1.03);
    ctx.lineTo(0.78,1.10);
    ctx.bezierCurveTo(0.79,1.20, 0.81,1.30, 0.82,1.41);
    ctx.bezierCurveTo(0.84,1.51, 0.85,1.59, 0.87,1.66);
    ctx.bezierCurveTo(0.89,1.72, 0.90,1.75, 0.91,1.75);
    ctx.bezierCurveTo(0.93,1.74, 0.92,1.59, 0.89,1.30);
    ctx.bezierCurveTo(0.87,1.05, 0.86,0.90, 0.87,0.85);
    ctx.lineTo(0.87,0.84);
    ctx.bezierCurveTo(0.87,0.84, 0.88,0.90, 0.88,1.04);
    ctx.bezierCurveTo(0.89,1.30, 0.92,1.49, 0.95,1.62);
    ctx.bezierCurveTo(0.97,1.67, 0.98,1.70, 0.99,1.70);
    ctx.lineTo(1.00,1.68);
    ctx.bezierCurveTo(1.00,1.66, 1.00,1.62, 0.99,1.55);
    ctx.bezierCurveTo(0.98,1.46, 0.97,1.36, 0.96,1.26);
    ctx.bezierCurveTo(0.96,1.23, 0.95,1.20, 0.95,1.16);
    ctx.bezierCurveTo(0.95,1.12, 0.94,1.07, 0.94,1.03);
    ctx.bezierCurveTo(0.94,0.99, 0.93,0.94, 0.93,0.90);
    ctx.bezierCurveTo(0.93,0.86, 0.93,0.84, 0.93,0.81);
    ctx.bezierCurveTo(0.92,0.79, 0.92,0.78, 0.91,0.76);
    ctx.bezierCurveTo(0.91,0.79, 0.91,0.84, 0.91,0.89);
    ctx.bezierCurveTo(0.92,1.06, 0.92,1.19, 0.94,1.29);
    ctx.bezierCurveTo(0.95,1.35, 0.95,1.40, 0.96,1.46);
    ctx.bezierCurveTo(0.97,1.52, 0.97,1.56, 0.97,1.60);
    ctx.bezierCurveTo(0.97,1.63, 0.97,1.65, 0.97,1.66);
    ctx.bezierCurveTo(0.97,1.66, 0.96,1.63, 0.94,1.56);
    ctx.bezierCurveTo(0.93,1.49, 0.91,1.43, 0.91,1.38);
    ctx.bezierCurveTo(0.89,1.22, 0.88,1.04, 0.88,0.86);
    ctx.bezierCurveTo(0.88,0.79, 0.88,0.74, 0.87,0.73);
    ctx.closePath();

    // sub-paths (the smaller wispy marks)
    ctx.moveTo(0.71,1.09);
    ctx.lineTo(0.70,1.11);
    ctx.lineTo(0.70,1.17);
    ctx.bezierCurveTo(0.70,1.31, 0.71,1.43, 0.71,1.54);
    ctx.bezierCurveTo(0.72,1.55, 0.72,1.56, 0.73,1.56);
    ctx.lineTo(0.73,1.50);
    ctx.lineTo(0.72,1.38);
    ctx.lineTo(0.74,1.52);
    ctx.lineTo(0.75,1.59);
    ctx.bezierCurveTo(0.76,1.60, 0.77,1.61, 0.77,1.63);
    ctx.bezierCurveTo(0.74,1.47, 0.72,1.34, 0.71,1.22);
    ctx.bezierCurveTo(0.70,1.16, 0.70,1.11, 0.70,1.08);
    ctx.closePath();

    ctx.moveTo(0.61,1.20);
    ctx.bezierCurveTo(0.60,1.21, 0.59,1.22, 0.58,1.23);
    ctx.bezierCurveTo(0.58,1.29, 0.59,1.35, 0.60,1.40);
    ctx.lineTo(0.61,1.45);
    ctx.bezierCurveTo(0.62,1.46, 0.64,1.47, 0.65,1.49);
    ctx.bezierCurveTo(0.63,1.37, 0.61,1.27, 0.61,1.21);
    ctx.closePath();

    ctx.moveTo(0.53,1.27);
    ctx.bezierCurveTo(0.52,1.27, 0.52,1.28, 0.51,1.28);
    ctx.lineTo(0.52,1.39);
    ctx.bezierCurveTo(0.53,1.39, 0.53,1.40, 0.54,1.40);
    ctx.lineTo(0.54,1.40);
    ctx.lineTo(0.52,1.27);
    ctx.closePath();

    ctx.moveTo(0.51,1.28);
    ctx.bezierCurveTo(0.50,1.28, 0.50,1.29, 0.49,1.29);
    ctx.lineTo(0.49,1.29);
    ctx.bezierCurveTo(0.49,1.31, 0.49,1.33, 0.49,1.36);
    ctx.bezierCurveTo(0.50,1.36, 0.50,1.37, 0.51,1.37);
    ctx.lineTo(0.51,1.28);
    ctx.closePath();

    ctx.moveTo(0.44,1.32);
    ctx.lineTo(0.43,1.33);
    ctx.lineTo(0.43,1.33);
    ctx.lineTo(0.45,1.34);
    ctx.lineTo(0.45,1.32);
    ctx.closePath();

    ctx.moveTo(0.90,1.92);
    ctx.lineTo(0.90,1.94);
    ctx.bezierCurveTo(0.90,1.93, 0.91,1.92, 0.91,1.91);
    ctx.lineTo(0.89,1.93);
    ctx.closePath();

    ctx.moveTo(1.15,1.51);
    ctx.bezierCurveTo(1.15,1.50, 1.16,1.50, 1.17,1.49);
    ctx.lineTo(1.16,1.48);
    ctx.bezierCurveTo(1.13,1.35, 1.10,1.20, 1.09,1.04);
    ctx.bezierCurveTo(1.08,1.02, 1.07,1.01, 1.05,0.99);
    ctx.bezierCurveTo(1.05,1.06, 1.06,1.12, 1.06,1.17);
    ctx.bezierCurveTo(1.07,1.25, 1.07,1.34, 1.08,1.41);
    ctx.lineTo(1.08,1.53);
    ctx.lineTo(1.06,1.42);
    ctx.bezierCurveTo(1.04,1.30, 1.02,1.16, 1.00,0.98);
    ctx.bezierCurveTo(1.00,0.94, 0.99,0.91, 0.99,0.88);
    ctx.bezierCurveTo(0.98,0.87, 0.98,0.85, 0.97,0.84);
    ctx.bezierCurveTo(0.97,0.87, 0.98,0.91, 0.98,0.97);
    ctx.bezierCurveTo(0.99,1.15, 1.01,1.30, 1.04,1.42);
    ctx.bezierCurveTo(1.05,1.50, 1.06,1.55, 1.06,1.56);
    ctx.bezierCurveTo(1.06,1.57, 1.06,1.58, 1.07,1.58);
    ctx.bezierCurveTo(1.08,1.59, 1.08,1.58, 1.09,1.56);
    ctx.bezierCurveTo(1.10,1.52, 1.10,1.39, 1.08,1.16);
    ctx.lineTo(1.10,1.26);
    ctx.bezierCurveTo(1.12,1.35, 1.13,1.43, 1.14,1.47);
    ctx.lineTo(1.15,1.50);
    ctx.closePath();

    ctx.moveTo(1.18,1.48);
    ctx.bezierCurveTo(1.18,1.48, 1.19,1.47, 1.20,1.47);
    ctx.bezierCurveTo(1.20,1.43, 1.19,1.39, 1.19,1.34);
    ctx.bezierCurveTo(1.18,1.26, 1.18,1.19, 1.18,1.14);
    ctx.bezierCurveTo(1.17,1.13, 1.17,1.13, 1.16,1.12);
    ctx.bezierCurveTo(1.16,1.19, 1.17,1.26, 1.18,1.33);
    ctx.bezierCurveTo(1.19,1.40, 1.19,1.45, 1.19,1.49);
    ctx.closePath();

    ctx.moveTo(1.23,1.44);
    ctx.lineTo(1.24,1.43);
    ctx.bezierCurveTo(1.23,1.38, 1.22,1.32, 1.22,1.24);
    ctx.lineTo(1.22,1.18);
    ctx.bezierCurveTo(1.21,1.17, 1.21,1.17, 1.20,1.16);
    ctx.lineTo(1.21,1.23);
    ctx.bezierCurveTo(1.22,1.32, 1.23,1.39, 1.24,1.44);
    ctx.closePath();

    ctx.moveTo(1.30,1.39);
    ctx.lineTo(1.32,1.38);
    ctx.bezierCurveTo(1.32,1.36, 1.31,1.33, 1.31,1.30);
    ctx.lineTo(1.31,1.24);
    ctx.bezierCurveTo(1.30,1.23, 1.30,1.23, 1.29,1.22);
    ctx.bezierCurveTo(1.29,1.25, 1.30,1.27, 1.30,1.29);
    ctx.bezierCurveTo(1.30,1.32, 1.31,1.35, 1.31,1.38);
    ctx.closePath();

    ctx.moveTo(1.34,1.37);
    ctx.lineTo(1.36,1.36);
    ctx.lineTo(1.34,1.28);
    ctx.lineTo(1.34,1.27);
    ctx.bezierCurveTo(1.33,1.26, 1.32,1.26, 1.32,1.25);
    ctx.lineTo(1.34,1.32);
    ctx.lineTo(1.35,1.37);
    ctx.closePath();

    ctx.moveTo(1.41,1.34);
    ctx.bezierCurveTo(1.42,1.34, 1.42,1.33, 1.43,1.33);
    ctx.bezierCurveTo(1.43,1.33, 1.43,1.32, 1.43,1.32);
    ctx.bezierCurveTo(1.42,1.32, 1.41,1.31, 1.41,1.31);
    ctx.lineTo(1.41,1.34);
    ctx.closePath();

    ctx.moveTo(1.44,1.33);
    ctx.lineTo(1.45,1.33);
    ctx.lineTo(1.44,1.33);
    ctx.lineTo(1.44,1.33);
    ctx.lineTo(1.44,1.33);
    ctx.closePath();
  }

  // Path 2 — main 4-point sparkle shape (verbatim from SVG)
  _path2(ctx) {
    ctx.moveTo(1.01, 0.07);
    ctx.bezierCurveTo(1.01,0.07, 1.01,0.12, 1.00,0.20);
    ctx.bezierCurveTo(0.98,1.07, 1.50,1.24, 1.72,1.28);
    ctx.bezierCurveTo(1.76,1.28, 1.79,1.28, 1.83,1.29);
    ctx.bezierCurveTo(1.87,1.30, 1.89,1.33, 1.89,1.37);
    ctx.bezierCurveTo(1.89,1.41, 1.85,1.43, 1.82,1.43);
    ctx.bezierCurveTo(1.81,1.43, 1.77,1.43, 1.72,1.42);
    ctx.bezierCurveTo(1.01,1.41, 0.94,2.40, 0.94,2.40);
    ctx.bezierCurveTo(0.94,2.44, 0.91,2.46, 0.87,2.46);
    ctx.bezierCurveTo(0.83,2.46, 0.80,2.43, 0.80,2.39);
    ctx.lineTo(0.80,2.39);
    ctx.bezierCurveTo(0.82,1.47, 0.24,1.42, 0.10,1.42);
    ctx.bezierCurveTo(0.09,1.42, 0.08,1.42, 0.06,1.42);
    ctx.bezierCurveTo(0.02,1.42, -0.01,1.39, -0.01,1.35);
    ctx.bezierCurveTo(-0.01,1.31, 0.02,1.28, 0.05,1.28);
    ctx.bezierCurveTo(0.05,1.28, 0.07,1.28, 0.09,1.28);
    ctx.bezierCurveTo(0.71,1.24, 0.83,0.50, 0.85,0.20);
    ctx.bezierCurveTo(0.85,0.16, 0.85,0.12, 0.86,0.08);
    ctx.lineTo(0.86,0.07);
    ctx.bezierCurveTo(0.86,0.03, 0.90,0.00, 0.93,0.01);
    ctx.bezierCurveTo(0.97,0.01, 0.99,0.04, 0.99,0.08);
    ctx.closePath();

    // inner filled diamond cutout (the concave centre detail)
    ctx.moveTo(0.92, 0.67);
    ctx.bezierCurveTo(0.84,0.93, 0.69,1.20, 0.42,1.33);
    ctx.bezierCurveTo(0.61,1.41, 0.82,1.57, 0.90,1.94);
    ctx.bezierCurveTo(0.98,1.70, 1.14,1.43, 1.42,1.32);
    ctx.bezierCurveTo(1.22,1.23, 1.01,1.04, 0.91,0.67);
    ctx.closePath();
  }

  _rand(min, max) { return min + Math.random() * (max - min); }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.canvas?.parentNode) this.canvas.parentNode.removeChild(this.canvas);
    document.removeEventListener('click', this._onClick);
  }
}

// ── AUTO-INIT ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    window.clickSpark = new ClickSpark();
  }, 300);
});