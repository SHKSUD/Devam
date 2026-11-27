/**
 * Phase 4: Devam Study Two-Tier Service Worker
 * - Tier 1 (APP_SHELL_CACHE): Core HTML/CSS/JS, curriculum modules, icons, and offline WEBAPPS.
 *   Network-first ({ cache: 'no-cache' }) with offline fallback so deployments update immediately.
 * - Tier 2 (PDF_CACHE): Opened NCERT chapter & syllabus PDFs persisted across app-shell updates
 *   so students never lose hundreds of MBs of cached textbooks when code/styles update.
 */
const APP_SHELL_CACHE = 'devam-shell-v2-p5-2';
const PDF_CACHE = 'devam-pdfs-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './icons/icon-180.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './classes/registry.js',
  './classes/class6/curriculum.js',
  './classes/class6/quiz.js',
  './classes/class6/reference.js',
  './classes/class6/concepts.js',
  './classes/class6/concepts-science.js',
  './classes/class6/quests.js',
  './classes/class6/deep-learning.js',
  './classes/class6/annual-paper-science.js',
  './classes/class6/annual-paper-math.js',
  './classes/class6/annual-paper-ssc.js',
  './WEBAPPS/GANITAPRAKAASH_MATH/index_datahandling_ch04.html',
  './WEBAPPS/GANITAPRAKAASH_MATH/mathquiz_numbers.html',
  './WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/index.html',
  './WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/app.js',
  './WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/style.css',
  './WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/data/manifest.json',
  './WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/data/math/ch04.json',
  './WEBAPPS/Sandboxes_Quiz_MS/ncert-learning-app/data/science/ch04.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(APP_SHELL_CACHE).then((cache) =>
      Promise.all(CORE_ASSETS.map((asset) =>
        fetch(asset, { cache: 'no-cache' }).then((res) => {
          if (res && res.ok) return cache.put(asset, res).catch(() => {});
        }).catch(() => null)
      ))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== APP_SHELL_CACHE && k !== PDF_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Tier 2 — PDFs: Cache-first in persistent PDF_CACHE (with QuotaExceededError guard)
  if (url.pathname.toLowerCase().endsWith('.pdf')) {
    event.respondWith(
      caches.open(PDF_CACHE).then((pdfCache) =>
        pdfCache.match(req, { ignoreSearch: true }).then((cached) => {
          if (cached) return cached;
          return fetch(req).then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              pdfCache.put(req, copy).catch(() => {});
            }
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Navigation requests (e.g., launching ./#/home offline on iPad Safari): Network-first with HTML shell fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req, { cache: 'no-cache' }).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(APP_SHELL_CACHE).then((cache) => cache.put('./index.html', copy).catch(() => {}));
        }
        return res;
      }).catch(() =>
        caches.match('./index.html', { ignoreSearch: true }).then((m) => m || caches.match('./', { ignoreSearch: true }))
      )
    );
    return;
  }

  // Tier 1 — App Shell, Classes Data & WEBAPPS: Network-first with ignoreSearch offline fallback
  event.respondWith(
    fetch(req, { cache: 'no-cache' }).then((res) => {
      if (res && res.ok) {
        const copy = res.clone();
        caches.open(APP_SHELL_CACHE).then((cache) => cache.put(req, copy).catch(() => {}));
      }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }))
  );
});
