import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Contact: judul huruf demi huruf (lalu bergelombang), ikon sosial "pop" elastis, bulan terbit menggantikan matahari.
export function initContact({ animate }) {
  if (!animate) return;

  const title = SplitText.create('.contact-title', { type: 'chars' });
  const tl = gsap.timeline({ scrollTrigger: { trigger: '.contact', start: 'top 60%' } });
  tl.from('.moon', { yPercent: 160, opacity: 0, duration: 1.8, ease: 'power2.out' }, 0)
    .from(title.chars, { yPercent: 120, opacity: 0, rotate: 8, duration: 0.9, stagger: 0.08, ease: 'back.out(1.8)' }, 0.1)
    .from('.contact .lead', { y: 24, opacity: 0, duration: 0.8 }, 0.6)
    .from('.social li', { scale: 0, rotate: -25, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'elastic.out(1, 0.55)' }, 0.8)
    .from('.cv-btn', { y: 24, opacity: 0, duration: 0.7 }, 1.3)
    .from('.footer', { opacity: 0, duration: 1 }, 1.5);

  // idle: huruf bergelombang pelan, ikon mengambang (pada <li>, agar tidak bentrok dengan efek magnetik)
  gsap.to(title.chars, { y: -8, duration: 1.6, ease: 'sine.inOut', yoyo: true, repeat: -1, stagger: { each: 0.12, from: 'start' } });
  gsap.utils.toArray('.social li').forEach((li, i) => {
    gsap.to(li, { y: -10, duration: 2 + i * 0.3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 });
  });

  // bulan sedikit parallax
  gsap.to('.moon', {
    y: 60, ease: 'none',
    scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'bottom bottom', scrub: true },
  });
}
