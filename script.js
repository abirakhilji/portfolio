/* ============================================================
   Abira Khilji — Portfolio scripts
   1. Mobile navigation
   2. Scroll-spy (highlights the current section in the nav)
   3. Scroll reveal for section headings and panels
   4. Typed terminal output in the About section
   5. Footer year
   ============================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Mobile navigation ---------- */

  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      toggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      });
    });
  }

  /* ---------- 2. Scroll-spy ---------- */

  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.main-nav a');

  if (sections.length && navLinks.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var id = entry.target.getAttribute('id');
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------- 3. Scroll reveal ---------- */

  var revealTargets = document.querySelectorAll(
    '.section-head, .panel, .timeline li, .hero-stat'
  );

  revealTargets.forEach(function (el) {
    if (!el.classList.contains('section-head')) el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in-view');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- 4. Typed terminal ---------- */

  var out = document.getElementById('terminalOutput');

  var lines = [
    { text: '$ whoami', cls: 't-prompt' },
    { text: 'abira khilji — bca student, jodhpur', cls: 't-val' },
    { text: '' },
    { text: '$ cat focus.json', cls: 't-prompt' },
    { text: '{' },
    { text: '  "core":     ["c", "c++", "java", "dsa"]', cls: 't-key' },
    { text: '  "systems":  ["dbms", "networks", "system design"]', cls: 't-key' },
    { text: '  "applied":  ["python", "prompt engineering"]', cls: 't-key' },
    { text: '  "built":    ["c interpreter", "chatbot"]', cls: 't-key' },
    { text: '}' },
    { text: '' },
    { text: '$ status --current', cls: 't-prompt' },
    { text: '# building core CS foundations + applied AI', cls: 't-comment' }
  ];

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderAll() {
    out.innerHTML = lines.map(function (l) {
      return l.cls
        ? '<span class="' + l.cls + '">' + escapeHtml(l.text) + '</span>'
        : escapeHtml(l.text);
    }).join('\n');
  }

  function typeLines() {
    var lineIndex = 0;
    var charIndex = 0;
    var html = '';

    function step() {
      if (lineIndex >= lines.length) return;

      var line = lines[lineIndex];

      if (charIndex === 0 && line.cls) html += '<span class="' + line.cls + '">';

      if (charIndex < line.text.length) {
        html += escapeHtml(line.text.charAt(charIndex));
        charIndex++;
        out.innerHTML = html + (line.cls ? '</span>' : '');
        setTimeout(step, line.cls === 't-prompt' ? 34 : 14);
      } else {
        if (line.cls) html += '</span>';
        html += '\n';
        out.innerHTML = html;
        lineIndex++;
        charIndex = 0;
        setTimeout(step, 190);
      }
    }

    step();
  }

  if (out) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      renderAll();
    } else {
      var started = false;
      var termObserver = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || started) return;
          started = true;
          typeLines();
          obs.disconnect();
        });
      }, { threshold: 0.35 });

      termObserver.observe(out.closest('.terminal') || out);
    }
  }

  /* ---------- 5. Footer year ---------- */

  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

})();
