document.addEventListener("DOMContentLoaded", function () {
    // Get userId from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    
    if (!userId) {
        console.error("No userId found in URL parameters");
        document.getElementById("historyContainer").innerHTML = "<p>Error: User ID not found</p>";
        return;
    }
    
    const historyContainer = document.getElementById("historyContainer");
    const userInfoSection = document.getElementById("userInfoSection");
    let userData = {};
    let currentPlanData = {};
    let rechargeHistory = [];
    
    // Fetch recharge history
    fetch(`http://localhost:8083/api/recharge/history?userId=${userId}`)
        .then(res => res.json())
        .then(history => {
            rechargeHistory = history; // Store history data for export
            
            if (history.length === 0) {
                document.getElementById("historyContainer").innerHTML = "<p>No history found</p>";
                return;
            }

            // Loop over history and create HTML cards
            history.forEach(item => {
                const card = document.createElement("div");
                card.className = "card mb-3 p-3";
                card.innerHTML = `
                    <div class="card-content">
                    <h4 class="cost">₹${item.cost}</h4>
                    <p class="recharge_date">${item.rechargeDate}</p>
                    <button class="view-btn btn btn-primary rounded">View Details</button>
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

                historyContainer.appendChild(card);
            });
        })
        .catch(error => {
            console.error("Error fetching recharge history:", error);
            document.getElementById("historyContainer").innerHTML = "<p>Error loading history data</p>";
        });

    // Fetch current plan details
    fetch(`http://localhost:8083/api/recharge/current-plan/details?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
            currentPlanData = data; // Store plan data for export
            
            document.getElementById("current_plan_cost").innerText = `₹${data.cost}`;
            document.getElementById("current_plan_details_cost").innerText = `₹${data.cost}`;
            document.getElementById("current_plan_details_validity").innerText = `${data.validity} days`;
            document.getElementById("current_plan_details_data").innerText = data.data;
            document.getElementById("current_plan_details_sms").innerText = `${data.sms} SMS/day`;
            document.getElementById("current_plan_details_calls").innerText = data.calls;
            document.getElementById("current_plan_expiry").innerText = data.expiryDate || "N/A";
            
            // Set status badge
            const statusBadge = document.getElementById("status-badge");
            statusBadge.innerText = "Active";
        })
        .catch(error => {
            console.error("Error fetching plan details:", error);
        });

    // Fetch user details
    fetch(`http://localhost:8083/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            userData = user; // Store user data for export
            
            // Populate user info section
            document.getElementById("userName").textContent = user.firstName + " " + user.lastName;
            document.getElementById("userMobile").textContent = user.mobileNumber;
            document.getElementById("userAltMobile").textContent = user.alternateMobile || "N/A";
            document.getElementById("userEmail").textContent = user.email;
            document.getElementById("userDob").textContent = user.dob || "N/A";

            // Assuming single address
            const address = user.addresses && user.addresses.length > 0 ? user.addresses[0] : null;
            if (address) {
                const fullAddress = `${address.doorNo}, ${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`;
                document.getElementById("userAddress").textContent = fullAddress;
            } else {
                document.getElementById("userAddress").textContent = "No address available";
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
            document.getElementById("userInfoSection").innerHTML = "<p>Error loading user data</p>";
        });
        
    // Download report functionality
    document.getElementById("downloadReport").addEventListener("click", function() {
        // Create workbook with multiple sheets
        const wb = XLSX.utils.book_new();
        
        // Account Details Sheet
        const accountDetailsData = [
            ["Account Details", ""],
            ["Name", userData.firstName + " " + userData.lastName],
            ["Mobile Number", userData.mobileNumber],
            ["Alternate Mobile", userData.alternateMobile || "N/A"],
            ["Email", userData.email],
            ["Date of Birth", userData.dob || "N/A"],
        ];
        
        // Add address if available
        if (userData.addresses && userData.addresses.length > 0) {
            const address = userData.addresses[0];
            const fullAddress = `${address.doorNo}, ${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`;
            accountDetailsData.push(["Address", fullAddress]);
        } else {
            accountDetailsData.push(["Address", "No address available"]);
        }
        
        const accountWS = XLSX.utils.aoa_to_sheet(accountDetailsData);
        XLSX.utils.book_append_sheet(wb, accountWS, "Account Details");
        
        // Current Plan Sheet
        const currentPlanSheetData = [
            ["Current Plan Details", ""],
            ["Cost", `₹${currentPlanData.cost || ""}`],
            ["Validity", `${currentPlanData.validity || ""} days`],
            ["Data", currentPlanData.data || ""],
            ["SMS", `${currentPlanData.sms || ""} SMS/day`],
            ["Calls", currentPlanData.calls || ""],
            ["Expiry Date", currentPlanData.expiryDate || "N/A"]
        ];
        
        const planWS = XLSX.utils.aoa_to_sheet(currentPlanSheetData);
        XLSX.utils.book_append_sheet(wb, planWS, "Current Plan");
        
        // Recharge History Sheet
        const historyHeaders = ["Date", "Cost", "Transaction ID", "Payment Mode", "Payment Status", "Validity", "Data", "SMS", "Calls"];
        const historyData = [historyHeaders];
        
        rechargeHistory.forEach(item => {
            historyData.push([
                item.rechargeDate,
                `₹${item.cost}`,
                item.transactionRef,
                item.paymentMode,
                item.paymentStatus,
                item.validity,
                item.data,
                item.sms,
                item.calls
            ]);
        });
        
        const historyWS = XLSX.utils.aoa_to_sheet(historyData);
        XLSX.utils.book_append_sheet(wb, historyWS, "Recharge History");
        
        // Generate Excel file and trigger download
        const userName = userData.firstName ? `${userData.firstName}_${userData.lastName}` : "subscriber";
        const fileName = `${userName}_Report_${new Date().toISOString().split('T')[0]}.xlsx`;
        XLSX.writeFile(wb, fileName);
    });

    const goBackBtn = document.getElementById("goBackBtn");

    goBackBtn.addEventListener("click", function () {
        if (document.referrer) {
            // Go back to the referring page
            window.location.href = document.referrer;
        } else {
            // Fallback if referrer is not available
            window.history.back();
        }
    });
});

function handleLogout() {
    sessionStorage.clear();
    // Redirect to login page
    window.location.href = "../loginPage/Login.html";
}