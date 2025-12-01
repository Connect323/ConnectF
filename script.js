document.addEventListener('DOMContentLoaded', () => {
  /* ---------- NAV TOGGLE (mobile) ---------- */
  const navToggle = document.getElementById('nav-toggle');
  const mainNav = document.getElementById('main-nav');

  navToggle && navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    mainNav.classList.toggle('show');
  });

  /* ---------- CARROSSEL ---------- */
  const slides = document.querySelector('.slides');
  const dotButtons = Array.from(document.querySelectorAll('.carousel-nav .dot'));
  let current = 0;
  const total = slides ? slides.children.length : 0;
  let autoTimer = null;
  const intervalMs = 5000;

  function goTo(index) {
    if (!slides) return;
    index = (index + total) % total;
    slides.style.transform = `translateX(-${(index * 100) / total}%)`;
    dotButtons.forEach((b, i) => b.classList.toggle('active', i === index));
    current = index;
  }

  dotButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      goTo(Number(btn.dataset.slide));
      restartAuto();
    });
  });

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), intervalMs);
  }
  function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
  function restartAuto() { stopAuto(); startAuto(); }

  if (total > 0) {
    // set width of slides (just in case)
    slides.style.width = `${total * 100}%`;
    Array.from(slides.children).forEach(child => child.style.width = `${100 / total}%`);
    goTo(0);
    startAuto();
    // pause on hover (optional)
    const wrapper = document.querySelector('.slides-wrapper');
    wrapper && wrapper.addEventListener('mouseenter', stopAuto);
    wrapper && wrapper.addEventListener('mouseleave', startAuto);
  }

  /* ---------- FLIP CARDS ---------- */
  const cardIds = ['card-internet', 'card-cloud'];
  cardIds.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    // click to flip
    el.addEventListener('click', (e) => {
      el.classList.toggle('flipped');
    });
    // keyboard (Enter) accessibility
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.classList.toggle('flipped');
      }
    });
    // stop click propagation on anchor/button inside
    el.querySelectorAll('a, button').forEach(inner => inner.addEventListener('click', (ev) => ev.stopPropagation()));
  });

  /* ---------- optional: close nav when clicking outside (mobile) ---------- */
  document.addEventListener('click', (e) => {
    if (!mainNav) return;
    if (!mainNav.classList.contains('show')) return;
    if (e.target.closest('#main-nav') || e.target.closest('#nav-toggle')) return;
    mainNav.classList.remove('show');
    navToggle.setAttribute('aria-expanded','false');
  });
});
