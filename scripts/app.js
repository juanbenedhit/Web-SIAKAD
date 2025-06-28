registerSW();

async function registerSW() {
  // Memeriksa apakah service worker didukung pada browser
  if ("serviceWorker" in navigator) {
    // Mendaftarkan service worker
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      // SW = service worker jika berhasil maka akan muncul text di console
      console.log("SW registered:", reg.scope);
    } catch (e) {
      // jika tidak maka akan muncul text di console
      console.error("SW registration failed:", e);
    }
  } else {
    // jika browser tidak mendukung SW maka akan muncul text di console
    console.warn("Service Workers not supported");
  }
}
