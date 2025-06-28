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
self.addEventListener("install", async (event) => {
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

// Menangani permintaan fetch dari jaringan dan cache
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
