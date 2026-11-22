import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Polesan global: lintasan matahari (progres scroll), nav pintar, kemiringan sesuai kecepatan scroll, bintang jatuh.
export function initPolish() {
  // ---- lintasan matahari: titik bergerak melengkung dari fajar ke malam ----
  const page = { start: 0, end: 'max', scrub: 0.6 };
  gsap.to('#sp-dot', {
    motionPath: { path: '#sp-arc', align: '#sp-arc', alignOrigin: [0.5, 0.5] },
    ease: 'none', scrollTrigger: page,
  });
  gsap.fromTo('#sp-trail', { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', scrollTrigger: page });
  gsap.timeline({ scrollTrigger: page, defaults: { ease: 'none' } })
    .to('#sp-dot', { fill: '#FF9A4D', duration: 1 }, 0).to('#sp-trail', { stroke: '#FF9A4D', duration: 1 }, 0)
    .to('#sp-dot', { fill: '#FF9ED1', duration: 1 }, 1).to('#sp-trail', { stroke: '#FF9ED1', duration: 1 }, 1)
    .to('#sp-dot', { fill: '#FFF3C9', duration: 1 }, 2).to('#sp-trail', { stroke: '#FFF3C9', duration: 1 }, 2);
  gsap.timeline({ scrollTrigger: page }).to('.sunpath', { color: '#13284F', duration: 1 }).to('.sunpath', { color: '#ffffff', duration: 1 });

  // ---- nav: pill penanda section aktif + sembunyi saat scroll turun ----
  const ind = document.querySelector('.nav-ind');
  let last = null;
  const move = (a) => {
    last = a;
    if (!a || getComputedStyle(a).display === 'none') { gsap.to(ind, { opacity: 0, duration: 0.3 }); return; }
    gsap.to(ind, { x: a.offsetLeft, width: a.offsetWidth, opacity: 1, duration: 0.55, ease: 'power3.out' });
  };
  document.querySelectorAll('.links a:not(.cta)').forEach((a) => {
    const sec = document.querySelector(a.getAttribute('href'));
    if (sec) ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && move(a) });
  });
  ['#hero', '#contact'].forEach((id) =>
    ScrollTrigger.create({ trigger: id, start: 'top 50%', end: 'bottom 50%', onToggle: (s) => s.isActive && move(null) })
  );
  // setelah melewati hero, nav menyusut jadi logo bulat; hover / klik logo untuk membuka menu
  const bar = document.querySelector('.nav-bar');
  let compact = false;
  const setOpen = (o) => {
    bar.classList.toggle('open', o);
    if (o) setTimeout(() => move(last), 450);
  };
  const setCompact = (c) => {
    if (c === compact) return;
    if (c && matchMedia('(max-width: 720px)').matches) return;
    compact = c;
    bar.classList.toggle('compact', c);
    setOpen(false);
    gsap.fromTo('.logo-img', { rotation: c ? -200 : 200 }, { rotation: 0, duration: 0.9, ease: 'back.out(1.4)' });
    if (!c) setTimeout(() => move(last), 450);
  };
  ScrollTrigger.create({ start: () => innerHeight * 0.6, end: 'max', onToggle: (s) => setCompact(s.isActive) });
  bar.addEventListener('click', (e) => {
    if (!compact) return;
    if (e.target.closest('.logo')) { e.preventDefault(); e.stopImmediatePropagation(); setOpen(!bar.classList.contains('open')); }
    else if (e.target.closest('.links a')) setOpen(false);
  }, true);
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    bar.addEventListener('mouseenter', () => compact && setOpen(true));
    bar.addEventListener('mouseleave', () => compact && setOpen(false));
  }

  // ---- kartu proyek miring mengikuti kecepatan scroll ----
  const skew = gsap.quickTo('.pcard-media', 'skewY', { duration: 0.5, ease: 'power3' });
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => skew(gsap.utils.clamp(-5, 5, s.getVelocity() / -350)) });
  ScrollTrigger.addEventListener('scrollEnd', () => skew(0));

  // ---- bintang jatuh di langit malam (ikut opacity .stars) ----
  const stars = document.querySelector('.stars');
  for (let i = 0; i < 3; i++) {
    const s = document.createElement('i');
    s.className = 'shoot';
    stars.appendChild(s);
    const run = () => {
      gsap.set(s, { left: `${gsap.utils.random(35, 95)}%`, top: `${gsap.utils.random(2, 40)}%`, x: 0, y: 0, opacity: 0 });
      gsap.timeline({ delay: gsap.utils.random(2, 9), onComplete: run })
        .to(s, { x: -260, y: 170, opacity: 1, duration: 0.45, ease: 'power1.in' })
        .to(s, { x: -460, y: 300, opacity: 0, duration: 0.5, ease: 'power1.out' });
    };
    run();
  }
}
