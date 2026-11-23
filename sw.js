/**
 * Phase 3: Devam Study Service Worker
 * - Pre-caches the core app shell & Class VI curriculum/quiz/exam blueprints for offline study.
 * - Caches opened NCERT PDFs on-demand so students on patchy mobile data can re-open them offline.
 */
const CACHE_NAME = 'devam-study-v2-p3-1';

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icons/icon.svg',
  './classes/registry.js',
  './classes/class6/curriculum.js',
  './classes/class6/quiz.js',
  './classes/class6/reference.js',
  './classes/class6/concepts.js',
  './classes/class6/concepts-science.js',
  './classes/class6/quests.js',
  './classes/class6/annual-paper-science.js',
  './classes/class6/annual-paper-math.js',
  './classes/class6/annual-paper-ssc.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // PDFs: Cache-first once opened, with network fallback & background store
  if (url.pathname.toLowerCase().endsWith('.pdf')) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          }
          return res;
        }).catch(() => cached);
      })
    );
    return;
  }

  // App Shell & JS Data: Stale-while-revalidate for instant load + fresh updates
  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        }
        return res;
      }).catch(() => cached);

      return cached || networkFetch;
    })
  );
});
