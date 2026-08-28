/* Scroll reveal + hero scrub.
   One entrance motion for the whole page: a short rise on first view.
   500ms, 10px, cubic-bezier(.22,.61,.36,1), fires once, 80px before entry.
   Stagger is 60ms per index, capped at 8, so a long list still finishes fast. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var STAGGER = 60;
  var STAGGER_CAP = 8;

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
      w.style.transitionDelay = (Math.min(i, STAGGER_CAP) * STAGGER) + 'ms';
    });
  });

  /* A [data-stagger] container hands each of its children an index delay, so a
     list of rows arrives in sequence instead of as one block. The container
     itself does not animate; only its rows do. */
  document.querySelectorAll('[data-stagger]').forEach(function (list) {
    var sel = list.getAttribute('data-stagger');
    var items = sel ? list.querySelectorAll(sel.indexOf('>') === 0 ? ':scope ' + sel : sel) : list.children;
    Array.prototype.forEach.call(items, function (item, i) {
      item.style.setProperty('--d', (Math.min(i, STAGGER_CAP) * STAGGER) + 'ms');
      if (!item.hasAttribute('data-reveal')) item.setAttribute('data-reveal', '');
    });
  });

  var targets = [].slice.call(document.querySelectorAll(
    '[data-reveal],[data-words],.hairline,.cn-chain-rail-line'
  ));

  if (reduce) {
    targets.forEach(function (el) { el.classList.add('is-in'); });
    var staticField = document.querySelector('[data-converge]');
    if (staticField) { staticField.classList.add('is-static'); }
    return;
  }

  /* A single rAF-throttled pass over the elements that have not landed yet.
     IntersectionObserver looks like the right tool here and is not: its
     callbacks coalesce, so a fast scroll (or Lenis jumping the page) skips
     entries entirely and those elements stay at opacity 0 forever. Testing a
     shrinking list of rects has no such hole, and the list empties as the
     reader goes down the page. */
  var pending = targets;
  var ticking = false;

  var land = function () {
    ticking = false;
    var vh = window.innerHeight;
    var still = [];
    for (var k = 0; k < pending.length; k++) {
      var el = pending[k];
      /* -80px: the entrance starts just before the element is really on
         screen, so it is already moving when the reader arrives. Anything
         above the fold counts as landed, which is what rescues a fast scroll. */
      if (el.getBoundingClientRect().top < vh - 80) {
        el.classList.add('is-in');
      } else {
        still.push(el);
      }
    }
    pending = still;
    if (!pending.length) {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    }
  };

  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(land);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  land();

  /* ---- Fragmentation: scattered tools travel to the centre --------------
     Each chip is measured once against the field's centre, then driven by a
     single scroll progress. Reduced motion gets the static arrangement: the
     fragments and the layer shown together, nothing travelling. */
  var field = document.querySelector('[data-converge]');
  if (field) {
    var chips = [].slice.call(field.querySelectorAll('[data-frag]'));

    if (reduce) {
      field.classList.add('is-static');
    } else {
      var vectors = [];

      var measure = function () {
        var core = field.querySelector('.frag-core');
        var f = field.getBoundingClientRect();
        var cx = f.width / 2;
        var cy = f.height / 2;
        vectors = chips.map(function (el) {
          /* Neutralise any transform already applied so the rest position is
             measured, not the current animated one. */
          el.style.setProperty('--dx', '0px');
          el.style.setProperty('--dy', '0px');
          var r = el.getBoundingClientRect();
          return {
            el: el,
            dx: cx - ((r.left - f.left) + r.width / 2),
            dy: cy - ((r.top - f.top) + r.height / 2)
          };
        });
        vectors.forEach(function (v) {
          v.el.style.setProperty('--dx', v.dx.toFixed(1) + 'px');
          v.el.style.setProperty('--dy', v.dy.toFixed(1) + 'px');
        });
        if (core) { core.style.opacity = ''; }
      };

      var qTick = false;
      var qPaint = function () {
        qTick = false;
        var r = field.getBoundingClientRect();
        var vh = window.innerHeight;
        /* Measured on the field's own centre, not its top, so the travel does
           not depend on how tall the field happens to be. The scattered state
           is held until the field is properly on screen, then the pieces
           converge over the next half viewport of scrolling. */
        var centre = r.top + r.height / 2;
        var from = vh * 0.78;
        var to = vh * 0.30;
        var q = (from - centre) / (from - to);
        q = q < 0 ? 0 : q > 1 ? 1 : q;
        field.style.setProperty('--q', q.toFixed(4));
      };

      var onQ = function () {
        if (qTick) return;
        qTick = true;
        requestAnimationFrame(qPaint);
      };

      measure();
      qPaint();
      window.addEventListener('scroll', onQ, { passive: true });
      window.addEventListener('resize', function () { measure(); qPaint(); });
    }
  }

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
