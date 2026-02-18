const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const type = document.getElementById('type');
const category = document.getElementById('category');
const amount = document.getElementById('amount');
const date = document.getElementById('date');
const submitBtn = document.querySelector('.btn-create');

const incomeChartCanvas = document.getElementById('incomeChart');
const expenseChartCanvas = document.getElementById('expenseChart');

const budgetList = document.getElementById('budget-list');
const budgetModal = document.getElementById('budget-modal');
const budgetForm = document.getElementById('budget-form');

const billsList = document.getElementById('bills-list');
const billModal = document.getElementById('bill-modal');
const billForm = document.getElementById('bill-form');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let budgets = JSON.parse(localStorage.getItem('budgets')) || [];
let bills = JSON.parse(localStorage.getItem('bills')) || [];
let editMode = false, editId = null;
let incomeChartInstance = null, expenseChartInstance = null;

const generateID = () => Math.floor(Math.random() * 100000000);

function addTransaction(e) {
    if (e) e.preventDefault();
    if (!amount.value.trim() || !date.value.trim()) return alert('Please add an amount and date');

    const transactionData = {
        id: editMode ? editId : generateID(),
        text: category.value,
        amount: type.value === 'Income' ? Number(amount.value) : -Math.abs(Number(amount.value)),
        category: category.value,
        date: date.value,
        type: type.value
    };

    if (editMode) {
        const index = transactions.findIndex(t => t.id === editId);
        if (index !== -1) transactions[index] = transactionData;
        editMode = false; editId = null;
        submitBtn.innerText = 'CREATE'; submitBtn.style.background = '';
    } else {
        transactions.push(transactionData);
    }
    resetForm(); updateAll();
}

const resetForm = () => { form.reset(); date.value = new Date().toISOString().split('T')[0]; };

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const item = document.createElement('li');

    const iconMap = { 'Income': 'fa-wallet', 'Food': 'fa-utensils', 'Rent': 'fa-home', 'Shopping': 'fa-shopping-cart' };
    const iconClass = `fas ${iconMap[transaction.type === 'Income' ? 'Income' : transaction.category] || 'fa-money-bill-wave'}`;
    const iconBgColor = transaction.type === 'Income' ? '#4ade80' : '#f87171';

    item.innerHTML = `
    <div class="list-item-left">
        <div class="list-icon" style="background-color: ${iconBgColor};"><i class="${iconClass}"></i></div>
        <div class="list-info">
            <span class="list-category">${transaction.category}</span>
            <span class="list-subtext">${sign}PKR ${Math.abs(transaction.amount)} - ${transaction.date || 'No Date'}</span>
        </div>
    </div>
    <div class="action-btn-container">
        <button class="edit-btn" onclick="editTransaction(${transaction.id})"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" onclick="removeTransaction(${transaction.id})"><i class="fas fa-trash"></i></button>
    </div>`;
    list.appendChild(item);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);
    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);
    const income = amounts.filter(item => item > 0).reduce((acc, item) => acc + item, 0).toFixed(2);
    const expense = (amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1).toFixed(2);

    balance.innerText = `PKR ${total}`;
    money_plus.innerText = `+PKR ${income}`;
    money_minus.innerText = `-PKR ${expense}`;
    updateCharts(); updateBudgetDisplay();
}

function removeTransaction(id) {
    if (editMode && editId === id) { editMode = false; editId = null; submitBtn.innerText = 'CREATE'; resetForm(); }
    transactions = transactions.filter(t => t.id !== id);
    updateAll();
}

function editTransaction(id) {
    const t = transactions.find(t => t.id === id);
    if (!t) return;
    type.value = t.amount > 0 ? 'Income' : 'Expense';
    toggleCategoryOptions();
    category.value = t.category || 'General';
    amount.value = Math.abs(t.amount);
    date.value = t.date;
    editMode = true; editId = id;
    submitBtn.innerText = 'UPDATE'; amount.focus();
}

function toggleCategoryOptions() {
    category.innerHTML = '';
    const options = type.value === 'Income'
        ? ['Salary', 'Investments', 'Freelance', 'Extra Income', 'Other']
        : ['Food', 'Rent', 'Utilities', 'Entertainment', 'Health', 'Shopping', 'Transport', 'Other'];
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt; option.innerText = opt;
        category.appendChild(option);
    });
}

function updateCharts() {
    renderChart('income', incomeChartCanvas, incomeChartInstance, ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0']);
    renderChart('expense', expenseChartCanvas, expenseChartInstance, ['#dc2626', '#ef4444', '#f87171', '#fca5a5', '#fecaca']);
}

function renderChart(type, canvas, instance, bgColors) {
    const isIncome = type === 'income';
    const filtered = transactions.filter(t => isIncome ? t.amount > 0 : t.amount < 0);
    const categories = filtered.reduce((acc, t) => {
        acc[t.category || 'General'] = (acc[t.category || 'General'] || 0) + Math.abs(t.amount);
        return acc;
    }, {});

    const labels = Object.keys(categories);
    if (instance) instance.destroy();

    const newInstance = new Chart(canvas.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: Object.values(categories),
                backgroundColor: bgColors.slice(0, labels.length || 1),
                borderWidth: 0, cutout: '70%'
            }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => ` ${c.label}: PKR ${c.raw}` } } }
        }
    });

    if (isIncome) incomeChartInstance = newInstance; else expenseChartInstance = newInstance;
}

const updateLocalStorage = () => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
    localStorage.setItem('budgets', JSON.stringify(budgets));
    localStorage.setItem('bills', JSON.stringify(bills));
};

function updateAll() {
    list.innerHTML = ''; transactions.forEach(addTransactionDOM);
    updateValues(); updateBillsDisplay(); updateLocalStorage();
}

const openBudgetModal = () => budgetModal.style.display = 'flex';
const closeBudgetModal = () => budgetModal.style.display = 'none';

budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const cat = document.getElementById('budget-category').value;
    const limit = parseFloat(document.getElementById('budget-amount').value);
    const index = budgets.findIndex(b => b.category === cat);
    if (index > -1) budgets[index].limit = limit; else budgets.push({ category: cat, limit });
    closeBudgetModal(); updateAll();
});

function updateBudgetDisplay() {
    budgetList.innerHTML = '';
    budgets.forEach(b => {
        const spent = transactions.filter(t => t.category === b.category && t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
        const percent = Math.min((spent / b.limit) * 100, 100);
        const statusClass = percent > 100 ? 'danger' : percent > 80 ? 'warning' : '';

        const div = document.createElement('div');
        div.classList.add('budget-item');
        div.innerHTML = `
            <div class="budget-header"><span>${b.category}</span><span>PKR ${spent.toFixed(2)} / PKR ${b.limit}</span></div>
            <div class="budget-bar-container"><div class="budget-bar ${statusClass}" style="width: ${percent}%"></div></div>`;
        budgetList.appendChild(div);
    });
}

const openBillModal = () => billModal.style.display = 'flex';
const closeBillModal = () => billModal.style.display = 'none';

function addBill() {
    const name = document.getElementById('bill-name').value;
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const date = document.getElementById('bill-date').value;
    if (name && amount && date) {
        bills.push({ id: generateID(), name, amount, date });
        closeBillModal(); updateAll();
        document.getElementById('bill-name').value = '';
        document.getElementById('bill-amount').value = '';
        document.getElementById('bill-date').value = '';
    }
}
billForm.addEventListener('submit', (e) => { e.preventDefault(); addBill(); });

function updateBillsDisplay() {
    billsList.innerHTML = '';
    bills.forEach(bill => {
        const item = document.createElement('li');
        item.classList.add('bill-item');
        item.innerHTML = `
            <span>${bill.name} (Due: ${bill.date}${getOrdinal(bill.date)}) - PKR ${bill.amount}</span>
            <button class="delete-btn" style="margin-left:10px; opacity:1;" onclick="payBill(${bill.id})">Pay</button>
            <button class="delete-btn" style="margin-left:5px; opacity:1; background:#ef4444;" onclick="removeBill(${bill.id})"><i class="fas fa-trash"></i></button>`;
        billsList.appendChild(item);
    });
}

function payBill(id) {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;
    transactions.push({
        id: generateID(), text: `Bill: ${bill.name}`, amount: -bill.amount,
        category: 'Utilities', date: new Date().toISOString().split('T')[0], type: 'Expense'
    });
    alert(`Paid bill: ${bill.name}`); updateAll();
}

function removeBill(id) { bills = bills.filter(b => b.id !== id); updateAll(); }

const getOrdinal = n => ["th", "st", "nd", "rd"][(n % 100 - 20) % 10] || ["th", "st", "nd", "rd"][n % 100] || "th";

form.addEventListener('submit', addTransaction);
window.addEventListener('click', e => {
    if (e.target == budgetModal) closeBudgetModal();
    if (e.target == billModal) closeBillModal();
});

if (date) date.value = new Date().toISOString().split('T')[0];
toggleCategoryOptions();
updateAll();
