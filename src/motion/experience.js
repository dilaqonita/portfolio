import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { flipChars, scrubWords } from './text.js';

// Experience editorial: marquee outline di belakang, kalimat menyala per kata, garis tergambar,
// baris terisi warna dari arah kursor masuk, klik untuk membuka detail.
export function initExperience({ animate }) {
  const rows = gsap.utils.toArray('.exp-row');

  // ---- buka / tutup detail (berfungsi juga tanpa animasi) ----
  rows.forEach((row) => {
    const head = row.querySelector('.exp-head');
    const body = row.querySelector('.exp-body');
    const plus = row.querySelector('.exp-plus');
    gsap.set(body, { height: 0 });
    head.addEventListener('click', () => {
      const open = head.getAttribute('aria-expanded') !== 'true';
      head.setAttribute('aria-expanded', String(open));
      row.classList.toggle('open', open);
      gsap.to(body, { height: open ? 'auto' : 0, duration: animate ? 0.6 : 0, ease: 'power3.inOut', onComplete: () => ScrollTrigger.refresh() });
      gsap.to(plus, { rotation: open ? 135 : 0, duration: animate ? 0.5 : 0, ease: 'back.out(2)' });
      if (open && animate) gsap.from(body.querySelectorAll('li'), { y: 16, opacity: 0, duration: 0.5, stagger: 0.07, delay: 0.15 });
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

  rows.forEach((row) => {
    const head = row.querySelector('.exp-head');
    const fill = row.querySelector('.exp-fill');
    const role = SplitText.create(row.querySelector('.exp-role'), { type: 'lines', mask: 'lines' });

    gsap
      .timeline({ scrollTrigger: { trigger: row, start: 'top 85%' } })
      .from(row.querySelector('.exp-line'), { scaleX: 0, transformOrigin: '0% 50%', duration: 1, ease: 'power3.inOut' })
      .from(row.querySelector('.exp-num'), { yPercent: 100, opacity: 0, duration: 0.6, ease: 'power3.out' }, 0.25)
      .from(role.lines, { yPercent: 110, duration: 0.8, ease: 'power4.out' }, 0.3)
      .from(row.querySelectorAll('.exp-org, .exp-side > *, .exp-plus'), { y: 18, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out' }, 0.45);

    // isi warna mengikuti arah masuk/keluar kursor (atas atau bawah)
    const dir = (e) => {
      const b = head.getBoundingClientRect();
      return e.clientY - b.top < b.height / 2 ? '50% 0%' : '50% 100%';
    };
    head.addEventListener('mouseenter', (e) => {
      gsap.set(fill, { transformOrigin: dir(e) });
      gsap.to(fill, { scaleY: 1, duration: 0.45, ease: 'power3.out', overwrite: true });
      gsap.to(head.querySelector('.exp-main'), { x: 18, duration: 0.45, ease: 'power3.out' });
      row.classList.add('hot');
    });
    head.addEventListener('mouseleave', (e) => {
      gsap.set(fill, { transformOrigin: dir(e) });
      gsap.to(fill, { scaleY: 0, duration: 0.4, ease: 'power3.inOut', overwrite: true });
      gsap.to(head.querySelector('.exp-main'), { x: 0, duration: 0.45, ease: 'power3.out' });
      row.classList.remove('hot');
    });
  });
}
