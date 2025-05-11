function getData(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function sumAmounts(arr) {
  return arr.reduce((total, item) => total + item.amount, 0);
}

function updateSummary() {
  const incomes = getData("incomes");
  const outcomes = getData("outcomes");
  const debts = getData("debts");
  const wishlist = getData("wishlist");

  const totalIncome = sumAmounts(incomes);
  const totalOutcome = sumAmounts(outcomes);
  const totalDebt = sumAmounts(debts);
  const netBalance = totalIncome - totalOutcome;

  document.getElementById("total-income").textContent = totalIncome.toLocaleString();
  document.getElementById("total-outcome").textContent = totalOutcome.toLocaleString();
  document.getElementById("total-debt").textContent = totalDebt.toLocaleString();
  document.getElementById("net-balance").textContent = netBalance.toLocaleString();

  // Tampilkan wishlist
  const wishlistContainer = document.getElementById("wishlist-items");
  wishlistContainer.innerHTML = "";

  if (wishlist.length > 0) {
    wishlist.forEach((item, index) => {
      const box = document.createElement("div");
      box.classList.add("wishlist-box");

      const recommendation = netBalance >= item.price
        ? `Boleh beli. Sisa: Rp ${(netBalance - item.price).toLocaleString()}`
        : `Jangan dulu, belum cukup.`;

      box.innerHTML = `
        <div class="wishlist-header">
          <span class="wishlist-title"><strong>${item.name}</strong> - Rp ${item.price.toLocaleString()}</span>
          <span class="wishlist-actions">
            <span class="action-icon approve" title="Sudah Dibeli" onclick="approveWishlist(${index})">✅</span>
            <span class="action-icon delete" title="Hapus" onclick="removeWishlist(${index})">❌</span>
          </span>
        </div>
        <p><em>${recommendation}</em></p>
      `;

      wishlistContainer.appendChild(box);
    });
  } else {
    wishlistContainer.innerHTML = "<p>Tidak ada wishlist.</p>";
  }

  // Income & Outcome
  const incomeList = document.getElementById("income-list");
  incomeList.innerHTML = "";
  incomes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.note || "Tanpa deskripsi"} - Rp ${item.amount.toLocaleString()}`;
    incomeList.appendChild(li);
  });

  const outcomeList = document.getElementById("outcome-list");
  outcomeList.innerHTML = "";
  outcomes.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.note || "Tanpa deskripsi"} - Rp ${item.amount.toLocaleString()}`;
    outcomeList.appendChild(li);
  });
}

// Hapus item wishlist
function removeWishlist(index) {
  const wishlist = getData("wishlist");
  wishlist.splice(index, 1);
  saveData("wishlist", wishlist);
  updateSummary();
}

// ACC item wishlist (logic untuk mengurangi saldo dan masukkan ke outcome)
function approveWishlist(index) {
  const wishlist = getData("wishlist");
  const approvedItem = wishlist[index];

  const incomes = getData("incomes");
  const outcomes = getData("outcomes");
  const netBalance = sumAmounts(incomes) - sumAmounts(outcomes);

  if (approvedItem.price > netBalance) {
    alert("Saldo tidak cukup untuk membeli item wishlist ini.");
    return;
  }

  // Tambahkan ke outcome
  outcomes.push({
    note: `Pembelian wishlist: ${approvedItem.name}`,
    amount: approvedItem.price
  });
  saveData("outcomes", outcomes);

  // Hapus item dari wishlist
  wishlist.splice(index, 1);
  saveData("wishlist", wishlist);

  alert(`Wishlist \"${approvedItem.name}\" telah dibeli seharga Rp ${approvedItem.price.toLocaleString()}!`);
  updateSummary();
}

// Reset semua data
function resetAllData() {
  localStorage.removeItem("incomes");
  localStorage.removeItem("outcomes");
  localStorage.removeItem("debts");
  localStorage.removeItem("wishlist");
  updateSummary();
}

// Lunasi hutang
function payDebt() {
  const debts = getData("debts");
  const totalDebt = sumAmounts(debts);

  if (totalDebt > 0) {
    const incomes = getData("incomes");
    const outcomes = getData("outcomes");
    const netBalance = sumAmounts(incomes) - sumAmounts(outcomes);

    if (totalDebt > netBalance) {
      alert("Saldo tidak cukup untuk melunasi hutang.");
      return;
    }

    const newBalance = netBalance - totalDebt;

    outcomes.push({
      note: "Pelunasan Hutang",
      amount: totalDebt
    });
    saveData("outcomes", outcomes);

    saveData("debts", []);
    document.getElementById("net-balance").textContent = newBalance.toLocaleString();

    alert(`Hutang sebesar Rp ${totalDebt.toLocaleString()} telah dilunasi!`);
    updateSummary();
  } else {
    alert("Tidak ada hutang yang perlu dilunasi.");
  }
}

// Event listener saat halaman dimuat

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("pay-debt-button").addEventListener("click", payDebt);
  document.getElementById("reset-all-button")?.addEventListener("click", resetAllData);
  updateSummary();
});
