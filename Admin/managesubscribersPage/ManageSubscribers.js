const subscribers = [
    {
        first_name: "John",
        last_name: "Doe",
        mobile_number: "7894561320",
        alternate_number: "9898989898",
        email: "john@example.com",
        address: "123 Street, NY",
        dob: "1990-01-01",
        user_status: "active"
    },
    {
        first_name: "Jane",
        last_name: "Smith",
        mobile_number: "9874561230",
        alternate_number: "9090909090",
        email: "jane@example.com",
        address: "456 Avenue, CA",
        dob: "1992-05-12",
        user_status: "inactive"
    },
    {
        first_name: "Helen",
        last_name: "Mac",
        mobile_number: "8795641230",
        alternate_number: "8888888888",
        email: "helen@example.com",
        address: "45 Main, LA",
        dob: "1995-05-30",
        user_status: "active"
    },
    {
        first_name: "George",
        last_name: "Bill",
        mobile_number: "9845661230",
        alternate_number: "7777777777",
        email: "George@example.com",
        address: "78 New road, DC",
        dob: "1999-12-27",
        user_status: "blocked"
    }
];

function loadSubscribers(filtered = subscribers) {
    const container = document.getElementById("SubsContainer");
    container.innerHTML = "";

    filtered.forEach((subscriber, index) => {
        const subscriberDiv = document.createElement("div");
        subscriberDiv.className = "subscriber-item";
        subscriberDiv.innerHTML = `
            <div class="subscriber-header">
                <div class="subscriber-info">
                    <h5 class="subscriber-name mb-0">${subscriber.first_name} ${subscriber.last_name}</h5>
                    <p class="subscriber-phone mb-0">${subscriber.mobile_number}</p>
                    <span class="badge bg-${statusBadge(subscriber.user_status)}">${subscriber.user_status}</span>
                </div>
                <div class="action-buttons">
                    <button class="material-icons btn icon-btn edit-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editModal">edit</button>
                    <button class="material-icons btn icon-btn view-btn" data-index="${index}">expand_more</button>
                </div>
            </div>
            <div class="details mt-3">
                <p><strong>Alternate Number:</strong> ${subscriber.alternate_number}</p>
                <p><strong>Email:</strong> ${subscriber.email}</p>
                <p><strong>Address:</strong> ${subscriber.address}</p>
                <p><strong>DOB:</strong> ${subscriber.dob}</p>
            </div>
        `;
        container.appendChild(subscriberDiv);
    });
}

function statusBadge(status) {
    if (status === "active") return "success";
    if (status === "inactive") return "secondary";
    if (status === "blocked") return "danger";
    return "light";
}

document.addEventListener("DOMContentLoaded", () => {
    loadSubscribers();

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
            const matchesName = sub.first_name.toLowerCase().includes(query);
            const matchesMobile = sub.mobile_number.includes(query);
            const matchesStatus = filter === "" || sub.user_status === filter;
            return (matchesName || matchesMobile) && matchesStatus;
        });

        loadSubscribers(filtered);
    });

    $(document).on("click", ".edit-btn", function () {
        let index = $(this).data("index");
        let sub = subscribers[index];
        $("#editIndex").val(index);
        $("#editEmail").val(sub.email);
        $("#editStatus").val(sub.user_status);
    });

    $("#updateBtn").click(function () {
        let index = $("#editIndex").val();
        subscribers[index].email = $("#editEmail").val();
        subscribers[index].user_status = $("#editStatus").val();
        $("#editModal").modal("hide");
        loadSubscribers();
    });
});

function handleLogout() {
    sessionStorage.clear(); // This removes ALL session storage keys
}
