const plansData = {
    "5G Packs": [
        { cost: "2025", validity: "200 Days", data: "2.5 GB/Day", sms: "150 SMS/day", calls: "Unlimited" },
        { cost: "999", validity: "98 Days", data: "2 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "749", validity: "98 Days", data: "1 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "679", validity: "110 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "599", validity: "90 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "459", validity: "85 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "349", validity: "70 Days", data: "1.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "399", validity: "90 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" }
    ],
    "Monthly Packs": [
        { cost: "445", validity: "28 Days", data: "2 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "549", validity: "24 Days", data: "2.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "449", validity: "28 Days", data: "2 GB/Day", sms: "150 SMS/day", calls: "Unlimited" },
        { cost: "409", validity: "20 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "389", validity: "28 Days", data: "2 GB/Day", sms: "150 SMS/day", calls: "Unlimited" },
        { cost: "349", validity: "24 Days", data: "1.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "359", validity: "28 Days", data: "2 GB/Day", sms: "150 SMS/day", calls: "Unlimited" },
        { cost: "309", validity: "20 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" }
    ],
    "Annual Packs": [
        { cost: "1299", validity: "250 Days", data: "2 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "1499", validity: "266 Days", data: "2 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "1666", validity: "356 Days", data: "2.5 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "2500", validity: "365 Days", data: "3 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "3500", validity: "365 Days", data: "3.5 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "2000", validity: "356 Days", data: "24 GB", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "2200", validity: "346 Days", data: "2 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "1999", validity: "356 Days", data: "1.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited" }
    ],
    "Data Add-On": [
        { cost: "198", validity: "Existing", data: "2 GB/Day", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "19", validity: "Existing", data: "1 GB", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "39", validity: "Existing", data: "2 GB", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "69", validity: "Existing", data: "3 GB", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "79", validity: "Existing", data: "4 GB", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "110", validity: "Existing", data: "6 GB", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "129", validity: "Existing", data: "8 GB", sms: "Existing Pack", calls: "Existing Pack" },
        { cost: "169", validity: "Existing", data: "12 GB", sms: "Existing Pack", calls: "Existing Pack" }
    ],
    "Talktime": [
        { cost: "100", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹81.75 Talktime" },
        { cost: "500", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹423.73 Talktime" },
        { cost: "600", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹533.63 Talktime" },
        { cost: "750", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹620.83 Talktime" },
        { cost: "860", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹795.93 Talktime" },
        { cost: "900", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹820.63 Talktime" },
        { cost: "1000", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹950.73 Talktime" },
        { cost: "1200", validity: "Unlimited", data: "No Data", sms: "No SMS", calls: "₹1100.73 Talktime" }
    ]
};
document.addEventListener("DOMContentLoaded", function () {
    const planContainer = document.querySelector(".row.g-3");
    const tabs = document.querySelectorAll(".nav-tabs .nav-link");
    let selectedCategory = "5G Packs"; // Default category
    let editingPlanIndex = null; // Track the plan being edited

    function getActiveCategory() {
        return document.querySelector(".nav-tabs .nav-link.active").innerHTML.trim();
    }

    function displayPlans(category) {
        planContainer.innerHTML = ""; // Clear existing plans

        if (plansData[category]) {
            plansData[category].forEach((plan, index) => {
                const planHTML = `
                    <div class="col-md-3 col-sm-6">
                        <div class="plan-card h-100 p-3 position-relative shadow-sm rounded">
                            <div class="position-absolute top-0 end-0 p-2">
                                <span class="material-icons text-primary me-2" style="cursor: pointer;" onclick="editPlan('${category}', ${index})">edit</span>
                                <span class="material-icons text-danger" style="cursor: pointer;" onclick="removePlan('${category}', ${index})">delete</span>
                            </div>
                            <h3 class="price text-start">₹${plan.cost}</h3>
                            <div class="d-flex">
                                <div><p><strong>${plan.validity}</strong></p><p>Validity</p></div>
                                <div style="margin-left: 20px;"><p><strong>${plan.data}</strong></p><p>Data</p></div>
                                <div style="margin-left: 20px;"><p><strong>${plan.sms}</strong></p><p>SMS</p></div>
                                <div style="margin-left: 20px;"><p><strong>${plan.calls}</strong></p><p>Calls</p></div>
                            </div>
                        </div>
                    </div>
                `;
                planContainer.innerHTML += planHTML;
            });
        } else {
            planContainer.innerHTML = "<p>No plans available for this category.</p>";
        }
    }

    displayPlans(selectedCategory);

    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            selectedCategory = getActiveCategory();
            displayPlans(selectedCategory);
        });
    });


    // Open Add Plan Modal
    window.addNewPlan = function () {
        editingPlanIndex = null; // Reset editing mode
        document.getElementById("planModalLabel").innerText = "Add New Plan";
        document.getElementById("planForm").reset(); // Clear form fields
        new bootstrap.Modal(document.getElementById("planModal")).show();
    };

    // Open Edit Plan Modal
    window.editPlan = function (category, index) {
        editingPlanIndex = index;
        selectedCategory = category;
        document.getElementById("planModalLabel").innerText = "Edit Plan";

        // Fill form fields with existing plan data
        const plan = plansData[category][index];
        document.getElementById("planCost").value = plan.cost;
        document.getElementById("planValidity").value = plan.validity;
        document.getElementById("planData").value = plan.data;
        document.getElementById("planSms").value = plan.sms;
        document.getElementById("planCalls").value = plan.calls;

        new bootstrap.Modal(document.getElementById("planModal")).show();
    };
     
    // Save or Update Plan
    document.getElementById("planForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const cost = document.getElementById("planCost").value;
        const validity = document.getElementById("planValidity").value;
        const data = document.getElementById("planData").value;
        const sms = document.getElementById("planSms").value;
        const calls = document.getElementById("planCalls").value;
        const category = getActiveCategory();

        if (editingPlanIndex !== null) {
            // Edit existing plan
            plansData[category][editingPlanIndex] = { cost, validity, data, sms, calls };
            editingPlanIndex = null; // Reset edit mode
        } else {
            // Add new plan
            plansData[category] = plansData[category] || [];
            plansData[category].push({ cost, validity, data, sms, calls });
        }

        displayPlans(category); // Refresh UI
        bootstrap.Modal.getInstance(document.getElementById("planModal")).hide(); // Close modal
    });

    // Remove Plan
    window.removePlan = function (category, index) {
        if (confirm("Are you sure you want to delete this plan?")) {
            plansData[category].splice(index, 1);
            displayPlans(category);
        }
    };
    
    });