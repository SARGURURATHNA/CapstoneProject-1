document.addEventListener("DOMContentLoaded", function() {
    loadSubscribersWithPlans(); // Fetch and display from backend

    // Setup event handlers
    // if (typeof setupEventHandlers === 'function') {
    //     setupEventHandlers();
    // }
    
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
            document.getElementById("totalSubscribers").textContent = data.totalSubscribers;
            document.getElementById("activeSubscribers").textContent = data.activeSubscribers;
            document.getElementById("monthlyRevenue").textContent = data.monthlyRevenue;
        })
        .catch(error => {
            console.error("Failed to load metrics:", error);
        });
}

let subscribers = [];

async function loadSubscribersWithPlans() {
    try {
        const res = await fetch('http://localhost:8083/api/users/subscribers');
        const users = await res.json(); // assuming it returns a list of users with userId        
        const mergedSubscribers = [];

        for (const user of users) {
            const planRes = await fetch(`http://localhost:8083/api/recharge/current-plan/details?userId=${user.userId}`);
            const planData = await planRes.json();

            // Merge user and plan info
            const merged = {
                name: planData.name,
                phone: planData.mobile,
                userId: planData.userId,

                // Plan details
                cost: `₹${planData.cost}`,
                date: planData.expiryDate,
                transactionId: planData.transactionId || "TXN00000", // dummy or from API if available
                paymentMode: planData.paymentMode || "N/A",
                validity: `${planData.validity} Days`,
                data: planData.data,
                sms: planData.sms,
                calls: planData.calls
            };

            mergedSubscribers.push(merged);
        }

        subscribers = mergedSubscribers;
        displaySubscribers(subscribers); // Call your existing function

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
    subscribers.forEach((subscriber, index) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-lg-6 col-xl-6 mb-4";
        
        colDiv.innerHTML = `
            <div class="card subscriber-card">
                <div class="card-header">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 class="mb-1">${subscriber.name}</h5>
                            <p class="mb-0 text-muted"><i class="material-icons small vertical-align-middle">phone</i> ${subscriber.phone}</p>
                        </div>
                    </div>
                </div>
                
                <div class="card-body pb-0">
                    <div class="mb-3">
                        <p class="mb-1"><strong>Expiring:</strong> <span class="text-danger">${subscriber.date}</span></p>
                        <p class="mb-1"><strong>Plan:</strong> ${subscriber.cost} / ${subscriber.validity}</p>
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

document.getElementById("filterDropdown").addEventListener("change", function () {
    const filterValue = this.value;
    filterSubscribersByExpiry(filterValue);
});

function filterSubscribersByExpiry(filter) {
    if (filter === "all") {
        displaySubscribers(subscribers);
        return;
    }

    const now = new Date();
    let thresholdDate;

    switch (filter) {
        case "3days":
            thresholdDate = new Date(now);
            thresholdDate.setDate(thresholdDate.getDate() + 3);
            break;
        case "2weeks":
            thresholdDate = new Date(now);
            thresholdDate.setDate(thresholdDate.getDate() + 14);
            break;
        case "1month":
            thresholdDate = new Date(now);
            thresholdDate.setMonth(thresholdDate.getMonth() + 1);
            break;
        default:
            displaySubscribers(subscribers);
            return;
    }

    const filtered = subscribers.filter(sub => {
        const expiry = new Date(sub.date);
        return expiry <= thresholdDate && expiry >= now;
    });

    displaySubscribers(filtered);
}


// function setupEventHandlers() {
//     // Setup download all button
//     document.getElementById("downloadAll").addEventListener("click", () => {
//         downloadAllExcel();
//     });
// }

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


// Profile Modals to admin.
function setupProfileModal() {
    const togglePasswordBtn = document.getElementById("togglePassword");
    const passwordSpan = document.getElementById("adminPassword");

    const loggedInAdmin = JSON.parse(sessionStorage.getItem("loggedInAdmin"));

    const mobileNumber = loggedInAdmin?.mobileNumber;

    if (mobileNumber) {
        fetch(`http://localhost:8083/api/users/mobile/${mobileNumber}`)
            .then(response => response.json())
            .then(user => {
                document.getElementById("adminFirstName").textContent = user.firstName || "-";
                document.getElementById("adminLastName").textContent = user.lastName || "-";
                document.getElementById("adminPhone").textContent = user.mobileNumber || "-";
                document.getElementById("adminAlternatePhone").textContent = user.alternateMobile || "-";
                document.getElementById("adminEmail").textContent = user.email || "-";
                document.getElementById("adminDOB").textContent = user.dob || "-";
                document.getElementById("adminUsername").textContent = user.username || "-";

                togglePasswordBtn.addEventListener("click", function () {
                    if (passwordSpan.textContent === "*******") {
                        passwordSpan.textContent = user.password || "-";
                        togglePasswordBtn.textContent = "Hide";
                    } else {
                        passwordSpan.textContent = "*******";
                        togglePasswordBtn.textContent = "Show";
                    }
                });
            
                // Set hidden password for toggle
                passwordSpan.textContent = "*******";
                togglePasswordBtn.dataset.password = user.password;

                // Optional: combine multiple address fields if needed
                if (user.addresses && user.addresses.length > 0) {
                    const address = user.addresses[0]; // taking first address
                    const fullAddress = `${address.doorNo || ""}, ${address.street || ""}, ${address.city || ""}, ${address.district || ""}, ${address.state || ""}, ${address.pincode || ""}`;
                    document.getElementById("adminAddress").textContent = fullAddress;
                } else {
                    document.getElementById("adminAddress").textContent = "-";
                }
            })
            .catch(error => {
                console.error("Error fetching admin data:", error);
            });
    }
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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedUser => {
                // Update the UI with new values
                document.getElementById('adminEmail').textContent = updatedUser.email;
                document.getElementById('adminAlternatePhone').textContent = updatedUser.alternateMobile;
                
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
    
    // Get admin data from sessionStorage
    const adminUser = JSON.parse(sessionStorage.getItem("loggedInAdmin"));
    const userId = sessionStorage.getItem("adminUserId");
    
    if (userId) {
        // Verify current password
        if (currentPasswordInput.value !== adminUser.password) {
            alert('Current password is incorrect');
            return;
        }
        
        // Prepare data for API
        const updates = {
            password: newPasswordInput.value
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
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(updatedUser => {
            // Update stored password in sessionStorage
            adminUser.password = newPasswordInput.value;
            sessionStorage.setItem("loggedInAdmin", JSON.stringify(adminUser));
            
            // If you have a togglePassword element, update it too
            const togglePasswordElement = document.getElementById('togglePassword');
            if (togglePasswordElement) {
                togglePasswordElement.dataset.password = newPasswordInput.value;
            }
            
            // Close the modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('editLoginModal'));
            modal.hide();
            
            // Reset form
            document.getElementById('editLoginForm').reset();
            
            // Show success message
            alert('Password updated successfully!');
        })
        .catch(error => {
            console.error('Error updating password:', error);
            alert('Failed to update password. Please try again.');
        });
    } else {
        // If no user ID found, show error
        alert('Unable to update password. Please log in again.');
    }
});
}

// Function to handle logout
function handleLogout() {
    sessionStorage.clear();
    window.location.href = "../loginPage/Login.html";
}
