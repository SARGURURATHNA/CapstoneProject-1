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
}

function statusBadge(status) {
    if (status === "Active") return "success";
    if (status === "inactive") return "secondary";
    if (status === "blocked") return "danger";
    return "light";
}

document.addEventListener("DOMContentLoaded", () => {
    // Fetch subscribers when page loads
    fetchSubscribers();

    document.getElementById("SubsContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("view-btn")) {
            const detailsDiv = event.target.closest(".subscriber-item").querySelector(".details");
            $(detailsDiv).slideToggle();
        }
    });

    $("#searchInput, #statusFilter").on("input change", () => {
        const query = $("#searchInput").val().toLowerCase();
        const filter = $("#statusFilter").val();

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
    });

    $(document).on("click", ".edit-btn", function () {
        let index = $(this).data("index");
        let sub = subscribers[index];
        
        // Store the user ID for update
        $("#editIndex").val(index);
        $("#editUserId").val(sub.id || sub.userId);
        
        // Fill the form with user data
        $("#editEmail").val(sub.email);
        $("#editStatus").val(sub.status || sub.user_status);
    });

    $("#updateBtn").click(async function () {
        try {
            const index = $("#editIndex").val();
            const userId = $("#editUserId").val();
            
            // Prepare update data
            const updatedData = {
                email: $("#editEmail").val(),
                status: $("#editStatus").val()
            };
            
            // If backend expects full user object, we need to include all fields
            const fullUpdatedData = {
                ...subscribers[index],
                ...updatedData
            };
            
            // Show loading state
            $("#updateBtn").prop('disabled', true).html('Updating...');
            
            // Update the user via API
            await updateUser(userId, fullUpdatedData);
            
            // Update local data
            subscribers[index] = {
                ...subscribers[index],
                email: updatedData.email,
                status: updatedData.status
            };
            
            // Hide modal and reload
            $("#editModal").modal("hide");
            loadSubscribers();
            
            // Show success message
            const alertDiv = document.createElement('div');
            alertDiv.className = 'alert alert-success alert-dismissible fade show';
            alertDiv.innerHTML = `
                User updated successfully!
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `;
            document.querySelector('.subscriber-container').prepend(alertDiv);
            
            // Remove alert after 3 seconds
            setTimeout(() => {
                $('.alert').alert('close');
            }, 3000);
            
        } catch (error) {
            // Show error
            const errorMsg = document.createElement('div');
            errorMsg.className = 'alert alert-danger mt-2';
            errorMsg.textContent = 'Failed to update user. Please try again.';
            document.querySelector('.modal-body').appendChild(errorMsg);
        } finally {
            // Reset button state
            $("#updateBtn").prop('disabled', false).html('Update');
        }
    });
});

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
}
