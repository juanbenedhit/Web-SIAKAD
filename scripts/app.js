registerSW();

async function registerSW() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.register(
        "/scripts/service-worker.js"
      );
      console.log("SW registered:", reg.scope);
    } catch (e) {
      console.error("SW registration failed:", e);
    }
  } else {
    console.warn("Service Workers not supported");
  }
}
