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
          <div class="sb-bg" aria-hidden="true"></div>
          <i class="sb-paper a" aria-hidden="true"></i><i class="sb-news a" aria-hidden="true"></i>
          <i class="sb-paper b" aria-hidden="true"></i><i class="sb-news b" aria-hidden="true"></i>
          <svg class="sb-svg" viewBox="0 0 100 138.9" preserveAspectRatio="none" aria-hidden="true"><path class="sb-stitch" d="M60 0 C 50 7, 44 20, 34 31 S 12 50, 0 63"/><path class="sb-stitch" d="M99 73 C 88 86, 78 100, 66 114 S 46 133, 34 139"/><circle class="sb-stitch" cx="30" cy="77.8" r="8"/><circle class="sb-stitch" cx="66" cy="61.1" r="9"/><circle class="sb-stitch" cx="78" cy="119.5" r="6"/><circle class="sb-stitch" cx="24" cy="138.9" r="7"/><path class="sb-doodle" d="M8 10 l3 7 7 .6 -5.4 4.6 1.8 7 -6.4 -3.8 -6.4 3.8 1.8 -7 -5.4 -4.6 7 -.6z" transform="translate(6 2)"/><path class="sb-doodle" d="M30 6 c6 0 8 7 2 9 s-8 -5 -3 -8 c5 -2 7 6 1 8"/><path class="sb-doodle" d="M12 38 q4 -8 8 0 t8 0 t8 0"/><path class="sb-doodle blue" d="M60 108 q5 -6 9 0 t9 0 t9 0"/><path class="sb-doodle blue" d="M70 124 c4 -7 10 -7 12 0 c2 7 -6 11 -9 5 c-2 -5 5 -9 9 -3"/><path class="sb-doodle blue" d="M84 96 l3 6 6 .5 -4.6 4 1.6 6 -5.4 -3.3 -5.4 3.3 1.6 -6 -4.6 -4 6 -.5z"/><path class="sb-twine" d="M101 3 C 92 6, 86 2, 80 9 S 72 20, 64 14"/><path class="sb-twine t2" d="M101 3 C 92 6, 86 2, 80 9 S 72 20, 64 14"/><path class="sb-twine" d="M88 7 c-5 -8 5 -9 4 -2 c-1 5 -8 3 -4 2"/></svg>
          <i class="sb-holes" aria-hidden="true"></i>
          <i class="sb-pop sb-tape t1" aria-hidden="true"></i><i class="sb-pop sb-tape t2" aria-hidden="true"></i>
          <i class="sb-pop sb-sun" aria-hidden="true"></i><i class="sb-pop sb-circle" aria-hidden="true"></i>
          <h1 class="sb-title" aria-label="Dila Qonita Hidayati, Portfolio">
            <span class="sb-row" aria-hidden="true"><b class="sb-l">P</b><b class="sb-l">o</b><b class="sb-l">r</b><b class="sb-l">t</b></span>
            <span class="sb-row r2" aria-hidden="true"><b class="sb-l">F</b><b class="sb-l">o</b><b class="sb-l">l</b><b class="sb-l">i</b><b class="sb-l">o</b></span>
          </h1>
          <p class="sb-label">Dila Qonita Hidayati</p>
          <svg class="sb-pop sb-heart h1" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21s-8-4.8-10-9.6C.8 8 2.6 4.6 6 4.6c2.2 0 3.6 1.2 4.2 2.4.7-1.2 2-2.4 4.2-2.4 3.4 0 5.2 3.4 4 6.8C20 16.2 12 21 12 21z"/></svg>
          <svg class="sb-pop sb-heart h2" viewBox="0 0 24 22" aria-hidden="true"><path d="M12 21s-8-4.8-10-9.6C.8 8 2.6 4.6 6 4.6c2.2 0 3.6 1.2 4.2 2.4.7-1.2 2-2.4 4.2-2.4 3.4 0 5.2 3.4 4 6.8C20 16.2 12 21 12 21z"/></svg>
          <svg class="sb-pop sb-star" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1.5l2.6 7.2 7.6.3-6 4.7 2.1 7.4L12 16.8 5.7 21.1l2.1-7.4-6-4.7 7.6-.3z"/></svg>
        </article>`;

export function mountHero() {
  const hero = document.querySelector('.hero');
  hero.classList.add('hero--combo');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) hero.classList.add('hero--static');
  hero.innerHTML = `
    <div class="hv hv-combo">
      <div class="cb-scene">${SCENE()}
      </div>
      <div class="mag-stage"><div class="mag-book">${COVER()}</div></div>
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
  const wrap = stage.querySelector('.mag-stage');
  // area sampul (tanpa transform) = jendela tempat adegan matahari mengintip dari "halaman dalam"
  const inset = () => {
    const L = wrap.offsetLeft, T = wrap.offsetTop, W = wrap.offsetWidth, H = wrap.offsetHeight;
    return `inset(${T}px ${stage.offsetWidth - L - W}px ${stage.offsetHeight - T - H}px ${L}px round 6px 18px 18px 6px)`;
  };
  gsap.set('.cb-scene', { clipPath: inset });
  gsap.set('.mag-cover', { transformPerspective: 1800, transformOrigin: '0% 50%' });
  gsap.set(book, { y: 180, rotation: -5, opacity: 0 });
  gsap.set('.sb-paper, .sb-news', { opacity: 0 });
  gsap.set('.sb-l', { scale: 0.3, y: 30, opacity: 0 });
  gsap.set('.sb-pop', { scale: 0, opacity: 0 });
  gsap.set('.sb-label', { opacity: 0, y: 14 });
  // adegan matahari sudah utuh & penuh warna di balik sampul (tanpa fade); hanya teks/tombol yang muncul belakangan
  gsap.set('.pt-ui', { opacity: 0 });

  const intro = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
  intro
    .to(book, { y: 0, rotation: 0, opacity: 1, duration: 1.3, ease: 'power4.out' }, 0.1)
    .to('.sb-paper, .sb-news', { opacity: 1, duration: 0.8 }, 0.5)
    .to('.sb-l', { scale: 1, y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: 'back.out(2.2)' }, 0.8)
    .to('.sb-pop', { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'back.out(2.4)' }, 1.3)
    .to('.sb-label', { opacity: 1, y: 0, duration: 0.6 }, 1.5);
  chrome(intro, 1.5);

  gsap
    .timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true }, defaults: { ease: 'none' } })
    // 1) satu gerakan: sampul mengayun terbuka SEKALIGUS jendela halaman dalam melebar sampai layar penuh
    .to('.mag-cover', { rotationY: -165, duration: 0.3, ease: 'power1.inOut' }, 0.02)
    .fromTo('.cb-scene', { clipPath: inset }, { clipPath: 'inset(0px 0px 0px 0px round 0px 0px 0px 0px)', duration: 0.26, ease: 'power2.inOut' }, 0.05)
    .fromTo(wrap, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.02, immediateRender: false }, 0.17)
    .fromTo('.pt-ui', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.08 }, 0.36)
    // 3) (jeda sebentar) lalu kamera masuk ke dalam matahari
    .fromTo('.pt-ui', { opacity: 1, y: 0 }, { opacity: 0, y: -40, duration: 0.06, immediateRender: false }, 0.62)
    .fromTo('.pt-name', { opacity: 1, scale: 1 }, { opacity: 0, scale: 1.7, duration: 0.22, immediateRender: false }, 0.62)
    .fromTo('.pt-me', { scale: 1, yPercent: 0 }, { scale: 1.45, yPercent: 10, duration: 0.26, immediateRender: false }, 0.62)
    .fromTo('.pt-me', { opacity: 1 }, { opacity: 0, duration: 0.1, immediateRender: false }, 0.78)
    .fromTo('.pt-rings', { scale: 1, opacity: 1 }, { scale: 2.2, opacity: 0, duration: 0.2 }, 0.62)
    .fromTo('.pt-clouds', { y: 0 }, { y: -80, duration: 0.38 }, 0.62)
    .fromTo('.pt-glow', { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.64)
    .fromTo('.pt-sun', { scale: 1 }, { scale: coverScale, ease: 'power1.in', duration: 0.34 }, 0.64)
    .fromTo('.pt-sun', { opacity: 1 }, { opacity: 0, duration: 0.06, immediateRender: false }, 0.94);

  parallax([['.pt-me-w', 26, 0], ['.pt-sun-w', 14, 10]]);
  return intro;
}
