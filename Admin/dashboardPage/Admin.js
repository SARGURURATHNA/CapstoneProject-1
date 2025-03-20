// Sample subscriber data
const subscribers = [
    {
        name: "John Doe",
        phone: "+91 9876543210",
        email: "johndoe@example.com",
        address: "123, ABC Street, Mumbai",
        dob: "01 Jan 1990",
        cost: "₹25",
        date: "Apr 21, 2025",
        transactionId: "TXN12345",
        paymentMode: "Credit Card",
        validity: "28 Days",
        data: "2GB/Day",
        sms: "100 SMS/Day",
        calls: "Unlimited"
    },
    {
        name: "Jane Smith",
        phone: "+91 8765432109",
        email: "janesmith@example.com",
        address: "456, XYZ Road, Delhi",
        dob: "10 Feb 1995",
        cost: "₹15",
        date: "Apr 21, 2025",
        transactionId: "TXN67890",
        paymentMode: "Debit Card",
        validity: "14 Days",
        data: "1GB/Day",
        sms: "50 SMS/Day",
        calls: "Unlimited"
    },
    {
        name: "Helen Mac",
        phone: "+91 5462317890",
        email: "helen@example.com",
        address: "48, XB Road, Ladak",
        dob: "16 Mar 1995",
        cost: "₹30",
        date: "Mar 23, 2025",
        transactionId: "TXN62390",
        paymentMode: "Net Banking",
        validity: "14 Days",
        data: "1GB/Day",
        sms: "50 SMS/Day",
        calls: "Unlimited"
    },
    {
        name: "George Bill",
        phone: "+91 9788432109",
        email: "george@example.com",
        address: "56, Rock Road, Mumbai",
        dob: "10 Apr 2000",
        cost: "₹56",
        date: "Mar 23, 2025",
        transactionId: "TXN67849",
        paymentMode: "Upi",
        validity: "26 Days",
        data: "1GB/Day",
        sms: "50 SMS/Day",
        calls: "Unlimited"
    }
];

// Dashboard metrics data
const dashboardMetrics = {
    totalSubscribers: 4215,
    activeSubscribers: 3890,
    monthlyRevenue: "₹1,48,500"
};

document.addEventListener("DOMContentLoaded", function() {
    // Set dashboard metrics
    document.getElementById("totalSubscribers").textContent = dashboardMetrics.totalSubscribers.toLocaleString();
    document.getElementById("activeSubscribers").textContent = dashboardMetrics.activeSubscribers.toLocaleString();
    document.getElementById("monthlyRevenue").textContent = dashboardMetrics.monthlyRevenue;
    
    const filterDropdown = document.getElementById("filterDropdown");
    if (filterDropdown) {
        filterDropdown.addEventListener("change", function() {
            const selected = this.value;
            filterSubscribers(selected);
        });
    }
    
    // Display subscribers
    displaySubscribers();
    
    // Setup event handlers
    if (typeof setupEventHandlers === 'function') {
        setupEventHandlers();
    }
    
    // Setup profile modal
    if (typeof setupProfileModal === 'function') {
        setupProfileModal();
    }
    
    // Setup edit modals if it exists
    if (typeof setupEditModals === 'function') {
        setupEditModals();
    }
});

function filterSubscribers(duration) {
    const today = new Date();

    const filtered = subscribers.filter(sub => {
        const dateParts = sub.date.split(' ');
        const month = getMonthNumber(dateParts[0]);
        const day = parseInt(dateParts[1].replace(',', ''));
        const year = parseInt(dateParts[2]);
        
        const expiryDate = new Date(year, month, day);
        
        const diffTime = expiryDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (duration) {
            case "3days":
                return diffDays <= 3 && diffDays >= 0;
            case "2weeks":
                return diffDays <= 14 && diffDays >= 0;
            case "1month":
                return diffDays <= 30 && diffDays >= 0;
            default:
                return true; // "All"
        }
    });

    displaySubscribers(filtered);
}

function getMonthNumber(monthName) {
    const months = {
        'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
        'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
    };
    return months[monthName];
}

const subsContainer = document.getElementById("SubsContainer");

// Function to display subscriber details dynamically
function displaySubscribers(filteredList = subscribers) {
    subsContainer.innerHTML = "";
    if (filteredList.length === 0) {
        // Display a message when no subscribers match the filter
        subsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info">
                    No subscribers match the selected filter criteria.
                </div>
            </div>
        `;
        return;
    }
    filteredList.forEach((subscriber, index) => {
        const colDiv = document.createElement("div");
        colDiv.className = "col-lg-6 col-xl-6 mb-4";
        
        colDiv.innerHTML = `
            <div class="card subscriber-card" data-subscriber-index="${index}">
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
                    
                    <!-- Personal Details Section -->
                    <div class="details-section" style="display: none;">
                        <h6 class="mb-3">Personal Details</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Email:</strong><br>${subscriber.email}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>DOB:</strong><br>${subscriber.dob}</p>
                            </div>
                        </div>
                        <p><strong>Address:</strong><br>${subscriber.address}</p>
                    </div>
                    
                    <!-- Recharge History Section -->
                    <div class="recharge-section" style="display: none;">
                        <h6 class="mb-3">Transaction Details</h6>
                        <div class="row mb-3">
                            <div class="col-md-6">
                                <p><strong>Transaction ID:</strong><br>${subscriber.transactionId}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Payment Mode:</strong><br>${subscriber.paymentMode}</p>
                            </div>
                        </div>
                        
                        <h6 class="mb-3">Plan Details</h6>
                        <div class="row">
                            <div class="col-md-6">
                                <p><strong>Cost:</strong> ${subscriber.cost}</p>
                                <p><strong>Validity:</strong> ${subscriber.validity}</p>
                            </div>
                            <div class="col-md-6">
                                <p><strong>Data:</strong> ${subscriber.data}</p>
                                <p><strong>SMS:</strong> ${subscriber.sms}</p>
                                <p><strong>Calls:</strong> ${subscriber.calls}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card-footer">
                    <button class="btn btn-primary action-btn btn-details" data-index="${index}">View Details</button>
                </div>
            </div>
        `;
        
        subsContainer.appendChild(colDiv);
    });
    document.querySelectorAll('.btn-details').forEach(button => {
        button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            toggleDetails(index);
        });
    });
}

function setupEventHandlers() {
    // Setup download all button
    document.getElementById("downloadAll").addEventListener("click", () => {
        downloadAllExcel();
    });
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


// Profile Modals
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
    // Redirect to login page
    window.location.href = "../loginPage/Login.html";
}
