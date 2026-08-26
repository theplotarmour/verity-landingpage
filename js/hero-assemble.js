/* =============================================================================
   Piece E — scatter-to-assemble hero, no animation library.
   Lenis provides inertial scroll; the assembly is driven by a scroll-progress
   value applied to each shard's transform on rAF. Degrades to the assembled
   screen under reduced motion or if scripting fails.
   ========================================================================== */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var scrub  = document.querySelector('.hero-scrub');
  var scaler = document.querySelector('.vd-scaler');
  if (!scrub || !scaler) return;

  var frameEl = scaler.querySelector('.vd-frame');
  var shards  = Array.prototype.slice.call(document.querySelectorAll('[data-shard]'));

  /* ---- fit the fixed canvas into whatever viewport we have ---- */
  function fit() {
    var w = window.innerWidth, h = window.innerHeight;
    var pad = w < 720 ? 24 : 64;
    var cw = scaler.offsetWidth || 1160, ch = scaler.offsetHeight || 860;
    var s = Math.min((w - pad) / cw, (h - pad - 88) / ch);
    scaler.style.setProperty('--vd-scale', Math.max(0.3, Math.min(1, s)).toFixed(4));
  }
  fit();

  if (reduce) {
    /* copy stays, screen sits assembled beneath it */
    scrub.style.setProperty('--p', 0);
    document.documentElement.classList.add('vd-static');
    window.addEventListener('resize', fit);
    return;
  }

  /* ---- Lenis: inertial scroll ---- */
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.1,
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true,
      touchMultiplier: 1.6
    });
    document.documentElement.classList.add('has-lenis');

    var raf = function (time) { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
    lenis.on('scroll', apply);

    /* In-page anchors keep working under smooth scroll. */
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      a.addEventListener('click', function (e) {
        var t = document.querySelector(id);
        if (!t) return;
        e.preventDefault();
        lenis.scrollTo(t, { offset: -80 });
      });
    });
  }

  /* ---- deterministic scatter, measured from each shard's resting place ---- */
  function rand(i, salt) {
    var x = Math.sin((i + 1) * 12.9898 + salt * 78.233) * 43758.5453;
    return x - Math.floor(x);
  }

  var placed = [];

  function measure() {
    /* clear any transform so we read true resting geometry */
    shards.forEach(function (el) { el.style.transform = ''; el.style.opacity = ''; el.style.filter = ''; });
    frameEl.style.transform = '';

    var frame = scaler.getBoundingClientRect();
    var vs = parseFloat(getComputedStyle(scaler).getPropertyValue('--vd-scale')) || 1;
    var cx = frame.width / 2, cy = frame.height / 2;
    var vw = window.innerWidth, vh = window.innerHeight;

    /* Big structural pieces land first, detail last, so the screen builds in a
       readable order instead of snapping together on one frame. */
    var weight = { 'vd-side': 0, 'vd-top': 0.06, 'vd-title': 0.12 };

    placed = shards.map(function (el, i) {
      var r = el.getBoundingClientRect();
      var sx = (r.left - frame.left) + r.width / 2 - cx;
      var sy = (r.top - frame.top) + r.height / 2 - cy;
      var len = Math.max(1, Math.hypot(sx, sy));
      var spread = 0.9 + rand(i, 1) * 0.5;

      var p = {
        el: el,
        x: (sx / len) * (140 + rand(i, 2) * 220) * spread + (rand(i, 5) - 0.5) * 150,
        y: (sy / len) * (90 + rand(i, 3) * 150) * spread + (rand(i, 6) - 0.5) * 120,
        rot: (rand(i, 4) - 0.5) * 26,
        scale: 0.62 + rand(i, 7) * 0.22
      };

      /* Keep every shard on screen at rest: a piece that starts outside the
         viewport reads as missing rather than as scattered. */
      var cxv = r.left + r.width / 2, cyv = r.top + r.height / 2;
      var halfW = r.width * 0.42, halfH = r.height * 0.42;
      var tx = cxv + p.x * vs, ty = cyv + p.y * vs;
      p.x += (Math.min(vw - halfW - 16, Math.max(halfW + 16, tx)) - tx) / vs;
      p.y += (Math.min(vh - halfH - 16, Math.max(halfH + 84, ty)) - ty) / vs;

      var key = Object.keys(weight).filter(function (k) { return el.classList.contains(k); })[0];
      p.at  = key !== undefined ? weight[key] : 0.16 + rand(i, 8) * 0.42;
      p.len = 0.42;
      return p;
    });
  }

  /* ---- progress + paint ---- */
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  var pending = false;

  function paint() {
    pending = false;
    var r = scrub.getBoundingClientRect();
    var span = scrub.offsetHeight - window.innerHeight;
    var p = span > 0 ? clamp01(-r.top / span) : 0;

    scrub.style.setProperty('--p', p.toFixed(4));

    for (var i = 0; i < placed.length; i++) {
      var s = placed[i];
      var t = ease(clamp01((p - s.at) / s.len));
      var inv = 1 - t;
      s.el.style.transform =
        'translate3d(' + (s.x * inv).toFixed(2) + 'px,' + (s.y * inv).toFixed(2) + 'px,0)' +
        ' rotate(' + (s.rot * inv).toFixed(2) + 'deg)' +
        ' scale(' + (s.scale + (1 - s.scale) * t).toFixed(4) + ')';
      s.el.style.opacity = (0.42 + 0.58 * t).toFixed(3);
      s.el.style.filter  = t > 0.995 ? 'none' : 'blur(' + (5 * inv).toFixed(2) + 'px)';
    }

    /* the whole screen also travels: the camera pushing in */
    var camera = 0.82 + 0.18 * ease(p);
    frameEl.style.transform = 'scale(' + camera.toFixed(4) + ')';
    /* the frame's own ground, hairline and shadow resolve last */
    frameEl.style.setProperty('--vd-chrome', clamp01((p - 0.62) / 0.3).toFixed(3));
  }

  function apply() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(paint);
  }

  measure();
  apply();

  window.addEventListener('scroll', apply, { passive: true });

  var rt = null;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      fit();
      measure();
      apply();
    }, 200);
  });

  window.addEventListener('load', function () { fit(); measure(); apply(); });
})();
