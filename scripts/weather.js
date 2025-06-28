document.addEventListener("DOMContentLoaded", () => {
  // membuat elemen kontainer kartu cuaca
  const weatherCard = document.getElementById("weather-card");
  if (!weatherCard) return; // Keluar jika kartu tidak ada di halaman ini

  // konfigurasi API dan koordinat ---
  const apiKey = "a9b2854f21546e1cc3feb3b2c84e5134";
  const lat = -7.79277;
  const lon = 110.40828;

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=id`;

  // async function untuk mengambil dan menampilkan data cuaca dari api
  async function fetchWeather() {
    weatherCard.innerHTML = `<div class="text-center text-gray-500">Memuat data cuaca...</div>`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Gagal mengambil data: ${response.statusText}`);
      }
      const data = await response.json();

      // menambil informasi cuaca
      const temp = Math.round(data.main.temp);
      const description = data.weather[0].description;
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

      // bagian untuk menampilkan data cuaca didalam card
      weatherCard.innerHTML = `
          <div class="flex items-center gap-2">
            <img src="${iconUrl}" alt="Ikon cuaca ${description}" class="w-24 h-24 md:w-28 md:h-28">
            <div class="text-center flex-1">
              <h2 class="text-4xl font-bold text-blue-900">${temp}°C</h2>
              <p class="capitalize text-sm text-gray-700">${description}</p>
              <p class="text-xs text-gray-600">Yogyakarta</p>
            </div>
          </div>
        `;
      // bagian error handling jika terjadi kesalahan
    } catch (error) {
      console.error("Error fetching weather:", error);
      weatherCard.innerHTML = `<div class="text-center text-blue-900">Gagal memuat data cuaca. Periksa koneksi Anda.</div>`;
    }
  }
  // memanggil fungsi fetchWeather saat halaman selesai dimuat
  fetchWeather();
});
