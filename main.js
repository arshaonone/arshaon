'use strict';
/* ================================================================
   ARSHAON v4 — JavaScript
   No cursor effects. Clean app-grade interactions.
   ================================================================ */

/* ── 1. AMBIENT ORB CANVAS ── */
(function initOrbs() {
  const canvas = document.getElementById('orb-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, id;

  const ORBS = [
    { x: 0.15, y: 0.25, r: 340, h: 48,  s: 0.12, l: 0.22, a: 0.055 },
    { x: 0.80, y: 0.60, r: 280, h: 200, s: 0.08, l: 0.20, a: 0.04  },
    { x: 0.50, y: 0.90, r: 220, h: 35,  s: 0.10, l: 0.18, a: 0.03  },
  ];

  let t = 0;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    ORBS[0].cx = W * ORBS[0].x; ORBS[0].cy = H * ORBS[0].y;
    ORBS[1].cx = W * ORBS[1].x; ORBS[1].cy = H * ORBS[1].y;
    ORBS[2].cx = W * ORBS[2].x; ORBS[2].cy = H * ORBS[2].y;
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;

    ORBS.forEach((o, i) => {
      const ox = o.cx + Math.sin(t + i * 1.2) * 40;
      const oy = o.cy + Math.cos(t + i * 0.8) * 30;
      const grd = ctx.createRadialGradient(ox, oy, 0, ox, oy, o.r);
      grd.addColorStop(0, `hsla(${o.h},${o.s*100}%,${o.l*100}%,${o.a})`);
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(ox, oy, o.r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Subtle floating particles
    id = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(id);
    else draw();
  });
})();


/* ── 2. NAVBAR SCROLL STATE ── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  function onScroll() {
    nav.classList.toggle('stuck', window.scrollY > 60);
    const btn = document.getElementById('back-top');
    if (btn) btn.classList.toggle('show', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ── 3. MOBILE MENU ── */
(function initBurger() {
  const burger  = document.getElementById('nav-burger');
  const overlay = document.getElementById('mob-overlay');
  if (!burger || !overlay) return;

  const links = overlay.querySelectorAll('.mob-nl');

  burger.addEventListener('click', () => {
    const open = overlay.classList.toggle('open');
    document.body.style.overflow = open ? 'hidden' : '';
  });

  links.forEach(l => l.addEventListener('click', () => {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


/* ── 4. SCROLL REVEAL ── */
(function initReveal() {
  const items = document.querySelectorAll('.rv');
  if (!items.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // stagger siblings
      const parent = entry.target.parentElement;
      const siblings = parent ? Array.from(parent.querySelectorAll('.rv:not(.in)')) : [];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('in'), Math.max(0, idx) * 90);
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });

  items.forEach(el => io.observe(el));
})();


/* ── 5. NUMBER COUNTERS ── */
(function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1800;
      const start  = performance.now();

      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.5 });

  els.forEach(el => io.observe(el));
})();


/* ── 6. SKILL BARS ── */
(function initBars() {
  const fills = document.querySelectorAll('.sk-bar-fill[data-w]');
  if (!fills.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      setTimeout(() => { el.style.width = `${el.dataset.w}%`; }, 150);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(el => io.observe(el));
})();


/* ── 7. CIRCULAR SKILL RINGS ── */
(function initRings() {
  const rings = document.querySelectorAll('.br-ring');
  if (!rings.length) return;
  const CIRC = 213.6;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const pct = parseFloat(el.closest('.br-item').querySelector('.br-pct')?.textContent) || 80;
      const offset = CIRC - (pct / 100) * CIRC;
      setTimeout(() => { el.style.strokeDashoffset = offset; }, 200);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });

  rings.forEach(el => io.observe(el));
})();


/* ── 8. VENTURES CARD PROGRESS BARS ── */
(function initVentureProgress() {
  const bars = document.querySelectorAll('.vcc-progress');
  if (!bars.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const w   = el.style.width; // e.g. "78%"
      el.style.width = '0%';
      setTimeout(() => { el.style.width = w; }, 200);
      io.unobserve(el);
    });
  }, { threshold: 0.3 });

  bars.forEach(el => io.observe(el));
})();


/* ── 9. VENTURES HORIZONTAL DRAG SCROLL ── */
(function initDragScroll() {
  const el = document.getElementById('ventures-scroll');
  if (!el) return;

  let isDown = false, startX, scrollLeft;

  el.addEventListener('mousedown', e => {
    isDown = true;
    el.style.cursor = 'grabbing';
    startX     = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });
  window.addEventListener('mouseup', () => {
    isDown = false;
    el.style.cursor = 'grab';
  });
  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x    = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.4;
    el.scrollLeft = scrollLeft - walk;
  });
})();


/* ── 10. MAGNETIC BUTTONS ── */
(function initMagnetic() {
  const buttons = document.querySelectorAll('.mag-btn');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine) return;

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width  / 2);
      const dy = e.clientY - (r.top  + r.height / 2);
      btn.style.transform = `translate(${dx * 0.28}px, ${dy * 0.28}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s ease';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
})();


/* ── 11. SMOOTH ANCHOR SCROLL ── */
(function initScrollLinks() {
  const NAV_H = 68;
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── 12. CONTACT FORM ── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('cf-success');
  const submit  = document.getElementById('cf-submit');
  if (!form) return;

  function shake(el) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'shake 0.45s ease';
    setTimeout(() => { el.style.animation = ''; }, 450);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const name = form.querySelector('#cf-name');
    const mail = form.querySelector('#cf-email');
    const msg  = form.querySelector('#cf-msg');

    let ok = true;
    [name, mail, msg].forEach(f => {
      if (!f) return;
      f.style.borderColor = '';
      if (!f.value.trim()) {
        f.style.borderColor = 'rgba(220, 70, 70, 0.5)';
        shake(f);
        ok = false;
      }
    });
    if (mail && mail.value && !mail.value.includes('@')) {
      mail.style.borderColor = 'rgba(220, 70, 70, 0.5)';
      shake(mail);
      ok = false;
    }
    if (!ok) return;

    const span = submit.querySelector('span');
    const orig = span?.textContent || 'Send';
    submit.disabled = true;
    if (span) span.textContent = 'Sending…';
    submit.style.opacity = '0.65';

    setTimeout(() => {
      submit.disabled = false;
      if (span) span.textContent = orig;
      submit.style.opacity = '';
      if (success) success.classList.add('show');
      form.reset();
      setTimeout(() => success?.classList.remove('show'), 6000);
    }, 1300);
  });
})();


/* ── 13. BACK TO TOP ── */
(function initBackTop() {
  document.getElementById('back-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ── 14. SUBTLE CARD HOVER GLOW ── */
(function initCardGlow() {
  const cards = document.querySelectorAll('.vc-card, .biodata-card, .why-card, .contact-form');
  const fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (!fine) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width)  * 100;
      const y = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
})();


/* ── 15. HERO TYPEWRITER for subtext ── */
(function initHeroLabel() {
  // The label already animates via CSS. Just add loaded class.
  document.body.classList.add('loaded');
})();


console.log('%c ARSHAON v4 — Serial Entrepreneur · Bangladesh', 'color:#D4AF37;font-family:monospace;font-size:11px;letter-spacing:0.1em;');
