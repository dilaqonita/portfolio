import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { hoverChars } from './text.js';

// Karakter 2.5D: kepala/mata mengikuti kursor (parallax berlapis), berkedip, bernapas.
// Kursor di atas karakter membuka "lensa" berisi foto asli. Sentuh/tap atau tombol = buka penuh.
export function initAbout({ animate }) {
  const wrap = document.querySelector('#avatar');
  if (!wrap) return;
  const photo = wrap.querySelector('.photo');
  const ring = wrap.querySelector('.lens-ring');
  const dur = (s) => (animate ? s : 0);

  // ---------- lensa foto ----------
  const st = { x: wrap.clientWidth / 2, y: wrap.clientHeight * 0.4, r: 0 };
  let full = false;
  const size = () => ({ w: wrap.clientWidth, h: wrap.clientHeight });
  const apply = () => {
    photo.style.clipPath = `circle(${st.r}px at ${st.x}px ${st.y}px)`;
    const big = st.r > Math.max(size().w, size().h) * 0.6;
    ring.style.width = ring.style.height = `${st.r * 2}px`;
    ring.style.left = `${st.x - st.r}px`;
    ring.style.top = `${st.y - st.r}px`;
    ring.style.opacity = st.r > 8 && !big ? 1 : 0;
  };
  const lensR = () => size().w * 0.3;
  const local = (e) => {
    const b = wrap.getBoundingClientRect();
    return { x: e.clientX - b.left, y: e.clientY - b.top };
  };
  const setFull = (on, at) => {
    full = on;
    const { w, h } = size();
    gsap.to(st, {
      r: on ? Math.hypot(w, h) : 0,
      x: at ? at.x : w / 2,
      y: at ? at.y : h * 0.4,
      duration: dur(0.9), ease: 'power3.inOut', onUpdate: apply, overwrite: true,
    });
    wrap.setAttribute('aria-pressed', String(on));
  };

  wrap.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setFull(!full); } });
  wrap.addEventListener('click', (e) => { if (e.pointerType !== undefined) setFull(!full, local(e)); });

  if (animate) {
    wrap.addEventListener('pointerenter', (e) => {
      if (full || e.pointerType !== 'mouse') return;
      const p = local(e);
      gsap.set(st, { x: p.x, y: p.y });
      gsap.to(st, { r: lensR(), duration: 0.7, ease: 'back.out(1.7)', onUpdate: apply, overwrite: 'auto' });
    });
    wrap.addEventListener('pointermove', (e) => {
      if (full || e.pointerType !== 'mouse') return;
      const p = local(e);
      gsap.to(st, { x: p.x, y: p.y, duration: 0.25, ease: 'power3.out', onUpdate: apply, overwrite: 'auto' });
    });
    wrap.addEventListener('pointerleave', (e) => {
      if (full || e.pointerType !== 'mouse') return;
      gsap.to(st, { r: 0, duration: 0.45, ease: 'power3.in', onUpdate: apply, overwrite: 'auto' });
    });
  }
  apply();

  if (!animate) return;

  // ---------- ikuti kursor (2.5D: tiap lapis bergerak beda jarak) ----------
  gsap.set('#c-head', { svgOrigin: '200 300' });
  const q = (sel, prop, d = 0.7) => gsap.quickTo(sel, prop, { duration: d, ease: 'power3' });
  const headX = q('#c-head', 'x'), headY = q('#c-head', 'y'), headR = q('#c-head', 'rotation');
  const eyeX = q('#c-eyes', 'x', 0.35), eyeY = q('#c-eyes', 'y', 0.35);
  const bodyX = q('#c-body', 'x'), bgX = q('#c-bg', 'x'), bgY = q('#c-bg', 'y');
  const chips = gsap.utils.toArray('.chip-float').map((el) => ({
    d: Number(el.dataset.depth) || 1, x: q(el, 'x', 0.9), y: q(el, 'y', 0.9),
  }));

  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      const b = wrap.getBoundingClientRect();
      const nx = gsap.utils.clamp(-1, 1, (e.clientX - (b.left + b.width / 2)) / (innerWidth * 0.45));
      const ny = gsap.utils.clamp(-1, 1, (e.clientY - (b.top + b.height / 2)) / (innerHeight * 0.45));
      headX(nx * 9); headY(ny * 5); headR(nx * 4);
      eyeX(nx * 3.5); eyeY(ny * 3);
      bodyX(nx * 4);
      bgX(nx * -12); bgY(ny * -8);
      chips.forEach((c) => { c.x(nx * 24 * c.d); c.y(ny * 16 * c.d); });
    });
  }

  // ---------- hidup: bernapas + berkedip ----------
  gsap.to('#c-body-idle', { y: -3, duration: 2.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('#c-head-idle', { y: -5, rotation: 0.8, svgOrigin: '200 300', duration: 2.4, delay: 0.2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.timeline({ repeat: -1, repeatDelay: 3.4 })
    .to('.eye', { scaleY: 0.08, transformOrigin: '50% 50%', duration: 0.07, yoyo: true, repeat: 1 });

  // ---------- masuk saat di-scroll ----------
  const heading = SplitText.create('.about-text .h2', { type: 'words,chars', wordsClass: 'word', charsClass: 'ch' });
  hoverChars(heading.chars);
  gsap.timeline({ scrollTrigger: { trigger: '.about', start: 'top 62%' } })
    .from('.poster-word', { opacity: 0, yPercent: 14, duration: 1.5, ease: 'power3.out' }, 0)
    .from(wrap, { y: 70, scale: 0.9, opacity: 0, duration: 1.1, ease: 'power3.out' }, 0.1)
    .from('#c-bg circle:last-child', { scale: 0.5, transformOrigin: '50% 50%', svgOrigin: '200 176', duration: 1.2, ease: 'back.out(1.6)' }, 0.2)
    .from('.chip-float', { scale: 0, opacity: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(2)' }, 0.7)
    .from(heading.chars, { rotationX: -100, yPercent: 50, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 500, duration: 1, stagger: 0.05, ease: 'back.out(1.8)' }, 0.3)
    .from('.chapters', { y: 28, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.8);

  const mm = gsap.matchMedia();
  const section = document.querySelector('.about');
  const chs = gsap.utils.toArray('.chapter');
  const kind = '.kind-u path';

  // ---------- desktop: section terkunci, 3 bab berganti dengan sendirinya; matahari di balik bingkai bergeser fajar -> senja ----------
  mm.add('(min-width: 901px)', () => {
    section.classList.add('pin');
    const sun = document.querySelector('#c-bg circle:last-child');
    const out = { autoAlpha: 0, y: -34, duration: 0.3, ease: 'power2.in' };
    const into = { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' };
    gsap.set(chs.slice(1), { autoAlpha: 0 });

    gsap
      .timeline({
        defaults: { ease: 'none' },
        scrollTrigger: { trigger: section, pin: true, start: 'top top', end: () => `+=${Math.round(innerHeight * 2.2)}`, scrub: 0.8, anticipatePin: 1, invalidateOnRefresh: true },
      })
      .to(chs[0], out, 0.85)
      .fromTo(chs[1], { autoAlpha: 0, y: 34 }, into, 1.05)
      .to(chs[1], out, 1.85)
      .fromTo(chs[2], { autoAlpha: 0, y: 34 }, into, 2.05)
      .to(sun, { attr: { cy: 210 }, fill: '#FFB27A', duration: 1 }, 0.5)
      .to(sun, { attr: { cy: 262 }, fill: '#FF9ED1', duration: 1 }, 1.5)
      .to('.poster-word', { xPercent: -9, duration: 3 }, 0)
      .fromTo(kind, { drawSVG: '0%' }, { drawSVG: '100%', duration: 0.5 }, 2.3);

    return () => {
      section.classList.remove('pin');
      gsap.set([chs, sun, kind, '.poster-word'], { clearProps: 'all' });
    };
  });

  // ---------- HP / tablet: bab tersusun ke bawah, muncul bergantian ----------
  mm.add('(max-width: 900px)', () => {
    chs.forEach((c) => gsap.from(c, { y: 34, opacity: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 86%' } }));
    gsap.fromTo(kind, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power2.inOut', scrollTrigger: { trigger: '.kind-u', start: 'top 85%' } });
  });
}
