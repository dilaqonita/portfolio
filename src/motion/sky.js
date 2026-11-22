import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Langit berganti "jam" mengikuti section yang sedang di tengah layar.
export function initSky({ animate }) {
  const root = document.documentElement;
  const sections = gsap.utils.toArray('[data-sky-top]');
  const first = sections[0];
  root.style.setProperty('--sky-top', first.dataset.skyTop);
  root.style.setProperty('--sky-bottom', first.dataset.skyBottom);
  if (!animate) return;

  const to = (s) =>
    gsap.to(root, { '--sky-top': s.dataset.skyTop, '--sky-bottom': s.dataset.skyBottom, duration: 1.2, ease: 'power2.inOut', overwrite: true });

  sections.forEach((s) =>
    ScrollTrigger.create({
      trigger: s,
      start: 'top 55%',
      end: 'bottom 55%',
      onEnter: () => to(s),
      onEnterBack: () => to(s),
    })
  );

  // Bintang muncul saat malam
  ScrollTrigger.create({
    trigger: '.experience',
    start: 'top 70%',
    onEnter: () => gsap.to('.stars', { opacity: 1, duration: 1.5 }),
    onLeaveBack: () => gsap.to('.stars', { opacity: 0, duration: 1 }),
  });
}
