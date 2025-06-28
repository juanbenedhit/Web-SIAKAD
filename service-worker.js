// menggunakan caching dengan fallback offline
const CACHE_NAME = "siakad-assets-v2";
const urlsToCache = [
  "./", // Alias untuk index.html
  "./index.html",
  "./pages/home.html",
  "./pages/infoMatkul.html",
  "./scripts/app.js",
  "./scripts/infoMatkul-db.js",
  "./scripts/dbMatkul.js",
  "./scripts/offline.js",
  "./scripts/weather.js",
  "./assets/images/Mahasiswa.jpg",
  "./assets/images/UTDI-logo2.png",
  "./assets/images/utdi-text.png",
  "./offline.html", // Halaman fallback offline
];

// menangani install event saat service worker pertama kali diinstal
self.addEventListener("install", async (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        // jika berhasil maka akan muncul text di console
        console.log("Service Worker: Precaching assets", urlsToCache);
        return cache.addAll(urlsToCache);
      })
      .catch((err) => {
        console.error("Service Worker: Gagal melakukan precaching", err);
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
  // Abaikan permintaan non-GET dan permintaan ekstensi Chrome
  if (
    event.request.method !== "GET" ||
    event.request.url.startsWith("chrome-extension://")
  ) {
    return;
  }

  // Strategi: Cache, falling back to Network.
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // 1. Coba ambil dari cache terlebih dahulu (Cache First)
      const cachedResponse = await cache.match(event.request);

      // 2. Jika ada di cache, kembalikan dari cache. Aplikasi akan terasa instan.
      if (cachedResponse) {
        return cachedResponse;
      }

      // 3. Jika tidak ada di cache, coba ambil dari jaringan (Network Fallback)
      try {
        const networkResponse = await fetch(event.request);

        // Jika respons valid, simpan ke cache untuk penggunaan berikutnya dan kembalikan
        if (networkResponse.ok) {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        // 4. Jika jaringan gagal, tampilkan halaman offline dari cache
        console.log(
          "Service Worker: Gagal mengambil dari jaringan, menampilkan halaman offline."
        );
        return await cache.match("./offline.html");
      }
    })
  );
});
