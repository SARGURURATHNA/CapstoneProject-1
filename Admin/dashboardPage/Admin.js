document.addEventListener("DOMContentLoaded", function() {
    loadSubscribersWithPlans(); // Fetch and display from backend

    // Setup profile modal
    if (typeof setupProfileModal === 'function') {
        setupProfileModal();
    }
    
    // Setup edit modals if it exists
    if (typeof setupEditModals === 'function') {
        setupEditModals();
    }

    loadDashboardMetrics();
});

function loadDashboardMetrics() {
    fetch("http://localhost:8083/api/users/metrics")
        .then(response => response.json())
        .then(data => {
            document.getElementById("totalSubscribers").textContent = data.totalUsers;
            document.getElementById("activeSubscribers").textContent = data.activeUsers;
            document.getElementById("monthlyRevenue").textContent = data.monthlyRevenue;
        })
        .catch(error => {
            console.error("Failed to load metrics:", error);
        });
}

let currentPage = 0;
let currentFilter = "all";
const subsPerPage = 2;

let subscribers = [];

async function loadSubscribersWithPlans(page = 0, filter = "all") {
    try {
        const res = await fetch(`http://localhost:8083/api/recharge/subscribers/paginated?page=${page}&size=${subsPerPage}&filter=${filter}`);
        const data = await res.json(); // Spring Page object
        
        subscribers = data.subscribers;
        console.log(subscribers);
        displaySubscribers(subscribers);
        setupPagination(data.totalPages, data.number);

    } catch (err) {
        console.error("Failed to load subscribers:", err);
    }
}

const subsContainer = document.getElementById("SubsContainer");

// Function to display subscriber details dynamically
function displaySubscribers(subscribers) {
    subsContainer.innerHTML = "";
    if (subscribers.length === 0) {
        // Display a message when no subscribers match the filter
        subsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No subscribers found.
                </div>
            </div>
        `;
        return;
    }
    subscribers.forEach((subscriber) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-lg-6 col-xl-6 mb-4";
        
        colDiv.innerHTML = `
            <div class="card subscriber-card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-1">${subscriber.name}</h5>
                            <p class="mb-0 text-muted"><i class="material-icons small vertical-align-middle">phone</i> ${subscriber.mobile}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card-body pb-0">
                    <div class="mb-3">
                        <p class="mb-1"><strong>Expiring:</strong> <span class="text-danger">${subscriber.expiryDate}</span></p>
                        <p class="mb-1"><strong>Plan:</strong> ₹${subscriber.cost} / ${subscriber.validity}</p>
                    </div>
                </div>
                
                <div class="card-footer">
                    <button class="btn btn-primary action-btn btn-details" data-user-id="${subscriber.userId}">View Details</button>
                </div>
            </div>
        `;
        
        subsContainer.appendChild(colDiv);
    });
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-user-id');
            window.location.href = `../SubscribersReport/SubscriberReport.html?userId=${userId}`;
        });
    });
}

function paginateSubscribers(subscribers, page = 1) {
    const startIndex = (page - 1) * subsPerPage;
    const endIndex = startIndex + subsPerPage;
    const paginatedSubscribers = subscribers.slice(startIndex, endIndex);
    displaySubscribers(paginatedSubscribers);
    setupPagination(subscribers, page);
}

function setupPagination(totalPages, activePage) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === activePage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i + 1}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            loadSubscribersWithPlans(currentPage, currentFilter);
        });
        pagination.appendChild(li);
    }
}


document.getElementById("filterDropdown").addEventListener("change", function () {
    const filterValue = this.value;
    filterSubscribersByExpiry(filterValue);
});

function filterSubscribersByExpiry(filter) {
    currentFilter = filter;
    currentPage = 0;
    loadSubscribersWithPlans(currentPage, currentFilter);
}

// Function to download all subscribers data
function downloadAllExcel() {
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
}

const adminUser = "http://localhost:8083/api/users/admin-users";
// Profile Modals to admin.
function setupProfileModal() {
    const passwordSpan = document.getElementById("adminPassword");

        fetch(`http://localhost:8083/api/users/admin-users`)
            .then(response => response.json())
            .then(adminUser => {
                const user = adminUser[0];
                console.log(user);
                document.getElementById("adminFirstName").textContent = user.firstName || "-";
                document.getElementById("adminLastName").textContent = user.lastName || "-";
                document.getElementById("adminPhone").textContent = user.mobileNumber || "-";
                document.getElementById("adminAlternatePhone").textContent = user.alternateMobile || "-";
                document.getElementById("adminEmail").textContent = user.email || "-";
                document.getElementById("adminDOB").textContent = user.dob || "-";
                document.getElementById("adminUsername").textContent = user.username || "-";

                // Set hidden password for toggle
                passwordSpan.textContent = "*******";
                sessionStorage.setItem("adminUserId",user.userId);

                // Optional: combine multiple address fields if needed
                if (user.addresses && user.addresses.length > 0) {
                    const address = user.addresses[0]; // taking first address
                    const fullAddress = [
                        address.doorNo,
                        address.street,
                        address.city,
                        address.district,
                        address.state,
                        address.pincode
                    ].filter(part => part && part.trim() !== "").join(", ");
                    document.getElementById("adminAddress").textContent = fullAddress;
                } else {
                    document.getElementById("adminAddress").textContent = "-";
                }
            })
            .catch(error => {
                console.error("Error fetching admin data:", error);
            });
}

// Function to setup the edit modals
function setupEditModals() {
    // Get reference to the edit personal info modal
    const editPersonalModal = document.getElementById('editPersonalModal');
    const editLoginModal = document.getElementById('editLoginModal');
    
    // Pre-fill the personal information edit form when the modal is opened
    editPersonalModal.addEventListener('show.bs.modal', function (event) {
        document.getElementById('editEmail').value = document.getElementById('adminEmail').textContent;
        document.getElementById('editAlternatePhone').value = document.getElementById('adminAlternatePhone').textContent;
    });
    
    // Handle saving personal information
    document.getElementById('savePersonalInfoBtn').addEventListener('click', function() {
        const emailInput = document.getElementById('editEmail');
        const alternatePhoneInput = document.getElementById('editAlternatePhone');
        
        // Validate inputs
        if (!emailInput.checkValidity() || !alternatePhoneInput.checkValidity()) {
            // If validation fails, trigger HTML5 validation UI
            if (!emailInput.checkValidity()) {
                emailInput.reportValidity();
            } else {
                alternatePhoneInput.reportValidity();
            }
            return;
        }
        
        const userId = sessionStorage.getItem("adminUserId");
        
        if (userId) {
            // Prepare data for API
            const updates = {
                email: emailInput.value,
                alternateMobile: alternatePhoneInput.value
            };
            
            // Send update request to API
            fetch(`http://localhost:8083/api/users/${userId}/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updates)
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        try {
                            const json = JSON.parse(text);
                            throw new Error(json.error || 'Network response was not ok');
                        } catch (e) {
                            throw new Error('Network response was not ok');
                        }
                    });
                }
                return response.json();
            })
            .then(data => {
                // Update the UI with new values
                document.getElementById('adminEmail').textContent = data.email || "-";
                document.getElementById('adminAlternatePhone').textContent = data.alternateMobile || "-";
                
                // Close the modal
                const modal = bootstrap.Modal.getInstance(editPersonalModal);
                modal.hide();
                
                // Show success message
                alert('Personal information updated successfully!');
            })
            .catch(error => {
                console.error('Error updating personal information:', error);
                alert('Failed to update personal information. Please try again.');
            });
        } else {
            // If no user ID found, show error
            alert('Unable to update profile. Please log in again.');
        }
    });
    
    // Password confirmation validation
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    const passwordMatchError = document.getElementById('passwordMatchError');

    confirmNewPasswordInput.addEventListener('input', function() {
        if (newPasswordInput.value !== confirmNewPasswordInput.value) {
            passwordMatchError.classList.remove('d-none');
        } else {
            passwordMatchError.classList.add('d-none');
        }
    });

    // Handle saving edited login information
    document.getElementById('saveLoginInfoBtn').addEventListener('click', function() {
        const currentPasswordInput = document.getElementById('currentPassword');
        const newPasswordInput = document.getElementById('newPassword');
        const confirmNewPasswordInput = document.getElementById('confirmNewPassword');
    
        // Validate inputs
        if (!currentPasswordInput.value || !newPasswordInput.value || !confirmNewPasswordInput.value) {
            alert('Please fill in all password fields');
            return;
        }
        
        if (newPasswordInput.value !== confirmNewPasswordInput.value) {
            passwordMatchError.classList.remove('d-none');
            return;
        }

        const userId = sessionStorage.getItem("adminUserId");
        
        // Prepare data for API
        const updates = {
            currentPassword: currentPasswordInput.value,
            password: newPasswordInput.value
        };
        
        // Send update request to API
        fetch(`http://localhost:8083/api/users/${userId}/update`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(updates)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error(data.error || 'Failed to update password');
                });
            }
            return response.json();
        })
        .then(data => {
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editLoginModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('editLoginForm').reset();
            
            // Show success message
            alert(data.message || 'Password updated successfully!');
        })
        .catch(error => {
            console.error('Error updating password:', error);
            alert('Failed to update password. Please try again.');
        });
    });
}

// Function to handle logout
function handleLogout() {
        const token = sessionStorage.getItem("accessToken");
        
        fetch("http://localhost:8083/api/auth/logout", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }).then(response => {
            if (response.ok) {
                // Clear all session storage
                sessionStorage.clear();
                // Redirect to login page
                window.location.href = "../loginPage/Login.html";
            }
        }).catch(error => {
            console.error("Logout failed:", error);
        });
}
    
