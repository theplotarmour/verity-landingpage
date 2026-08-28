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
    /* This branch returns out of the module, so everything the converge block
       would have set has to be set here too. Without it the layer the pieces
       are meant to become never appears at all: the section renders with an
       empty space where Verity should be. */
    var staticField = document.querySelector('[data-converge]');
    if (staticField) { staticField.classList.add('is-static'); }
    document.documentElement.classList.add('no-converge');
    document.documentElement.style.setProperty('--q', '1');
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

  /* ---- Fragmentation: the tools travel into the plate in the next section --
     The pieces scattered in "your systems are fragmented" fly down the page and
     land on the "Verity / the operational layer" plate that already exists in
     the following section. Both elements sit in the same document flow, so each
     chip's vector to the plate is constant and is measured once. */
  var field = document.querySelector('[data-converge]');
  var landing = document.querySelector('[data-converge-target]');

  if (field && landing) {
    var chips = [].slice.call(field.querySelectorAll('[data-frag]'));

    if (reduce) {
      field.classList.add('is-static');
      document.documentElement.classList.add('no-converge');
      document.documentElement.style.setProperty('--q', '1');
    } else {
      var docBox = function (el) {
        var r = el.getBoundingClientRect();
        return {
          cx: r.left + window.scrollX + r.width / 2,
          cy: r.top + window.scrollY + r.height / 2
        };
      };

      var span = 1;

      var measure = function () {
        chips.forEach(function (el) {
          el.style.setProperty('--dx', '0px');
          el.style.setProperty('--dy', '0px');
        });
        var target = docBox(landing);
        chips.forEach(function (el) {
          var c = docBox(el);
          el.style.setProperty('--dx', (target.cx - c.cx).toFixed(1) + 'px');
          el.style.setProperty('--dy', (target.cy - c.cy).toFixed(1) + 'px');
        });
        /* How far the pieces have to fall. The trip is given exactly this much
           scroll, so the page moves up by the same distance the pieces move
           down and they hold their place on screen instead of leaving by the
           top before they have arrived. */
        span = Math.max(240, Math.abs(target.cy - docBox(field).cy));
      };

      var qTick = false;
      var qPaint = function () {
        qTick = false;
        /* Progress is taken from where the plate actually is on screen, not
           from a scroll range. Tie it to scroll distance and the later beats
           land while the plate is still near the bottom edge, where nobody
           sees them. This way every phase happens at a known screen position:
           the collapse at roughly two thirds down, the expansion just above
           centre, the name at centre. */
        var r = landing.getBoundingClientRect();
        var vh = window.innerHeight;
        var centre = r.top + r.height / 2;
        /* The plate ends just above the middle of the screen; the trip starts
           one full fall earlier, which puts the scattered pieces at that same
           spot when it begins. Everything then happens around the centre of
           the viewport rather than at its edges. */
        var to = vh * 0.40;
        var from = to + span;
        var q = (from - centre) / span;
        q = q < 0 ? 0 : q > 1 ? 1 : q;
        /* Smoothstep. Linear progress starts and stops abruptly, which reads as
           the pieces being dragged; eased, they gather speed and settle. */
        q = q * q * (3 - 2 * q);
        document.documentElement.style.setProperty('--q', q.toFixed(4));
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
      /* Late webfont swaps move both elements; re-measure once they settle. */
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(function () { measure(); qPaint(); });
      }
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
