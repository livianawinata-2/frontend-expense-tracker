const CATEGORY_ICONS = {
  "Makanan dan Minuman":
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20 20H2v-2h18v2Zm-4-4H6v-2h10v2Zm4-10h-2v4h2v2h-2v2h-2V6H6v8H4V4h16v2Zm2 4h-2V6h2v4Z"/></svg>',
  Transportasi:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M6 17h2v-2H6v2Zm10 0h2v-2h-2v2Zm2-8h4v2H12V9h4V7h2v2Zm-6 0h-2V7H4v4H2v4h2v-2h6v2h4v-2h6v2h2v-4h2v6h-4v2h-6v-2h-4v2H4v-2H0V9h2V5h14v2h-4v2Z"/></svg>',
  Belanja:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M19 22H5v-2h14v2ZM9 6h6V4h2v2h4v14h-2V8h-2v2h-2V8H9v2H7V8H5v12H3V6h4V4h2v2Zm6-2H9V2h6v2Z"/></svg>',
  Tagihan:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20 22H4v-2h16v2ZM4 20H2V4h2v16Zm18 0h-2V4h2v16Zm-6-3H6v-2h10v2Zm-4-4H6v-2h6v2Zm6-4H6V7h12v2Zm2-5H4V2h16v2Z"/></svg>',
  Hiburan:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M20 20H4v-2h16v2ZM4 18H2V6h2v12Zm18 0h-2V6h2v12Zm-12-7h2v2h-2v2H8v-2H6v-2h2V9h2v2Zm8 4h-2v-2h2v2Zm-2-4h-2V9h2v2Zm4-5H4V4h16v2Z"/></svg>',
  Lainnya:
    '<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24"><path d="M18 23H10V21H12V19H14V21H16V17H18V23ZM10 15H12V19H10V17H6V15H8V13H4V11H10V15ZM20 17H18V15H20V17ZM14 15H12V13H14V15ZM22 15H20V13H18V11H20V7H22V15ZM4 7H8V9H4V11H2V3H4V7ZM18 11H16V9H18V11ZM16 9H14V3H16V9ZM12 7H10V5H12V7ZM14 3H4V1H14V3Z"/></svg>',
};

let expenses = JSON.parse(localStorage.getItem("my_expense_data")) || [];

const expenseForm = document.getElementById("expenseForm");
const expenseName = document.getElementById("expenseName");
const expenseAmount = document.getElementById("expenseAmount");
const expenseCategory = document.getElementById("expenseCategory");
const expenseDate = document.getElementById("expenseDate");
const expenseList = document.getElementById("expenseList");
const emptyState = document.getElementById("emptyState");

const totalAmountElem = document.getElementById("totalAmount");
const totalCountBadge = document.getElementById("totalCountBadge");
const listTotalText = document.getElementById("listTotalText");
const clearAllBtn = document.getElementById("clearAllBtn");

const formatRupiah = (num) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(num);
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const [year, month, day] = dateStr.split("-");
  return `${day}/${month}/${year}`;
};

const setDefaultDate = () => {
  const today = new Date().toISOString().split("T")[0];
  expenseDate.value = today;
};

const save = () => {
  localStorage.setItem("my_expense_data", JSON.stringify(expenses));
};

const updateTotals = () => {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  const count = expenses.length;

  totalAmountElem.textContent = formatRupiah(total);
  totalCountBadge.textContent = `${count} Transaksi`;
  listTotalText.textContent = `${count} data`;
};

const renderList = () => {
  expenseList.innerHTML = "";

  if (expenses.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");

    expenses.forEach((item) => {
      const itemElement = document.createElement("div");
      itemElement.className = "expense-item";

      const icon = CATEGORY_ICONS[item.category] || CATEGORY_ICONS["Lainnya"];

      itemElement.innerHTML = `
        <div class="item-left">
          <div class="item-icon">${icon}</div>
          <div class="item-details">
            <span class="item-title">${escapeHTML(item.name)}</span>
            <span class="item-meta">${item.category} • ${formatDate(item.date)}</span>
          </div>
        </div>
        <div class="item-right">
          <span class="item-amount">- ${formatRupiah(item.amount)}</span>
          <button 
            type="button"
            class="btn-delete" 
            onclick="deleteExpense(${item.id})" 
            title="Hapus Pengeluaran"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      `;

      expenseList.appendChild(itemElement);
    });
  }

  updateTotals();
};

const escapeHTML = (text) => {
  const p = document.createElement("p");
  p.textContent = text;
  return p.innerHTML;
};

expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const nameVal = expenseName.value.trim();
  const amountVal = parseFloat(expenseAmount.value);
  const categoryVal = expenseCategory.value;
  const dateVal = expenseDate.value;

  if (!nameVal || isNaN(amountVal) || amountVal <= 0) {
    alert("Input ga valid");
    return;
  }

  const newItem = {
    id: Date.now(),
    name: nameVal,
    amount: amountVal,
    category: categoryVal,
    date: dateVal,
  };

  expenses.unshift(newItem);

  save();
  renderList();

  expenseForm.reset();
  setDefaultDate();
  expenseName.focus();
});

window.deleteExpense = (id) => {
  if (confirm("Hapus catatan pengeluaran ini?")) {
    expenses = expenses.filter((item) => item.id !== id);
    save();
    renderList();
  }
};

clearAllBtn.addEventListener("click", () => {
  if (expenses.length === 0) return;
  if (confirm("Hapus seluruh catatan pengeluaran?")) {
    expenses = [];
    save();
    renderList();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  setDefaultDate();
  renderList();
});
