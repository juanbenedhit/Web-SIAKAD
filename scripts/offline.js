// logika untuk menampilkan/menyembunyikan notifikasi offline
document.addEventListener("DOMContentLoaded", () => {
  const indicator = document.getElementById("offline-indicator");

  // memastikan elemen ada sebelum melanjutkan
  if (!indicator) return;

  //   function untuk memperbarui status online
  function updateOnlineStatus() {
    if (navigator.onLine) {
      indicator.classList.add("opacity-0", "invisible");
    } else {
      indicator.classList.remove("opacity-0", "invisible");
    }
  }

  //   bagian untuk menambahkan event listener online atau offline
  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // mengecek status saat halaman pertama kali dimuat
  updateOnlineStatus();
});
