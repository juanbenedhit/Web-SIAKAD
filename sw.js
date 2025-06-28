// menggunakan caching dengan fallback offline
const CACHE_NAME = "siakad-assets-v3";
const urlsToCache = [
  "/",
  "/pages/home.html",
  "/pages/infoMatkul.html",
  "/scripts/app.js",
  "/scripts/infomatkul.js",
  "/scripts/dbmatkul.js",
  "/scripts/offline.js",
  "/scripts/weather.js",
  "/assets/images/Mahasiswa.jpg",
  "/assets/images/UTDI-logo2.png",
  "/assets/images/utdi-text.png",
];

// menangani install event saat service worker pertama kali diinstal
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("Service Worker: Precaching assets");
      try {
        await cache.addAll(urlsToCache);
      } catch (err) {
        console.error("Gagal cache file:", err);
      }
    })()
  );
});

// saat service worker aktif
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
});

// menangani fetch request dengan strategi: Cache First, lalu Network
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse; // jika ada di cache
      }

      return fetch(event.request)
        .then((networkResponse) => {
          return networkResponse; // jika berhasil fetch online
        })
        .catch(() => {
          // jika offline dan tidak ada di cache, kembalikan response kosong agar tidak error
          return new Response("", {
            status: 200,
            statusText: "Offline - no cache",
          });
        });
    })
  );
});
