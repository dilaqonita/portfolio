import gsap from 'gsap';

// Hero "Magazine -> Sun Portal": sampul majalah; saat di-scroll terbuka dan memperlihatkan adegan matahari
// (nama, foto, awan) lewat jendela seukuran majalah, melebar jadi layar penuh, lalu kamera zoom masuk ke matahari.
const IMG = '/hero/dila-cutout.webp';
const NOTE = 'Software engineering student<br>at IPB University, Bogor.';
const CTA = `<div class="cta-row"><a class="btn btn-primary" href="#projects">See projects</a><a class="btn btn-ghost" href="#contact">Get in touch</a></div>`;
const ME = (cls) => `<img class="${cls}" src="${IMG}" alt="Dila Qonita Hidayati" width="386" height="838" decoding="async">`;
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

const SCENE = () => `
      <div class="pt-sun-w" aria-hidden="true"><i class="pt-glow"></i><i class="pt-sun"></i></div>
      <div class="pt-rings" aria-hidden="true"><i class="pt-ring r1"></i><i class="pt-ring r2"></i></div>
      <div class="pt-name" aria-hidden="true">
        <span class="pt-line"><span>Dila</span></span>
        <span class="pt-line"><span>Qonita<small>Hidayati.</small></span></span>
      </div>
      <div class="pt-me-w">${ME('pt-me')}</div>
      <div class="pt-clouds" aria-hidden="true"><i class="pt-cloud a"></i><i class="pt-cloud b"></i></div>
      <div class="pt-ui">
        <div class="pt-foot"><p class="hero-note">${NOTE}</p>${CTA}</div>
        <p class="pt-hint" aria-hidden="true">Scroll to enter the sun ↓</p>
      </div>`;

const COVER = () => `<article class="mag-cover">
          <div class="mag-bg" aria-hidden="true"><i class="mag-sun"></i></div>
          <header class="mag-top"><span>Issue Nº 26 · Bogor, ID</span><span>★ Be kind</span></header>
          <h1 class="mag-mast" aria-label="Dila Qonita Hidayati"><span aria-hidden="true">Dila</span></h1>
          ${ME('mag-me')}
          <ul class="mag-lines" aria-hidden="true">
            <li><b>Web</b><span>Interfaces that feel alive</span></li>
            <li><b>GIS</b><span>Maps that tell stories</span></li>
            <li><b>AI</b><span>Models, all the way to deployment</span></li>
          </ul>
          <div class="mag-bar" aria-hidden="true"><i class="mag-code"></i></div>
          <p class="mag-strap">Dila Qonita Hidayati<small>Software Engineering Student · IPB University</small></p>
        </article>`;

export function mountHero() {
  const hero = document.querySelector('.hero');
  hero.classList.add('hero--combo');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) hero.classList.add('hero--static');
  hero.innerHTML = `
    <div class="hv hv-combo">
      <div class="cb-scene">${SCENE()}
      </div>
      <div class="mag-side l"><p class="hero-note">${NOTE}</p>${CTA}</div>
      <div class="mag-book">${COVER()}</div>
      <p class="mag-side r" aria-hidden="true">Scroll to open the issue ↓</p>
    </div>`;
}

// skala minimum agar piringan matahari menutup seluruh layar, tanpa tekstur raksasa
const coverScale = () => (Math.hypot(innerWidth, innerHeight) * 1.4) / document.querySelector('.pt-sun').offsetWidth;

function chrome(intro, at) {
  gsap.set('.nav-bar', { yPercent: -160, opacity: 0 });
  gsap.set('.sunpath', { opacity: 0, y: 20 });
  intro.to('.nav-bar', { yPercent: 0, opacity: 1, duration: 0.8 }, at).to('.sunpath', { opacity: 1, y: 0, duration: 0.8 }, at + 0.4);
}

function parallax(list) {
  if (!fine()) return;
  const hero = document.querySelector('.hero');
  const q = list.map(([sel, mx, my]) => {
    const el = document.querySelector(sel);
    return { mx, my, qx: gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3' }), qy: my ? gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3' }) : null };
  });
  window.addEventListener('pointermove', (e) => {
    if (hero.getBoundingClientRect().bottom < 0) return;
    const nx = e.clientX / innerWidth - 0.5;
    const ny = e.clientY / innerHeight - 0.5;
    q.forEach((t) => { t.qx(nx * t.mx); t.qy?.(ny * t.my); });
  });
}

// dikembalikan dalam keadaan paused; diputar setelah preloader selesai
export function initHero() {
  const stage = document.querySelector('.hv-combo');
  const book = stage.querySelector('.mag-book');
  // area sampul (tanpa transform) = jendela tempat adegan matahari mengintip dari "halaman dalam"
  const inset = () => {
    const L = book.offsetLeft, T = book.offsetTop, W = book.offsetWidth, H = book.offsetHeight;
    return `inset(${T}px ${stage.offsetWidth - L - W}px ${stage.offsetHeight - T - H}px ${L}px round 6px 18px 18px 6px)`;
  };
  gsap.set('.cb-scene', { clipPath: inset });
  gsap.set('.mag-cover', { transformPerspective: 1800, transformOrigin: '0% 50%' });
  gsap.set(book, { y: 180, rotation: -5, opacity: 0 });
  gsap.set('.mag-me', { yPercent: 14 });
  gsap.set('.mag-mast span', { yPercent: 40, opacity: 0 });
  gsap.set(['.mag-lines li', '.mag-top', '.mag-bar', '.mag-strap'], { opacity: 0, y: 18 });
  gsap.set('.mag-side', { opacity: 0, y: 24 });
  // adegan matahari tersembunyi sampai halaman dibuka
  gsap.set('.pt-sun-w', { opacity: 0 });
  gsap.set(['.pt-me-w', '.pt-name', '.pt-ring', '.pt-clouds', '.pt-ui'], { opacity: 0 });

  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  intro
    .to(book, { y: 0, rotation: 0, opacity: 1, duration: 1.3, ease: 'power4.out' }, 0.1)
    .to('.mag-mast span', { yPercent: 0, opacity: 1, duration: 1, ease: 'power4.out' }, 0.7)
    .to('.mag-me', { yPercent: 0, duration: 1.2, ease: 'power4.out' }, 0.7)
    .to(['.mag-top', '.mag-lines li', '.mag-bar', '.mag-strap'], { opacity: 1, y: 0, duration: 0.7, stagger: 0.07 }, 1.1)
    .to('.mag-side', { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 }, 1.4);
  chrome(intro, 1.5);

  gsap
    .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }, defaults: { ease: 'none' } })
    // 1) sampul dibuka; di baliknya matahari + kamu muncul
    .to('.mag-side', { opacity: 0, duration: 0.05 }, 0)
    .to('.mag-cover', { rotationY: -165, duration: 0.28, ease: 'power1.inOut' }, 0.02)
    .fromTo('.pt-sun-w', { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2 }, 0.06)
    .fromTo('.pt-me-w', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22 }, 0.06)
    .fromTo('.pt-name', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.1)
    .fromTo('.pt-ring', { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.04 }, 0.12)
    .fromTo('.pt-clouds', { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.12)
    // 2) majalah melebar jadi layar penuh
    .fromTo('.cb-scene', { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)', duration: 0.2, ease: 'power2.inOut' }, 0.3)
    .to(book, { autoAlpha: 0, duration: 0.04 }, 0.3)
    .fromTo('.pt-ui', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.46)
    // 3) (jeda sebentar) lalu kamera masuk ke dalam matahari
    .fromTo('.pt-ui', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.06 }, 0.62)
    .fromTo('.pt-name', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.7, duration: 0.22 }, 0.62)
    .fromTo('.pt-me', { scale: 1, yPercent: 0 }, { scale: 1.45, yPercent: 10, duration: 0.26 }, 0.62)
    .fromTo('.pt-me', { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.78)
    .fromTo('.pt-rings', { scale: 1, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.2 }, 0.62)
    .fromTo('.pt-clouds', { y: 0 }, { y: -80, duration: 0.38 }, 0.62)
    .fromTo('.pt-glow', { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.64)
    .fromTo('.pt-sun', { scale: 1 }, { scale: coverScale, ease: 'power1.in', duration: 0.34 }, 0.64)
    .fromTo('.pt-sun', { opacity: 1 }, { opacity: 0, duration: 0.06 }, 0.94);

  parallax([['.pt-me-w', 26, 0], ['.pt-sun-w', 14, 10]]);
  return intro;
}
