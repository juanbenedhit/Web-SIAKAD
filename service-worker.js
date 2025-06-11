// menggunakan caching dengan fallback offline
const CACHE_NAME = "siakad-assets-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/offline.html", //halaman ketika offline
  // "/pages/home.html",
  "/scripts/app.js",
  "/assets/images/Mahasiswa.jpg",
  "/assets/images/UTDI-logo2.png",
  "/assets/images/utdi-text.png",
];

// Saat service worker ter-install
self.addEventListener("install", (event) => {
  // Precache semua file statis
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Service Worker: Precaching assets");
      return cache.addAll(urlsToCache);
    })
  );
});

// Saat service worker aktif
self.addEventListener("activate", (event) => {
  // Bersihkan cache lama jika ada
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

// Menangani permintaan fetch (online dulu, fallback offline)
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  event.respondWith(
    (async () => {
      try {
        // mencoba mengambil dari jaringan online
        const networkResponse = await fetch(event.request);
        return networkResponse; // Jika berhasil, kembalikan respons jaringan
      } catch (error) {
        // Jaringan gagal (kemungkinan offline) maka di console akan muncul text
        console.log(
          "Service Worker: Fetch failed, trying cache for:",
          event.request.url
        );
        // mencoba mengambil dari cache
        const cachedResponse = await caches.match(event.request);
        return cachedResponse || caches.match("/offline.html"); // Jika tidak ada di cache, kembalikan offline.html
      }
    })()
  );
});
