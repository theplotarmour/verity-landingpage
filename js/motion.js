/* Scroll reveal + hero scrub. One direction, nothing under 400ms. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Split [data-words] headings into per-word spans for staggered reveal. */
  document.querySelectorAll('[data-words]').forEach(function (el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (child) {
        if (child.nodeType === 3) {
          var frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(function (tok) {
            if (!tok) return;
            if (/^\s+$/.test(tok)) { frag.appendChild(document.createTextNode(tok)); return; }
            var s = document.createElement('span');
            s.className = 'reveal-word';
            s.textContent = tok;
            frag.appendChild(s);
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === 1) { walk(child); }
      });
    };
    walk(el);
    el.querySelectorAll('.reveal-word').forEach(function (w, i) {
      w.style.transitionDelay = (i * 65) + 'ms';
    });
  });

  if (reduce) {
    document.querySelectorAll('[data-reveal],[data-words]').forEach(function (el) { el.classList.add('is-in'); });
    return;
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });

  document.querySelectorAll('[data-reveal],[data-words]').forEach(function (el) { io.observe(el); });

  /* Hero scrub: hero copy recedes, workspace scales up. Scroll-driven, one direction. */
  var scrub = document.querySelector('[data-scrub]');
  if (scrub) {
    var raf = null;
    var onScroll = function () {
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = null;
        var r = scrub.getBoundingClientRect();
        var span = scrub.offsetHeight - window.innerHeight;
        var p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        scrub.style.setProperty('--p', p.toFixed(4));
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
  }
})();
