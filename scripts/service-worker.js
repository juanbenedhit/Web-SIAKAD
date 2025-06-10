// Versi stabil: caching dengan fallback offline
const CACHE_NAME = "siakad-assets-v1";
const ASSETS = [
  "/",
  "/offline.html",
  "/pages/home.html",
  "/scripts/app.js",
  "/assets/images/Mahasiswa.jpg",
  "/assets/images/UTDI-logo2.png",
  "/assets/images/utdi-text.png",
];

// Install service worker & cache semua file
self.addEventListener("install", (event) => {
  self.skipWaiting(); // langsung aktif
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch((err) => {
        console.warn("Beberapa file gagal dicache:", err);
      });
    })
  );
});

// Aktivasi: kontrol langsung halaman
self.addEventListener("activate", (event) => {
  clients.claim(); // langsung kontrol halaman
  // Tidak menghapus cache sama sekali
});

// Fetch: gunakan cache, fallback ke offline.html jika navigasi gagal
self.addEventListener("fetch", (event) => {
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cached) => {
            return cached || caches.match("/offline.html");
          });
        })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request);
      })
    );
  }
});
