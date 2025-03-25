var isQuickRecharge = false;
window.onload=function(){
    const urlParams = new URLSearchParams(window.location.search);
    isQuickRecharge = urlParams.get('quickRecharge');
};


function isLoggedIn() {
    return sessionStorage.getItem("isLoggedIn") === "true";
}

function showLoginPopup() {
    let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
}

function selectPlan(planId, cost, validity, data, sms, calls) {

    if(!isQuickRecharge){
    if (!isLoggedIn()) {
        showLoginPopup();
        return;
    }}
    const url = `../planConfirmPage/PlanConfirm.html?planId=${planId}&cost=${encodeURIComponent(cost)}&validity=${encodeURIComponent(validity)}&data=${encodeURIComponent(data)}&sms=${encodeURIComponent(sms)}&calls=${encodeURIComponent(calls)}`;
    window.location.href = url;
}

let currentPage = 0;
let totalPages = 0;
const pageSize = 8;

document.addEventListener("DOMContentLoaded", function () {
    const planContainer = document.querySelector(".row.g-3");
    const tabs = document.querySelectorAll(".nav-tabs .nav-link");
    let plansData = {};

    // Function to get URL parameter
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    async function fetchPlans(category, filters = {}, page=0) {
        try {
            const params = new URLSearchParams({
                category: category,
                page: page,
                size: pageSize, // Adjust if you implement pagination later
                ...filters
            });
    
            const response = await fetch(`http://localhost:8083/api/plans/category?${params}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const plansPage = await response.json();
            currentPage = plansPage.number !== undefined ? plansPage.number : 0;
            totalPages = plansPage.totalPages !== undefined ? plansPage.totalPages : 1;
            return plansPage.content || [];
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    function updatePaginationControls() {
        const paginationContainer = document.getElementById("paginationControls");
        paginationContainer.innerHTML = "";
        
        if (totalPages <= 1) {
            // Hide pagination if there's only one page
            paginationContainer.parentElement.style.display = "none";
            return;
        } else {
            paginationContainer.parentElement.style.display = "block";
        }
        
        // Previous button
        const prevLi = document.createElement("li");
        prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
        const prevBtn = document.createElement("button");
        prevBtn.className = "page-link";
        prevBtn.innerHTML = "&laquo;";
        prevBtn.setAttribute("aria-label", "Previous");
        if (currentPage > 0) {
            prevBtn.addEventListener("click", () => goToPage(currentPage - 1));
        }
        prevLi.appendChild(prevBtn);
        paginationContainer.appendChild(prevLi);
    
        // Page buttons
        const maxButtons = 5; // Maximum number of page buttons to display
        const startPage = Math.max(0, Math.min(currentPage - Math.floor(maxButtons / 2), totalPages - maxButtons));
        const endPage = Math.min(startPage + maxButtons, totalPages);
    
        // Add first page button if not visible in range
        if (startPage > 0) {
            const firstLi = document.createElement("li");
            firstLi.className = "page-item";
            const firstBtn = document.createElement("button");
            firstBtn.className = "page-link";
            firstBtn.textContent = "1";
            firstBtn.addEventListener("click", () => goToPage(0));
            firstLi.appendChild(firstBtn);
            paginationContainer.appendChild(firstLi);
    
            // Add ellipsis if there's a gap
            if (startPage > 1) {
                const ellipsisLi = document.createElement("li");
                ellipsisLi.className = "page-item disabled";
                const ellipsisSpan = document.createElement("span");
                ellipsisSpan.className = "page-link";
                ellipsisSpan.innerHTML = "&hellip;";
                ellipsisLi.appendChild(ellipsisSpan);
                paginationContainer.appendChild(ellipsisLi);
            }
        }
    
        // Numbered page buttons
        for (let i = startPage; i < endPage; i++) {
            const pageLi = document.createElement("li");
            pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
            const pageBtn = document.createElement("button");
            pageBtn.className = "page-link";
            pageBtn.textContent = i + 1;
            if (i !== currentPage) {
                pageBtn.addEventListener("click", () => goToPage(i));
            }
            pageLi.appendChild(pageBtn);
            paginationContainer.appendChild(pageLi);
        }
    
        // Add last page button if not visible in range
        if (endPage < totalPages) {
            // Add ellipsis if there's a gap
            if (endPage < totalPages - 1) {
                const ellipsisLi = document.createElement("li");
                ellipsisLi.className = "page-item disabled";
                const ellipsisSpan = document.createElement("span");
                ellipsisSpan.className = "page-link";
                ellipsisSpan.innerHTML = "&hellip;";
                ellipsisLi.appendChild(ellipsisSpan);
                paginationContainer.appendChild(ellipsisLi);
            }
    
            const lastLi = document.createElement("li");
            lastLi.className = "page-item";
            const lastBtn = document.createElement("button");
            lastBtn.className = "page-link";
            lastBtn.textContent = totalPages;
            lastBtn.addEventListener("click", () => goToPage(totalPages - 1));
            lastLi.appendChild(lastBtn);
            paginationContainer.appendChild(lastLi);
        }
    
        // Next button
        const nextLi = document.createElement("li");
        nextLi.className = `page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`;
        const nextBtn = document.createElement("button");
        nextBtn.className = "page-link";
        nextBtn.innerHTML = "&raquo;";
        nextBtn.setAttribute("aria-label", "Next");
        if (currentPage < totalPages - 1) {
            nextBtn.addEventListener("click", () => goToPage(currentPage + 1));
        }
        nextLi.appendChild(nextBtn);
        paginationContainer.appendChild(nextLi);
    }

    async function goToPage(page) {
        if (page < 0 || page >= totalPages) return;
        
        const activeTab = document.querySelector(".nav-tabs .nav-link.active");
        const currentCategory = activeTab ? activeTab.innerText.trim() : "";
        
        // Get current filters (if any)
        const filters = getCurrentFilters();
        
        // Fetch plans for the specified page
        plansData[currentCategory] = await fetchPlans(currentCategory, filters, page);
        
        // Display plans and update pagination
        displayPlans(currentCategory, filters, false); // Pass false to avoid fetching again
    }

    function getCurrentFilters() {
        const selectedValidity = [];
        const selectedPrice = [];
    
        if (document.getElementById("validity1Month")?.checked) selectedValidity.push([28, 30]);
        if (document.getElementById("validity3Months")?.checked) selectedValidity.push([80, 90]);
        if (document.getElementById("validity6Months")?.checked) selectedValidity.push([170, 180]);
        if (document.getElementById("validity1Year")?.checked) selectedValidity.push([360, 365]);
    
        if (document.getElementById("priceUnder500")?.checked) selectedPrice.push([0, 499]);
        if (document.getElementById("price500to1000")?.checked) selectedPrice.push([500, 1000]);
        if (document.getElementById("price1000to2000")?.checked) selectedPrice.push([1000, 2000]);
        if (document.getElementById("priceAbove2000")?.checked) selectedPrice.push([2001, 100000]);
    
        const filters = {};
        
        if (selectedValidity.length > 0) {
            filters.minValidity = Math.min(...selectedValidity.map(v => v[0]));
            filters.maxValidity = Math.max(...selectedValidity.map(v => v[1]));
        }
    
        if (selectedPrice.length > 0) {
            filters.minPrice = Math.min(...selectedPrice.map(p => p[0]));
            filters.maxPrice = Math.max(...selectedPrice.map(p => p[1]));
        }
        
        return filters;
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
    async function displayPlans(category, filters = {},fetchNewData = true) {
        if(fetchNewData){
        if (!filters || Object.keys(filters).length === 0) {
            if (!plansData[category]) {
                plansData[category] = await fetchPlans(category);
            }
        } else {
            plansData[category] = await fetchPlans(category, filters); // filtered results
        }}
    
        const plans = plansData[category];
        planContainer.innerHTML = ""; // Clear existing plans
    
        tabs.forEach(tab => {
            if (tab.innerText.trim() === category) {
                tabs.forEach(t => t.classList.remove("active"));
                tab.classList.add("active");
            }
        });


        // Check if plans exist for the category
        if (plans && plans.length > 0) {
            plans.forEach(plan => {
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
                        <button class="btn btn-buy w-100 mt-3" onclick="selectPlan(${plan.planId},'${plan.price}', '${validity}', '${data}', '${sms}', '${calls}')">Buy</button>
                    </div>
                </div>
                `;
                planContainer.innerHTML += planHTML;
            });
        } else {
            planContainer.innerHTML = "<p>Sorry! Currently, no plans are available for this category.</p>";
        }
        updatePaginationControls();
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

    document.getElementById("applyFilter").addEventListener("click", () => {
        const filters = getCurrentFilters();
    
    // Get the currently selected tab/category
    const activeTab = document.querySelector(".nav-tabs .nav-link.active");
    const currentCategory = activeTab ? activeTab.innerText.trim() : "";
    
    // Reset to first page when applying filters
    currentPage = 0;
    
    // Hide modal
    const filterModal = bootstrap.Modal.getInstance(document.getElementById("filterModal"));
    filterModal.hide();
    
    // Fetch & display plans with filters
    displayPlans(currentCategory, filters);
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

function setupClearFilterButton() {
    const clearFilterBtn = document.getElementById("clearFilter");
    if (!clearFilterBtn) return;
    
    clearFilterBtn.addEventListener("click", function() {
        console.log("Clear filter clicked"); // Debug log
        
        // Uncheck all filter checkboxes
        const filterCheckboxes = document.querySelectorAll('#filterModal input[type="checkbox"]');
        filterCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Get the currently selected tab/category
        const activeTab = document.querySelector(".nav-tabs .nav-link.active");
        const currentCategory = activeTab ? activeTab.innerText.trim() : "";
        
        // Force page reset
        window.currentPage = 0;
        
        // Reload the page with just the category parameter
        window.location.href = `?category=${encodeURIComponent(currentCategory)}`;
    });
}

// Call this function at the end of your existing DOMContentLoaded event
// Or add this line at the end of your script:
document.addEventListener("DOMContentLoaded", setupClearFilterButton);