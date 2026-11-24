import gsap from 'gsap';

// Zoom "PORTFOLIO": isi Selected Projects (dinding screenshot) hanya terlihat lewat huruf raksasa (mask SVG);
// di luar huruf = langit asli, jadi tidak ada tepi warna dengan section di atas/bawahnya.
// Saat di-scroll, kamera zoom masuk ke batang huruf "T" sampai lubangnya menelan layar.
export function initFolio({ animate }) {
  const fz = document.getElementById('folio');
  if (!fz) return;
  const stick = fz.querySelector('.fz-stick');
  const svg = fz.querySelector('.fz-svg');
  const under = fz.querySelector('.fz-under');

  if (!animate) {            // tanpa animasi: tampilkan isinya biasa
    stick.appendChild(under);
    svg.remove();
    fz.classList.add('fz--static');
    return;
  }

  const t = svg.querySelector('#fz-t');
  const mask = svg.querySelector('#fz-m');
  const mr = svg.querySelector('#fz-mr');
  const full = svg.querySelector('#fz-full');
  const fo = svg.querySelector('#fz-fo');
  const wall = fz.querySelector('.wall');
  const intro = fz.querySelector('.proj-intro-text');
  const state = { p: 0 };
  let ox = 0, oy = 0, S = 80;

  const apply = () => {
    const s = Math.pow(S, state.p);
    t.setAttribute('transform', `translate(${ox} ${oy}) scale(${s}) translate(${-ox} ${-oy})`);
  };

  const layout = () => {
    const W = stick.clientWidth, H = stick.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    mask.setAttribute('x', 0); mask.setAttribute('y', 0); mask.setAttribute('width', W); mask.setAttribute('height', H);
    [mr, full, fo].forEach((el) => { el.setAttribute('width', W); el.setAttribute('height', H); });
    t.removeAttribute('transform');
    t.style.fontFamily = 'Fraunces, Georgia, serif';
    t.style.fontWeight = '800';
    t.style.letterSpacing = '-0.03em';
    t.setAttribute('font-size', 100);
    t.setAttribute('x', W / 2);
    t.setAttribute('y', H / 2);
    const len = t.getComputedTextLength() || 1;
    const fs = Math.min((W * (W < 720 ? 0.94 : 0.9) * 100) / len, H * 0.6);
    t.setAttribute('font-size', fs);
    t.setAttribute('y', H / 2 + fs * 0.34);
    // titik zoom = tengah batang huruf "T" (indeks 3), hampir di tengah layar agar lubangnya membuka merata
    const ex = t.getExtentOfChar(3);
    ox = ex.x + ex.width / 2;
    oy = ex.y + ex.height / 2;
    const stem = Math.max(fs * 0.11, 4);
    // dibatasi: glyph > ~16000px gagal dirender browser; sisa celah ditutup dengan memunculkan isi penuh di ujung zoom
    S = Math.min((1.25 * 2 * Math.max(ox, W - ox)) / stem, 11000 / fs);
    apply();
  };

  layout();
  document.fonts?.ready.then(() => { layout(); });
  window.addEventListener('resize', layout);

  gsap
    .timeline({ scrollTrigger: { trigger: fz, start: 'top top', end: 'bottom bottom', scrub: 0.6, invalidateOnRefresh: true, onRefresh: layout }, defaults: { ease: 'none' } })
    .to({}, { duration: 0.14 })
    .to(state, { p: 1, duration: 0.74, ease: 'none', onUpdate: apply })
    .fromTo(under, { scale: 1.22 }, { scale: 1, duration: 0.74, ease: 'power1.out', transformOrigin: '50% 50%' }, 0.14)
    // dinding proyek jelas saat mengintip lewat huruf, lalu meredup seperti tampilan Selected Projects
    .fromTo(wall, { opacity: 0.95 }, { opacity: 0.36, duration: 0.5 }, 0.4)
    .fromTo(intro, { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.66)
    // celah tepi terakhir: isi muncul penuh (mask memutih), Selected Projects terbuka sepenuhnya
    // warna dasar isi huruf memudar: yang terlihat tinggal langit asli (menyatu dengan daftar proyek di bawahnya)
    .fromTo(under, { '--bgo': 1 }, { '--bgo': 0, duration: 0.2, immediateRender: false }, 0.72)
    .fromTo(full, { opacity: 0 }, { opacity: 1, duration: 0.2, immediateRender: false }, 0.72)
    .to({}, { duration: 0.08 });
}
