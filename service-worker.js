// menggunakan caching dengan fallback offline
const CACHE_NAME = "siakad-assets-v2";
const urlsToCache = [
  "/",
  "/pages/home.html",
  "/pages/infoMatkul.html",
  "/scripts/app.js",
  "/scripts/infoMatkul-db.js",
  "/scripts/dbMatkul.js",
  "/scripts/offline.js",
  "/scripts/weather.js",
  "/assets/images/Mahasiswa.jpg",
  "/assets/images/UTDI-logo2.png",
  "/assets/images/utdi-text.png",
];

// menangani install event saat service worker pertama kali diinstal
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // jika berhasil maka akan muncul text di console
      console.log("Service Worker: Precaching assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// Saat service worker aktif
self.addEventListener("activate", (event) => {
  // memberi tahu service worker untuk menghapus cache lama jika ada
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

// Menangani permintaan fetch dengan strategi "Cache First, falling back to Network"
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Jika resource ditemukan di cache, langsung kembalikan dari cache.
      if (cachedResponse) return cachedResponse;
      return fetch(event.request);
    })
  );
});
