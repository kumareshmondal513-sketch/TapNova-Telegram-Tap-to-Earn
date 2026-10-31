/* =====================================================
   TAPNOVA - SERVICE WORKER
   FILE 07: service-worker.js
   Path: TapNova/frontend/service-worker.js
===================================================== */

const CACHE_NAME = "tapnova-cache-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./api.js",
  "./manifest.json",
  "./assets/tapnova-icon.svg"
];

/* INSTALL */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

/* ACTIVATE */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );

  self.clients.claim();
});

/* FETCH */

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // API response ক্যাশে করা হবে না।
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // বাইরের ওয়েবসাইটের অনুরোধ ক্যাশে করা হবে না।
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.ok) {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });
        }

        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);

        if (cached) {
          return cached;
        }

        return caches.match("./index.html");
      })
  );
});