import { Resvg } from '@resvg/resvg-js';
import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import pngToIco from 'png-to-ico';

const outDir = path.resolve('public');
mkdirSync(outDir, { recursive: true });

const faviconSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="512" height="512" rx="140" fill="#1C1C1F"/>
  <rect y="340" width="512" height="172" fill="#2F5EF4" opacity="0.92"/>
  <text x="256" y="300" text-anchor="middle" font-size="220" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#F8F5F0">AB</text>
</svg>`;

const ogSvg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#F8F5F0"/>
  <rect x="0" y="460" width="1200" height="170" fill="#2F5EF4" opacity="0.08"/>
  <circle cx="980" cy="110" r="120" fill="#2F5EF4" opacity="0.18"/>
  <text x="80" y="240" font-size="72" font-family="Arial, Helvetica, sans-serif" font-weight="700" fill="#1C1C1F">Амиран Бестаев</text>
  <text x="80" y="320" font-size="40" font-family="Arial, Helvetica, sans-serif" font-weight="500" fill="#2F5EF4">Frontend Developer · Vue/Nuxt · TypeScript</text>
  <text x="80" y="390" font-size="26" font-family="Arial, Helvetica, sans-serif" font-weight="400" fill="#6F6F76">Fast, expressive interfaces for maps, catalogs, and complex logic.</text>
</svg>`;

const renderToPng = (svg, size, outPath) => {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: size }
  });
  const pngData = resvg.render().asPng();
  writeFileSync(outPath, pngData);
};

writeFileSync(path.join(outDir, 'favicon.svg'), faviconSvg);

renderToPng(faviconSvg, 512, path.join(outDir, 'android-chrome-512x512.png'));
renderToPng(faviconSvg, 192, path.join(outDir, 'android-chrome-192x192.png'));
renderToPng(faviconSvg, 180, path.join(outDir, 'apple-touch-icon.png'));
renderToPng(faviconSvg, 32, path.join(outDir, 'favicon-32x32.png'));
renderToPng(faviconSvg, 16, path.join(outDir, 'favicon-16x16.png'));

const ico = await pngToIco([
  path.join(outDir, 'favicon-16x16.png'),
  path.join(outDir, 'favicon-32x32.png')
]);
writeFileSync(path.join(outDir, 'favicon.ico'), ico);

renderToPng(ogSvg, 1200, path.join(outDir, 'og-image.png'));
writeFileSync(path.join(outDir, 'og-image.svg'), ogSvg);
