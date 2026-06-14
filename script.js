/* ============================================================
   ROHIT BHUSAWALE PORTFOLIO – script.js
   Handles: Loader, Particles, Typewriter, Nav, Reveal,
            Skill Bars, Stats Counter, Form, Theme Toggle,
            Back-to-top, Scroll Progress, Skill Filter
   ============================================================ */

'use strict';

/* ─── 1. Loader ─────────────────────────────────────────────── */
(function initLoader() {
  const loader   = document.getElementById('loader');
  const progress = loader.querySelector('.loader-progress');
  const text     = loader.querySelector('.loader-text');
  const messages = ['Initializing...', 'Loading skills...', 'Deploying...', 'Ready!'];
  let pct = 0;
  let mi  = 0;

  const tick = setInterval(() => {
    pct += Math.random() * 18 + 5;
    if (pct >= 100) { pct = 100; clearInterval(tick); }
    progress.style.width = pct + '%';
    text.textContent = messages[Math.min(mi, messages.length - 1)];
    mi++;
  }, 160);

  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 700);
  });

  // Fallback: hide after 3s regardless
  setTimeout(() => loader.classList.add('hidden'), 3000);
})();

/* ─── 2. Particles Canvas ───────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  const ctx    = canvas.getContext('2d');
  let particles = [];
  const COUNT   = 60;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.r    = Math.random() * 1.5 + 0.4;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = (Math.random() - 0.5) * 0.25;
      this.a    = Math.random() * 0.4 + 0.1;
      this.da   = (Math.random() * 0.003 + 0.001) * (Math.random() > 0.5 ? 1 : -1);
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.a += this.da;
      if (this.a > 0.5 || this.a < 0.05) this.da *= -1;
      if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }
    draw() {
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = isDark
        ? `rgba(59,158,255,${this.a})`
        : `rgba(59,100,255,${this.a * 0.5})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
          ctx.beginPath();
          ctx.strokeStyle = isDark
            ? `rgba(59,158,255,${0.05 * (1 - dist / 100)})`
            : `rgba(59,100,255,${0.03 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  for (let i = 0; i < COUNT; i++) particles.push(new Particle());
  animate();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });
})();

/* ─── 3. Typewriter ─────────────────────────────────────────── */
(function initTypewriter() {
  const el     = document.getElementById('typewriter');
  const words  = ['DevOps Engineer', 'AWS Engineer', 'Cloud Engineer', 'CI/CD Specialist', 'Automation Enthusiast'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word   = words[wi];
    const speed  = deleting ? 60 : 100;
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) {
      setTimeout(() => { deleting = true; }, 1600);
    } else if (deleting && ci < 0) {
      deleting = false;
      wi = (wi + 1) % words.length;
    }
    setTimeout(type, speed);
  }
  setTimeout(type, 800);
})();

/* ─── 4. Navbar: scroll + mobile toggle ────────────────────── */
(function initNav() {
  const navbar  = document.getElementById('navbar');
  const toggle  = document.getElementById('nav-toggle');
  const navList = document.getElementById('nav-links');
  const links   = navList.querySelectorAll('a');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  toggle.addEventListener('click', () => {
    const open = navList.classList.toggle('open');
    toggle.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open);
  });

  // Close on link click (mobile)
  links.forEach(link => {
    link.addEventListener('click', () => {
      navList.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    });
  });

  // Active link highlight on scroll
  const sections = document.querySelectorAll('section[id]');
  const obsOpts  = { rootMargin: '-40% 0px -40% 0px' };

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${e.target.id}`));
      }
    });
  }, obsOpts);

  sections.forEach(s => obs.observe(s));
})();

/* ─── 5. Scroll Progress Bar ────────────────────────────────── */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (window.scrollY / max * 100) + '%';
  }, { passive: true });
})();

/* ─── 6. Scroll Reveal ──────────────────────────────────────── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // Slight stagger for sibling elements in a grid
        const siblings = [...e.target.parentElement.children].filter(c => c.classList.contains(e.target.classList[0]));
        const idx = siblings.indexOf(e.target);
        setTimeout(() => {
          e.target.classList.add('revealed');
          obs.unobserve(e.target);
        }, idx * 80);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
})();

/* ─── 7. Animated Stats Counter ─────────────────────────────── */
(function initCounters() {
  const nums = document.querySelectorAll('.stat-number');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el     = e.target;
      const target = +el.dataset.target;
      const dur    = 1600;
      const step   = dur / 60;
      let cur = 0;
      const inc = target / (dur / step);

      const tick = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(tick); }
        el.textContent = Math.floor(cur);
      }, step);

      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  nums.forEach(n => obs.observe(n));
})();

/* ─── 8. Skill Bar Animation ─────────────────────────────────── */
(function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const fill  = e.target.querySelector('.skill-bar-fill');
      const level = e.target.dataset.level;
      fill.style.width = level + '%';
      obs.unobserve(e.target);
    });
  }, { threshold: 0.4 });

  bars.forEach(b => obs.observe(b));
})();

/* ─── 9. Skills Filter ──────────────────────────────────────── */
(function initSkillsFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.skill-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !match);
      });
    });
  });
})();

/* ─── 10. Theme Toggle ──────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('theme-toggle');
  const icon = btn.querySelector('.theme-icon');
  const root = document.documentElement;
  const KEY  = 'rbs-theme';

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    icon.textContent = theme === 'dark' ? '☀' : '☾';
    localStorage.setItem(KEY, theme);
  }

  const saved = localStorage.getItem(KEY);
  const pref  = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  apply(saved || pref);

  btn.addEventListener('click', () => {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
})();

/* ─── 11. Back To Top ───────────────────────────────────────── */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ─── 12. Contact Form ──────────────────────────────────────── */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  function validate(field) {
    const err = field.parentElement.querySelector('.form-error');
    let msg = '';
    field.classList.remove('invalid');

    if (!field.value.trim()) {
      msg = 'This field is required.';
    } else if (field.type === 'email') {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(field.value)) msg = 'Please enter a valid email address.';
    }

    if (msg) { field.classList.add('invalid'); err.textContent = msg; return false; }
    err.textContent = '';
    return true;
  }

  form.querySelectorAll('input, textarea').forEach(field => {
    field.addEventListener('blur', () => validate(field));
    field.addEventListener('input', () => { if (field.classList.contains('invalid')) validate(field); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const fields  = form.querySelectorAll('[required]');
    let allValid  = true;
    fields.forEach(f => { if (!validate(f)) allValid = false; });
    if (!allValid) return;

    const btnText = form.querySelector('.btn-text');
    const btnLoad = form.querySelector('.btn-loading');
    btnText.hidden = true;
    btnLoad.hidden = false;

    // Simulate async send (wire up to Formspree/EmailJS as needed)
    setTimeout(() => {
      btnText.hidden = false;
      btnLoad.hidden = true;
      success.hidden = false;
      form.reset();
      setTimeout(() => { success.hidden = true; }, 5000);
    }, 1200);
  });
})();

/* ─── 13. Footer Year ───────────────────────────────────────── */
document.getElementById('year').textContent = new Date().getFullYear();

/* ─── 14. Lazy Image Loading ────────────────────────────────── */
(function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) {
    document.querySelectorAll('img[loading="lazy"]').forEach(img => {
      img.src = img.dataset.src || img.src;
    });
  } else {
    // Fallback IntersectionObserver
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          if (img.dataset.src) img.src = img.dataset.src;
          obs.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[loading="lazy"]').forEach(img => obs.observe(img));
  }
})();