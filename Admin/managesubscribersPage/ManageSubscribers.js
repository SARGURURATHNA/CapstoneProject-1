const subscribers = [
    { name: "John Doe", phone: "7894561320", email: "john@example.com", address: "123 Street, NY", dob: "1990-01-01" },
    { name: "Jane Smith", phone: "9874561230", email: "jane@example.com", address: "456 Avenue, CA", dob: "1992-05-12" },
    { name: "Helen Mac", phone: "8795641230", email: "helen@example.com", address: "45 Main, LA", dob: "1995-05-30" },
    { name: "George Bill", phone: "9845661230", email: "George@example.com", address: "78 New road, DC", dob: "1999-12-27" }
];

function loadSubscribers() {
    const container = document.getElementById("SubsContainer");
    container.innerHTML = "";
    subscribers.forEach((subscriber, index) => {
        const subscriberDiv = document.createElement("div");
        subscriberDiv.className = "subscriber-item";
        subscriberDiv.innerHTML = `
            <div class="subscriber-header">
                <div class="subscriber-info">
                    <h5 class="subscriber-name mb-0">${subscriber.name}</h5>
                    <p class="subscriber-phone mb-0">${subscriber.phone}</p>
                </div>
                <button class="view-btn btn btn-primary" data-index="${index}">View Details</button>
                <button class="material-icons btn icon-btn edit-btn" data-index="${index}" data-bs-toggle="modal" data-bs-target="#editModal">edit</button>
                <button class="material-icons btn icon-btn remove-btn" data-index="${index}">delete</button>
            </div>
            <div class="details mt-3" style="display: none;">
                <p><strong>Email:</strong> ${subscriber.email}</p>
                <p><strong>Address:</strong> ${subscriber.address}</p>
                <p><strong>DOB:</strong> ${subscriber.dob}</p>
            </div>
        `;
        container.appendChild(subscriberDiv);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadSubscribers();
    document.getElementById("SubsContainer").addEventListener("click", (event) => {
        if (event.target.classList.contains("view-btn")) {
            const detailsDiv = event.target.parentElement.nextElementSibling;
            $(detailsDiv).slideToggle();
        }
    });

    $(document).on("click", ".edit-btn", function() {
        let index = $(this).data("index");
        let sub = subscribers[index];
        $("#editIndex").val(index);
        $("#editName").val(sub.name);
        $("#editPhone").val(sub.phone);
        $("#editEmail").val(sub.email);
        $("#editAddress").val(sub.address);
        $("#editDob").val(sub.dob);
    });

    $("#updateBtn").click(function() {
        let index = $("#editIndex").val();
        subscribers[index] = {
            name: $("#editName").val(),
            phone: $("#editPhone").val(),
            email: $("#editEmail").val(),
            address: $("#editAddress").val(),
            dob: $("#editDob").val()
        };
        $("#editModal").modal("hide");
        loadSubscribers();
    });

    $(document).on("click", ".remove-btn", function() {
        let index = $(this).data("index");
        subscribers.splice(index, 1);
        loadSubscribers();
    });
});