// Helper: Ambil data dari localStorage, kalau belum ada, buat array kosong
function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

// Helper: Simpan data ke localStorage
function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Tambah Income
document.getElementById("add-income").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("income-amount").value);
  const note = document.getElementById("income-note").value;

  if (isNaN(amount) || amount <= 0) {
    alert("Nominal income harus lebih dari 0!");
    return;
  }

  const incomes = getData("incomes");
  incomes.push({ amount, note });
  saveData("incomes", incomes);

  alert("Income berhasil ditambahkan!");
  document.getElementById("income-amount").value = "";
  document.getElementById("income-note").value = "";
});

// Tambah Outcome
document.getElementById("add-outcome").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("outcome-amount").value);
  const note = document.getElementById("outcome-note").value;

  if (isNaN(amount) || amount <= 0) {
    alert("Nominal outcome harus lebih dari 0!");
    return;
  }

  const outcomes = getData("outcomes");
  outcomes.push({ amount, note });
  saveData("outcomes", outcomes);

  alert("Outcome berhasil ditambahkan!");
  document.getElementById("outcome-amount").value = "";
  document.getElementById("outcome-note").value = "";
});

// Tambah Hutang
document.getElementById("add-debt").addEventListener("click", () => {
  const amount = parseFloat(document.getElementById("debt-amount").value);

  if (isNaN(amount) || amount <= 0) {
    alert("Masukkan nominal hutang yang valid!");
    return;
  }

  const debts = getData("debts");
  debts.push({ amount });
  saveData("debts", debts);

  alert("Hutang berhasil ditambahkan!");
  document.getElementById("debt-amount").value = "";
});

// Simpan Wishlist
document.getElementById("save-wishlist").addEventListener("click", () => {
  const name = document.getElementById("wishlist-name").value;
  const price = parseFloat(document.getElementById("wishlist-price").value);

  // Validasi input
  if (!name || isNaN(price) || price <= 0) {
    alert("Masukkan nama dan harga barang yang valid!");
    return;
  }

  // Ambil data wishlist yang sudah ada, jika ada
  const wishlist = getData("wishlist");

  // Tambahkan item baru ke wishlist
  wishlist.push({ name, price });

  // Simpan kembali ke localStorage
  saveData("wishlist", wishlist);

  alert("Barang wishlist berhasil disimpan!");

  // Kosongkan input
  document.getElementById("wishlist-name").value = "";
  document.getElementById("wishlist-price").value = "";

  // Update tampilan atau lainnya (jika perlu)
  updateSummary(); // Pastikan fungsi updateSummary() didefinisikan di recap.js
});
