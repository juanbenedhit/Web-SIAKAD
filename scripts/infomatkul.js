// Inisialisasi IndexedDB
const DB_NAME = "InfoMatkulDB";
const DB_VERSION = 1;
const STORE_NAME = "matkul";

// Buka atau buat IndexedDB
const request = indexedDB.open(DB_NAME, DB_VERSION);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  if (!db.objectStoreNames.contains(STORE_NAME)) {
    const objectStore = db.createObjectStore(STORE_NAME, { keyPath: "kode" });

    // Cek apakah initialData sudah tersedia (dari file terpisah)
    if (typeof initialData === "undefined") {
      console.error(
        "initialData tidak ditemukan. Pastikan file initial-matkul-data.js sudah dimuat."
      );
      return;
    }
    // Masukkan data awal ke object store
    objectStore.transaction.oncomplete = function () {
      const store = db
        .transaction(STORE_NAME, "readwrite")
        .objectStore(STORE_NAME);
      initialData.forEach((item) => store.add(item));
    };
  }
};

// bagian untuk handle success pada id matkulContainer
request.onsuccess = function (event) {
  const db = event.target.result;
  if (document.getElementById("matkulContainer")) {
    displayMatkulData(db);
  }
};

// bagian untuk handle error
request.onerror = function () {
  console.error("Gagal membuka database IndexedDB");
};

// Fungsi untuk menampilkan data ke halaman HTML
function displayMatkulData(db) {
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    const matkulContainer = document.getElementById("matkulContainer");
    if (!matkulContainer) {
      console.error("Elemen dengan ID 'matkulContainer' tidak ditemukan.");
      return;
    }
    matkulContainer.innerHTML = "";

    // bagian untuk menampilkan data matkul
    getAll.result.forEach((matkul) => {
      const card = document.createElement("div");
      card.className = "p-4 bg-gray-100 shadow rounded-xl";
      card.innerHTML = `
        <div class="space-y-2">
            <h1 class="text-lg font-bold md:text-xl">${matkul.nama}</h1>
            <h1 class="text-lg font-bold md:text-xl">(${matkul.kode})</h1>
            <p class="text-sm text-justify md:text-base">${matkul.deskripsi}</p>
            <p class="text-xs text-gray-500">Dosen : ${matkul.dosen}</p>
            <p class="text-xs text-gray-500">SKS : ${matkul.sks}</p>
        </div>
      `;

      matkulContainer.appendChild(card);
    });
  };
}
