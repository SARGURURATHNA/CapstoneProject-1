document.addEventListener("DOMContentLoaded", function () {
    const dropdownMenu = document.getElementById("dropdownMenu");

    function updateDropdown() {
        dropdownMenu.innerHTML = ""; // Clear previous options

        if (sessionStorage.getItem("isLoggedIn")) {
            const user = JSON.parse(sessionStorage.getItem("loggedInUser"));
            const fullName = `${user.firstName} ${user.lastName}`;
            // User is logged in: Show "My Account" and "Logout"
            dropdownMenu.innerHTML = `
                <li class="dropdown-header fw-bold text-primary">${fullName}</li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="../rechargehistoryPage/RechargeHistory.html">My Account</a></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            `;

            document.getElementById("logoutBtn").addEventListener("click", function () {
                sessionStorage.clear(); // Remove login state
                updateDropdown(); // Refresh dropdown
                window.location.href = "../indexPage/Home.html";
            });
        } else {
            // User is not logged in: Show only "Login"
            dropdownMenu.innerHTML = `<li><a class="dropdown-item" href="../loginPage/Login.html">Login</a></li>`;
        }
    }

    updateDropdown(); // Initialize dropdown on page load
});
