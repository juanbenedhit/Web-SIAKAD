// menggunakan caching dengan fallback offline
const CACHE_NAME = "siakad-assets-v3";
const urlsToCache = [
  "/",
  "/index.html",
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
  "/offline.html",
];

// menangani install event saat service worker pertama kali diinstal
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      console.log("Service Worker: Precaching assets");
      await cache.addAll(urlsToCache);
    })()
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

// Menangani permintaan fetch. Strategi: Cache-First, lalu Network
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Jika ada di cache, kembalikan dari cache.
      // Jika tidak, coba ambil dari jaringan.
      return (
        cachedResponse ||
        fetch(event.request).catch(() => {
          // Jika permintaan jaringan juga gagal (misalnya, offline),
          // kembalikan halaman offline untuk permintaan navigasi.
          if (event.request.mode === "navigate") {
            return caches.match("/offline.html");
          }
        })
      );
    })
  );
});
