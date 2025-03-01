var isQuickRecharge = false;
window.onload=function(){
    const urlParams = new URLSearchParams(window.location.search);
    isQuickRecharge = urlParams.get('quickRecharge');
};


function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function showLoginPopup() {
    let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
}

function selectPlan(cost, validity, data, sms, calls) {

    if(!isQuickRecharge){
    if (!isLoggedIn()) {
        showLoginPopup();
        return;
    }}
    const url = `../planConfirmPage/PlanConfirm.html?cost=${encodeURIComponent(cost)}&validity=${encodeURIComponent(validity)}&data=${encodeURIComponent(data)}&sms=${encodeURIComponent(sms)}&calls=${encodeURIComponent(calls)}`;
    window.location.href = url;
}

const plansData = {
    "5G Packs": [
        { cost: "2025", validity: "200 Days", data: "2.5 GB/Day", sms: "150 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "999", validity: "98 Days", data: "2 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "749", validity: "98 Days", data: "1 GB/Day", sms: "200 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "679", validity: "110 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "599", validity: "90 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "459", validity: "85 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "349", validity: "70 Days", data: "1.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" },
        { cost: "399", validity: "90 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Unlimited 5G" }
    ],
    "Monthly Packs": [
        { cost: "445", validity: "28 Days", data: "2 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"JioHotstar included" },
        { cost: "549", validity: "24 Days", data: "2.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Netflix included" },
        { cost: "449", validity: "28 Days", data: "2 GB/Day", sms: "150 SMS/day", calls: "Unlimited" },
        { cost: "409", validity: "20 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" },
        { cost: "389", validity: "28 Days", data: "2 GB/Day", sms: "150 SMS/day", calls: "Unlimited" },
        { cost: "349", validity: "24 Days", data: "1.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"SonyLiv included" },
        { cost: "359", validity: "28 Days", data: "2 GB/Day", sms: "150 SMS/day", calls: "Unlimited",benefits:"Zee5 included" },
        { cost: "309", validity: "20 Days", data: "1 GB/Day", sms: "100 SMS/day", calls: "Unlimited" }
    ],
    "Annual Packs": [
        { cost: "1299", validity: "250 Days", data: "2 GB/Day", sms: "200 SMS/day", calls: "Unlimited",benefits:"Zee5 included" },
        { cost: "1499", validity: "266 Days", data: "2 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"JioHotstar included" },
        { cost: "1666", validity: "356 Days", data: "2.5 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "2500", validity: "365 Days", data: "3 GB/Day", sms: "200 SMS/day", calls: "Unlimited" ,benefits:"Netflix included"},
        { cost: "3500", validity: "365 Days", data: "3.5 GB/Day", sms: "200 SMS/day", calls: "Unlimited",benefits:"AmazonPrime included" },
        { cost: "2000", validity: "356 Days", data: "24 GB", sms: "200 SMS/day", calls: "Unlimited",benefits:"SonyLiv included" },
        { cost: "2200", validity: "346 Days", data: "2 GB/Day", sms: "200 SMS/day", calls: "Unlimited" },
        { cost: "1999", validity: "356 Days", data: "1.5 GB/Day", sms: "100 SMS/day", calls: "Unlimited",benefits:"Aha included" }
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

    // Function to get URL parameter
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Function to display plans
    function displayPlans(category) {
        planContainer.innerHTML = ""; // Clear existing plans

        // Find the tab with the matching category and make it active
        tabs.forEach(tab => {
            if (tab.innerText.trim() === category) {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
            }
        });

        // Check if plans exist for the category
        if (plansData[category]) {
            plansData[category].forEach(plan => {
                const benefitsHTML = plan.benefits 
                ?  `<div class="benefit-badge">
                ${plan.benefits}
                </div>`
                : "";
                const planHTML = `
                <div class="col-md-3 col-sm-6 g-5">
                    <div class="plan-card h-100 text-center position-relative">
                    ${benefitsHTML}
                        <h3 class="price fw-bold text-start">₹${plan.cost}</h3>
                        <div class="d-flex flex-column align-items-center gap-1">
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">Validity</p>
                                <p>${plan.validity}</p>
                            </div>
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">Data</p>
                                <p>${plan.data}</p>
                            </div>
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">SMS</p>
                                <p>${plan.sms}</p>
                            </div>
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">Calls</p>
                                <p>${plan.calls}</p>
                            </div>
                            
                        </div>
                        <button class="btn btn-buy w-100 mt-3" onclick="selectPlan('${plan.cost}', '${plan.validity}', '${plan.data}', '${plan.sms}', '${plan.calls}')">Buy</button>
                    </div>
                </div>
                `;
                planContainer.innerHTML += planHTML;
            });
        } else {
            planContainer.innerHTML = "<p>Sorry! Currently, no plans are available for this category.</p>";
        }
    }

    // Get category from URL
    let selectedCategory = getQueryParam("category") || "5G Packs";

    // Display the correct plans on page load
    displayPlans(selectedCategory);

    // Handle tab click event (switching categories within the page)
    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            tabs.forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            const category = this.innerText.trim();
            displayPlans(category);
            history.pushState(null, "", `?category=${encodeURIComponent(category)}`); // Update URL without reloading
        });
    });
});
