document.addEventListener("DOMContentLoaded", function() {
    const adminForm = document.getElementById("admin_form");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const userErr = document.getElementById("userErr");
    const passErr = document.getElementById("passErr");

    adminForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const usernameValue = username.value.trim();
        const passwordValue = password.value.trim();

        // Reset error messages
        userErr.textContent = "";
        passErr.textContent = "";

        let isValid = true;

        // Username Validation
        const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{3,9}$/;
        if (usernameValue === "") {
            userErr.textContent = "Username is required";
            isValid = false;
        }
        else if(usernameValue.length < 3){
            userErr.textContent = "Username should contain at least 3 characters.";
            isValid = false;
        }
        else if (!usernameRegex.test(usernameValue)) {
            userErr.textContent = "Invalid username! Should start with a letter, max length 10, only letters, numbers, and _ allowed.";
            isValid = false;
        }

        // Password Validation
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,12}$/;
        if (passwordValue === "") {
            passErr.textContent = "Password is required";
            isValid = false;
        }
        else if(passwordValue.length < 8){
            passErr.textContent = "Password should be at least 8 characters.";
            isValid = false;
        } 
        else if (!passwordRegex.test(passwordValue)) {
            passErr.textContent = "Password must be 8-12 characters long, contain at least one letter, one number, and one special character.";
            isValid = false;
        }

        // If validation fails, stop here
        if(!isValid) return;

        // Attempt Admin Login
        try {
            const loginResponse = await fetch("http://localhost:8083/api/auth/admin-login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: usernameValue,
                    password: passwordValue
                })
            });

            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                
                // Store authentication data securely
                sessionStorage.setItem("accessToken", loginData.accessToken);
                sessionStorage.setItem("userRole", loginData.role);
                sessionStorage.setItem("isAdminLoggedIn", "true");
                sessionStorage.setItem("username", usernameValue);

                // Clear password from memory
                password.value = "";
                
                alert("Admin login successful! Redirecting to Admin Dashboard...");
                window.location.href = "../dashboardPage/Admin.html";
            } else {
                // Handle login failure
                const errorData = await loginResponse.json();
                alert(errorData.message || "Invalid admin credentials!");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Login failed. Please try again.");
        }
    });
});

// Utility function for making authenticated requests
// function makeAuthenticatedRequest(url, options = {}) {
//     const token = sessionStorage.getItem("accessToken");
//     return fetch(url, {
//         ...options,
//         headers: {
//             ...options.headers,
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//         }
//     });
// }

// // Logout function
// function logout() {
//     const token = sessionStorage.getItem("accessToken");
    
//     fetch("http://localhost:8083/api/auth/logout", {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${token}`,
//             "Content-Type": "application/json"
//         }
//     }).then(response => {
//         if (response.ok) {
//             // Clear all session storage
//             sessionStorage.clear();
//             // Redirect to login page
//             window.location.href = "../loginPage/AdminLogin.html";
//         }
//     }).catch(error => {
//         console.error("Logout failed:", error);
//     });
// }

// Route protection middleware
// function protectAdminRoute() {
//     const token = sessionStorage.getItem("accessToken");
//     const userRole = sessionStorage.getItem("userRole");

//     // Check if token exists and role is ROLE_ADMIN
//     if (!token || userRole !== "ROLE_ADMIN") {
//         alert("Unauthorized access. Redirecting to login.");
//         window.location.href = "../loginPage/AdminLogin.html";
//         return false;
//     }
//     return true;
// }

// // Add this to the beginning of each admin page's JavaScript
// document.addEventListener("DOMContentLoaded", function() {
//     protectAdminRoute();
// });