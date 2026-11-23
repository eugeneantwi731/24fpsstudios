/*!
 * hero-lightning.js — animated outline sweep for an existing hero illustration.
 * Drop-in, no dependencies, no markup changes.
 *
 *   <script src="hero-lightning.js"></script>
 *   <script>heroLightning('#hero img');</script>
 *
 * It wraps your <img> in a positioned span and adds two canvases around it.
 * The image must be same-origin (the script reads its pixels).
 *
 * Options (all optional):
 *   heroLightning('#hero img', {
 *     cycle: 9,        // seconds for one full loop through the figures
 *     speed: 1,        // playback rate
 *     glow: 1,         // brightness
 *     color: '#8fe9ff',
 *     hot: '#ffffff',
 *     zones: [...],    // see DEFAULT_ZONES — boxes are fractions of the image
 *     exclude: [...]   // regions never lit, same format
 *   });
 */
(function (root) {
  // x0, y0, x1, y1 as fractions of the image. Tuned for the 24fps crew artwork.
  var DEFAULT_ZONES = [
    { id: 'artist', color: '#7ff0e2', hot: '#f0fffc', start: 0.35, dur: 0.95, weight: 0.9, box: [0.005, 0.360, 0.420, 0.930], exit: [0.170, 0.655] },
    { id: 'pen',    color: '#c3aeff', hot: '#f6f2ff', start: 0.62, dur: 0.85, weight: 0.9, box: [0.270, 0.370, 0.630, 0.790], exit: [0.330, 0.398] },
    { id: 'right',  color: '#ffd964', hot: '#fffbe8', start: 0.74, dur: 0.90, weight: 0.9, box: [0.720, 0.080, 0.995, 0.640], exit: [0.800, 0.510] },
    { id: 'mid',    color: '#ff6fa6', hot: '#ffffff', start: 0.36, dur: 1.45, weight: 1.6, box: [0.440, 0.000, 0.735, 0.470], exit: [0.700, 0.230] }
  ];
  // the 24fps lockup — everything converges into it at the end of the loop
  var LOGO = { box: [0.500, 0.440, 0.960, 0.930], center: [0.735, 0.665], color: '#ff2d7e', hot: '#ffffff' };
  var CYCLE_T = 7.6, CONVERGE = 1.30, STRIKE = 2.25, SETTLE = 3.70;   // charge up (0.35-1.8s), then discharge into the logo

  var DEFAULT_EXCLUDE = [
    [0.280, 0.200, 0.430, 0.330],   // graffiti mark
    [0.860, 0.060, 1.000, 0.280]    // loose marks
  ];

  function heroLightning(target, opts) {
    opts = opts || {};
    var img = typeof target === 'string' ? document.querySelector(target) : target;
    if (!img || img.tagName !== 'IMG') { console.warn('[heroLightning] need an <img>'); return; }

    var ZONES   = opts.zones   || DEFAULT_ZONES;
    var EXCLUDE = opts.exclude || DEFAULT_EXCLUDE;
    var CYCLE   = opts.cycle   || CYCLE_T;
    var SPEED   = opts.speed   || 1;
    var GLOW    = opts.glow    == null ? 1 : opts.glow;
    var COLOR   = opts.color   || '#8fe9ff';   // fallback when a zone has no colour
    var HOT     = opts.hot     || '#ffffff';

    // wrap the image without disturbing your layout
    var wrap = document.createElement('span');
    wrap.style.cssText = 'position:relative;display:block;line-height:0';
    img.parentNode.insertBefore(wrap, img);
    var bloom = document.createElement('canvas'), rim = document.createElement('canvas');
    var lay = 'position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:screen;pointer-events:none;';
    bloom.style.cssText = lay + 'filter:blur(7px)';
    rim.style.cssText = lay;
    wrap.appendChild(bloom);
    wrap.appendChild(img);
    wrap.appendChild(rim);

    var A = bloom.getContext('2d'), R = rim.getContext('2d');
    var W = 0, H = 0, pts = null, logo = null, t = 0, last = performance.now(), raf, boltCycle = -1, seeds = [];

    function resize() {
      var r = img.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
      W = r.width; H = r.height;
      [[bloom, A], [rim, R]].forEach(function (p) {
        p[0].width = Math.max(1, Math.round(W * dpr));
        p[0].height = Math.max(1, Math.round(H * dpr));
        p[1].setTransform(dpr, 0, 0, dpr, 0, 0);
      });
    }
    if (root.ResizeObserver) new ResizeObserver(resize).observe(img);
    else addEventListener('resize', resize);
    resize();

    // trace the inked contours of the artwork, once
    function trace(src) {
      var MW = 420, MH = Math.round(MW * src.naturalHeight / src.naturalWidth);
      var off = document.createElement('canvas');
      off.width = MW; off.height = MH;
      var c = off.getContext('2d', { willReadFrequently: true });
      c.drawImage(src, 0, 0, MW, MH);
      var d;
      try { d = c.getImageData(0, 0, MW, MH).data; }
      catch (e) { console.warn('[heroLightning] image must be same-origin'); return; }

      var n = MW * MH, solid = new Uint8Array(n), lum = new Float32Array(n), i;
      for (i = 0; i < n; i++) {
        if (d[i * 4 + 3] > 80) solid[i] = 1;
        lum[i] = 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2];
      }
      var buckets = ZONES.map(function () { return []; }), logoPts = [];
      for (var y = 1; y < MH - 1; y++) for (var x = 1; x < MW - 1; x++) {
        i = y * MW + x;
        if (!solid[i]) continue;
        var L = lum[i], nbr = Math.max(lum[i + 1], lum[i - 1], lum[i + MW], lum[i - MW]);
        if (!(L < 118 && nbr - L > 48)) continue;      // dark stroke beside a lighter pixel
        var nx = x / MW, ny = y / MH, skip = false, b, k;
        var lb = LOGO.box;
        if (nx >= lb[0] && nx <= lb[2] && ny >= lb[1] && ny <= lb[3]) { logoPts.push(nx, ny); continue; }
        for (k = 0; k < EXCLUDE.length; k++) {
          b = EXCLUDE[k];
          if (nx >= b[0] && nx <= b[2] && ny >= b[1] && ny <= b[3]) { skip = true; break; }
        }
        if (skip) continue;
        for (k = 0; k < ZONES.length; k++) {
          b = ZONES[k].box;
          if (nx >= b[0] && nx <= b[2] && ny >= b[1] && ny <= b[3]) { buckets[k].push(nx, ny); break; }
        }
      }
      pts = buckets.map(function (b) { return new Float32Array(b); });
      logo = new Float32Array(logoPts);
    }
    if (img.complete && img.naturalWidth) trace(img);
    else img.addEventListener('load', function () { trace(img); });

    function jagged(from, to, spread, seed) {
      var p = [from, to], disp = Math.hypot(to.x - from.x, to.y - from.y) * spread, r = seed;
      function rnd(){ r = (r * 9301 + 49297) % 233280; return r / 233280; }
      for (var k = 0; k < 5; k++) {
        var next = [p[0]];
        for (var j = 1; j < p.length; j++) {
          var a = p[j-1], b = p[j], mx = (a.x+b.x)/2, my = (a.y+b.y)/2;
          var nx = -(b.y-a.y), ny = b.x-a.x, L = Math.hypot(nx, ny) || 1, o = (rnd()-0.5) * disp;
          next.push({ x: mx + nx/L*o, y: my + ny/L*o }, b);
        }
        p = next; disp *= 0.55;
      }
      return p;
    }

    function finale(beat, scale) {
      if (beat < CONVERGE || beat > SETTLE) return;
      var cx = LOGO.center[0] * W, cy = LOGO.center[1] * H;
      var id = Math.floor(t / CYCLE);
      if (boltCycle !== id) { boltCycle = id; seeds = ZONES.map(function(){ return (Math.random()*200000)|0; }); }
      var run = (beat - CONVERGE) / (STRIKE - CONVERGE);
      ZONES.forEach(function (z, zi) {
        if (!z.exit) return;
        var bs = CONVERGE + zi * 0.17, bd = 0.46, k = (beat - bs) / bd;
        if (k < 0 || k > 1) return;
        var seg = jagged({ x: z.exit[0]*W, y: z.exit[1]*H }, { x: cx, y: cy }, 0.16, seeds[zi] + 1);
        var lead = Math.min(1, k / 0.45), out = k < 0.45 ? 1 : 1 - (k - 0.45) / 0.55;
        seg = seg.slice(0, Math.max(2, Math.floor(seg.length * lead)));
        var flick = (0.7 + Math.random() * 0.3) * out;
        [[6.5, z.color, 0.14, 16], [2.6, z.color, 0.5, 0], [1.1, z.hot, 0.9, 0]].forEach(function (p) {
          R.beginPath(); R.moveTo(seg[0].x, seg[0].y);
          for (var i = 1; i < seg.length; i++) R.lineTo(seg[i].x, seg[i].y);
          R.lineWidth = p[0] * scale; R.strokeStyle = p[1];
          R.globalAlpha = p[2] * flick * GLOW;
          R.lineCap = 'round'; R.lineJoin = 'round';
          R.shadowBlur = p[3]; R.shadowColor = z.color;
          R.stroke(); R.shadowBlur = 0;
        });
      });
      var fl = beat < STRIKE ? Math.max(0, run) * Math.max(0, run) * 0.45
                             : Math.pow(Math.max(0, 1 - (beat - STRIKE) / (SETTLE - STRIKE)), 1.6);
      if (fl > 0.02 && logo) {
        var dot = 2.3 * scale, flick = 0.8 + Math.random() * 0.2;
        for (var i = 0; i < logo.length; i += 2) {
          R.globalAlpha = Math.min(1, fl * flick * 0.95 * GLOW);
          R.fillStyle = fl > 0.6 ? LOGO.hot : LOGO.color;
          R.fillRect(logo[i]*W - dot/2, logo[i+1]*H - dot/2, dot, dot);
        }
        var rad = W * (0.10 + fl * 0.12);
        var g = A.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, LOGO.hot); g.addColorStop(0.35, LOGO.color); g.addColorStop(1, 'rgba(0,0,0,0)');
        A.globalAlpha = Math.min(1, fl * 0.5 * GLOW); A.fillStyle = g;
        A.beginPath(); A.arc(cx, cy, rad, 0, Math.PI * 2); A.fill();
      }
    }

    function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000); last = now; t += dt;
      A.clearRect(0, 0, W, H); R.clearRect(0, 0, W, H);
      if (pts) {
        A.globalCompositeOperation = 'lighter';
        R.globalCompositeOperation = 'lighter';
        var scale = Math.max(0.5, W / 620), beat = (t * SPEED) % CYCLE;
        ZONES.forEach(function (z, zi) {
          var p = pts[zi]; if (!p || !p.length) return;
          var local = (beat - z.start) / z.dur;
          if (local < 0 || local > 1) return;
          var span = z.box[3] - z.box[1];
          var head = z.box[1] - 0.12 * span + local * span * 1.24;
          var band = span * 0.24, dot = 2.5 * scale;
          for (var i = 0; i < p.length; i += 2) {
            var dist = Math.abs(p[i + 1] - head);
            var s = dist < band ? (1 - dist / band) : 0;
            var a = s * s * 2.0 * (z.weight || 1) * GLOW;
            if (a < 0.035) continue;
            var X = p[i] * W, Y = p[i + 1] * H;
            R.globalAlpha = Math.min(1, a);
            R.fillStyle = s > 0.93 ? (z.hot || HOT) : (z.color || COLOR);
            R.fillRect(X - dot / 2, Y - dot / 2, dot, dot);
            if (a > 0.25) {
              A.globalAlpha = Math.min(1, a * 0.75);
              A.fillStyle = z.color || COLOR;
              A.fillRect(X - dot * 1.3, Y - dot * 1.3, dot * 2.6, dot * 2.6);
            }
          }
        });
        finale(beat, scale);
        A.globalAlpha = R.globalAlpha = 1;
        A.globalCompositeOperation = R.globalCompositeOperation = 'source-over';
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return { stop: function () { cancelAnimationFrame(raf); bloom.remove(); rim.remove(); } };
  }

  root.heroLightning = heroLightning;
})(window);
