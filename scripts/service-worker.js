// install service worker dengan async dan menggunakan try dan catch untuk melihat error jika ada
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      try {
        // menggunakan caches.open untuk membuat cache baru
        const cache = await caches.open("pwa-assets");
        // menggunakan cache.addAll untuk menambahkan file ke cache
        await cache.addAll([
          "/",
          "/pages/home.html",
          "/scripts/app.js",
          "/assets/images/Mahasiswa.jpg",
          "/assets/images/UTDI-logo2.png",
          "/assets/images/utdi-text.png",
        ]);
        // memberikan informasi di console jika cache berhasil dibuat
        console.log("Service Worker installed and files cached.");
      } catch (error) {
        // memberikan informasi di console jika cache gagal dibuat
        console.error("Cache gagal:", error);
      }
    })()
  );
});

// menggunakan event fetch untuk memperbarui cache jika ada perubahan
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // It can update the cache to serve updated content on the next request
      return cachedResponse || fetch(event.request);
    })
  );
});
