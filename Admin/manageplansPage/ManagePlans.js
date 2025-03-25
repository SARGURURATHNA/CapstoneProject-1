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
            plans.forEach(plan =>  {
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

// Add category event listener
document.getElementById('saveCategory').addEventListener('click', function() {
        const categoryName = document.getElementById('categoryName').value.trim();
        
        if (!categoryName) {
          alert('Please enter a category name');
          return;
        }
        
        saveCategory(categoryName);
      });

      window.refreshCurrentPlans = async function() {
        const activeTab = document.querySelector(".nav-tabs .nav-link.active");
        const currentCategory = activeTab ? activeTab.innerText.trim() : "";
        const filters = getCurrentFilters();
        
        // Clear the cached data for this category to force a refresh
        plansData[currentCategory] = null;
        
        // Fetch and display plans again
        await displayPlans(currentCategory, filters);
    };
});


// Adding a new category
function saveCategory(categoryName) {
    fetch('http://localhost:8083/api/plans/categories/add', {  // Updated endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ categoryName: categoryName })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add category');
          }
    })
    .then(() => {
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
        modal.hide();
        
        // Clear the input field
        document.getElementById('categoryName').value = '';
        
        // Refresh the categories list
        window.location.reload();
        // Show success message
        alert('Category added successfully!');
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to add category. Please try again.');
      });

}

// function for deleting a plan.
async function deletePlan(planId) {
    const confirmed = confirm("Are you sure you want to delete this plan?");
    if (!confirmed) return;

    try {
        const response = await fetch(`http://localhost:8083/api/plans/${planId}`, {
            method: "DELETE"
        });

        if (response.ok || response.status === 204) {
            alert("Plan deleted successfully.");
            await window.refreshCurrentPlans();
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
     // Handle OTT fields - check if they're empty first
     const ottInput = document.getElementById("planOtt").value.trim();
     const ottCategoryInput = document.getElementById("planOttCategory").value.trim();
     
     // Only split and map if the fields aren't empty
     const ottNames = ottInput ? ottInput.split(",").map(item => item.trim()).filter(item => item) : null;
     const ottCategories = ottCategoryInput ? ottCategoryInput.split(",").map(item => item.trim()).filter(item => item) : null;

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
            const contentType = response.headers.get("content-type");
            let result;

            if (contentType && contentType.includes("application/json")) {
                try {
                    result = await response.json();
                    console.log(`${planId ? "Updated" : "Created"} plan:`, result);
                } catch (jsonError) {
                    console.warn("Failed to parse JSON:", jsonError);
                }
            } else {
                console.warn("Unexpected content type or empty response body.");
            }

            await window.refreshCurrentPlans();
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
    document.getElementById("planOtt").value = plan.ottNames?.join(", ") || "";
    document.getElementById("planOttCategory").value = plan.ottCategories?.join(", ") || "";

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
    window.location.href = "../loginPage/Login.html";
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

document.addEventListener("DOMContentLoaded", setupClearFilterButton);
