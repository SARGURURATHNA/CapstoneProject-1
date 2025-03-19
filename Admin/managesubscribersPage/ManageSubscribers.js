let subscribers = [];

// Function to fetch all subscribers from the API
async function fetchSubscribers() {
    try {
        const response = await fetch('http://localhost:8083/api/users/subscribers');
        if (!response.ok) {
            throw new Error('Failed to fetch subscribers');
        }
        subscribers = await response.json();
        console.log(subscribers);
        loadSubscribers(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        document.getElementById("SubsContainer").innerHTML = `
            <div class="alert alert-danger">
                Failed to load subscribers. Please try again later.
            </div>
        `;
    }
}

function loadSubscribers(filtered = subscribers) {
    const container = document.getElementById("SubsContainer");
    container.innerHTML = "";

    filtered.forEach((subscriber, index) => {
        const firstName = subscriber.firstName || subscriber.first_name || '';
        const lastName = subscriber.lastName || subscriber.last_name || '';
        const mobileNumber = subscriber.mobileNumber || subscriber.mobile_number || '';
        const alternateNumber = subscriber.alternateNumber || subscriber.alternate_number || '';
        const email = subscriber.email || '';
        const address = subscriber.address || '';
        const dob = subscriber.dateOfBirth || subscriber.dob || '';
        const userStatus = subscriber.userStatus || subscriber.user_status || '';
        const subscriberDiv = document.createElement("div");
        subscriberDiv.className = "subscriber-item";
        subscriberDiv.innerHTML = `
            <div class="subscriber-header">
                <div class="subscriber-info">
                    <h5 class="subscriber-name mb-0">${firstName} ${lastName}</h5>
                    <p class="subscriber-phone mb-0">${mobileNumber}</p>
                    <p class="subscriber-email mb-0">${email}</p>
                    <span class="badge bg-${statusBadge(userStatus)}">${userStatus}</span>
                </div>
                <div class="action-buttons">
                    <button class="material-icons btn icon-btn edit-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editModal">edit</button>
                    <a href="SubscriberReport.html?userId=${subscriber.userId}" class="btn btn-outline-primary btn-sm view-details-btn">View Details</a>
                </div>
            </div>
            <div class="details mt-3">
                <p><strong>Alternate Number:</strong> ${alternateNumber}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>DOB:</strong> ${dob}</p>
            </div>
        `;
        container.appendChild(subscriberDiv);
    });

    // Add event listeners to all edit buttons
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', handleEditClick);
    });
}

function statusBadge(status) {
    if (status === "Active") return "success";
    if (status === "inactive") return "secondary";
    if (status === "blocked") return "danger";
    return "light";
}

// Function to handle search and filter
function handleSearchFilter() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const filterSelect = document.getElementById('statusFilter');
    const filter = filterSelect ? filterSelect.value : "";

    const filtered = subscribers.filter(sub => {
        const firstName = sub.firstName || sub.first_name || '';
        const lastName = sub.lastName || sub.last_name || '';
        const mobileNumber = sub.mobileNumber || sub.mobile_number || '';
        const userStatus = sub.status || sub.user_status || '';
        
        const matchesName = (firstName + ' ' + lastName).toLowerCase().includes(query);
        const matchesMobile = mobileNumber.includes(query);
        const matchesStatus = filter === "" || userStatus === filter;
        
        return (matchesName || matchesMobile) && matchesStatus;
    });

    loadSubscribers(filtered);
}

// Function to handle edit button click
function handleEditClick(event) {
    const index = event.target.getAttribute('data-index');
    const sub = subscribers[index];
    
    document.getElementById('editIndex').value = index;
    document.getElementById('editUserId').value = sub.id || sub.userId;
    
    // Only populate status field
    document.getElementById('editStatus').value = sub.userStatus || sub.user_status;
}

// Function to update user
async function updateUser(userId, newStatus) {
    try {
        const response = await fetch(`http://localhost:8083/api/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userStatus:newStatus})
        });
        
        if (!response.ok) {
            throw new Error('Failed to update user');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

// Function to handle update button click
async function handleUpdate() {
    try {
        const index = document.getElementById('editIndex').value;
        const userId = document.getElementById('editUserId').value;
        const newStatus = document.getElementById('editStatus').value;
        
        // Prepare data for update - just sending the status
        // const updatedData = {
        //     userStatus: newStatus
        // };
        
        // If backend expects full user object, include all fields
        // const fullUpdatedData = {
        //     ...subscribers[index],
        //     ...updatedData
        // };
        
        // Show loading state
        const updateBtn = document.getElementById('updateBtn');
        updateBtn.disabled = true;
        updateBtn.textContent = 'Updating...';
        
        // Update the user via API
        await updateUser(userId, newStatus);
        
        // Update local data
        subscribers[index] = {
            ...subscribers[index],
            userStatus: newStatus,
            user_status: newStatus
        };
        
        // Hide modal
        const modal = document.getElementById('editModal');
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        bootstrapModal.hide();
        
        // Reload subscribers
        loadSubscribers();
        
        // Show success message
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            User status updated successfully!
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        document.querySelector('.subscriber-container').prepend(alertDiv);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 2000);
        
    } catch (error) {
        // Show error
        const errorMsg = document.createElement('div');
        errorMsg.className = 'alert alert-danger mt-2';
        errorMsg.textContent = 'Failed to update user status. Please try again.';
        document.querySelector('.modal-body').appendChild(errorMsg);
        
        // Remove error message after 3 seconds
        setTimeout(() => {
            if (errorMsg.parentNode) {
                errorMsg.parentNode.removeChild(errorMsg);
            }
        }, 3000);
    } finally {
        // Reset button state
        const updateBtn = document.getElementById('updateBtn');
        updateBtn.disabled = false;
        updateBtn.textContent = 'Update';
    }
}

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
}

document.addEventListener("DOMContentLoaded", () => {
    // Fetch subscribers when page loads
    fetchSubscribers();

    // Event listener for view button clicks
    document.getElementById("SubsContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("view-btn")) {
            const detailsDiv = event.target.closest(".subscriber-item").querySelector(".details");
            // Toggle visibility of details
            if (detailsDiv.style.display === "none" || !detailsDiv.style.display) {
                detailsDiv.style.display = "block";
            } else {
                detailsDiv.style.display = "none";
            }
        }
    });

    // Add event listener for search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchFilter);
    }
    
    // Add event listener for status filter if it exists
    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', handleSearchFilter);
    }

    // Add event listener for update button
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', handleUpdate);
    }
});