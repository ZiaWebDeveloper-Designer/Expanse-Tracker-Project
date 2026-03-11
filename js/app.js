let transactions = JSON.parse(localStorage.getItem('transactions')) || [
  {desc: "March Salary", amount: 2000, type: "income", category: "Salary"},
  {desc: "Grocery Shopping", amount: 150, type: "expense", category: "Food"},
  {desc: "Electricity Bill", amount: 100, type: "expense", category: "Bills"},
  {desc: "Movie Night", amount: 50, type: "expense", category: "Entertainment"},
  {desc: "Bus Ticket", amount: 20, type: "expense", category: "Transport"},
  {desc: "Freelance Project", amount: 500, type: "income", category: "Other"}
];
const transactionsUl = document.getElementById('transactions');
const balanceSpan = document.getElementById('balance');
const totalIncomeSpan = document.getElementById('totalIncome');
const totalExpenseSpan = document.getElementById('totalExpense');
const ctx = document.getElementById('expenseChart').getContext('2d');
const addBtn = document.getElementById('addBtn');
let chart;

function updateUI() {
    transactionsUl.innerHTML = '';
    let balance = 0;
    let totalIncome = 0;
    let totalExpense = 0;
    let categoryTotals = {};

    transactions.forEach((t, index) => {
        const li = document.createElement('li');
        li.textContent = `${t.desc} [$${t.amount.toFixed(2)} | ${t.category}]`;
        li.className = t.type;

        const delBtn = document.createElement('button');
        delBtn.textContent = 'X';
        delBtn.className = 'delete-btn';
        delBtn.onclick = () => deleteTransaction(index);

        li.appendChild(delBtn);
        transactionsUl.appendChild(li);

        if (t.type === 'income') {
            balance += t.amount;
            totalIncome += t.amount;
        } else {
            balance -= t.amount;
            totalExpense += t.amount;
            categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
        }
    });

    balanceSpan.textContent = balance.toFixed(2);
    totalIncomeSpan.textContent = totalIncome.toFixed(2);
    totalExpenseSpan.textContent = totalExpense.toFixed(2);

    localStorage.setItem('transactions', JSON.stringify(transactions));
    renderChart(categoryTotals);
}

function addTransaction() {
    const desc = document.getElementById('desc').value.trim();
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;
    const category = document.getElementById('category').value;

    if (!desc || isNaN(amount) || amount <= 0) { alert("Enter valid description and amount"); return; }

    transactions.push({ desc, amount, type, category });
    document.getElementById('desc').value = '';
    document.getElementById('amount').value = '';
    updateUI();
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

function renderChart(categoryTotals) {
    const labels = Object.keys(categoryTotals);
    const data = Object.values(categoryTotals);
    if (chart) chart.destroy();
    chart = new Chart(ctx, {
        type: 'pie',
        data: { labels, datasets: [{ data, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'] }] },
        options: { responsive: true, plugins: { legend: { position: 'bottom' } } }
    });
}

addBtn.addEventListener('click', addTransaction);
updateUI();
