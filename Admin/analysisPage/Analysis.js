window.onload = function () {
    // Line Chart (Revenue)
    var lineCtx = document.getElementById('lineChart').getContext('2d');
    new Chart(lineCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Revenue (in Millions)',
                data: [5.2, 6.8, 7.5, 8.3, 9.0, 10.5],
                borderColor: '#007bff',
                fill: false,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Revenue: $${tooltipItem.raw}M`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Revenue (Millions)" } },
                x: { title: { display: true, text: "Month" } }
            }
        }
    });

    // Bar Chart (Recharges)
    var barCtx = document.getElementById('barChart').getContext('2d');
    new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Recharges (in Thousands)',
                data: [150, 180, 220, 260, 300, 350],
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            return `Recharges: ${tooltipItem.raw}K`;
                        }
                    }
                }
            },
            scales: {
                y: { beginAtZero: true, title: { display: true, text: "Recharges (Thousands)" } },
                x: { title: { display: true, text: "Month" } }
            }
        }
    });

    // Pie Chart (Plan Popularity)
    var pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['5G Packs', 'Monthly Packs', 'Annual Packs', 'Data Add-On', 'Talktime'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: ['#007bff', '#28a745', '#ffcc00', '#ff5733', '#6c757d']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(tooltipItem) {
                            let labels = ['5G Packs', 'Monthly Packs', 'Annual Packs', 'Data Add-On', 'Talktime'];
                            let value = tooltipItem.raw;
                            return `${labels[tooltipItem.dataIndex]}: ${value}%`;
                        }
                    }
                }
            }
        }
    });
};

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".download-btn").forEach(button => {
        button.addEventListener("click", function () {
            const chartId = this.getAttribute("data-chart");
            downloadChartData(chartId);
        });
    });
});

function downloadChartData(chartId) {
    let chart = Chart.getChart(chartId);
    if (!chart) return alert("Chart not found!");

    let labels = chart.data.labels;
    let dataset = chart.data.datasets[0];

    // Check if it's a Pie Chart (Pie Charts have multiple data points but no x-axis labels)
    let isPieChart = chart.config.type === 'pie';

    let data = [["Category", dataset.label || "Percentage (%)"]]; // Default to "Percentage (%)" for Pie Chart

    if (isPieChart) {
        // Fix: Pie chart lacks a dataset label, so we set a generic title
        labels.forEach((label, index) => {
            data.push([label, dataset.data[index]]);
        });
    } else {
        // Bar and Line Charts: Labels are x-axis categories, dataset.data holds values
        labels.forEach((label, index) => {
            data.push([label, dataset.data[index]]);
        });
    }

    // Convert to worksheet
    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Generate filename dynamically, avoiding undefined label
    let fileName = isPieChart ? "Plan_Popularity.xlsx" : `${dataset.label.replace(/\s+/g, '_')}.xlsx`;

    // Download Excel file
    XLSX.writeFile(wb, fileName);
}

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
    window.location.href = "../loginPage/Login.html";
}
