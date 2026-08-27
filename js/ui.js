/* Nav glass on scroll, theme toggle, and the site-wide reveal. */
(function () {
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () { nav.classList.toggle('is-scrolled', window.scrollY > 24); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  var root = document.documentElement;
  var toggle = document.getElementById('theme-toggle');
  var syncLabel = function () {
    if (!toggle) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  };
  syncLabel();
  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('verity-theme', next); } catch (e) {}
      syncLabel();
    });
  }

  /* Close the mobile sheet after navigating. */
  var sheet = document.getElementById('mobile-nav');
  var check = document.getElementById('nav-toggle');
  if (sheet && check) {
    sheet.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') check.checked = false;
    });
  }

  /* ------------------------------------------------- Schedule timeline progress --- */
  var progress = document.getElementById('shd-progress');
  var timeline = document.getElementById('shd-list');
  var section = document.getElementById('schedule');
  if (progress && timeline && section) {
    /* Compute progress relative to the section being scrolled through, not the
       whole document. The fill covers the track from the top of the section
       to the bottom of the timeline; we use the timeline's own height so the
       fill matches the actual rail. */
    var rafPending = false;
    var updateProgress = function () {
      var rect = section.getBoundingClientRect();
      var viewH = window.innerHeight || document.documentElement.clientHeight;
      var trackH = timeline.offsetHeight;
      /* Distance scrolled past the section's top, in px of the track. */
      var scrolled = viewH * 0.5 - rect.top;     /* trigger when section mid hits viewport mid */
      var total = trackH + viewH * 0.5;          /* span over which progress reaches 100% */
      var pct = trackH > 0 ? (scrolled / total) * 100 : 0;
      if (pct < 0) pct = 0;
      if (pct > 100) pct = 100;
      progress.style.setProperty('--pct-n', (pct / 100).toFixed(4));
    };
    var onScroll = function () {
      if (rafPending) return;
      rafPending = true;
      window.requestAnimationFrame(function () {
        rafPending = false;
        updateProgress();
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    /* Set the initial fill to the live item (3rd of 5 = 50%) before any scroll,
       so the bar is always visible on page load. */
    progress.style.setProperty('--pct-n', '0.5');
    updateProgress();
  }

  /* ------------------------------------------------- Locations city toggle --- */
  var locItems = document.querySelectorAll('.loc-item');
  var locCard = document.getElementById('loc-card');
  var locCity = document.querySelector('.loc-card-city');

  var LOCATIONS = [
    { city: 'Delhi',     ops: 42, sla: '98.7%', exceptions: 3 },
    { city: 'Noida',     ops: 18, sla: '99.1%', exceptions: 0 },
    { city: 'Gurgaon',   ops: 24, sla: '98.2%', exceptions: 1 },
    { city: 'Mumbai',    ops: 36, sla: '97.9%', exceptions: 2 },
    { city: 'Hyderabad', ops: 21, sla: '98.8%', exceptions: 0 },
    { city: 'Bengaluru', ops: 29, sla: '99.0%', exceptions: 1 },
  ];

  function activateCity(index) {
    locItems.forEach(function (item, i) {
      var active = i === index;
      item.classList.toggle('is-active', active);
      var btn = item.querySelector('.loc-btn');
      if (btn) btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    if (locCard && locCity) {
      var loc = LOCATIONS[index];
      locCity.textContent = loc.city;
      var rows = locCard.querySelectorAll('.loc-card-row dd');
      rows[0].textContent = loc.ops;
      rows[1].textContent = loc.sla;
      rows[2].textContent = loc.exceptions;
      rows[2].style.color = loc.exceptions > 0 ? 'var(--accent-text)' : '';
    }
  }

  locItems.forEach(function (item) {
    var btn = item.querySelector('.loc-btn');
    if (!btn) return;
    var idx = parseInt(item.getAttribute('data-city'), 10);
    btn.addEventListener('click', function () { activateCity(idx); });
  });
})();
