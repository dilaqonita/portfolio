import gsap from 'gsap';

// Interaksi mikro: kursor pengikut, tombol magnetik, menu "scramble" saat hover.
export function initInteract() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // ---- kursor ring dengan lag (quickTo) ----
  const ring = document.querySelector('.cursor');
  const label = ring.querySelector('span');
  gsap.set(ring, { xPercent: -50, yPercent: -50 });
  const qx = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
  const qy = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
  let shown = false;
  window.addEventListener('mousemove', (e) => {
    if (!shown) { gsap.set(ring, { x: e.clientX, y: e.clientY, opacity: 1 }); shown = true; }
    qx(e.clientX); qy(e.clientY);
  });
  document.addEventListener('mouseleave', () => { gsap.to(ring, { opacity: 0, duration: 0.2 }); shown = false; });
  document.addEventListener('mouseover', (e) => {
    const c = e.target.closest('[data-cursor]');
    ring.classList.toggle('big', !!c);
    if (c) label.textContent = c.dataset.cursor;
    ring.classList.toggle('link', !c && !!e.target.closest('a, button'));
  });

  // ---- tombol magnetik ----
  document.querySelectorAll('.btn, .more, .links a.cta, .soc').forEach((el) => {
    const mx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    const my = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      mx((e.clientX - (r.left + r.width / 2)) * 0.35);
      my((e.clientY - (r.top + r.height / 2)) * 0.35);
    });
    el.addEventListener('mouseleave', () => { mx(0); my(0); });
  });

  // ---- menu: teks diacak lalu tersusun kembali ----
  document.querySelectorAll('.links a:not(.cta)').forEach((a) => {
    const text = a.textContent;
    a.addEventListener('mouseenter', () =>
      gsap.to(a, { duration: 0.5, scrambleText: { text, chars: 'lowerCase', speed: 0.6 }, overwrite: true })
    );
  });
}
