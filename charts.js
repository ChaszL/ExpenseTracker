let chart1 = null;
let chart2 = null;

function renderAnalytics() {
    const ctx1 = document.getElementById('cashFlowChart').getContext('2d');
    const ctx2 = document.getElementById('categoryChart').getContext('2d');

    if (chart1) chart1.destroy();
    if (chart2) chart2.destroy();

    const filtered = transactions.filter(t => t.date.startsWith(currentPeriod));

    let inc = 0, exp = 0;
    const catMap = {};

    filtered.forEach(t => {
        const val = parseFloat(t.amount);
        if (t.type === 'deposit') {
            inc += val;
        } else {
            exp += val;
            catMap[t.category] = (catMap[t.category] || 0) + val;
        }
    });

    chart1 = new Chart(ctx1, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{ 
                data: [inc, exp], 
                backgroundColor: ['#1cc88a', '#e74a3b'],
                borderRadius: 8
            }]
        },
        options: { 
            maintainAspectRatio: false,
            plugins: { 
                title: { display: true, text: `Cash Flow: ${currentPeriod}` },
                legend: { display: false }
            } 
        }
    });

    chart2 = new Chart(ctx2, {
        type: 'doughnut',
        data: {
            labels: Object.keys(catMap),
            datasets: [{ 
                data: Object.values(catMap), 
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#6610f2', '#fd7e14', '#36b9cc'] 
            }]
        },
        options: { 
            maintainAspectRatio: false,
            plugins: { title: { display: true, text: 'Spending by Category' } } 
        }
    });
}