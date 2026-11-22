import { siGmail, siInstagram, siGithub } from 'simple-icons';
import { experience } from './data/experience.js';
import { certs, alsoAwards } from './data/achievements.js';
import { profile } from './data/profile.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// LinkedIn tidak ada di paket simple-icons, jadi path glyph-nya ditulis sendiri
const LINKEDIN_PATH =
  'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z';

export function renderAll() {
  // ---- Experience: daftar editorial, klik untuk membuka detail ----
  document.getElementById('exp-list').innerHTML = experience
    .map(
      (e, i) => `<li class="exp-row">
        <span class="exp-line" aria-hidden="true"></span>
        <button class="exp-head" type="button" aria-expanded="false" aria-controls="exp-body-${i}">
          <span class="exp-fill" aria-hidden="true"></span>
          <span class="exp-num">${String(i + 1).padStart(2, '0')}</span>
          <span class="exp-main"><span class="exp-role">${esc(e.role)}</span><span class="exp-org">${esc(e.org)}</span></span>
          <span class="exp-side"><span class="exp-tag">${esc(e.tag)}</span><span class="exp-year">${esc(e.period)}</span></span>
          <span class="exp-plus" aria-hidden="true"></span>
        </button>
        <div class="exp-body" id="exp-body-${i}"><ul>${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></div>
      </li>`
    )
    .join('');

  // ---- Achievements: kartu di carousel silinder ----
  document.getElementById('also-awards').innerHTML = alsoAwards.map((a) => `<span>${esc(a)}</span>`).join('');
  document.getElementById('ci-total').textContent = `/ ${String(certs.length).padStart(2, '0')}`;
  document.getElementById('cert-ring').innerHTML = certs
    .map(
      (c, i) => `<button type="button" class="cert" data-id="${c.id}" data-index="${i}"
          data-title="${esc(c.title)}" data-sub="${esc(c.issuer)}${c.year ? `, ${esc(c.year)}` : ''}" data-badge="${esc(c.badge)}"
          aria-label="Open certificate: ${esc(c.title)}">
        <span class="cert-thumb"><img src="/certs/${c.id}.webp" alt="${esc(c.title)}, ${esc(c.issuer)}" loading="lazy"></span>
        ${c.badge ? `<span class="cert-badge">${esc(c.badge)}</span>` : ''}
        <span class="cert-cap"><strong>${esc(c.title)}</strong><em>${esc(c.issuer)}${c.year ? `, ${esc(c.year)}` : ''}</em></span>
      </button>`
    )
    .join('');
  const first = certs[0];
  document.getElementById('ci-title').textContent = first.title;
  document.getElementById('ci-sub').textContent = `${first.issuer}${first.year ? `, ${first.year}` : ''}`;
  document.getElementById('ci-badge').textContent = first.badge;

  // ---- Contact ----
  const socials = [
    { name: 'Email', href: `mailto:${profile.email}`, path: siGmail.path, hex: '#' + siGmail.hex, ext: false },
    { name: 'LinkedIn', href: profile.social.linkedin, path: LINKEDIN_PATH, hex: '#0A66C2', ext: true },
    { name: 'Instagram', href: profile.social.instagram, path: siInstagram.path, hex: '#E4405F', ext: true },
    { name: 'GitHub', href: profile.social.github, path: siGithub.path, hex: '#F5F0FF', ext: true },
  ];
  document.getElementById('social').innerHTML = socials
    .map(
      (s) => `<li><a class="soc" href="${esc(s.href)}" ${s.ext ? 'target="_blank" rel="noopener"' : ''} aria-label="${s.name}" data-cursor="${s.name}">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="${s.hex}" d="${s.path}"/></svg></a></li>`
    )
    .join('');
}
