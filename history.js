function renderHistory() {
    const container = document.getElementById('history-list');
    const filtered = transactions.filter(t => t.date.startsWith(currentPeriod));

    if (filtered.length === 0) {
        container.innerHTML = `<div class="card p-5 text-center border-0 shadow-sm"><p class="text-muted">No transactions for ${currentPeriod}</p></div>`;
        return;
    }

    const sorted = [...filtered].sort((a, b) => new Date(b.date) - new Date(a.date));

    let html = `
        <div class="card overflow-hidden border-0 shadow-sm">
            <table class="table table-hover align-middle mb-0">
                <thead class="table-light">
                    <tr>
                        <th class="ps-4">Date</th>
                        <th>Description</th>
                        <th>Category</th>
                        <th>Amount</th>
                        <th class="text-end pe-4">Action</th>
                    </tr>
                </thead>
                <tbody>`;

    sorted.forEach((t) => {
        const isIncome = t.type === 'deposit';
        const colorClass = isIncome ? 'text-success' : 'text-danger';
        const prefix = isIncome ? '+' : '-';
        const originalIndex = transactions.indexOf(t);

        html += `
            <tr>
                <td class="ps-4 text-muted small">${t.date}</td>
                <td><span class="fw-bold text-dark">${t.name}</span></td>
                <td><span class="badge ${t.category === 'Savings' ? 'bg-info text-dark' : 'bg-light text-secondary border'}">${t.category}</span></td>
                <td class="${colorClass} fw-bold">${prefix}$${parseFloat(t.amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                <td class="text-end pe-4">
                    <button class="btn btn-link text-danger p-0" onclick="deleteTx(${originalIndex})"><i class="bi bi-trash3"></i></button>
                </td>
            </tr>`;
    });

    html += `</tbody></table></div>`;
    container.innerHTML = html;
}

function deleteTx(index) {
    if(confirm("Remove this transaction?")) {
        transactions.splice(index, 1);
        saveData();
        renderHistory();
        // If we deleted a savings transaction, we should refresh the savings tab if it's active
        if(document.getElementById('savings').classList.contains('active')) renderSavings();
    }
}