registerSW();

// Registers a service worker
async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      // path atau path file service-worker.js yang akan di register
      const registration = await navigator.serviceWorker.register(
        "/scripts/service-worker.js"
      );
    } catch (error) {
      // text error message
      showResult("Error while registering: " + error.message);
    }
  } else {
    // text jika service worker tidak ada
    showResult("Service workers API not available");
  }
}

function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
