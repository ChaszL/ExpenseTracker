const formHTML = `
    <div class="card p-4 mx-auto" style="max-width: 600px;">
        <form id="txForm">
            <div class="mb-3">
                <label class="form-label fw-bold">Date</label>
                <input type="date" id="txDate" class="form-control" required>
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Description</label>
                <input type="text" id="txName" class="form-control" placeholder="What was this for?" required>
            </div>
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Category</label>
                    <select id="txCat" class="form-select" onchange="toggleCustomCategory()">
                        <option>Salary</option>
                        <option>Food</option>
                        <option>Rent</option>
                        <option>Shopping</option>
                        <option>Savings</option> <option value="Other">Other...</option>
                    </select>
                </div>
                <div class="col-md-6 mb-3">
                    <label class="form-label fw-bold">Type</label>
                    <select id="txType" class="form-select">
                        <option value="expense">Expense</option>
                        <option value="deposit">Income</option>
                    </select>
                </div>
            </div>
            <div class="mb-3 d-none" id="customCatWrapper">
                 <label class="form-label fw-bold">Custom Category Name</label>
                 <input type="text" id="txCustomCat" class="form-control" placeholder="Enter category name">
            </div>
            <div class="mb-3">
                <label class="form-label fw-bold">Amount</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" step="0.01" id="txAmount" class="form-control" placeholder="0.00" required>
                </div>
            </div>
            <button type="submit" class="btn btn-primary w-100 py-2">Add Transaction</button>
        </form>
    </div>
`;

document.getElementById('form-container').innerHTML = formHTML;
document.getElementById('txDate').valueAsDate = new Date();

function toggleCustomCategory() {
    const select = document.getElementById('txCat');
    const wrapper = document.getElementById('customCatWrapper');
    const customInput = document.getElementById('txCustomCat');
    if (select.value === "Other") {
        wrapper.classList.remove('d-none');
        customInput.setAttribute('required', 'true');
        customInput.focus();
    } else {
        wrapper.classList.add('d-none');
        customInput.removeAttribute('required');
    }
}

document.getElementById('txForm').onsubmit = (e) => {
    e.preventDefault();
    const mainCat = document.getElementById('txCat').value;
    const finalCategory = (mainCat === "Other") ? document.getElementById('txCustomCat').value : mainCat;
    
    const newTx = {
        date: document.getElementById('txDate').value,
        name: document.getElementById('txName').value,
        category: finalCategory,
        type: document.getElementById('txType').value,
        amount: document.getElementById('txAmount').value
    };

    transactions.push(newTx);
    saveData();
    e.target.reset();
    document.getElementById('txDate').valueAsDate = new Date();
    document.getElementById('customCatWrapper').classList.add('d-none');
    alert("Transaction added successfully!");
};