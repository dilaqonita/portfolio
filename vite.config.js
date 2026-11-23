import { defineConfig } from 'vite';
import { compression } from 'vite-plugin-compression2';

// Optimasi performa tanpa mengubah tampilan/animasi:
// file build dikompres gzip + brotli (dipakai otomatis oleh hosting yang mendukung).
export default defineConfig({
  plugins: [
    compression({ algorithms: ['gzip', 'brotliCompress'], exclude: [/\.(webp|pdf|png|jpg)$/i] }),
  ],
  build: { cssMinify: true, reportCompressedSize: true },
});
