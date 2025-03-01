
document.addEventListener("DOMContentLoaded", function () {
    const historyContainer = document.getElementById("historyContainer");
    let rechargeHistory = JSON.parse(localStorage.getItem("rechargeHistory")) || [];

    if (rechargeHistory.length === 0) {
        historyContainer.innerHTML = "<p class='text-center'>No recharge history available.</p>";
        return;
    }

    rechargeHistory.forEach(({ month, recharges }) => {
        const monthHeader = document.createElement("h5");
        monthHeader.className = "recharge-month";
        monthHeader.innerText = month;
        historyContainer.appendChild(monthHeader);

        recharges.forEach(({ cost, validity, data, sms, calls, date, transactionId, paymentMode }) => {
            const card = document.createElement("div");
            card.className = "card mb-3 p-3";
            card.innerHTML = `
                <div class="card-content">
                <h4 class="cost">₹${cost}</h4>
                <p class="recharge_date">${date}</p>
                <button class="view-btn btn btn-primary rounded">View Details</button>
                <button class="download-btn btn btn-primary rounded">Download Invoice<span class="material-symbols-outlined">download</span></button>
                </div>

                <div class="details">
                <p><strong>Transaction Details</strong></p>
                <table class="transaction-table">
                <tr>
                    <td><strong>Transaction ID</strong></td>
                    <td id="transactionId">${transactionId}</td>
                </tr>
                <tr>
                    <td><strong>Payment Mode</strong></td>
                    <td id="paymentMethod">${paymentMode}</td>
                </tr>
                </table>

                <p style="margin-top: 30px;"><strong>Plan Details</strong></p>
                <table class="plan-table">
                    <tr>
                        <td><strong>Cost</strong></td>
                        <td id="planCost">₹${cost}</td>
                    </tr>
                    <tr>
                        <td><strong>Validity</strong></td>
                        <td id="planValidity">${validity}</td>
                    </tr>
                    <tr>
                        <td><strong>Data</strong></td>
                        <td id="planData">${data}</td>
                    </tr>
                    <tr>
                        <td><strong>SMS</strong></td>
                        <td id="planSms">${sms}</td>
                    </tr>
                    <tr>
                        <td><strong>Calls</strong></td>
                        <td id="planCalls">${calls}</td>
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
                    month,
                    cost,
                    validity,
                    data,
                    sms,
                    calls,
                    date,
                    transactionId,
                    paymentMode
                });
            });

            historyContainer.appendChild(card);
        });
    });


    function downloadInvoice({ month, cost, validity, data, sms, calls, date, transactionId, paymentMode }) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Add Title
        doc.setFontSize(18);
        doc.text("Invoice", 90, 10);
    
        // Define common column styles to ensure uniform width
        const columnStyles = {
            0: { cellWidth: 50 }, // First column width (Labels)
            1: { cellWidth: 100 } // Second column width (Values)
        };
    
        // Transaction Details Data
        const transactionData = [
            [{ content: "Transaction Details", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fillColor: [200, 200, 200] } }],
            ["Date", date],
            ["Month", month],
            ["Transaction ID", transactionId],
            ["Payment Mode", paymentMode]
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
    
    
    

    // Load user details from localStorage if available
    let userDetails =  {
        name: "John",
        mobile: "7894561230",
        address: "123 Street, City",
        dob: "2000-01-01",
        email: "john@example.com"
    };

    document.getElementById("editName").value = userDetails.name;
    document.getElementById("editMobile").value = userDetails.mobile;
    document.getElementById("editAddress").value = userDetails.address;
    document.getElementById("editDob").value = userDetails.dob;
    document.getElementById("editEmail").value = userDetails.email;

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


