const CACHE_VERSION = 'sql-master-v8';
var CACHE_NAME = CACHE_VERSION;
var LOCAL_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/data-dvdrental.js',
  './js/data-tasks.js',
  './js/data-interview.js',
  './js/app.js',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function(cache) {
      return cache.addAll(LOCAL_ASSETS);
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    (async function() {
      var keys = await caches.keys();
      await Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_VERSION) {
            return caches.delete(key);
          }
        })
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', function(event) {
  var req = event.request;
  var url = new URL(req.url);

  // Strategia Network-Only dla zapytań do Supabase REST API (nigdy nie cachuj API rankingu/profili)
  if (url.hostname.indexOf('supabase.co') > -1 || url.hostname.indexOf('supabase.in') > -1 || url.pathname.indexOf('/rest/v1/') > -1) {
    event.respondWith(fetch(req));
    return;
  }

  if (req.method !== 'GET') return;

  var isSameOrigin = url.origin === self.location.origin;
  var isWasmOrPglite = url.href.indexOf('@electric-sql/pglite') > -1 || /\.wasm(\?|$)/i.test(url.pathname) || /\.data(\?|$)/i.test(url.pathname);
  var isCdnCacheable = url.hostname.indexOf('cdn.jsdelivr.net') > -1 ||
                       url.hostname.indexOf('fonts.googleapis.com') > -1 ||
                       url.hostname.indexOf('fonts.gstatic.com') > -1;

  if (!isSameOrigin && !isCdnCacheable) return;

  // 1. Cache-First dla ciężkich plików WASM (@electric-sql/pglite) oraz czcionek z CDN
  if (isWasmOrPglite || (!isSameOrigin && isCdnCacheable)) {
    event.respondWith(
      caches.match(req).then(function(cached) {
        if (cached) return cached;
        return fetch(req).then(function(networkRes) {
          if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
            var clone = networkRes.clone();
            caches.open(CACHE_VERSION).then(function(cache) {
              cache.put(req, clone);
            });
          }
          return networkRes;
        });
      })
    );
    return;
  }

  // 2. Network-First z fallbackiem do Cache dla plików aplikacji (.html, .js, .css, .json, .svg)
  event.respondWith(
    fetch(req).then(function(networkRes) {
      if (networkRes && networkRes.status === 200) {
        var clone = networkRes.clone();
        caches.open(CACHE_VERSION).then(function(cache) {
          cache.put(req, clone);
        });
      }
      return networkRes;
    }).catch(function() {
      return caches.match(req).then(function(cached) {
        return cached || caches.match('./index.html');
      });
    })
  );
});
