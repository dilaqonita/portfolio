import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { flipChars } from './text.js';

export function initProjects({ animate }) {
  if (!animate) return;

  // ---- dinding screenshot miring bergerak mengikuti scroll ----
  gsap.set('.wall-grid', { rotationX: 52, rotationZ: -18 });
  gsap.fromTo(
    '.wall-grid',
    { yPercent: 6, rotationZ: -22 },
    {
      yPercent: -22, rotationZ: -14, ease: 'none',
      scrollTrigger: { trigger: '#folio', start: 'top bottom', end: 'bottom top', scrub: 0.8 },
    }
  );

  // ---- judul: per huruf (SplitText), lead: per baris bermasker ----
  flipChars('.proj-intro-text .h2', '#folio', 'top 40%');
  SplitText.create('.proj-intro-text .lead', {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110, duration: 0.9, stagger: 0.12, ease: 'power3.out',
        scrollTrigger: { trigger: '#folio', start: 'top 40%' },
      }),
  });


  const cards = gsap.utils.toArray('.pcard');

  // ---- tiap kartu: gambar masuk dengan tilt 3D, teks naik; gambar parallax halus ----
  cards.forEach((card) => {
    const shot = card.querySelector('.shot');
    const body = card.querySelectorAll('.pcard-body > *');
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 82%' } });
    if (shot) tl.from(shot, { rotationY: -16, rotationX: 8, y: 70, opacity: 0, transformPerspective: 1200, duration: 1.1, ease: 'power3.out' });
    tl.from(body, { y: 28, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'power3.out' }, shot ? 0.2 : 0);

    const img = card.querySelector('.shot img');
    if (img && !img.classList.contains('fit')) {
      gsap.fromTo(img, { yPercent: -4 }, {
        yPercent: 4, ease: 'none',
        scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });

  // ---- desktop: kartu menumpuk, kartu lama mengecil saat kartu berikut menimpa ----
  gsap.matchMedia().add('(min-width: 901px)', () => {
    cards.forEach((card, i) => {
      const next = cards[i + 1];
      if (!next) return;
      gsap.fromTo(card, { scale: 1, filter: 'brightness(1)' }, {
        scale: 0.94, filter: 'brightness(0.92)', ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 120px', scrub: true },
      });
    });
  });
}
