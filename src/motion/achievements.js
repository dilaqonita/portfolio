import gsap from 'gsap';
import { flipChars } from './text.js';

// Sertifikat: section terkunci, 17 kartu berputar di silinder 3D mengikuti scroll,
// teks raksasa bergeser di belakang, judul aktif "scramble". Klik kartu = lightbox.
export function initAchievements({ animate }) {
  const stage = document.getElementById('cert-stage');
  const ring = document.getElementById('cert-ring');
  const cards = [...ring.querySelectorAll('.cert')];
  const N = cards.length;
  const dur = (s) => (animate ? s : 0);

  const info = {
    n: document.getElementById('ci-n'),
    title: document.getElementById('ci-title'),
    sub: document.getElementById('ci-sub'),
    badge: document.getElementById('ci-badge'),
  };
  let active = 0;
  const showInfo = (i) => {
    if (i === active) return;
    active = i;
    const c = cards[i];
    info.n.textContent = String(i + 1).padStart(2, '0');
    info.badge.textContent = c.dataset.badge;
    info.badge.style.display = c.dataset.badge ? '' : 'none';
    info.sub.textContent = c.dataset.sub;
    gsap.to(info.title, { duration: 0.6, scrambleText: { text: c.dataset.title, chars: 'upperAndLowerCase', speed: 0.9 }, overwrite: true });
    gsap.fromTo(info.n, { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: 'power3.out', overwrite: true });
  };
  info.badge.style.display = cards[0].dataset.badge ? '' : 'none';

  // ---------- silinder 3D ----------
  if (animate) {
    stage.classList.add('ring-3d');
    flipChars('.achievements .h2', '.achievements');

    const step = 360 / N;
    const state = { rot: 0 };
    let R = 0;
    const setRot = cards.map((c) => gsap.quickSetter(c, 'rotationY', 'deg'));

    const layout = () => {
      const cw = cards[0].offsetWidth;
      R = (cw / 2 / Math.tan(Math.PI / N)) * 1.1;
      gsap.set(cards, { transformOrigin: `50% 50% ${-R}px` });
      render();
    };
    const render = () => {
      cards.forEach((c, i) => {
        const a = i * step + state.rot;
        const front = Math.cos((a * Math.PI) / 180);
        setRot[i](a);
        c.style.opacity = gsap.utils.mapRange(-1, 1, 0.08, 1, front);
        c.style.pointerEvents = front > 0.75 ? 'auto' : 'none';
      });
      const idx = ((Math.round(-state.rot / step) % N) + N) % N;
      showInfo(idx);
    };

    gsap.set(ring, { rotationX: -7 });
    layout();
    window.addEventListener('resize', layout);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: stage, pin: true, start: 'top top', end: () => `+=${N * 170}`,
        scrub: 0.9, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
    tl.to(state, { rot: -(N - 1) * step, ease: 'none', onUpdate: render }, 0)
      .fromTo('.cert-bgword', { xPercent: 0 }, { xPercent: -45, ease: 'none' }, 0);

    // masuk: silinder mengembang & berputar sedikit sebelum pin dimulai
    // (dianimasikan pada .ring-view agar tidak bentrok dengan opacity per kartu dari render())
    gsap.from('.ring-view', {
      scale: 0.55, opacity: 0, y: 80, duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: stage, start: 'top 75%' },
    });
    gsap.from(['.also', '.cert-info'], { y: 30, opacity: 0, duration: 0.8, stagger: 0.12, scrollTrigger: { trigger: stage, start: 'top 60%' } });
  }

  // ---------- lightbox ----------
  const lb = document.getElementById('lightbox');
  const img = lb.querySelector('.lb-img');
  const backdrop = lb.querySelector('.lb-backdrop');
  const capTitle = lb.querySelector('.lb-caption strong');
  const capSub = lb.querySelector('.lb-caption span');
  const ui = lb.querySelectorAll('.lb-btn, .lb-caption');
  let current = null;
  let isOpen = false;

  const fit = (nw, nh) => {
    if (!nw || !nh) { nw = 4; nh = 3; }
    const s = Math.min((innerWidth * 0.9) / nw, (innerHeight * 0.74) / nh, 2);
    const w = nw * s, h = nh * s;
    return { left: (innerWidth - w) / 2, top: Math.max(16, (innerHeight - h) / 2 - 24), width: w, height: h };
  };
  const setCaption = (card) => { capTitle.textContent = card.dataset.title; capSub.textContent = card.dataset.sub; };
  const loadFull = (card) => {
    const f = new Image();
    f.onload = () => {
      if (current !== card || !isOpen) return;
      img.src = f.src;
      gsap.to(img, { ...fit(f.naturalWidth, f.naturalHeight), duration: dur(0.3), overwrite: 'auto' });
    };
    f.src = `/certs/${card.dataset.id}-full.webp`;
  };
  const thumbRect = (card) => card.querySelector('.cert-thumb img').getBoundingClientRect();

  const open = (card) => {
    const ti = card.querySelector('.cert-thumb img');
    current = card; isOpen = true;
    setCaption(card);
    img.src = ti.currentSrc || ti.src; img.alt = ti.alt;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('lb-open');
    window.dispatchEvent(new CustomEvent('scroll-lock', { detail: true }));
    gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: dur(0.4) });
    gsap.fromTo(img, { ...thumbRect(card), opacity: 1, borderRadius: 10, x: 0 }, { ...fit(ti.naturalWidth, ti.naturalHeight), borderRadius: 14, duration: dur(0.75), ease: 'power3.inOut', overwrite: true });
    gsap.fromTo(ui, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: dur(0.5), delay: dur(0.35), stagger: 0.04, overwrite: true });
    loadFull(card);
    lb.querySelector('.lb-close').focus({ preventScroll: true });
  };

  const close = () => {
    if (!isOpen) return;
    isOpen = false;
    const card = current;
    const done = () => {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('lb-open');
      window.dispatchEvent(new CustomEvent('scroll-lock', { detail: false }));
      card?.focus({ preventScroll: true });
    };
    gsap.to(ui, { opacity: 0, duration: dur(0.2), overwrite: true });
    gsap.to(backdrop, { opacity: 0, duration: dur(0.45), delay: dur(0.15) });
    const r = card && thumbRect(card);
    if (r && r.width > 0 && Number(card.style.opacity || 1) > 0.5) {
      gsap.to(img, { ...r, x: 0, borderRadius: 10, duration: dur(0.6), ease: 'power3.inOut', onComplete: done, overwrite: true });
    } else {
      gsap.to(img, { opacity: 0, duration: dur(0.3), onComplete: done, overwrite: true });
    }
  };

  const go = (dir) => {
    const next = cards[(cards.indexOf(current) + dir + N) % N];
    current = next;
    const ti = next.querySelector('.cert-thumb img');
    setCaption(next);
    gsap.to(img, {
      opacity: 0, x: -dir * 70, duration: dur(0.22), ease: 'power2.in', overwrite: true,
      onComplete: () => {
        img.src = ti.currentSrc || ti.src; img.alt = ti.alt;
        gsap.set(img, { ...fit(ti.naturalWidth, ti.naturalHeight), x: dir * 70 });
        gsap.to(img, { opacity: 1, x: 0, duration: dur(0.4), ease: 'power3.out' });
        loadFull(next);
      },
    });
  };

  cards.forEach((c) => c.addEventListener('click', () => open(c)));
  lb.querySelector('.lb-close').addEventListener('click', close);
  backdrop.addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => go(-1));
  lb.querySelector('.lb-next').addEventListener('click', () => go(1));
  window.addEventListener('keydown', (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') go(-1);
    else if (e.key === 'ArrowRight') go(1);
  });
  window.addEventListener('resize', () => {
    if (!isOpen) return;
    const ti = current.querySelector('.cert-thumb img');
    gsap.set(img, fit(ti.naturalWidth, ti.naturalHeight));
  });
  let sx = 0;
  lb.addEventListener('pointerdown', (e) => { sx = e.clientX; });
  lb.addEventListener('pointerup', (e) => {
    const d = e.clientX - sx;
    if (e.pointerType === 'touch' && Math.abs(d) > 60) go(d < 0 ? 1 : -1);
  });
}
