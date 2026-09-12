#!/usr/bin/env node
/**
 * Batch-generate App Store screenshots by combining simulator captures with
 * the HTML frame generators (html2canvas).
 *
 * Usage:
 *   cd static/apps/sborders && npm run generate:appstore
 */

import { createServer } from 'node:http';
import {
  createReadStream,
  existsSync,
  mkdirSync,
  readdirSync,
  renameSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

const ROOT = __dirname;
const SCREENSHOTS_DIR = join(ROOT, 'screenshots');
const OUTPUT_DIR = join(ROOT, 'appstore');
const BG_FILL = '#1D4ED8';

const EN_LANG = 'en';
const LOCALIZED_LANGS = ['de', 'fr', 'it', 'pt', 'es', 'hi', 'jp', 'zh'];
const ALL_LANGS = [EN_LANG, ...LOCALIZED_LANGS];
const SCREENSHOT_COUNT = 7;

// Slot → source filename stem (without device prefix)
const SLOT_KEYS = {
  1: 'kanban',
  2: 'order-detail',
  3: 'stats',
  4: 'calendar',
  5: 'team-share',
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.css': 'text/css; charset=utf-8',
};

function resolveShotFile(langDir, device, key) {
  const prefix = device === 'ipad' ? 'ipad' : 'iphone';
  const candidates = [`${prefix}-${key}.png`];
  if (key === 'stats') candidates.push(`${prefix}-stas.png`);
  for (const name of candidates) {
    const path = join(langDir, name);
    if (existsSync(path)) return name;
  }
  return null;
}

function buildImageMap(lang, device, baseUrl) {
  const langDir = join(SCREENSHOTS_DIR, lang);
  const mapping = {};
  for (const [slot, key] of Object.entries(SLOT_KEYS)) {
    const file = resolveShotFile(langDir, device, key);
    if (!file) {
      throw new Error(`Missing ${device}-${key}.png for language "${lang}"`);
    }
    mapping[slot] = `${baseUrl}/screenshots/${lang}/${encodeURIComponent(file)}`;
  }
  return mapping;
}

function iphoneFilename(lang, num) {
  return lang === EN_LANG
    ? `SBOrders-Screenshot-${num}.png`
    : `SBOrders-Screenshot-${lang}-${num}.png`;
}

function ipadFilename(lang, num) {
  return lang === EN_LANG
    ? `SBOrders-iPad-Screenshot-${num}.png`
    : `SBOrders-iPad-Screenshot-${lang}-${num}.png`;
}

function saveDataUrl(dataUrl, outPath) {
  const base64 = dataUrl.replace(/^data:image\/png;base64,/, '');
  writeFileSync(outPath, Buffer.from(base64, 'base64'));
}

async function removeAlphaFromPng(filePath, sharp) {
  const tmpPath = `${filePath}.rgb.tmp`;
  await sharp(filePath).flatten({ background: BG_FILL }).png().toFile(tmpPath);
  unlinkSync(filePath);
  renameSync(tmpPath, filePath);
}

async function removeAlphaFromTree(dir, sharp) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      await removeAlphaFromTree(path, sharp);
    } else if (entry.name.endsWith('.png')) {
      await removeAlphaFromPng(path, sharp);
    }
  }
}

function startServer() {
  return new Promise((resolvePromise) => {
    const server = createServer((req, res) => {
      const urlPath = decodeURIComponent(req.url.split('?')[0]);
      const filePath = resolve(ROOT, '.' + urlPath);
      if (!filePath.startsWith(ROOT) || !existsSync(filePath)) {
        res.writeHead(404);
        res.end('Not found');
        return;
      }
      const ext = extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      createReadStream(filePath).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolvePromise({ server, baseUrl: `http://127.0.0.1:${port}` });
    });
  });
}

async function loadPage(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 });
  await page.waitForFunction(() => typeof html2canvas !== 'undefined' && typeof exportScreenshot === 'function');
  return page;
}

async function generateSet({
  browser,
  baseUrl,
  generatorPath,
  lang,
  device,
  imageMap,
  localized,
  ipadExtraPatch,
}) {
  const page = await loadPage(browser, `${baseUrl}/${generatorPath}`);

  if (localized) {
    await page.addScriptTag({ url: `${baseUrl}/screenshots-extra-locales.js` });
    await page.evaluate((patch) => {
      const extra = window.SCREENSHOTS_EXTRA_LOCALES || {};
      const ipadPatch = patch ? window.SCREENSHOTS_EXTRA_LOCALES_IPAD || null : null;
      if (typeof registerExtraLocales === 'function') {
        registerExtraLocales(extra, ipadPatch);
      }
    }, !!ipadExtraPatch);
  }

  await page.evaluate((urls) => {
    window.batchLoadImages(urls);
  }, imageMap);

  await page.evaluate(() =>
    Promise.all(
      [1, 2, 3, 4, 5].map(
        (n) =>
          new Promise((resolve) => {
            const img = document.querySelector(`#placeholder${n} img`);
            if (!img) return resolve();
            if (img.complete) return resolve();
            img.onload = resolve;
            img.onerror = resolve;
          }),
      ),
    ),
  );
  await new Promise((r) => setTimeout(r, 300));

  const outDir = join(OUTPUT_DIR, device, lang);
  mkdirSync(outDir, { recursive: true });

  const nameFn = device === 'ipad' ? ipadFilename : iphoneFilename;

  for (let num = 1; num <= SCREENSHOT_COUNT; num++) {
    const dataUrl = localized
      ? await page.evaluate(async (n, l) => exportScreenshot(n, l), num, lang)
      : await page.evaluate(async (n) => exportScreenshot(n), num);

    const outPath = join(outDir, nameFn(lang, num));
    saveDataUrl(dataUrl, outPath);
    console.log(`  ✓ ${device}/${lang}/${nameFn(lang, num)}`);
  }

  await page.close();
}

async function main() {
  let puppeteer;
  let sharp;
  try {
    puppeteer = require('puppeteer');
    sharp = require('sharp');
  } catch {
    console.error('Install dependencies first: cd static/apps/sborders && npm install');
    process.exit(1);
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });

  const { server, baseUrl } = await startServer();
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    for (const lang of ALL_LANGS) {
      const langDir = join(SCREENSHOTS_DIR, lang);
      if (!existsSync(langDir)) {
        console.warn(`Skipping ${lang}: no screenshots folder`);
        continue;
      }

      let iphoneMap;
      let ipadMap;
      try {
        iphoneMap = buildImageMap(lang, 'iphone', baseUrl);
        ipadMap = buildImageMap(lang, 'ipad', baseUrl);
      } catch (err) {
        console.warn(`Skipping ${lang}: ${err.message}`);
        continue;
      }

      console.log(`\n${lang.toUpperCase()} — iPhone`);
      if (lang === EN_LANG) {
        await generateSet({
          browser,
          baseUrl,
          generatorPath: 'screenshots-generator.html',
          lang,
          device: 'iphone',
          imageMap: iphoneMap,
          localized: false,
        });
      } else {
        await generateSet({
          browser,
          baseUrl,
          generatorPath: 'screenshots-generator-localized.html',
          lang,
          device: 'iphone',
          imageMap: iphoneMap,
          localized: true,
        });
      }

      console.log(`${lang.toUpperCase()} — iPad`);
      if (lang === EN_LANG) {
        await generateSet({
          browser,
          baseUrl,
          generatorPath: 'screenshots-ipad.html',
          lang,
          device: 'ipad',
          imageMap: ipadMap,
          localized: false,
        });
      } else {
        await generateSet({
          browser,
          baseUrl,
          generatorPath: 'screenshots-ipad-localized.html',
          lang,
          device: 'ipad',
          imageMap: ipadMap,
          localized: true,
          ipadExtraPatch: true,
        });
      }
    }

    console.log('\nRemoving alpha channel from output PNGs...');
    await removeAlphaFromTree(OUTPUT_DIR, sharp);
    console.log(`Done. Output: ${OUTPUT_DIR}`);
  } finally {
    await browser.close();
    server.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
