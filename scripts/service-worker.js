// service-worker.js
const CACHE_NAME = "utdi-cache-v1";
const OFFLINE_URL = "/offline.html";
const urlsToCache = [
  "/",
  "/index.html",
  "/pages/home.html",
  "/offline.html",
  "/assets/images/Mahasiswa.jpg",
  "/assets/images/UTDI-logo2.png",
  "https://cdn.tailwindcss.com",
  "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
});

// Fetch event
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache clone of response
        const resClone = response.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then((cached) => {
          if (cached) return cached;
          // Fallback to offline.html for navigations
          if (event.request.mode === "navigate") {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});
