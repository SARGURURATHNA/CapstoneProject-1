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

document.addEventListener("DOMContentLoaded", function () {
    const planContainer = document.querySelector(".row.g-3");
    const tabs = document.querySelectorAll(".nav-tabs .nav-link");
    let plansData = {};

    // Function to get URL parameter
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    async function fetchPlans(category) {
        try {
            const response = await fetch(`http://localhost:8083/api/plans/category?category=${encodeURIComponent(category)}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const plans = await response.json();
            return plans;
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    function formatOttBenefits(plan) {
        if (!plan.ottNames || plan.ottNames.length === 0) {
            return null;
        }
        
        const otts = plan.ottNames.join(',');
        const categories = plan.ottCategories ? plan.ottCategories.join(',') : '';
        return `${otts}|${categories}|${plan.validity}|${plan.data}|₹${plan.price}`;
    }

    // Function to display plans
    async function displayPlans(category) {
        if (!plansData[category]) {
            plansData[category] = await fetchPlans(category);
        }
        planContainer.innerHTML = ""; // Clear existing plans

        // Find the tab with the matching category and make it active
        tabs.forEach(tab => {
            if (tab.innerText.trim() === category) {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
            }
        });


        // Check if plans exist for the category
        if (plansData[category] && plansData[category].length > 0) {
            plansData[category].forEach(plan => {
                const benefits = formatOttBenefits(plan);
                const benefitsHTML = benefits 
                ? `<div class="benefit-badge position-absolute top-0 end-0 m-2 text-white d-flex align-items-center rounded-pill px-3 py-1" style="z-index:1;">
                        <span class="me-2">${plan.badge}</span>
                        <button class="btn btn-sm p-0 border-0 bg-transparent text-white" onclick="showBenefitsModal('${benefits}')">
                            <i class="bi bi-arrow-right fs-5"></i>
                        </button>
                </div>`
                : "";
                let sms = plan.sms;
                let calls = plan.calls;
                let data = plan.data;
                let validity = plan.validity;

                // if (category === "Data Add-on") {
                    if (!sms || sms.trim() === "") sms = "Existing pack";
                    if (!calls || calls.trim() === "") calls = "Existing pack";
                // }

                if (category === "Talktime") {
                    if (!data || data.trim() === "") data = "N/A";
                    if (validity === null || validity === undefined || validity === 0) validity = "N/A";
                    calls = "₹"+calls + " Talktime";
                }
                const planHTML = `
                <div class="col-md-3 col-sm-6 g-5">
                    <div class="plan-card h-100 text-center position-relative">
                    ${benefitsHTML}
                        <h3 class="price fw-bold text-start">₹${plan.price}</h3>
                        <div class="d-flex flex-column align-items-center gap-1">
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">Validity</p>
                                <p>${validity}</p>
                            </div>
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">Data</p>
                                <p>${data}</p>
                            </div>
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">SMS</p>
                                <p>${sms}</p>
                            </div>
                            <div class="d-flex justify-content-between w-100">
                                <p class="fw-bold">Calls</p>
                                <p>${calls}</p>
                            </div>
                            
                        </div>
                        <button class="btn btn-buy w-100 mt-3" onclick="selectPlan('${plan.price}', '${validity}', '${data}', '${sms}', '${calls}')">Buy</button>
                    </div>
                </div>
                `;
                planContainer.innerHTML += planHTML;
            });
        } else {
            planContainer.innerHTML = "<p>Sorry! Currently, no plans are available for this category.</p>";
        }
    }

    // Function to initialize category tabs
    async function initializeTabs() {
        try {
            // Fetch all unique categories
            const response = await fetch("http://localhost:8083/api/plans/categories");
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const categoryList = await response.json();
            const categories = new Set(categoryList);
            
            // Get category from URL or use first available
            let selectedCategory = getQueryParam("category");
            
            if (!selectedCategory || !categories.has(selectedCategory)) {
                selectedCategory = categories.has("5G Packs") ? "5G Packs" : categoryList[0];
            }
            await displayPlans(selectedCategory);
        } catch (error) {
            console.error("Error initializing tabs:", error);
            planContainer.innerHTML = "<p class='col-12 text-center'>Error loading plans. Please try again later.</p>";
        }
    }

    // Initialize the page
    initializeTabs();

    // Handle tab click event (switching categories within the page)
    tabs.forEach(tab => {
        tab.addEventListener("click", function (event) {
            event.preventDefault();
            const category = this.innerText.trim();
            displayPlans(category);
            history.pushState(null, "", `?category=${encodeURIComponent(category)}`); // Update URL without reloading
        });
    });
});

function showBenefitsModal(benefit) {
    const [subsString, categoriesString, validity, totalData, cost] = benefit.split("|");
    const subscriptionImages = document.getElementById("subscriptionImages");
    const packDetailsTable = document.getElementById("packDetailsTable").querySelector("tbody");
  
    // Clear previous content
    subscriptionImages.innerHTML = "";
    packDetailsTable.innerHTML = "";
  
    const subscriptions = subsString.split(",");
    const categories = categoriesString.split(",");
  
    // Render subscription logos
    subscriptions.forEach((sub, i) => {
        const div = document.createElement("div");
        div.classList.add("text-center", "me-3");

        const img = document.createElement("img");
        img.src = `Assets/${sub.trim().toLowerCase()}.png`;
        img.alt = sub.trim();
        img.style.height = "40px";
        img.classList.add("d-block", "mx-auto");

        const label = document.createElement("div");
        label.innerText = categories[i]?.charAt(0).toUpperCase() + categories[i]?.slice(1);
        label.classList.add("small", "text-muted");

        div.appendChild(img);
        div.appendChild(label);
        subscriptionImages.appendChild(div);
    });
  
    // Define pack detail entries
    const details = [
      { label: "Cost", value: cost },
      { label: "Validity", value: validity },
      { label: "Data", value: totalData },
    ];
  
    // Add rows to table
    details.forEach(detail => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td class="fw-bold">${detail.label}</td>
        <td>${detail.value}</td>
      `;
      packDetailsTable.appendChild(row);
    });
  
    // Show modal
    const benefitModal = new bootstrap.Modal(document.getElementById('benefitModal'));
    benefitModal.show();
}  