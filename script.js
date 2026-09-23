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

// Animated bar widths for LeetCode
window.addEventListener('load', () => {
  setTimeout(() => {
    document.querySelectorAll('.bar-fill').forEach(bar => {
      bar.style.width = bar.style.width;
    });
  }, 300);
});
