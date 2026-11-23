import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flipChars, scrubWords } from './text.js';

// Experience "Boarding Pass Stack": tiap pengalaman = tiket pesawat. Saat di-scroll, tiket baru
// menimpa tiket sebelumnya (sticky stack, yang tertimpa mengecil + menggelap). Klik / Enter untuk membalik tiket.
export function initExperience({ animate }) {
  const rows = gsap.utils.toArray('.bp-row');

  // ---- balik tiket (berfungsi juga tanpa animasi) ----
  rows.forEach((row) => {
    const card = row.querySelector('.bp-card');
    const flip = row.querySelector('.bp-flip');
    const front = row.querySelector('.bp-front');
    const back = row.querySelector('.bp-back');
    gsap.set(flip, { transformPerspective: 1500 });
    const toggle = () => {
      const on = card.getAttribute('aria-pressed') !== 'true';
      card.setAttribute('aria-pressed', String(on));
      front.setAttribute('aria-hidden', String(on));
      back.setAttribute('aria-hidden', String(!on));
      gsap.to(flip, { rotationY: on ? 180 : 0, duration: animate ? 0.9 : 0, ease: 'power3.inOut' });
      // sedikit "terbang" saat dibalik
      if (animate) gsap.fromTo(card, { scale: 1 }, { scale: 1.03, duration: 0.45, yoyo: true, repeat: 1, ease: 'power2.inOut', overwrite: false });
    };
    card.addEventListener('click', toggle);
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });

  if (!animate) return;

  flipChars('.experience .h2', '.experience');
  scrubWords('.exp-statement');

  // marquee teks outline raksasa, digeser oleh scroll
  gsap.fromTo('.exp-marquee-track', { xPercent: 0 }, {
    xPercent: -50, ease: 'none',
    scrollTrigger: { trigger: '.experience', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
  });

  const mobile = () => window.innerWidth <= 720;

  rows.forEach((row, i) => {
    const card = row.querySelector('.bp-card');

    // tiket meluncur masuk dari bawah dengan sedikit miring, lalu lurus
    gsap.from(card, {
      y: 160, rotation: i % 2 ? 4 : -4, opacity: 0, duration: 1.1, ease: 'power4.out',
      scrollTrigger: { trigger: row, start: 'top 90%' },
    });

    // tiket yang ditimpa tiket berikutnya: mengecil & menggelap (scrub mengikuti scroll)
    const next = rows[i + 1];
    if (!next) return;
    const nextTop = () => (mobile() ? 84 + 16 * (i + 1) : 96 + 22 * (i + 1));
    gsap.timeline({
      scrollTrigger: { trigger: next, start: 'top 85%', end: () => `top ${nextTop()}px`, scrub: true },
    })
      .to(card, { scale: 0.94, ease: 'none' }, 0)
      .to(row.querySelector('.bp-dim'), { opacity: 0.38, ease: 'none' }, 0);
  });
}
