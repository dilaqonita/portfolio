// Mengecilkan foto galeri: ambil dari assets-src/gallery (foto asli, ukuran bebas),
// simpan ke src/assets/gallery sebagai WebP maksimal 1400px sisi terpanjang (±100-250 KB per foto).
// Pakai: npm run photos
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const IN = 'assets-src/gallery';
const OUT = 'src/assets/gallery';
await mkdir(OUT, { recursive: true });
const files = (await readdir(IN)).filter((f) => /\.(jpe?g|png|webp|avif|tiff?)$/i.test(f));
if (!files.length) {
  console.log(`Belum ada foto di ${IN}. Taruh foto aslimu di folder itu, lalu jalankan lagi: npm run photos`);
  process.exit(0);
}
for (const f of files) {
  const out = join(OUT, parse(f).name.replace(/\s+/g, '-') + '.webp');
  const info = await sharp(join(IN, f)).rotate().resize({ width: 1400, height: 1400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toFile(out);
  console.log(`${f} -> ${out}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} KB`);
}
console.log(`\nSelesai: ${files.length} foto. Jalankan "npm run dev" untuk melihat galeri.`);
