document.addEventListener("DOMContentLoaded", function () {
    const dropdownMenu = document.getElementById("dropdownMenu");

    function updateDropdown() {
        dropdownMenu.innerHTML = ""; // Clear previous options

        if (localStorage.getItem("isLoggedIn")) {
            // User is logged in: Show "My Account" and "Logout"
            dropdownMenu.innerHTML = `
                <li><a class="dropdown-item" href="../rechargehistoryPage/RechargeHistory.html">My Account</a></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            `;

            document.getElementById("logoutBtn").addEventListener("click", function () {
                localStorage.removeItem("isLoggedIn"); // Remove login state
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
