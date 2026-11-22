import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flipChars, maskLines } from './text.js';

// Rak logo gantung: marquee + ayunan (idle, hover, dan terdorong kecepatan scroll)
export function initTicker({ animate }) {
  if (!animate) return;

  flipChars('.stack-title', '#stack');
  maskLines('.stack-lead', '#stack', 'top 70%');

  const track = document.querySelector('#logo-track');
  const marquee = gsap.to(track, { xPercent: -50, duration: 60, ease: 'none', repeat: -1 });

  const hangs = gsap.utils.toArray('.hang');
  const inners = hangs.map((h) => h.querySelector('.hang-in'));
  inners.forEach((el) => gsap.set(el, { transformOrigin: '50% 0' }));

  // tertiup angin: satu gelombang ayunan yang merambat dari kiri ke kanan
  hangs.forEach((h, i) => {
    gsap
      .fromTo(h, { rotation: -5, transformOrigin: '50% 0' }, { rotation: 5, duration: 2.6, ease: 'sine.inOut', yoyo: true, repeat: -1 })
      .time((i % 26) * 0.14);
  });

  // hover: dorongan lalu pegas kembali
  hangs.forEach((h, i) => {
    h.addEventListener('mouseenter', () => {
      gsap.fromTo(
        inners[i],
        { rotation: gsap.utils.random([-1, 1]) * 16 },
        { rotation: 0, duration: 1.6, ease: 'elastic.out(1, 0.25)', overwrite: true }
      );
    });
  });

  // scroll: marquee ngebut + logo terseret searah scroll
  const swing = gsap.quickTo(inners, 'rotation', { duration: 0.4, ease: 'power2.out' });
  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      const v = self.getVelocity();
      swing(gsap.utils.clamp(-14, 14, -v / 220));
      gsap.to(marquee, { timeScale: 1 + Math.min(Math.abs(v) / 500, 4), duration: 0.2, overwrite: true });
      gsap.to(marquee, { timeScale: 1, duration: 1, delay: 0.25, overwrite: false });
    },
  });
  ScrollTrigger.addEventListener('scrollEnd', () => swing(0));
}
