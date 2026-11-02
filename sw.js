var CACHE_NAME = 'sql-master-pwa-v2';
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
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(LOCAL_ASSETS);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.map(function(key) {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  var url = new URL(req.url);
  var isSameOrigin = url.origin === self.location.origin;
  var isCdnCacheable = url.hostname.indexOf('cdn.jsdelivr.net') > -1 ||
                       url.hostname.indexOf('fonts.googleapis.com') > -1 ||
                       url.hostname.indexOf('fonts.gstatic.com') > -1;

  if (!isSameOrigin && !isCdnCacheable) return;

  event.respondWith(
    caches.match(req).then(function(cached) {
      if (cached) {
        if (isSameOrigin) {
          fetch(req).then(function(fresh) {
            if (fresh && fresh.status === 200) {
              caches.open(CACHE_NAME).then(function(c) { c.put(req, fresh); });
            }
          }).catch(function() {});
        }
        return cached;
      }
      return fetch(req).then(function(networkRes) {
        if (networkRes && (networkRes.status === 200 || networkRes.type === 'opaque')) {
          var clone = networkRes.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(req, clone);
          });
        }
        return networkRes;
      });
    })
  );
});

