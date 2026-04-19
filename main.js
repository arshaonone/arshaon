/* ================================================================
   ARSHAON.COM — Main JavaScript v3
   No custom cursor. Clean, performant, 4K-ready.
   ================================================================ */

'use strict';

/* ──────────────────────────────────────────────
   1. PARTICLE CANVAS (subtle, premium)
   ────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;
  const COUNT  = 55;
  const GOLD   = [201, 168, 76];
  const SILVER = [180, 190, 200];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function createParticle() {
    const isGold = Math.random() < 0.55;
    const col    = isGold ? GOLD : SILVER;
    return {
      x:     rand(0, W),
      y:     rand(0, H),
      r:     rand(0.4, 1.6),
      dx:    rand(-0.12, 0.12),
      dy:    rand(-0.18, -0.06),
      alpha: rand(0.04, 0.25),
      fade:  rand(0.001, 0.003),
      col,
    };
  }

  function init() {
    particles = [];
    for (let i = 0; i < COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Very faint grid lines (4D depth effect)
    ctx.strokeStyle = 'rgba(201,168,76,0.018)';
    ctx.lineWidth   = 0.5;
    const step = 90;
    for (let x = 0; x < W; x += step) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (let y = 0; y < H; y += step) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha})`;
      ctx.fill();

      p.x += p.dx;
      p.y += p.dy;
      p.alpha -= p.fade;

      if (p.alpha <= 0 || p.y < -10 || p.x < -10 || p.x > W + 10) {
        const fresh = createParticle();
        fresh.y = H + 5;
        particles[i] = fresh;
      }
    });

    // Subtle connection lines between close particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * 0.04;
          ctx.strokeStyle = `rgba(201,168,76,${alpha})`;
          ctx.lineWidth   = 0.4;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    resize();
    init();
  });

  resize();
  init();
  draw();

  // Pause when tab hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animId);
    } else {
      draw();
    }
  });
})();


/* ──────────────────────────────────────────────
   2. LIVE CLOCK (ticker + mobile)
   ────────────────────────────────────────────── */
(function initClock() {
  const tickerEl = document.getElementById('ticker-time');
  const mobEl    = document.getElementById('mob-time');

  function pad(n) { return String(n).padStart(2, '0'); }

  function updateClock() {
    // Bangladesh time = UTC+6
    const now = new Date();
    const bst = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
    const h   = pad(bst.getHours());
    const m   = pad(bst.getMinutes());
    const s   = pad(bst.getSeconds());
    const str = `${h}:${m}:${s}`;

    if (tickerEl) tickerEl.textContent = `BD ${str}`;
    if (mobEl)    mobEl.textContent    = `${h}:${m}`;
  }

  updateClock();
  setInterval(updateClock, 1000);
})();


/* ──────────────────────────────────────────────
   3. NAVBAR  — sticky behavior after ticker
   ────────────────────────────────────────────── */
(function initNavbar() {
  const header  = document.getElementById('site-header');
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navbar) return;

  // Pad body top so content starts below ticker+navbar
  const tickerH = document.querySelector('.ticker-bar')?.offsetHeight || 34;
  const navH    = 64;
  document.body.style.paddingTop = `${tickerH + navH}px`;

  function onScroll() {
    const scrolled = window.scrollY > 80;
    navbar.classList.toggle('scrolled', scrolled);

    // Active link highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - navH - tickerH - 50;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.dataset.section === current);
    });

    // Back to top
    const btn = document.getElementById('back-top');
    if (btn) btn.classList.toggle('visible', window.scrollY > 600);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ──────────────────────────────────────────────
   4. HAMBURGER MENU
   ────────────────────────────────────────────── */
(function initHamburger() {
  const burger = document.getElementById('hamburger');
  const menu   = document.getElementById('mobile-menu');
  if (!burger || !menu) return;

  const mobLinks = menu.querySelectorAll('.mob-link, .mob-cta');

  function openMenu() {
    burger.classList.add('open');
    menu.classList.add('open');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    burger.classList.remove('open');
    menu.classList.remove('open');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobLinks.forEach(l => l.addEventListener('click', closeMenu));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('open')) closeMenu();
  });
})();


/* ──────────────────────────────────────────────
   5. SCROLL REVEAL
   ────────────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Stagger siblings within same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll('[data-reveal]:not(.revealed)')
          );
          const delay = siblings.indexOf(entry.target) * 80;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -70px 0px', threshold: 0.12 }
  );

  items.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   6. STAT / NUMBER COUNTERS
   ────────────────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur    = 1600;
      const start  = performance.now();

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / dur, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   7. SKILL BARS
   ────────────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.sk-fill, .skill-fill');
  if (!fills.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const w  = el.dataset.w || 0;
      setTimeout(() => { el.style.width = `${w}%`; }, 200);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();


/* ──────────────────────────────────────────────
   8. 3D TILT on Project Rows (subtle)
   ────────────────────────────────────────────── */
(function initTilt() {
  const cards = document.querySelectorAll('.proj-row, .venture-card, .pstep');

  // Only on devices with fine pointer (not touch)
  const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFinePointer) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const maxRot = 3;
      const rotX   = (-dy / (rect.height / 2)) * maxRot;
      const rotY   = ( dx / (rect.width  / 2)) * maxRot;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });
})();


/* ──────────────────────────────────────────────
   9. SMOOTH SCROLL for anchor links
   ────────────────────────────────────────────── */
(function initSmoothScroll() {
  const tickerH = document.querySelector('.ticker-bar')?.offsetHeight || 34;
  const navH    = 64;
  const offset  = tickerH + navH;

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ──────────────────────────────────────────────
   10. CONTACT FORM
   ────────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit  = document.getElementById('form-submit');
  if (!form) return;

  function shake(el) {
    el.style.animation = 'none';
    void el.offsetWidth;
    el.style.animation = 'shake 0.5s ease';
    setTimeout(() => { el.style.animation = ''; }, 500);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.querySelector('#cf-name');
    const email   = form.querySelector('#cf-email');
    const message = form.querySelector('#cf-message');
    let valid = true;

    [name, email, message].forEach(field => {
      if (!field) return;
      field.style.borderColor = '';
      if (!field.value.trim()) {
        field.style.borderColor = 'rgba(220,80,80,0.6)';
        shake(field);
        valid = false;
      }
    });

    if (email && email.value && !email.value.includes('@')) {
      email.style.borderColor = 'rgba(220,80,80,0.6)';
      shake(email);
      valid = false;
    }

    if (!valid) return;

    // Simulate send
    const btnSpan = submit.querySelector('span');
    const origText = btnSpan ? btnSpan.textContent : 'Send Message';
    submit.disabled = true;
    if (btnSpan) btnSpan.textContent = 'Sending…';
    submit.style.opacity = '0.7';

    setTimeout(() => {
      submit.disabled = false;
      if (btnSpan) btnSpan.textContent = origText;
      submit.style.opacity = '';
      if (success) success.classList.add('show');
      form.reset();
      setTimeout(() => { if (success) success.classList.remove('show'); }, 5000);
    }, 1400);
  });
})();


/* ──────────────────────────────────────────────
   11. BACK TO TOP button
   ────────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ──────────────────────────────────────────────
   12. HERO ID CARD — parallax on scroll
   ────────────────────────────────────────────── */
(function initHeroParallax() {
  const card = document.querySelector('.hero-id-card');
  if (!card) return;

  const hasFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFine) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const hero    = document.getElementById('hero');
      if (!hero) { ticking = false; return; }
      const heroH = hero.offsetHeight;
      if (scrollY > heroH) { ticking = false; return; }
      const pct   = scrollY / heroH;
      const moveY = pct * 40;
      card.style.transform = `translateY(${-moveY}px) rotate(-0.5deg)`;
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
})();


/* ──────────────────────────────────────────────
   13. VENTURES CARDS — stagger entrance
   ────────────────────────────────────────────── */
(function initVentureStagger() {
  const cards = document.querySelectorAll('.venture-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const i = Array.from(cards).indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 100);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  cards.forEach(card => {
    card.style.opacity   = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.4s ease, box-shadow 0.4s ease';
    observer.observe(card);
  });
})();


/* ──────────────────────────────────────────────
   14. PROCESS STEPS — stagger + icon animate
   ────────────────────────────────────────────── */
(function initProcessSteps() {
  const steps = document.querySelectorAll('.pstep');
  if (!steps.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const i = Array.from(steps).indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
      }, i * 150);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });

  steps.forEach(step => {
    step.style.opacity   = '0';
    step.style.transform = 'translateY(20px)';
    step.style.transition = 'opacity 0.65s ease, transform 0.65s ease, border-color 0.4s, box-shadow 0.4s';
    observer.observe(step);
  });
})();


/* ──────────────────────────────────────────────
   15. FOOTER MANIFESTO — speed on hover
   ────────────────────────────────────────────── */
(function initManifesto() {
  const track = document.querySelector('.fm-track');
  if (!track) return;

  const footer = document.querySelector('.footer-manifesto');
  if (footer) {
    footer.addEventListener('mouseenter', () => {
      track.style.animationDuration = '10s';
    });
    footer.addEventListener('mouseleave', () => {
      track.style.animationDuration = '20s';
    });
  }
})();


/* ──────────────────────────────────────────────
   16. NAV LOGO shimmer pulse on load
   ────────────────────────────────────────────── */
(function initLogoEffect() {
  const logo = document.querySelector('.logo-name');
  if (!logo) return;

  logo.style.transition = 'opacity 0.4s';

  // Fade in on load
  logo.style.opacity = '0';
  setTimeout(() => { logo.style.opacity = '1'; }, 300);
})();


/* ──────────────────────────────────────────────
   17. PROJ ROW hover accent line
   ────────────────────────────────────────────── */
(function initProjRows() {
  const rows = document.querySelectorAll('.proj-row');
  rows.forEach(row => {
    row.addEventListener('mouseenter', () => {
      const num = row.querySelector('.pr-num');
      if (num) num.style.background = 'rgba(201,168,76,0.14)';
    });
    row.addEventListener('mouseleave', () => {
      const num = row.querySelector('.pr-num');
      if (num) num.style.background = '';
    });
  });
})();


/* ──────────────────────────────────────────────
   18. HERO CARD — entrance animation
   ────────────────────────────────────────────── */
(function initHeroCard() {
  const card    = document.querySelector('.hero-id-card');
  const textCol = document.querySelector('.hero-text-col');

  if (card) {
    card.style.opacity   = '0';
    card.style.transform = 'translateX(-30px)';
    card.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
    setTimeout(() => {
      card.style.opacity   = '1';
      card.style.transform = '';
    }, 200);
  }

  if (textCol) {
    textCol.style.opacity   = '0';
    textCol.style.transform = 'translateX(30px)';
    textCol.style.transition = 'opacity 0.9s ease 0.2s, transform 0.9s ease 0.2s';
    setTimeout(() => {
      textCol.style.opacity   = '1';
      textCol.style.transform = '';
    }, 200);
  }
})();


/* ──────────────────────────────────────────────
   19. GOLD ACCENT HOVER on cards
   ────────────────────────────────────────────── */
(function initCardHoverGlow() {
  const cards = document.querySelectorAll('.card-glass');
  const hasFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (!hasFine) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });
  });
})();


/* ──────────────────────────────────────────────
   20. Ticker Bar — pause on hover
   ────────────────────────────────────────────── */
(function initTickerPause() {
  const track = document.getElementById('ticker-track');
  const bar   = document.querySelector('.ticker-bar');
  if (!track || !bar) return;

  bar.addEventListener('mouseenter', () => {
    track.style.animationPlayState = 'paused';
  });
  bar.addEventListener('mouseleave', () => {
    track.style.animationPlayState = 'running';
  });
})();


/* ──────────────────────────────────────────────
   DONE — All modules loaded
   ────────────────────────────────────────────── */
console.log('%cARSHAON.COM | v3 — Clean. Premium. Built to Scale.', 'color:#C9A84C;font-family:monospace;font-size:12px;');
