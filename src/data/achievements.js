// Semua sertifikat dari folder sertif/. Gambar: /certs/<id>.webp (thumbnail) dan /certs/<id>-full.webp (lightbox).
export const certFilters = [
  { key: 'all', label: 'All' },
  { key: 'competition', label: 'Competitions' },
  { key: 'organization', label: 'Organizations' },
  { key: 'learning', label: 'Study & Learning' },
  { key: 'tahfiz', label: 'Tahfiz' },
];

export const certs = [
  { id: 'biometric', cat: 'competition', badge: '1st Place', title: 'Biometric National Essay Competition', issuer: 'Universitas Sebelas Maret', year: '2025' },
  { id: 'msw', cat: 'competition', badge: '2nd Place', title: 'Marine Scientific Writing (Essay)', issuer: 'Universitas Trunojoyo Madura', year: '2025' },
  { id: 'epic', cat: 'competition', badge: '2nd Place', title: 'EPIC Business Plan Competition', issuer: 'Universitas Negeri Malang', year: '2026' },
  { id: 'icc', cat: 'competition', badge: '1st Honorable Mention', title: 'Indonesian Counseling Competition (Essay)', issuer: 'Universitas Ahmad Dahlan', year: '2026' },
  { id: 'nextgen', cat: 'competition', badge: 'Semifinalist', title: 'Nexgen Business Model Canvas', issuer: 'Universitas Ciputra', year: '2025' },
  { id: 'veterinary', cat: 'competition', badge: '2nd Honorable Mention', title: 'VENOL 13th x ASPC Veterinary Olympiad', issuer: 'Universitas Airlangga', year: '2023' },
  { id: 'acustic', cat: 'competition', badge: 'Participant', title: 'Agricultural Scientific Writing Competition (ACUSTIC)', issuer: 'Universitas Sriwijaya', year: '2025' },
  { id: 'osn', cat: 'competition', badge: 'Participant', title: 'National Science Olympiad (OSN-K), Astronomy', issuer: 'Regency level, Bangkalan', year: '2023' },
  { id: 'micro', cat: 'organization', badge: '', title: 'Webmaster Division member', issuer: 'MicroIT Student Association', year: '2024/2025' },
  { id: 'medis', cat: 'organization', badge: '', title: 'Medical staff at MPKMB 62', issuer: 'Vocational School, IPB University', year: '2025' },
  { id: 'medis2', cat: 'organization', badge: '', title: 'MPKMB 62 learning outcome', issuer: 'Vocational School, IPB University', year: '2025' },
  { id: 'panitbukber', cat: 'organization', badge: '', title: 'Committee for Upgrading x Buber', issuer: 'MicroIT Student Association', year: '2026' },
  { id: 'guangdong', cat: 'learning', badge: '', title: 'Exchange program credential', issuer: 'Guangdong Construction Polytechnic', year: '2025' },
  { id: 'guangdong2', cat: 'learning', badge: '', title: 'Exchange program transcript', issuer: 'Guangdong Construction Polytechnic', year: '2025' },
  { id: 'gemini', cat: 'learning', badge: '', title: 'Gemini Certified Student', issuer: 'Google for Education', year: '' },
  { id: 'tahfiz6', cat: 'tahfiz', badge: 'Mumtaz', title: 'Tahfiz test, 6 juz', issuer: 'Tahfiz foundation', year: '2019' },
  { id: 'tahfiz3', cat: 'tahfiz', badge: '', title: 'Tahfiz test, 3 juz', issuer: 'Tahfiz foundation', year: '2019' },
];

// Prestasi di CV yang tidak punya sertifikat di folder
export const alsoAwards = ['IPB delegate at PIMNAS 39 (PKM-KI), Universitas Diponegoro, 2026'];
