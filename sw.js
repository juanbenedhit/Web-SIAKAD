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

// menghapus cache lama saat activate
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

// menangani fetch event yang dimana cache terlebih dahulu baru network
self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    // jika bukan maka dihentikan
    return;
  }

  // jika ada respon di cahce maka kembalikan
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      //  jika tidak ada di cache, kita coba ambil dari network
      return fetch(event.request).catch(() => {
        // kembalikan halaman yang terdapat di cache
        return caches.keys().then((cacheNames) => {
          // membuka cache terbaru
          return caches.open(CACHE_NAME).then((cache) => {
            return cache.keys().then((requests) => {
              // mengambil halaman fallback dan carikan di page yang dibutuhkan
              const pageFallback = requests.find((req) =>
                req.url.includes("/pages/")
              );
              return pageFallback
                ? cache.match(pageFallback)
                : Response.error();
            });
          });
        });
      });
    })
  );
});
