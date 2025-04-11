const CACHE_NAME = ' 儲蓄險分析 -v1';
const ASSETS = [
  '/UI-2/html/index.html',
  '/UI-2/html/js/app.js',
  '/UI-2/html/manifest.json',
  '/UI-2/html/particles.json',
  '/UI-2/html/css/styles.css',
  '/UI-2/html/icons/icon-192x192.png',
  '/UI-2/html/icons/icon-512x512.png'
];

// 安裝 Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活 Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// 攔截請求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
