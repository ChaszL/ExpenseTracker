/**
 * Renders the main savings dashboard view.
 */
function renderSavings() {
    const container = document.getElementById('savings-container');
    const goalName = localStorage.getItem('savingsGoalName') || "General Savings";
    const goalAmount = parseFloat(localStorage.getItem('savingsGoalAmount')) || 1000;

    const totalSavings = transactions
        .filter(t => t.category === "Savings")
        .reduce((acc, t) => {
            const amt = parseFloat(t.amount);
            return t.type === 'expense' ? acc + amt : acc - amt;
        }, 0);

    const progressPercent = goalAmount > 0 ? Math.min((totalSavings / goalAmount) * 100, 100).toFixed(1) : 0;
    const remaining = Math.max(goalAmount - totalSavings, 0);

    container.innerHTML = `
        <div class="row g-4">
            <div class="col-md-12">
                <div class="card p-4 shadow-sm border-0">
                    <div class="d-flex justify-content-between align-items-end mb-3">
                        <div>
                            <span class="badge bg-primary mb-2">Target Goal</span>
                            <h3 class="fw-bold">${goalName}</h3>
                        </div>
                        <div class="text-end">
                            <h4 class="fw-bold mb-0">$${totalSavings.toLocaleString()} / $${goalAmount.toLocaleString()}</h4>
                            <small class="text-muted">${progressPercent}% Completed</small>
                        </div>
                    </div>
                    <div class="progress" style="height: 20px; border-radius: 10px; background-color: #e9ecef;">
                        <div class="progress-bar progress-bar-striped progress-bar-animated bg-success" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card p-4 border-0 shadow-sm h-100" id="savings-action-card">
                    <h5 class="fw-bold mb-4">Transfer Funds</h5>
                    <div id="savings-input-area">
                        <div class="d-grid gap-3">
                            <button class="btn btn-primary py-3 fw-bold" onclick="showSavingsForm('expense')">
                                <i class="bi bi-arrow-up-right-circle me-2"></i> Add to Savings
                            </button>
                            <button class="btn btn-outline-dark py-3 fw-bold" onclick="showSavingsForm('deposit')">
                                <i class="bi bi-arrow-down-left-circle me-2"></i> Withdraw to Balance
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-md-6">
                <div class="card p-4 border-0 shadow-sm h-100 bg-dark text-white">
                    <h5 class="fw-bold mb-3">Roadmap Calculation</h5>
                    <p class="opacity-75">To hit your <strong>$${goalAmount.toLocaleString()}</strong> goal:</p>
                    <h2 class="text-info fw-bold">$${remaining.toLocaleString()} Left</h2>
                    <hr class="opacity-25">
                    <p class="small mb-0 text-warning"><i class="bi bi-exclamation-triangle-fill me-2"></i>Adding to savings reduces your main dashboard balance.</p>
                </div>
            </div>
        </div>
    `;
}

/**
 * Replaces the savings view with a goal editor form (Replaces the prompt version)
 */
function setupSavingsGoal() {
    const container = document.getElementById('savings-container');
    const currentName = localStorage.getItem('savingsGoalName') || "General Savings";
    const currentAmount = localStorage.getItem('savingsGoalAmount') || 1000;

    container.innerHTML = `
        <div class="card p-4 border-0 shadow-sm mx-auto" style="max-width: 500px;">
            <h4 class="fw-bold mb-4 text-primary">Update Savings Goal</h4>
            <form id="editGoalForm">
                <div class="mb-3">
                    <label class="form-label fw-bold">Goal Name</label>
                    <input type="text" id="newGoalName" class="form-control" value="${currentName}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label fw-bold">Target Amount</label>
                    <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input type="number" id="newGoalAmount" class="form-control" value="${currentAmount}" step="0.01" required>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary flex-grow-1 fw-bold">Save Changes</button>
                    <button type="button" class="btn btn-light" onclick="renderSavings()">Cancel</button>
                </div>
            </form>
        </div>
    `;

    document.getElementById('editGoalForm').onsubmit = (e) => {
        e.preventDefault();
        localStorage.setItem('savingsGoalName', document.getElementById('newGoalName').value);
        localStorage.setItem('savingsGoalAmount', document.getElementById('newGoalAmount').value);
        renderSavings();
    };
}

/**
 * Inline form for adding or withdrawing funds (Replaces the prompt version)
 */
function showSavingsForm(type) {
    const inputArea = document.getElementById('savings-input-area');
    const isContribution = (type === 'expense');
    const labelText = isContribution ? 'Amount to Save' : 'Amount to Withdraw';

    inputArea.innerHTML = `
        <form id="savingsSubmitForm">
            <div class="mb-3">
                <label class="form-label fw-bold">${labelText}</label>
                <div class="input-group">
                    <span class="input-group-text">$</span>
                    <input type="number" step="0.01" id="savingsAmountInput" class="form-control" placeholder="0.00" required>
                </div>
            </div>
            <div class="d-flex gap-2">
                <button type="submit" class="btn btn-success flex-grow-1 fw-bold">Confirm</button>
                <button type="button" class="btn btn-light" onclick="renderSavings()">Cancel</button>
            </div>
        </form>
    `;

    document.getElementById('savingsSubmitForm').onsubmit = (e) => {
        e.preventDefault();
        const amount = document.getElementById('savingsAmountInput').value;
        processSavingsAction(type, amount);
    };
}

function processSavingsAction(type, amount) {
    if (amount && !isNaN(amount) && parseFloat(amount) > 0) {
        const isContribution = (type === 'expense');
        const newTx = {
            date: new Date().toISOString().split('T')[0],
            name: isContribution ? "Saved: " + (localStorage.getItem('savingsGoalName') || "Savings") : "Withdrew from Savings",
            category: "Savings",
            type: type,
            amount: amount
        };

        transactions.push(newTx);
        saveData();
        renderSavings();
    }
}