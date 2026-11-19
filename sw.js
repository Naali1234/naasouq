// Naa Souq service worker: keeps pictures cached for speed, but always fetches the newest pages and code.
const CACHE = "naasouq-v2";
self.addEventListener("install", e => { self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  const isAsset = /\.(png|jpg|jpeg)(\?|$)/.test(req.url);
  if (isAsset) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); return res; })));
  } else {
    // pages and code: always ask the server for the latest version; use the saved copy only when offline
    e.respondWith(fetch(req.url, { cache: "no-cache", credentials: "same-origin" })
      .then(res => { const c = res.clone(); caches.open(CACHE).then(ca => ca.put(req, c)); return res; })
      .catch(() => caches.match(req)));
  }
});
