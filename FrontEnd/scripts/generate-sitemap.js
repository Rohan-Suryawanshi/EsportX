import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const baseUrl = 'https://esport-x-frontend.vercel.app';
const pages = [
  '/',
  '/games',
  '/matches',
  '/leaderboard',
  '/login',
  '/register',
  '/profile',
  '/admin-dashboard'
];

const lastmod = new Date().toISOString().split('T')[0];

const urlEntries = pages
  .map(
    (p) => `  <url>\n    <loc>${baseUrl}${p}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>`
  )
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.resolve(__dirname, '..', 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'sitemap.xml'), sitemap, 'utf8');
console.log('sitemap.xml written to', path.join(outDir, 'sitemap.xml'));
