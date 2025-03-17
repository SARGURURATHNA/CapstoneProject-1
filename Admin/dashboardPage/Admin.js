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
        email: "georgeexample.com",
        address: "56, rock Road, Mumbai",
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

const historyContainer = document.getElementById("SubsContainer");

// Function to display subscriber details dynamically
function displaySubscribers() {
    subscribers.forEach((subscriber, index) => {
        const subscriberCard = document.createElement("div");
        subscriberCard.className = "card p-3 mb-3 w-50 shadow-sm";

        subscriberCard.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h5 class="mb-0">${subscriber.name}</h5>
                    <p class="mb-0">${subscriber.phone}</p>
                </div>
                <button class="btn bg-transparent border-0 btn-sm me-3 download-btn" data-index="${index}">
                    <span class="material-icons text-primary">download</span>
                </button>
            </div>

            <div class="d-flex">
                <button class="recharge-btn btn btn-primary btn-custom mt-2 me-2">View Recharge History</button>
                <button class="view-btn btn btn-secondary btn-custom mt-2 me-2">View Details</button>
            </div>

            <!-- Personal Details -->
            <div class="details mt-3" style="display: none;">
                <p><strong>Email:</strong> ${subscriber.email}</p>
                <p><strong>Address:</strong> ${subscriber.address}</p>
                <p><strong>DOB:</strong> ${subscriber.dob}</p>
            </div>

            <!-- Recharge History -->
            <div class="recharge-history mt-3" style="display: none;">
                <p><strong>Transaction Details</strong></p>
                <table class="table table-bordered">
                    <tr>
                        <td><strong>Transaction ID</strong></td>
                        <td>${subscriber.transactionId}</td>
                    </tr>
                    <tr>
                        <td><strong>Payment Mode</strong></td>
                        <td>${subscriber.paymentMode}</td>
                    </tr>
                </table>

                <p style="margin-top: 20px;"><strong>Plan Details</strong></p>
                <table class="table table-bordered">
                    <tr>
                        <td><strong>Cost</strong></td>
                        <td>${subscriber.cost}</td>
                    </tr>
                    <tr>
                        <td><strong>Validity</strong></td>
                        <td>${subscriber.validity}</td>
                    </tr>
                    <tr>
                        <td><strong>Data</strong></td>
                        <td>${subscriber.data}</td>
                    </tr>
                    <tr>
                        <td><strong>SMS</strong></td>
                        <td>${subscriber.sms}</td>
                    </tr>
                    <tr>
                        <td><strong>Calls</strong></td>
                        <td>${subscriber.calls}</td>
                    </tr>
                </table>
            </div>
        `;

        // Get buttons and detail sections
        const viewBtn = subscriberCard.querySelector(".view-btn");
        const rechargeBtn = subscriberCard.querySelector(".recharge-btn");
        const detailsDiv = subscriberCard.querySelector(".details");
        const rechargeDiv = subscriberCard.querySelector(".recharge-history");

        viewBtn.addEventListener("click", () => {
            rechargeDiv.style.display = "none";
            detailsDiv.style.display = detailsDiv.style.display === "none" ? "block" : "none";
        });

        rechargeBtn.addEventListener("click", () => {
            detailsDiv.style.display = "none";
            rechargeDiv.style.display = rechargeDiv.style.display === "none" ? "block" : "none";
        });

        historyContainer.appendChild(subscriberCard);
    });

    // Attach event listeners for download buttons
    document.querySelectorAll(".download-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const index = event.currentTarget.getAttribute("data-index");
            downloadExcel(subscribers[index]);
        });
    });
}

// Function to generate and download an Excel file
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

// Call the function to populate the historyContainer
displaySubscribers();

document.getElementById("downloadAll").addEventListener("click", () => {
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
});

document.addEventListener("DOMContentLoaded", function () {
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
                // document.getElementById("adminPassword").textContent = user.password || "-";

                togglePasswordBtn.addEventListener("click", function () {
                    if (passwordSpan.textContent === "*******") {
                        passwordSpan.textContent = user.password || - "-"; // Example password
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
                    const fullAddress = `${address.doorNo ||""}, ${address.street || ""}, ${address.city || ""}, ${address.district ||""}, ${address.state || ""}, ${address.pincode || ""}`;
                    document.getElementById("adminAddress").textContent = fullAddress;
                } else {
                    document.getElementById("adminAddress").textContent = "-";
                }
            })
            .catch(error => {
                console.error("Error fetching admin data:", error);
            });
    }
});

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
}
