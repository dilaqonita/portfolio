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
    .map((e, i) => {
      const no = String(i + 1).padStart(2, '0');
      const year = (e.period.match(/\d{4}/) || [''])[0];
      const colors = ['#FF9ED1', '#FFD9B8', '#9CCBFF', '#C9B6F5', '#FFE08A'];
      return `<li class="bp-row" style="--i:${i};--tk:${colors[i % colors.length]}">
        <div class="bp-card" role="button" tabindex="0" aria-pressed="false" aria-label="${esc(e.role)}, ${esc(e.org)}. Press to flip the ticket">
          <div class="bp-flip">
            <div class="bp-face bp-front">
              <div class="bp-main">
                <div class="bp-top"><span class="bp-brand">Boarding Pass</span><span class="bp-plane" aria-hidden="true">✈︎</span></div>
                <h3 class="bp-role">${esc(e.role)}</h3>
                <p class="bp-org">${esc(e.org)}</p>
                <div class="bp-fields">
                  <div><small>Class</small><b>${esc(e.tag)}</b></div>
                  <div><small>Period</small><b>${esc(e.period)}</b></div>
                  <div><small>Seat</small><b>${no}</b></div>
                </div>
              </div>
              <div class="bp-stub" aria-hidden="true"><span class="bp-no">No. ${no}</span><span class="bp-year">${year}</span><i class="bp-bars"></i><span class="bp-hint">Tap to flip ↻</span></div>
            </div>
            <div class="bp-face bp-back" aria-hidden="true">
              <div class="bp-main">
                <div class="bp-top"><span class="bp-brand">Flight log</span><span class="bp-plane" aria-hidden="true">✈︎</span></div>
                <ul class="bp-list">${e.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
              </div>
              <div class="bp-stub" aria-hidden="true"><span class="bp-no">No. ${no}</span><span class="bp-year">${year}</span><i class="bp-bars"></i><span class="bp-hint">Tap to flip back ↻</span></div>
            </div>
          </div>
          <span class="bp-dim" aria-hidden="true"></span>
        </div>
      </li>`;
    })
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
