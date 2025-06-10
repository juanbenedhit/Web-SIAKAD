registerSW();

// Registers a service worker
async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      // Change the service worker URL to see what happens when the SW doesn't exist
      const registration = await navigator.serviceWorker.register(
        "service-worker.js"
      );
    } catch (error) {
      showResult("Error while registering: " + error.message);
    }
  } else {
    showResult("Service workers API not available");
  }
}

function showResult(text) {
  document.querySelector("output").innerHTML = text;
}
