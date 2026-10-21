/* DoyinTech offline shell v4 — Signal Runner when network is down (not Chrome dinosaur).
 * Only /play is cached as a page. Other pages (wallet, admin, ops, purchase pages) are never
 * stored, so personal data can't be read back from the cache on a shared device.
 * Bumping the cache name purges anything older versions stored. */
var CACHE = "doyintech-play-v4";
var PRECACHE = ["/play", "/logo.png", "/favicon.ico"];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(function (cache) {
        return cache.addAll(PRECACHE);
      })
      .then(function () {
        return self.skipWaiting();
      })
      .catch(function () {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (key) {
            if (key !== CACHE) return caches.delete(key);
          })
        );
      })
      .then(function () {
        return self.clients.claim();
      })
  );
});

function isSameOrigin(url) {
  try {
    return new URL(url).origin === self.location.origin;
  } catch {
    return false;
  }
}

function isPlayPage(pathname) {
  return pathname === "/play" || pathname.indexOf("/play/") === 0;
}

function shouldCacheAsset(pathname) {
  if (pathname.indexOf("/api/") === 0) return false;
  return (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/audio/") ||
    pathname === "/play" ||
    /\.(js|css|woff2?|png|svg|ico|webp|jpg|jpeg)$/i.test(pathname)
  );
}

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;
  if (!isSameOrigin(request.url)) return;

  var url = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then(function (response) {
          if (response && response.ok && isPlayPage(url.pathname)) {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) {
              cache.put("/play", copy);
            });
          }
          return response;
        })
        .catch(function () {
          return caches.match("/play").then(function (play) {
            if (play) return play;
            return new Response(
              "<!DOCTYPE html><html><head><meta charset=utf-8><meta name=viewport content=\"width=device-width,initial-scale=1\"><title>Signal Runner Offline</title><style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#020617;color:#e2e8f0;font-family:system-ui,sans-serif;padding:24px;text-align:center}a{color:#22d3ee}</style></head><body><div><h1>Signal Runner</h1><p>Open this page once while online so it can work offline.</p><p><a href=\"/play\">Try /play again</a></p></div></body></html>",
              { headers: { "Content-Type": "text/html; charset=utf-8" } }
            );
          });
        })
    );
    return;
  }

  if (shouldCacheAsset(url.pathname)) {
    event.respondWith(
      caches.match(request).then(function (cached) {
        var network = fetch(request)
          .then(function (response) {
            if (response && response.ok) {
              var copy = response.clone();
              caches.open(CACHE).then(function (cache) {
                cache.put(request, copy);
              });
            }
            return response;
          })
          .catch(function () {
            return cached;
          });
        return cached || network;
      })
    );
  }
});
