
document.addEventListener("DOMContentLoaded", function () {
    const modalEl = document.getElementById("planModal");
    planModal = new bootstrap.Modal(modalEl);
    let user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const historyContainer = document.getElementById("historyContainer");
        fetch(`http://localhost:8083/api/recharge/history?userId=${user.userId}`)
        .then(res => res.json())
        .then(history => {
            if (history.length === 0) {
                document.getElementById("historyContainer").innerHTML = "<p>No history found</p>";
                return;
            }

            // Loop over history and create HTML cards as before
            history.forEach(item => {
            const card = document.createElement("div");
            card.className = "card mb-3 p-3";
            card.innerHTML = `
                <div class="card-content">
                <h4 class="cost">₹${item.cost}</h4>
                <p class="recharge_date">${item.rechargeDate}</p>
                <button class="view-btn btn btn-primary rounded">View Details</button>
                <button class="download-btn btn btn-primary rounded">Download Invoice<span class="material-symbols-outlined">download</span></button>
                </div>

                <div class="details">
                <p><strong>Transaction Details</strong></p>
                <table class="transaction-table">
                <tr>
                    <td><strong>Transaction ID</strong></td>
                    <td id="transactionId">${item.transactionRef}</td>
                </tr>
                <tr>
                    <td><strong>Payment Mode</strong></td>
                    <td id="paymentMethod">${item.paymentMode}</td>
                </tr>
                <tr>
                    <td><strong>Payment Status</strong></td>
                    <td id="paymentMethod">${item.paymentStatus}</td>
                </tr>
                </table>

                <p style="margin-top: 30px;"><strong>Plan Details</strong></p>
                <table class="plan-table">
                    <tr>
                        <td><strong>Cost</strong></td>
                        <td id="planCost">₹${item.cost}</td>
                    </tr>
                    <tr>
                        <td><strong>Validity</strong></td>
                        <td id="planValidity">${item.validity}</td>
                    </tr>
                    <tr>
                        <td><strong>Data</strong></td>
                        <td id="planData">${item.data}</td>
                    </tr>
                    <tr>
                        <td><strong>SMS</strong></td>
                        <td id="planSms">${item.sms}</td>
                    </tr>
                    <tr>
                        <td><strong>Calls</strong></td>
                        <td id="planCalls">${item.calls}</td>
                    </tr>
                </table>
                </div>
                `;
            
            const viewBtn = card.querySelector(".view-btn");
            const details = card.querySelector(".details");

            viewBtn.addEventListener("click", function () {
                $(details).slideToggle();
            });

            const downloadBtn = card.querySelector(".download-btn");
            downloadBtn.addEventListener("click", function () {
                downloadInvoice({
                    // month,
                    cost:item.cost,
                    validity:item.validity,
                    data:item.data,
                    sms:item.sms,
                    calls:item.calls,
                    date:item.rechargeDate,
                    transactionId:item.transactionRef,
                    paymentMode:item.paymentMode,
                    paymentStatus:item.paymentStatus
                });
            });

            historyContainer.appendChild(card);
        });
    });

    fetch(`http://localhost:8083/api/recharge/current-plan/details?userId=${user.userId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("status-badge").innerText = data.status;
            document.getElementById("current_plan_cost").innerText = `₹${data.cost}`;
            
            const expiryDate = new Date(data.expiryDate);
            const formattedDate = expiryDate.toLocaleString('default', {year:'numeric', month: 'long', day: 'numeric' });

            document.getElementById("current_plan_expiry").innerText = formattedDate;
        })
        .catch(err => {
            console.error("Error loading current plan:", err);
        });

        const viewPlanBtn = document.querySelector(".current-plan button");

        viewPlanBtn.addEventListener("click", () => {

            if (!user || !user.userId) {
                console.error("User not found in sessionStorage");
                return;
            }

            fetch(`http://localhost:8083/api/recharge/current-plan/details?userId=${user.userId}`)
                .then(res => res.json())
                .then(data => {
                    // Set the values in the modal
                    document.getElementById("current_plan_cost").innerText = `₹${data.cost}`;
                    document.getElementById("modalCost").innerText = `₹${data.cost}`;
                    document.getElementById("modalValidity").innerText = `${data.validity} days`;
                    document.getElementById("modalData").innerText = data.data;
                    document.getElementById("modalSms").innerText = `${data.sms} SMS/day`;
                    document.getElementById("modalCalls").innerText = data.calls;
                    planModal.show();
                })
                .catch(error => {
                    console.error("Error fetching plan details:", error);
                });
        });

        modalEl.addEventListener("hidden.bs.modal", () => {
            //Clean up backdrop manually just in case
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
        });



    function downloadInvoice({cost, validity, data, sms, calls, date, transactionId, paymentMode, paymentStatus }) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Add Title
        doc.setFontSize(18);
        doc.text("Invoice", 90, 10);
    
        const columnStyles = {
            0: { cellWidth: 50 },
            1: { cellWidth: 100 }
        };
    
        // Transaction Details Data
        const transactionData = [
            [{ content: "Transaction Details", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fillColor: [200, 200, 200] } }],
            ["Date", date],
            ["Transaction ID", transactionId],
            ["Payment Mode", paymentMode],
            ["Payment Status", paymentStatus]
        ];
    
        // Add Transaction Details Table
        doc.autoTable({
            body: transactionData,
            startY: 20,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 20 },
            columnStyles: columnStyles // Apply uniform column widths
        });
    
        // Get the current Y position after first table and add space
        let finalY = doc.lastAutoTable.finalY + 10; 
    
        // Plan Details Data
        const planData = [
            [{ content: "Plan Details", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fillColor: [200, 200, 200] } }],
            ["Cost", cost],
            ["Validity", validity],
            ["Data", data],
            ["SMS", sms],
            ["Calls", calls]
        ];
    
        // Add Plan Details Table with consistent column widths
        doc.autoTable({
            body: planData,
            startY: finalY,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 20 },
            columnStyles: columnStyles // Apply same column width as first table
        });
    
        // Save the PDF
        doc.save("Invoice.pdf");
    }
    
    const storedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const userId = storedUser?.userId;

    if (!userId) {
        console.error("No userId found in sessionStorage.");
        return;
    }

    fetch(`http://localhost:8083/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            // Populate profile
            document.getElementById("userName").textContent = user.firstName + " " + user.lastName;
            document.getElementById("editfirstName").value = user.firstName;
            document.getElementById("editlastName").value = user.lastName;
            document.getElementById("editMobile").value = user.mobileNumber;
            document.getElementById("editalternateMobile").value = user.alternateMobile;
            document.getElementById("editDob").value = user.dob;
            document.getElementById("editEmail").value = user.email;

            // Assuming single address
            const address = user.addresses[0];
            if (address) {
                const fullAddress = `${address.doorNo}, ${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`;
                document.getElementById("editAddress").value = fullAddress;
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
        });

    // Save only email when the Save Changes button is clicked
    document.getElementById("saveChanges").addEventListener("click", function() {
        let updatedEmail = document.getElementById("editEmail").value;

        // Update the email field in localStorage
        userDetails.email = updatedEmail;
        localStorage.setItem("userDetails", JSON.stringify(userDetails));

        // Close the modal
        let modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        modal.hide();

        console.log("Updated Email:", updatedEmail);
    });
    
});

document.getElementById("editButton").addEventListener("click", function () {
    let editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
});

document.addEventListener("DOMContentLoaded", function () {
    const viewPlanButton = document.querySelector(".current-plan button");

    viewPlanButton.addEventListener("click", function () {
        let planModal = new bootstrap.Modal(document.getElementById("planModal"));
        planModal.show();
    });
});


