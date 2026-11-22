import { animate, stagger } from 'motion';

// Menu layar penuh untuk HP. Panel turun dengan pegas (Motion), tautan masuk bergantian.
// Berfungsi juga tanpa animasi (reduced motion): panel langsung muncul/hilang.
export function initMenu({ animate: motionOn }) {
  const btn = document.querySelector('.menu-btn');
  const panel = document.getElementById('menu');
  if (!btn || !panel) return;

  const items = panel.querySelectorAll('nav a, .menu-mail');
  const root = document.documentElement;
  let open = false;
  let closing = null;

  const lock = (on) => window.dispatchEvent(new CustomEvent('scroll-lock', { detail: on }));

  const show = () => {
    open = true;
    closing?.stop?.();
    panel.style.visibility = 'visible';
    panel.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Close menu');
    root.classList.add('menu-open');
    lock(true);
    if (!motionOn) { panel.style.transform = 'translateY(0%)'; items[0]?.focus(); return; }
    animate(panel, { transform: ['translateY(-100%)', 'translateY(0%)'] }, { type: 'spring', stiffness: 210, damping: 26 });
    animate(items, { opacity: [0, 1], transform: ['translateY(36px)', 'translateY(0px)'] },
      { type: 'spring', stiffness: 280, damping: 24, delay: stagger(0.06, { startDelay: 0.18 }) });
    items[0]?.focus({ preventScroll: true });
  };

  const hide = (restoreFocus = true) => {
    if (!open) return;
    open = false;
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-label', 'Open menu');
    root.classList.remove('menu-open');
    lock(false);
    const done = () => { panel.style.visibility = 'hidden'; panel.setAttribute('aria-hidden', 'true'); };
    if (restoreFocus) btn.focus({ preventScroll: true });
    if (!motionOn) { panel.style.transform = 'translateY(-100%)'; done(); return; }
    closing = animate(panel, { transform: 'translateY(-100%)' }, { duration: 0.45, ease: [0.76, 0, 0.24, 1] });
    closing.then(() => { if (!open) done(); });
  };

  btn.addEventListener('click', () => (open ? hide() : show()));
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') hide(); });
  // capture: tutup dulu (membuka kunci scroll) sebelum handler anchor Lenis berjalan
  panel.addEventListener('click', (e) => { if (e.target.closest('a')) hide(false); }, true);
  // jika layar dilebarkan, menu otomatis tertutup
  matchMedia('(min-width: 721px)').addEventListener('change', (m) => { if (m.matches) hide(false); });
}
