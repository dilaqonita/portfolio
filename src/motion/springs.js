import { animate, hover, press } from 'motion';

// Motion (penerus Framer Motion, API vanilla JS): interaksi mikro berbasis pegas.
// Sengaja hanya dipasang pada elemen yang transform-nya TIDAK dipegang GSAP, agar keduanya tidak berebut.
const spring = { type: 'spring', stiffness: 420, damping: 16 };
const soft = { type: 'spring', stiffness: 260, damping: 20 };

export function initSprings() {
  // bola kaca di wind chime: membesar & memantul (GSAP hanya mengayun .hang / .hang-in, bukan .orb)
  hover('.hang .orb', (el) => {
    animate(el, { scale: 1.2, rotate: 10 }, spring);
    return () => animate(el, { scale: 1, rotate: 0 }, soft);
  });

  // ikon sosial: svg di dalam tombol berputar & membesar (GSAP memegang .soc untuk efek magnet)
  hover('.soc', (el) => {
    const icon = el.querySelector('svg');
    animate(icon, { scale: 1.22, rotate: -12 }, spring);
    return () => animate(icon, { scale: 1, rotate: 0 }, soft);
  });

  // angka statistik terangkat & berubah warna
  hover('.stats li', (el) => {
    const n = el.querySelector('b');
    animate(n, { y: -6, color: '#D6478C' }, spring);
    return () => animate(n, { y: 0, color: '#13284F' }, soft);
  });

  // kartu proyek: bayangan membesar & nomor berayun (hanya box-shadow / elemen dalam, GSAP memegang scale kartu)
  hover('.pcard', (el) => {
    const num = el.querySelector('.num');
    animate(el, { boxShadow: '0 6px 14px rgba(19,40,79,.12), 0 44px 90px rgba(19,40,79,.28)' }, soft);
    animate(num, { scale: 1.22, rotate: -7 }, spring);
    return () => {
      animate(el, { boxShadow: '0 2px 6px rgba(19,40,79,.08), 0 30px 60px rgba(19,40,79,.16)' }, soft);
      animate(num, { scale: 1, rotate: 0 }, soft);
    };
  });

  // tombol tutup lightbox berputar saat di-hover
  hover('.lb-close', (el) => {
    animate(el, { rotate: 90 }, spring);
    return () => animate(el, { rotate: 0 }, soft);
  });

  // efek tekan (juga di layar sentuh)
  press('.logo, .lb-btn', (el) => {
    animate(el, { scale: 0.86 }, spring);
    return () => animate(el, { scale: 1 }, soft);
  });
  press('.soc', (el) => {
    const icon = el.querySelector('svg');
    animate(icon, { scale: 0.8 }, spring);
    return () => animate(icon, { scale: 1 }, soft);
  });
}
