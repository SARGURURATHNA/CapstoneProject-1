// Sample subscriber data
const subscribers = [
    {
        name: "John Doe",
        phone: "+91 9876543210",
        email: "johndoe@example.com",
        address: "123, ABC Street, Mumbai",
        dob: "01 Jan 1990",
        cost: "₹25",
        date: "Feb 26, 2025",
        transactionId: "TXN12345",
        paymentMode: "Credit Card",
        validity: "28 Days",
        data: "2GB/Day",
        sms: "100 SMS/Day",
        calls: "Unlimited"
    },
    {
        name: "Jane Smith",
        phone: "+91 8765432109",
        email: "janesmith@example.com",
        address: "456, XYZ Road, Delhi",
        dob: "10 Feb 1995",
        cost: "₹15",
        date: "Feb 25, 2025",
        transactionId: "TXN67890",
        paymentMode: "Debit Card",
        validity: "14 Days",
        data: "1GB/Day",
        sms: "50 SMS/Day",
        calls: "Unlimited"
    },
    {
        name: "Helen Mac",
        phone: "+91 5462317890",
        email: "helen@example.com",
        address: "48, XB Road, Ladak",
        dob: "16 Mar 1995",
        cost: "₹30",
        date: "Feb 25, 2025",
        transactionId: "TXN62390",
        paymentMode: "Net Banking",
        validity: "14 Days",
        data: "1GB/Day",
        sms: "50 SMS/Day",
        calls: "Unlimited"
    },
    {
        name: "George Bill",
        phone: "+91 9788432109",
        email: "george@example.com",
        address: "56, Rock Road, Mumbai",
        dob: "10 Apr 2000",
        cost: "₹56",
        date: "Feb 25, 2025",
        transactionId: "TXN67849",
        paymentMode: "Upi",
        validity: "26 Days",
        data: "1GB/Day",
        sms: "50 SMS/Day",
        calls: "Unlimited"
    }
];

// Dashboard metrics data
const dashboardMetrics = {
    totalSubscribers: 4215,
    activeSubscribers: 3890,
    monthlyRevenue: "₹1,48,500"
};

document.addEventListener("DOMContentLoaded", function() {
    // Set dashboard metrics
    document.getElementById("totalSubscribers").textContent = dashboardMetrics.totalSubscribers.toLocaleString();
    document.getElementById("activeSubscribers").textContent = dashboardMetrics.activeSubscribers.toLocaleString();
    document.getElementById("monthlyRevenue").textContent = dashboardMetrics.monthlyRevenue;
    
    // Display subscribers
    displaySubscribers();
    
    // Setup event handlers
    setupEventHandlers();
    
    // Setup profile modal
    setupProfileModal();
});

const subsContainer = document.getElementById("SubsContainer");

// Function to display subscriber details dynamically
function displaySubscribers() {
    subscribers.forEach((subscriber, index) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-lg-6 col-xl-6 mb-4";
        
        colDiv.innerHTML = `
            <div class="card subscriber-card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-1">${subscriber.name}</h5>
                            <p class="mb-0 text-muted"><i class="material-icons small vertical-align-middle">phone</i> ${subscriber.phone}</p>
                        </div>
                        <div class="download-icon">
                            <span class="material-icons btn-download" data-index="${index}">download</span>
                        </div>
                    </div>
                </div>
                
                <div class="card-body pb-0">
                    <div class="mb-3">
                        <p class="mb-1"><strong>Expiring:</strong> <span class="text-danger">${subscriber.date}</span></p>
                        <p class="mb-1"><strong>Plan:</strong> ${subscriber.cost} / ${subscriber.validity}</p>
                    </div>
                    
                    <!-- Personal Details Section -->
                    <div class="details-section">
                        <h6 class="mb-3">Personal Details</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Email:</strong><br>${subscriber.email}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>DOB:</strong><br>${subscriber.dob}</p>
                            </div>
                        </div>
                        <p><strong>Address:</strong><br>${subscriber.address}</p>
                    </div>
                    
                    <!-- Recharge History Section -->
                    <div class="recharge-section">
                        <h6 class="mb-3">Transaction Details</h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <p><strong>Transaction ID:</strong><br>${subscriber.transactionId}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Payment Mode:</strong><br>${subscriber.paymentMode}</p>
                            </div>
                        </div>
                        
                        <h6 class="mb-3">Plan Details</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Cost:</strong> ${subscriber.cost}</p>
                                <p><strong>Validity:</strong> ${subscriber.validity}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Data:</strong> ${subscriber.data}</p>
                                <p><strong>SMS:</strong> ${subscriber.sms}</p>
                                <p><strong>Calls:</strong> ${subscriber.calls}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card-footer">
                    <div class="row">
                        <div class="col-6 pe-1">
                            <button class="btn btn-primary action-btn btn-details" data-index="${index}">View Details</button>
                        </div>
                        <div class="col-6 ps-1">
                            <button class="btn btn-secondary action-btn btn-recharge" data-index="${index}">Recharge History</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        subsContainer.appendChild(colDiv);
    });
}

function setupEventHandlers() {
    // Setup details view buttons
    document.querySelectorAll(".btn-details").forEach((btn) => {
        btn.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            const card = this.closest(".subscriber-card");
            const detailsSection = card.querySelector(".details-section");
            const rechargeSection = card.querySelector(".recharge-section");
            
            rechargeSection.style.display = "none";
            detailsSection.style.display = detailsSection.style.display === "none" ? "block" : "none";
        });
    });

    // Setup recharge history buttons
    document.querySelectorAll(".btn-recharge").forEach((btn) => {
        btn.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            const card = this.closest(".subscriber-card");
            const detailsSection = card.querySelector(".details-section");
            const rechargeSection = card.querySelector(".recharge-section");
            
            detailsSection.style.display = "none";
            rechargeSection.style.display = rechargeSection.style.display === "none" ? "block" : "none";
        });
    });

    // Setup download buttons
    document.querySelectorAll(".btn-download").forEach(button => {
        button.addEventListener("click", function() {
            const index = this.getAttribute("data-index");
            downloadExcel(subscribers[index]);
        });
    });

    // Setup download all button
    document.getElementById("downloadAll").addEventListener("click", () => {
        downloadAllExcel();
    });
}

// Function to generate and download an Excel file for a single subscriber
function downloadExcel(subscriber) {
    // Data for Excel
    const sheetData = [
        ["Subscriber Details"],
        ["Name", subscriber.name],
        ["Phone", subscriber.phone],
        ["Email", subscriber.email],
        ["Address", subscriber.address],
        ["DOB", subscriber.dob],
        [],
        ["Recharge History"],
        ["Transaction ID", subscriber.transactionId],
        ["Payment Mode", subscriber.paymentMode],
        [],
        ["Plan Details"],
        ["Cost", subscriber.cost],
        ["Validity", subscriber.validity],
        ["Data", subscriber.data],
        ["SMS", subscriber.sms],
        ["Calls", subscriber.calls]
    ];

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(wb, ws, "Recharge History");

    // Create Excel file and trigger download
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${subscriber.name}_Recharge_History.xlsx`;
    link.click();
}

// Function to download all subscribers data
function downloadAllExcel() {
    // Convert subscriber data into an array of objects
    const data = subscribers.map(subscriber => ({
        "Name": subscriber.name,
        "Phone": subscriber.phone,
        "Email": subscriber.email,
        "Address": subscriber.address,
        "DOB": subscriber.dob,
        "Cost": subscriber.cost,
        "Date": subscriber.date,
        "Transaction ID": subscriber.transactionId,
        "Payment Mode": subscriber.paymentMode,
        "Validity": subscriber.validity,
        "Data": subscriber.data,
        "SMS": subscriber.sms,
        "Calls": subscriber.calls
    }));

    // Create a new workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Recharge History");

    // Create and trigger the download
    XLSX.writeFile(wb, "Recharge_History.xlsx");
}

function setupProfileModal() {
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordSpan = document.getElementById("adminPassword");

    const loggedInAdmin = JSON.parse(sessionStorage.getItem("loggedInAdmin"));

    const mobileNumber = loggedInAdmin?.mobileNumber;

    if (mobileNumber) {
        fetch(`http://localhost:8083/api/users/mobile/${mobileNumber}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById("adminFirstName").textContent = user.firstName || "-";
                document.getElementById("adminLastName").textContent = user.lastName || "-";
                document.getElementById("adminPhone").textContent = user.mobileNumber || "-";
                document.getElementById("adminAlternatePhone").textContent = user.alternateMobile || "-";
                document.getElementById("adminEmail").textContent = user.email || "-";
                document.getElementById("adminDOB").textContent = user.dob || "-";
                document.getElementById("adminUsername").textContent = user.username || "-";

                togglePasswordBtn.addEventListener("click", function () {
                    if (passwordSpan.textContent === "*******") {
                        passwordSpan.textContent = user.password || "-";
                        togglePasswordBtn.textContent = "Hide";
                    } else {
                        passwordSpan.textContent = "*******";
                        togglePasswordBtn.textContent = "Show";
                    }
                });
            
                // Set hidden password for toggle
                passwordSpan.textContent = "*******";
                togglePasswordBtn.dataset.password = user.password;

                // Optional: combine multiple address fields if needed
                if (user.addresses && user.addresses.length > 0) {
                    const address = user.addresses[0]; // taking first address
                    const fullAddress = `${address.doorNo || ""}, ${address.street || ""}, ${address.city || ""}, ${address.district || ""}, ${address.state || ""}, ${address.pincode || ""}`;
                    document.getElementById("adminAddress").textContent = fullAddress;
                } else {
                    document.getElementById("adminAddress").textContent = "-";
                }
            })
            .catch(error => {
                console.error("Error fetching admin data:", error);
            });
    }
}

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
}