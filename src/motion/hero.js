import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { Draggable } from 'gsap/Draggable';
import { hoverChars } from './text.js';

// Hero: intro dimainkan setelah preloader (dikembalikan dalam keadaan paused),
// pesawat kertas terbang meninggalkan jejak, matahari bisa di-drag & dilempar.
export function initHero({ animate }) {
  if (!animate) return null; // reduced motion: hero statis, semua langsung terlihat

  const lines = gsap.utils.toArray('.hero-name .line-in');

  // ---- keadaan awal (tertutup preloader) ----
  gsap.set(lines, { yPercent: 115 });
  gsap.set('.sun-wrap', { yPercent: 120, opacity: 0 });
  gsap.set('.cloud', { opacity: 0, x: -60 });
  gsap.set(['.hero-note', '.cta-row', '.doodle'], { opacity: 0, y: 24 });
  gsap.set('.nav-bar', { yPercent: -160, opacity: 0 });
  gsap.set('.sunpath', { opacity: 0, y: 20 });

  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  intro
    .to('.sun-wrap', { yPercent: 0, opacity: 1, duration: 1.4, ease: 'power2.out' }, 0.1)
    .to('.cloud', { opacity: (i) => [0.55, 0.4, 0.32][i], x: 0, duration: 1.4, stagger: 0.15 }, 0.3)
    .to('.hero-note', { opacity: 1, y: 0, duration: 0.9 }, 1.3)
    .to(lines, { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'power4.out' }, 0.6)
    .to('.doodle', { opacity: 1, y: 0, duration: 0.8 }, 1.4)
    .add(flyPlane, 1.5)
    .to('.cta-row', { opacity: 1, y: 0, duration: 0.7 }, 1.6)
    .to('.nav-bar', { yPercent: 0, opacity: 1, duration: 0.8 }, 1.6)
    .to('.sunpath', { opacity: 1, y: 0, duration: 0.8 }, 2);

  hoverChars(SplitText.create('.hero-name .line-in', { type: 'chars', charsClass: 'ch' }).chars);

  // ---- Scroll: matahari turun & menghangat, nama parallax, awan berlapis ----
  gsap
    .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.6 }, defaults: { ease: 'none' } })
    .to('.sun-wrap', { y: 340, x: 160 }, 0)
    .to('.sun', { backgroundColor: '#FF9A4D', boxShadow: '0 0 90px 40px rgba(255,154,77,.55)' }, 0)
    .to('.hero-name', { yPercent: -18 }, 0)
    .to('.hero-foot', { yPercent: -30, opacity: 0 }, 0)
    .to('.c1', { x: 220 }, 0)
    .to('.c2', { x: -160 }, 0)
    .to('.c3', { x: 120, y: -40 }, 0);

  // ---- Matahari bisa di-drag & dilempar (Draggable + Inertia). Langit ikut berubah, lalu kembali ke tempat ----
  const sun = document.querySelector('.sun');
  const hero = document.querySelector('.hero');
  const root = document.documentElement;
  const topAt = gsap.utils.interpolate('#1F5FA8', '#5A3FA0');
  const bottomAt = gsap.utils.interpolate('#BFE4F6', '#FFB27A');
  const paint = () => {
    const s = sun.getBoundingClientRect();
    const h = hero.getBoundingClientRect();
    if (h.bottom < innerHeight * 0.5) return;
    const t = gsap.utils.clamp(0, 1, ((s.top + s.height / 2 - h.top) / h.height - 0.28) * 2.2);
    gsap.set(root, { '--sky-top': topAt(t), '--sky-bottom': bottomAt(t) });
  };
  const goHome = () =>
    gsap.to(sun, { x: 0, y: 0, duration: 2.2, delay: 1.2, ease: 'elastic.out(1, 0.45)', onUpdate: paint, overwrite: true });

  Draggable.create(sun, {
    type: 'x,y',
    inertia: true,
    bounds: hero,
    onPress() { gsap.killTweensOf(sun); },
    onDrag: paint,
    onThrowUpdate: paint,
    onThrowComplete: goHome,
  });

  return intro;
}

// Pesawat kertas mengikuti lintasan loop, jejaknya tergambar lalu terhapus; bintang berkelip.
function flyPlane() {
  gsap.set('#plane-trail', { drawSVG: '0% 0%' });
  gsap.set('#plane', { opacity: 0 });
  const path = { path: '#plane-path', align: '#plane-path', alignOrigin: [0.5, 0.5], autoRotate: true };
  gsap
    .timeline({ repeat: -1, repeatDelay: 0.8 })
    .set('#plane', { opacity: 1, scale: 1.45, transformOrigin: '50% 50%' })
    .to('#plane', { motionPath: path, duration: 4.6, ease: 'power1.inOut' }, 0)
    .fromTo('#plane-trail', { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 4.6, ease: 'power1.inOut' }, 0)
    .to('#plane', { opacity: 0, scale: 0.6, duration: 0.35 }, 4.35)
    .to('#plane-trail', { drawSVG: '100% 100%', duration: 1.1, ease: 'power2.in' }, 4.4);
  gsap.to('.doodle-star', { scale: 1.5, opacity: 0.35, transformOrigin: '50% 50%', duration: 0.9, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: 0.5 });
}
