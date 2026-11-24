import gsap from 'gsap';

// Galeri "Moments": foto-foto dimasukkan ke src/assets/gallery (otomatis terbaca, tanpa edit kode).
// Efek terowongan 3D: foto tersebar kiri-kanan-atas-bawah, bergerak dari kejauhan menuju kamera (membesar saat mendekat),
// lalu lewat dan menghilang. Tiap saat hanya beberapa foto yang terlihat; di akhir tidak ada yang tersisa.
const files = import.meta.glob('../assets/gallery/*.{jpg,jpeg,png,webp,avif}', { eager: true, query: '?url', import: 'default' });
const MIN_CARDS = 8;      // jika foto lebih sedikit, foto diulang agar terowongan tidak terlalu sepi
const Z_START = -1140;    // kedalaman foto pertama saat awal
const Z_FAR = -1700;      // lebih jauh dari ini: tak terlihat
const Z_NEAR = 500;       // lewat ini: sudah melewati kamera, tak terlihat
// jarak kedalaman antar foto (besar = lebih sedikit foto terlihat bersamaan, tidak bertumpuk); layar HP lebih sempit jadi lebih jarang
const gapNow = () => (innerWidth <= 720 ? 430 : 235);
const zPerPx = () => (innerWidth <= 720 ? 1.9 : 1.1); // kecepatan: kedalaman per piksel scroll (panjang section otomatis mengikuti jumlah foto)

export function renderGallery() {
  const sec = document.getElementById('gallery');
  const urls = Object.keys(files).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })).map((k) => files[k]);
  if (!urls.length) {
    sec?.remove();
    document.querySelectorAll('a[href="#gallery"]').forEach((a) => a.remove());
    return false;
  }
  const total = Math.max(urls.length, MIN_CARDS);
  document.getElementById('gal-field').innerHTML = Array.from({ length: total }, (_, i) => {
    const dup = i >= urls.length;
    return `<figure class="gal-card"${dup ? ' aria-hidden="true"' : ''}><img src="${urls[i % urls.length]}" alt="${dup ? '' : `Photo ${i + 1}`}" loading="lazy" decoding="async"></figure>`;
  }).join('');
  return true;
}

// acak deterministik (hasil sama tiap muat)
const rnd = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };
const clamp = gsap.utils.clamp(0, 1);

export function initGallery({ animate }) {
  const sec = document.getElementById('gallery');
  if (!sec) return;
  if (!animate) { sec.classList.add('gallery--static'); return; }

  const cards = gsap.utils.toArray('.gal-card');
  const N = cards.length;
  let GAP = gapNow(), travel = 0;
  const size = () => { GAP = gapNow(); travel = (N - 1) * GAP + (Z_NEAR - Z_START); sec.style.height = `${Math.round(travel / zPerPx() + innerHeight)}px`; };
  size();
  const zSet = cards.map((c) => gsap.quickSetter(c, 'z', 'px'));
  const state = { p: 0 };

  // Penempatan: tiap foto dipilihkan posisi (arah + jarak dari tengah) yang paling sedikit bertabrakan dengan foto lain
  // yang lewat bersamaan. Proyeksi perspektif dihitung langsung, jadi tak ada dua foto yang saling menutup.
  const PERSP = 1200;
  const place = () => {
    const W = innerWidth, H = innerHeight, mob = W <= 720;
    const cw = cards[0].offsetWidth || Math.min(250, Math.max(140, W * 0.16));
    // ukuran tiap foto yang sebenarnya (rasio asli, dibatasi tinggi maksimum)
    const dims = cards.map((c) => {
      const im = c.querySelector('img');
      const ratio = im.naturalWidth ? im.naturalHeight / im.naturalWidth : 0.9;
      return { w: cw, h: Math.min(cw * ratio, H * (mob ? 0.4 : 0.56)) };
    });
    const cand = [];
    for (let r = 0; r < 6; r++) for (let a = 0; a < 30; a++) {
      const ang = (a / 30) * Math.PI * 2, rad = [0.05, 0.14, 0.23, 0.32, 0.4, 0.47][r];
      cand.push({ x: Math.cos(ang) * rad * W * (mob ? 1.0 : 1.2), y: Math.sin(ang) * rad * H * 1.05 });
    }
    const rect = (c, d, z) => { const k = PERSP / (PERSP - z), m = 14 * k; return { l: c.x * k - (d.w * k) / 2 - m, r: c.x * k + (d.w * k) / 2 + m, t: c.y * k - (d.h * k) / 2 - m, b: c.y * k + (d.h * k) / 2 + m }; };
    const ov = (A, B) => { const w = Math.min(A.r, B.r) - Math.max(A.l, B.l), h = Math.min(A.b, B.b) - Math.max(A.t, B.t); return w > 0 && h > 0 ? (w * h) / Math.min((A.r - A.l) * (A.b - A.t), (B.r - B.l) * (B.b - B.t)) : 0; };
    const ZS = [-1500, -1250, -1100, -800, -550, -300, -80, 120];
    const placed = new Array(cards.length);
    const costOf = (i, cd, ci) => {
      let cost = (rnd(i, ci) - 0.5) * 0.02;
      ZS.forEach((z) => {
        const R = rect(cd, dims[i], z);
        if (z > -600 && z < 150) {                                    // saat besar & jelas, jangan keluar layar
          const out = Math.max(0, -W / 2 - R.l) + Math.max(0, R.r - W / 2) + Math.max(0, -H / 2 - R.t) + Math.max(0, R.b - H / 2);
          cost += (out / W) * 3;
        }
        for (let j = Math.max(0, i - 10); j <= Math.min(cards.length - 1, i + 10); j++) {
          if (j === i || !placed[j]) continue;
          cost += ov(R, rect(placed[j], dims[j], z + (i - j) * GAP)) * 6;
        }
      });
      return cost;
    };
    const choose = (i) => {
      let best = null, bestCost = Infinity;
      cand.forEach((cd, ci) => {
        if (i < (mob ? 1 : 3) && Math.hypot(cd.x / W, cd.y / H) > [0.12, 0.3, 0.32][i]) return;     // foto pertama dekat tengah: layar awal tidak kosong
        const cost = costOf(i, cd, ci);
        if (cost < bestCost) { bestCost = cost; best = cd; }
      });
      return best;
    };
    cards.forEach((_, i) => { placed[i] = choose(i); });               // putaran 1: berurutan
    for (let round = 0; round < 6; round++) cards.forEach((_, i) => { placed[i] = choose(i); });   // penyempurnaan: lihat foto di depan & belakang
    cards.forEach((c, i) => gsap.set(c, { xPercent: -50, yPercent: -50, x: placed[i].x, y: placed[i].y, rotation: (rnd(i, 3) - 0.5) * 12, z: Z_FAR, opacity: 0 }));
  };

  const render = () => {
    cards.forEach((c, i) => {
      const z = Z_START - i * GAP + state.p * travel;
      const op = Math.min(clamp((z - Z_FAR) / 560), clamp((Z_NEAR - z) / 430));
      zSet[i](z);
      c.style.opacity = op;
      c.style.visibility = op <= 0.01 ? 'hidden' : 'visible';
    });
  };

  place(); render();
  let pending = cards.filter((c) => !c.querySelector('img').complete).length;
  const settle = () => { place(); render(); };
  cards.forEach((c) => { const im = c.querySelector('img'); if (!im.complete) im.addEventListener('load', () => { if (--pending <= 0) settle(); }, { once: true }); });
  if (document.fonts) document.fonts.ready.then(settle);
  window.addEventListener('resize', () => { size(); place(); render(); });

  gsap
    .timeline({ scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: 0.7, invalidateOnRefresh: true, onRefresh: () => { size(); place(); render(); } }, defaults: { ease: 'none' } })
    .fromTo('.gal-title', { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.15 }, 0)
    .to(state, { p: 1, duration: 1, onUpdate: render }, 0)
    .to('.gal-title', { scale: 1.25, duration: 1 }, 0);
}
