import gsap from 'gsap';

// Preloader "matahari terbit": langit malam -> fajar, matahari naik dari horizon, hitung 0-100,
// lalu tirai terangkat. Promise selesai tepat saat tirai mulai naik (agar intro hero menyambung).
export function runLoader() {
  return new Promise((resolve) => {
    const el = document.getElementById('loader');
    const root = document.documentElement;
    if (!el) { root.classList.remove('loading'); resolve(); return; }

    const num = el.querySelector('.ld-count b');
    const count = { v: 0 };
    const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2500))]);

    const tl = gsap.timeline();
    tl.from('.ld-mark', { opacity: 0, y: 16, duration: 0.8, ease: 'power3.out' }, 0)
      .to(count, { v: 100, duration: 2, ease: 'power2.inOut', onUpdate: () => { num.textContent = Math.round(count.v); } }, 0)
      .fromTo('.ld-sun', { yPercent: 110 }, { yPercent: -18, duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo(el, { backgroundImage: 'linear-gradient(180deg, #150C4A 0%, #22145F 55%, #2B1B7A 100%)' },
        { backgroundImage: 'linear-gradient(180deg, #1F5FA8 0%, #B9A6E8 55%, #FFD9B8 100%)', duration: 2, ease: 'power2.inOut' }, 0)
      .fromTo('.ld-horizon', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut' }, 0);

    tl.eventCallback('onComplete', () => {
      fontsReady.then(() => {
        resolve();
        gsap.timeline({ onComplete: () => { el.remove(); root.classList.remove('loading'); } })
          .to(['.ld-count', '.ld-mark'], { yPercent: -60, opacity: 0, duration: 0.5, ease: 'power2.in' }, 0)
          .fromTo(el, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.1, ease: 'power4.inOut' }, 0.15);
      });
    });
  });
}
