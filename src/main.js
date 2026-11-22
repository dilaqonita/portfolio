import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Flip } from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import Lenis from 'lenis';
import './styles/main.css';
import { hangingLogos } from './data/logos.js';
import { projects } from './data/projects.js';
import { initHero } from './motion/hero.js';
import { initTicker } from './motion/ticker.js';
import { initSky } from './motion/sky.js';
import { initProjects } from './motion/projects.js';
import { initInteract } from './motion/interact.js';
import { initAbout } from './motion/about.js';
import { initExperience } from './motion/experience.js';
import { initAchievements } from './motion/achievements.js';
import { initContact } from './motion/contact.js';
import { renderAll } from './render.js';
import { runLoader } from './motion/loader.js';
import { initPolish } from './motion/polish.js';
import { initSprings } from './motion/springs.js';
import { initMenu } from './motion/menu.js';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Draggable, InertiaPlugin, Flip, MotionPathPlugin, DrawSVGPlugin);

renderAll();

// ---- render: logo gantung ----
// Wind chime: tali berbeda panjang, bola kaca, label pastel (peach / blue / pink) sesuai tema
const TONES = ['peach', 'blue', 'pink'];
const logoHtml = hangingLogos
  .map((l, i) => {
    const len = 34 + ((i * 37) % 5) * 14; // panjang tali bervariasi, berulang konsisten untuk loop
    return `<div class="hang ${TONES[i % 3]}" style="--len:${len}px"><div class="hang-in">
      <span class="string"></span>
      <span class="orb"><svg class="logo-svg" viewBox="0 0 24 24" role="img" aria-label="${l.name}"><path fill="${l.hex}" d="${l.path}"/></svg></span>
      <span class="logo-name">${l.name}</span></div></div>`;
  })
  .join('');
document.getElementById('logo-track').innerHTML = logoHtml + logoHtml; // digandakan agar loop mulus

// ---- render: proyek ----
const wallImgs = projects.filter((p) => p.image).map((p) => p.image);
document.getElementById('wall-grid').innerHTML = [...wallImgs, ...wallImgs, ...wallImgs]
  .slice(0, 12)
  .map((src) => `<img src="${src}" alt="" loading="lazy">`)
  .join('');

document.getElementById('project-list').innerHTML = projects
  .map((p, i) => {
    const num = String(i + 1).padStart(2, '0');
    const stack = p.stack.join(' / ');
    const bullets = p.bullets.map((b) => `<p>${b}</p>`).join('');
    const hasImg = Boolean(p.image);
    const shot = hasImg
      ? `<div class="shot"><div class="shot-bar"><i></i><i></i><i></i></div><img src="${p.image}" alt="Screenshot of ${p.title}" loading="lazy"></div>`
      : '';
    const action = p.url
      ? `<a class="more" href="${p.url}" target="_blank" rel="noopener">Visit project <span aria-hidden="true">↗</span></a>`
      : `<span class="soon">Not live yet</span>`;
    const head = `<span class="num">${num}</span>
        <h3>${p.title}</h3>
        <p class="role">${p.role}${p.year ? `<span class="yr">${p.year}</span>` : ''}</p>`;
    const main = `<div class="bullets">${bullets}</div>
        ${stack ? `<p class="stack">${stack}</p>` : ''}
        ${action}`;
    // proyek tanpa screenshot tampil sebagai baris teks ringkas, bukan poster kosong
    return hasImg
      ? `<article class="pcard">
      <div class="pcard-media">${shot}</div>
      <div class="pcard-body">${head}${main}</div>
    </article>`
      : `<article class="pcard is-text">
      <div class="pcard-body"><div class="pc-head">${head}</div><div class="pc-main">${main}</div></div>
    </article>`;
  })
  .join('');

// ---- smooth scroll + GSAP ----
const mm = gsap.matchMedia();

mm.add('(prefers-reduced-motion: no-preference)', () => {
  const lenis = new Lenis({ lerp: 0.1 });
  lenis.on('scroll', ScrollTrigger.update);
  const lock = (e) => (e.detail ? lenis.stop() : lenis.start());
  window.addEventListener('scroll-lock', lock);
  const tick = (t) => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  document.querySelectorAll('a[href^="#"]').forEach((a) =>
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const target = id.length > 1 && document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: 0 });
      }
    })
  );

  // urutan penting: trigger ber-pin (projects) dibuat sebelum trigger langit agar posisinya ikut ter-refresh benar
  const intro = initHero({ animate: true });
  initProjects({ animate: true });
  initAbout({ animate: true });
  initExperience({ animate: true });
  initAchievements({ animate: true });
  initContact({ animate: true });
  initTicker({ animate: true });
  initSky({ animate: true });
  initInteract();
  initPolish();
  initSprings();
  initMenu({ animate: true });

  // preloader dulu; scroll dikunci sampai tirai mulai naik, lalu intro hero diputar
  lenis.stop();
  scrollTo(0, 0);
  runLoader().then(() => {
    lenis.start();
    intro?.play();
  });

  return () => {
    window.removeEventListener('scroll-lock', lock);
    gsap.ticker.remove(tick);
    lenis.destroy();
  };
});

mm.add('(prefers-reduced-motion: reduce)', () => {
  initMenu({ animate: false });
  document.getElementById('loader')?.remove();
  document.documentElement.classList.remove('loading');
  initHero({ animate: false });
  initTicker({ animate: false });
  initSky({ animate: false });
  initProjects({ animate: false });
  initAbout({ animate: false });
  initExperience({ animate: false });
  initAchievements({ animate: false });
  initContact({ animate: false });
});

document.fonts?.ready.then(() => ScrollTrigger.refresh());
