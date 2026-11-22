import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

const finePointer = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

// Huruf melompat & sedikit berputar saat disentuh kursor, lalu kembali dengan pegas.
export function hoverChars(chars) {
  if (!finePointer()) return;
  chars.forEach((c) =>
    c.addEventListener('mouseenter', () => {
      if (c._hop) return;
      c._hop = gsap
        .timeline({ onComplete: () => { c._hop = null; } })
        .to(c, { yPercent: -24, rotation: gsap.utils.random(-12, 12), color: '#FF9ED1', duration: 0.18, ease: 'power2.out' })
        .to(c, { yPercent: 0, rotation: 0, color: '', duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    })
  );
}

// Judul: tiap huruf membalik 3D dari bawah (rotationX), lalu bisa di-hover.
export function flipChars(target, trigger, start = 'top 75%') {
  const split = SplitText.create(target, { type: 'words,chars', wordsClass: 'word', charsClass: 'ch' });
  gsap.from(split.chars, {
    rotationX: -100, yPercent: 50, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 500,
    duration: 1, stagger: 0.028, ease: 'back.out(1.8)',
    scrollTrigger: { trigger: trigger || target, start },
  });
  hoverChars(split.chars);
  return split;
}

// Paragraf: kata menyala dari redup ke terang mengikuti scroll.
export function scrubWords(target) {
  const split = SplitText.create(target, { type: 'words' });
  gsap.fromTo(split.words, { opacity: 0.14 }, {
    opacity: 1, ease: 'none', stagger: 0.1,
    scrollTrigger: { trigger: target, start: 'top 82%', end: 'bottom 45%', scrub: true },
  });
  return split;
}

// Paragraf: baris naik dari balik masker.
export function maskLines(target, trigger, start = 'top 80%') {
  return SplitText.create(target, {
    type: 'lines', mask: 'lines', autoSplit: true,
    onSplit: (self) =>
      gsap.from(self.lines, {
        yPercent: 110, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: trigger || target, start },
      }),
  });
}
