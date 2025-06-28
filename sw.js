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

// event listener untuk permintaan fetch strategi Cache-First kemudian Network
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Jika ada di cache, gunakan dari cache
      if (cachedResponse) {
        return cachedResponse;
      }
      // Jika tidak ada di cache, coba fetch dari network
      return fetch(event.request).catch(() => {
        // Jika network gagal (offline), tidak menampilkan apa-apa
        return;
      });
    })
  );
});
