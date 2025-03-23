let subscribers = [];

// Function to fetch all subscribers from the API
let currentPage = 0;
let pageSize = 5;
let totalPages = 0;

async function fetchSubscribers(page = 0) {
    const query = document.getElementById('searchInput').value.trim();
    const status = document.getElementById('statusFilter').value;

    try {
        const response = await fetch(`http://localhost:8083/api/users/subscribers?page=${page}&size=${pageSize}&search=${query}&status=${status}`);
        if (!response.ok) {
            throw new Error('Failed to fetch subscribers');
        }
        const data = await response.json();
        subscribers = data.subscribers || [];
        currentPage = data.currentPage;
        totalPages = data.totalPages;

        loadSubscribers(subscribers);
        renderPagination();
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
                    <a href="../SubscribersReport/SubscriberReport.html?userId=${subscriber.userId}" class="btn btn-outline-primary btn-sm view-details-btn">View Details</a>
                </div>
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

document.getElementById('searchInput').addEventListener('input', debounce(handleSearchFilter, 300));
document.getElementById('statusFilter').addEventListener('change', handleSearchFilter);

// Optional debounce utility to limit search calls
function debounce(func, delay) {
    let timeout;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(func, delay);
    };
}

function renderPagination() {
    const container = document.getElementById("paginationControls");
    container.innerHTML = '';

    if (totalPages <= 1) return;

    // Create pagination container
    const paginationNav = document.createElement('nav');
    paginationNav.setAttribute('aria-label', 'Page navigation');
    const paginationUl = document.createElement('ul');
    paginationUl.className = 'pagination justify-content-center';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 0 ? 'disabled' : ''}`;
    const prevButton = document.createElement('button');
    prevButton.className = 'page-link';
    prevButton.innerHTML = '&laquo;';
    prevButton.addEventListener('click', () => {
        if (currentPage > 0) fetchSubscribers(currentPage - 1);
    });
    prevLi.appendChild(prevButton);
    paginationUl.appendChild(prevLi);

    // Page number buttons
    // Determine which page numbers to show
    let startPage = Math.max(0, currentPage - 2);
    let endPage = Math.min(totalPages - 1, currentPage + 2);
    
    // Ensure we always show at least 5 pages if available
    if (endPage - startPage < 4) {
        if (startPage === 0) {
            endPage = Math.min(4, totalPages - 1);
        } else if (endPage === totalPages - 1) {
            startPage = Math.max(0, totalPages - 5);
        }
    }

    // First page button if not starting from the first page
    if (startPage > 0) {
        const firstLi = document.createElement('li');
        firstLi.className = 'page-item';
        const firstButton = document.createElement('button');
        firstButton.className = 'page-link';
        firstButton.textContent = '1';
        firstButton.addEventListener('click', () => fetchSubscribers(0));
        firstLi.appendChild(firstButton);
        paginationUl.appendChild(firstLi);
        
        // Add ellipsis if there's a gap
        if (startPage > 1) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            const ellipsisSpan = document.createElement('span');
            ellipsisSpan.className = 'page-link';
            ellipsisSpan.innerHTML = '&hellip;';
            ellipsisLi.appendChild(ellipsisSpan);
            paginationUl.appendChild(ellipsisLi);
        }
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
        const pageLi = document.createElement('li');
        pageLi.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const pageButton = document.createElement('button');
        pageButton.className = 'page-link';
        pageButton.textContent = i + 1;
        pageButton.addEventListener('click', () => fetchSubscribers(i));
        pageLi.appendChild(pageButton);
        paginationUl.appendChild(pageLi);
    }

    // Add ellipsis and last page if needed
    if (endPage < totalPages - 1) {
        if (endPage < totalPages - 2) {
            const ellipsisLi = document.createElement('li');
            ellipsisLi.className = 'page-item disabled';
            const ellipsisSpan = document.createElement('span');
            ellipsisSpan.className = 'page-link';
            ellipsisSpan.innerHTML = '&hellip;';
            ellipsisLi.appendChild(ellipsisSpan);
            paginationUl.appendChild(ellipsisLi);
        }
        
        const lastLi = document.createElement('li');
        lastLi.className = 'page-item';
        const lastButton = document.createElement('button');
        lastButton.className = 'page-link';
        lastButton.textContent = totalPages;
        lastButton.addEventListener('click', () => fetchSubscribers(totalPages - 1));
        lastLi.appendChild(lastButton);
        paginationUl.appendChild(lastLi);
    }

    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`;
    const nextButton = document.createElement('button');
    nextButton.className = 'page-link';
    nextButton.innerHTML = '&raquo;';
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages - 1) fetchSubscribers(currentPage + 1);
    });
    nextLi.appendChild(nextButton);
    paginationUl.appendChild(nextLi);

    paginationNav.appendChild(paginationUl);
    container.appendChild(paginationNav);
}


// Function to handle search and filter
// function handleSearchFilter() {
//     currentPage = 0; // reset to first page on new search/filter
//     fetchSubscribers(currentPage);
// }

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
    window.location.href = "../loginPage/Login.html";
}

document.addEventListener("DOMContentLoaded", () => {
    // Fetch subscribers when page loads
    fetchSubscribers();
    // Add event listener for update button
    const updateBtn = document.getElementById('updateBtn');
    if (updateBtn) {
        updateBtn.addEventListener('click', handleUpdate);
    }

    document.getElementById('searchInput').addEventListener('input', debounce(handleSearchFilter, 300));
    document.getElementById('statusFilter').addEventListener('change', handleSearchFilter);
});

function handleSearchFilter() {
    currentPage = 0; // reset to first page on new search/filter
    fetchSubscribers(currentPage);
}