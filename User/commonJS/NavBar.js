document.addEventListener("DOMContentLoaded", function () {
    const dropdownMenu = document.getElementById("dropdownMenu");
    const backendBaseUrl = "http://localhost:8083/api"; // Make sure this matches your backend URL

    function updateDropdown() {
        dropdownMenu.innerHTML = ""; // Clear previous options

        // Check if user is logged in using sessionStorage
        const accessToken = sessionStorage.getItem("accessToken");
        
        if (accessToken) {
            const mobileNumber = sessionStorage.getItem("mobileNumber");
            const userRole = sessionStorage.getItem("userRole");

            let user = JSON.parse(sessionStorage.getItem("loggedInUser"));
            
            // User is logged in: Show "My Account" and "Logout"
            dropdownMenu.innerHTML = `
                <li class="dropdown-header fw-bold text-primary">${user.firstName+" "+user.lastName}</li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="../rechargehistoryPage/RechargeHistory.html">My Account</a></li>
                <li><a class="dropdown-item" href="#" id="logoutBtn">Logout</a></li>
            `;
            
            // Add logout event listener
            document.getElementById("logoutBtn").addEventListener("click", function (event) {
                event.preventDefault();
                handleLogout();
            });
        } else {
            // User is not logged in: Show only "Login"
            dropdownMenu.innerHTML = `<li><a class="dropdown-item" href="../loginPage/Login.html">Login</a></li>`;
        }
    }

    async function handleLogout() {
        const accessToken = sessionStorage.getItem("accessToken");
        
        if (!accessToken) {
            // If no token, just redirect to home
            redirectToHome();
            return;
        }

        try {
            // Send logout request to backend
            const response = await fetch(`${backendBaseUrl}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                // Clear session storage
                sessionStorage.clear();
                
                // Redirect to home page
                redirectToHome();
            } else {
                // If logout fails, still clear session and redirect
                sessionStorage.clear();
                redirectToHome();
                
                // Optionally show an error message
                console.error('Logout failed');
            }
        } catch (error) {
            // Handle network errors
            console.error('Logout error:', error);
            sessionStorage.clear();
            redirectToHome();
        }
    }

    function redirectToHome() {
        // Refresh dropdown to show login option
        updateDropdown();
        
        // Redirect to home page
        window.location.href = "../indexPage/Home.html";
    }

    // Initialize dropdown on page load
    updateDropdown();
});