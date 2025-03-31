window.onload = function () {
    // Line Chart (Revenue)
    fetch("http://localhost:8083/api/users/metrics")
    .then(response => response.json())
    .then(data => {
        const revenueData = data.monthlyRevenueData;
        const labels = Object.keys(revenueData); // e.g., ["Jan", "Feb", ...]
        const revenueValues = Object.values(revenueData).map(val => (val / 1000).toFixed(2)); // Convert to thousands

        const lineCtx = document.getElementById('lineChart').getContext('2d');
        new Chart(lineCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue (in ₹ Thousands)',
                    data: revenueValues,
                    borderColor: '#00c9a7',
                    backgroundColor: 'rgba(0, 201, 167, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    pointBackgroundColor: '#007bff'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: { color: '#333', font: { size: 14 } }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(tooltipItem) {
                                return `₹${tooltipItem.raw}K`;
                            }
                        }
                    },
                    title: {
                        display: true,
                        color: '#333',
                        font: { size: 18, weight: 'bold' }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: "Revenue (₹ Thousands)",
                            color: '#333',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#333'
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Month",
                            color: '#333',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#333'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    });


    // Bar Chart (Recharges)
    fetch('http://localhost:8083/api/recharge/monthly-recharges')
    .then(response => response.json())
    .then(data => {
        const labels = Object.keys(data); // Example: ["January", "February", ..., "December"]
        const values = Object.values(data).map(count => (count / 1000).toFixed(2)); // In thousands

        const barCtx = document.getElementById('barChart').getContext('2d');

        new Chart(barCtx, {
            type: 'bar',  // Changed from 'line' to 'bar'
            data: {
                labels: labels,
                datasets: [{
                    label: 'Recharges (in Thousands)',
                    data: values,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        color: '#333',
                        font: { size: 18, weight: 'bold' }
                    },
                    tooltip: {
                        callbacks: {
                            label: function (tooltipItem) {
                                return `Recharges: ${tooltipItem.raw}K`;
                            }
                        }
                    },
                    legend: {
                        labels: {
                            color: '#333',
                            font: { size: 14 }
                        }
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Month',
                            color: '#333',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#333',
                            font: { size: 12 }
                        },
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Recharges (Thousands)',
                            color: '#333',
                            font: { size: 14 }
                        },
                        ticks: {
                            color: '#333',
                            font: { size: 12 }
                        },
                        grid: {
                            color: '#e0e0e0'
                        }
                    }
                }
            }
        });
    });



    // Bar Chart (Plan Popularity)
    fetch("http://localhost:8083/api/recharge/category-recharges")
    .then(response => response.json())
    .then(data => {
        console.log(data);

        // Extract categories and counts from the response map
        const categories = Object.keys(data); // x-axis labels
        const counts = Object.values(data).map(count => (count / 1000).toFixed(2)); // in thousands

        const backgroundColors = ['#007bff', '#28a745', '#ffcc00', '#ff5733', '#6c757d'];

        const ctx = document.getElementById('planbarChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: categories,
                datasets: [{
                    label: 'Recharges (in thousands)',
                    data: counts,
                    backgroundColor: backgroundColors
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'No. of Recharges (in thousands)'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Plan Categories'
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw}k`;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => {
        console.error("Error fetching recharge category data:", error);
    });


    fetch("http://localhost:8083/api/transaction/payment-mode-counts")
    .then(response => response.json())
    .then(data => {
        const labels = data.map(entry => entry.paymentMode);
        const counts = data.map(entry => entry.count);

        const colors = ['#007bff', '#28a745', '#ffc107', '#dc3545', '#6f42c1'];

        const ctx = document.getElementById('doughnutChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: counts,
                    backgroundColor: colors
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return `${context.label}: ${context.raw}`;
                            }
                        }
                    }
                }
            }
        });
    })
    .catch(error => console.error("Failed to load payment mode data:", error));


};


//Event listener for download button.
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
    let chartType = chart.config.type;
    let fileName = "";
    let data = [];
    
    // Set proper headers based on chart type
    if (chartId === "barChart") {
        fileName = "Monthly_Recharges.xlsx";
        data.push(["Month", "Recharges (Thousands)"]);
        labels.forEach((label, index) => {
            data.push([label, chart.data.datasets[0].data[index]]);
        });
    } 
    else if (chartId === "lineChart") {
        fileName = "Monthly_Revenue.xlsx";
        data.push(["Month", "Revenue (₹ Thousands)"]);
        labels.forEach((label, index) => {
            data.push([label, chart.data.datasets[0].data[index]]);
        });
    }
    else if (chartId === "planbarChart") {
        fileName = "Plan_Popularity.xlsx";
        // First row with headers - Month and all plan categories
        let headerRow = ["Month"];
        chart.data.datasets.forEach(dataset => {
            headerRow.push(dataset.label);
        });
        data.push(headerRow);
        
        // Add data for each month
        labels.forEach((month, monthIndex) => {
            let rowData = [month];
            chart.data.datasets.forEach(dataset => {
                rowData.push(dataset.data[monthIndex]);
            });
            data.push(rowData);
        });
    }
    else if (chartId === "doughnutChart") {
        fileName = "Payment_Modes.xlsx";
        data.push(["Payment Mode", "Count"]);
        labels.forEach((label, index) => {
            data.push([label, chart.data.datasets[0].data[index]]);
        });
    }

    // Convert to worksheet
    let ws = XLSX.utils.aoa_to_sheet(data);
    let wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // Download Excel file
    XLSX.writeFile(wb, fileName);
}

function handleLogout() {
    const token = sessionStorage.getItem("accessToken");
    
    fetch("http://localhost:8083/api/auth/logout", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }).then(response => {
        if (response.ok) {
            // Clear all session storage
            sessionStorage.clear();
            // Redirect to login page
            window.location.href = "../loginPage/Login.html";
        }
    }).catch(error => {
        console.error("Logout failed:", error);
    });
}
