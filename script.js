// Certificate modal state
let selectedCert = null;

function openModal(e) {
  if (e.target.classList.contains('cert-view-btn')) {
    const btn = e.target;
    selectedCert = {
      title: btn.dataset.title,
      file: btn.dataset.file,
      pdf: btn.dataset.pdf || null
    };
    renderModalContent();
  }
}

function renderModalContent() {
  const content = document.getElementById('modal-content');
  const src = encodeURI(selectedCert.file || '');
  const pdfSrc = selectedCert.pdf ? encodeURI(selectedCert.pdf) : null;

  let innerHTML = `<p class="modal-title">${selectedCert.title}</p>
    <div class="modal-img-wrap">
      <img src="${src}" alt="${selectedCert.title}" class="modal-img" onerror="this.style.display='none';this.nextElementSibling.style.display='block'" />
      <p class="modal-img-fallback" style="display:none;text-align:center;color:var(--muted);padding:2rem">Preview unavailable — <a href="${pdfSrc||src}" download class="modal-download">⬇ Download file</a></p>
    </div>
    <div class="modal-file">
      <span class="modal-file-title">${selectedCert.title}</span>
      ${pdfSrc ? `<a href="${pdfSrc}" download class="modal-download">⬇ Download PDF</a>` : ''}
    </div>`;

  content.innerHTML = innerHTML;
  document.getElementById('modal-overlay').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.getElementById('modal-close-btn').focus({ preventScroll: true });
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('open');
  document.body.style.overflow = '';
  selectedCert = null;
}

// Close on overlay click (not on box click)
document.getElementById('modal-overlay').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// Close button click
document.getElementById('modal-close-btn').addEventListener('click', closeModal);

// Keyboard close (modal + mobile nav)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const overlay = document.getElementById('modal-overlay');
    if (overlay.classList.contains('open')) {
      closeModal();
    }
    if (typeof isNavOpen === 'function' && isNavOpen()) {
      setNav(false);
      document.getElementById('hamburger').focus();
    }
  }
});

// Delegate click on cert-view-btn
document.addEventListener('click', openModal);

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// Hamburger menu (slide-in below 768px)
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
const navScrim = document.getElementById('nav-scrim');
function setNav(open) {
  navLinks.classList.toggle('open', open);
  hamburger.classList.toggle('open', open);
  if (navScrim) navScrim.classList.toggle('show', open);
  hamburger.setAttribute('aria-expanded', String(open));
  hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}
function isNavOpen() { return navLinks.classList.contains('open'); }
hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  setNav(!isNavOpen());
});
if (navScrim) navScrim.addEventListener('click', () => setNav(false));
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => setNav(false));
});
document.addEventListener('click', (e) => {
  if (!isNavOpen()) return;
  if (!e.target.closest('#navbar')) setNav(false);
});

// AOS (Animate on Scroll) with stagger for grouped items
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.projects-grid, .skills-grid, .achievements-grid, .interests-grid, .certs-grid, .cp-grid, .timeline, .contact-grid').forEach(group => {
  [...group.querySelectorAll('[data-aos]')].forEach((el, i) => {
    el.style.setProperty('--aos-delay', `${Math.min(i, 5) * 60}ms`);
  });
});
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
      // Clear stagger delay after entry so later hovers/presses stay snappy
      const el = e.target;
      const d = parseInt((el.style.getPropertyValue('--aos-delay') || '0').replace('ms', ''), 10) || 0;
      setTimeout(() => el.style.removeProperty('--aos-delay'), 450 + d);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
if (reduceMotion) {
  document.querySelectorAll('[data-aos]').forEach(el => {
    el.style.removeProperty('--aos-delay');
    el.classList.add('visible');
  });
} else {
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
}

// Active nav link highlight
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionObserver.observe(s));

// Click ripple on buttons (skipped for reduced-motion users)
document.addEventListener('pointerdown', (e) => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const btn = e.target.closest('.btn,.btn-primary,.btn-secondary,.cert-view-btn,.nav-cta,.modal-download');
  if (!btn) return;
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 500);
});

// ─── Living hero: typing rotator, count-up stats, particles, parallax ───
// (all skipped for reduced-motion users — static content stays as-is)
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {

  // 1. Typing role rotator in the hero tagline
  const typerEl = document.getElementById('role-typer');
  if (typerEl) {
    const roles = ['Full-Stack Developer', 'AI/ML Engineer', 'Competitive Programmer', 'Problem Solver'];
    typerEl.textContent = roles[0];
    let roleIdx = 0, charIdx = roles[0].length, deleting = true;
    function tickTyper() {
      let delay;
      if (deleting) {
        charIdx -= 1;
        typerEl.textContent = roles[roleIdx].slice(0, Math.max(charIdx, 0));
        delay = 38;
        if (charIdx <= 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          delay = 350;
        }
      } else {
        charIdx += 1;
        typerEl.textContent = roles[roleIdx].slice(0, charIdx);
        delay = 75;
        if (charIdx >= roles[roleIdx].length) {
          deleting = true;
          delay = 1700;
        }
      }
      setTimeout(tickTyper, delay);
    }
    // Start after the entrance animation settles
    setTimeout(tickTyper, 1800);
  }

  // 2. Count-up hero stats (final values already in HTML as fallback)
  const statNums = document.querySelectorAll('.stat-num[data-count]');
  function countUp(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1400, t0 = performance.now();
    function frame(t) {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(frame);
  }
  setTimeout(() => statNums.forEach(countUp), 650);

  // 3. Rising bubble particles in the hero background
  const pWrap = document.getElementById('hero-particles');
  if (pWrap) {
    const colors = ['184,137,45', '52,61,26', '120,110,85'];
    // Scatter bubbles across the full hero height (on phones the hero is
    // taller than the viewport — starting them all at the bottom would
    // leave the first screen empty). Negative delays = mid-flight at load.
    const H = pWrap.offsetHeight || window.innerHeight;
    for (let i = 0; i < 38; i++) {
      const s = document.createElement('span');
      s.className = 'hero-particle';
      const big = i % 5 === 4; // every 5th bubble is a large blurred one for depth
      const size = big ? 20 + Math.random() * 14 : 6 + Math.random() * 10;
      s.style.left = `${(Math.random() * 100).toFixed(2)}%`;
      s.style.top = `${(Math.random() * H).toFixed(1)}px`;
      s.style.width = s.style.height = `${size.toFixed(1)}px`;
      const c = colors[i % colors.length];
      s.style.background = `radial-gradient(circle at 32% 30%, rgba(255,255,255,.8), rgba(255,255,255,.05) 55%), rgba(${c},.30)`;
      s.style.border = `1px solid rgba(${c},.35)`;
      s.style.boxShadow = 'inset -2px -3px 6px rgba(255,255,255,.25)';
      if (big) s.style.filter = 'blur(1px)';
      const dur = 6 + Math.random() * 7;
      s.style.animationDuration = `${dur.toFixed(2)}s`;
      s.style.animationDelay = `${(-Math.random() * dur).toFixed(2)}s`;
      pWrap.appendChild(s);
    }
  }

  // 4. Subtle mouse parallax on the bg + photo (fine pointers only)
  const hero = document.querySelector('.hero');
  const heroBg = document.querySelector('.hero-bg');
  const photoWrap = document.querySelector('.hero-photo-wrap');
  if (hero && heroBg && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      heroBg.style.setProperty('--bgx', `${(x * 18).toFixed(1)}px`);
      heroBg.style.setProperty('--bgy', `${(y * 18).toFixed(1)}px`);
      if (photoWrap) {
        photoWrap.style.setProperty('--phx', `${(x * -14).toFixed(1)}px`);
        photoWrap.style.setProperty('--phy', `${(y * -14).toFixed(1)}px`);
      }
    });
    hero.addEventListener('mouseleave', () => {
      heroBg.style.setProperty('--bgx', '0px');
      heroBg.style.setProperty('--bgy', '0px');
      if (photoWrap) {
        photoWrap.style.setProperty('--phx', '0px');
        photoWrap.style.setProperty('--phy', '0px');
      }
    });
  }
}
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.style.width;
    });
  }, 300);
});
