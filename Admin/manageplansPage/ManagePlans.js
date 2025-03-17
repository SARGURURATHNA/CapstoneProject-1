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
                        <div class="d-flex justify-content-center gap-3 mt-2">
                            <span class="material-icons text-primary cursor-pointer" onclick='openEditModal(${JSON.stringify(plan)})' title="Edit">edit</span>
                            <span class="material-icons text-danger cursor-pointer" onclick="deletePlan(${plan.planId})" title="Delete">delete</span>
                        </div>
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
        const tabContainer = document.getElementById("categoryTabs");
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
            categoryList.forEach((category, index) => {
                const li = document.createElement("li");
                li.className = "nav-item";
    
                const a = document.createElement("a");
                a.className = "nav-link";
                if (category === selectedCategory) {
                    a.classList.add("active");
                }
    
                a.href = "#";
                a.innerText = category;
                a.dataset.category = category;
    
                a.addEventListener("click", async (e) => {
                    e.preventDefault();
    
                    // Update active tab
                    document.querySelectorAll("#categoryTabs .nav-link").forEach(link => link.classList.remove("active"));
                    a.classList.add("active");

                    history.pushState(null, "", `?category=${encodeURIComponent(category)}`);
    
                    await displayPlans(category);
                });
    
                li.appendChild(a);
                tabContainer.appendChild(li);
            });
            await displayPlans(selectedCategory);
        } catch (error) {
            console.error("Error initializing tabs:", error);
            planContainer.innerHTML = "<p class='col-12 text-center'>Error loading plans. Please try again later.</p>";
        }
    }

    // Initialize the page
    initializeTabs();

    // Handle tab click event (switching categories within the page)
    // tabs.forEach(tab => {
    //     tab.addEventListener("click", function (event) {
    //         event.preventDefault();
    //         const category = this.innerText.trim();
    //         displayPlans(category);
    //         history.pushState(null, "", `?category=${encodeURIComponent(category)}`); // Update URL without reloading
    //     });
    // }); 
});

async function deletePlan(planId) {
    const confirmed = confirm("Are you sure you want to delete this plan?");
    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:8083/api/plans/${planId}`, {
            method: "DELETE"
        });

        if (response.ok || response.status === 204) {
            alert("Plan deleted successfully.");
            //initializeTabs(); // Re-fetch and refresh all plans
        } else {
            const errorText = await response.text();
            console.error("Delete failed:", errorText);
            alert("Failed to delete the plan.");
        }
    } catch (error) {
        console.error("Error deleting plan:", error);
        alert("An error occurred while deleting the plan.");
    }
}

document.getElementById("planForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const planId = document.getElementById("editIndex").value;
    const price = document.getElementById("planCost").value;
    const validity = document.getElementById("planValidity").value;
    const data = document.getElementById("planData").value;
    const sms = document.getElementById("planSms").value;
    const calls = document.getElementById("planCalls").value;
    const ottNames = document.getElementById("planOtt").value.split(",").map(item => item.trim());
    const ottCategories = document.getElementById("planOttCategory").value.split(",").map(item => item.trim());

    // Get selected category from active tab
    const activeTab = document.querySelector("#categoryTabs .nav-link.active");
    const categoryName = activeTab ? activeTab.dataset.category : "General";


    const requestData = {
        price,
        validity,
        data,
        sms,
        calls,
        ottNames,
        ottCategories,
        categoryName
    };

    console.log(requestData);

    try {
        const method = planId ? "PUT" : "POST";
        const url = planId
            ? `http://localhost:8083/api/plans/${planId}`
            : `http://localhost:8083/api/plans`;

        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok) {
            const result = await response.json();
            console.log(`${planId ? "Updated" : "Created"} plan:`, result);
            // Refresh the plan list
            //initializeTabs();
            bootstrap.Modal.getInstance(document.getElementById('planModal')).hide();
        } else {
            throw new Error(`Failed to ${planId ? "update" : "create"} plan`);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("Something went wrong while saving the plan.");
    }
});


function openAddPlanModal() {
    document.getElementById("editIndex").value = "";
    document.getElementById("planForm").reset();
    document.getElementById("planModalLabel").innerText = "Add New Plan";
    const modal = new bootstrap.Modal(document.getElementById("planModal"));
    modal.show();
}

function openEditModal(plan) {
    document.getElementById("planModalLabel").innerText = "Edit Plan";
    document.getElementById("editIndex").value = plan.planId;

    document.getElementById("planCost").value = plan.price;
    document.getElementById("planValidity").value = parseInt(plan.validity);
    document.getElementById("planData").value = plan.data;
    document.getElementById("planSms").value = plan.sms;
    document.getElementById("planCalls").value = plan.calls;
    document.getElementById("planOtt").value = plan.ottNames?.join(", ");
    document.getElementById("planOttCategory").value = plan.ottCategories?.join(", ");

    const modal = new bootstrap.Modal(document.getElementById('planModal'));
    modal.show();
}



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

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
}
