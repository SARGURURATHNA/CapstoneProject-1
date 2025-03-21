// Admin Login Form
const adminForm = document.getElementById("admin_form");

adminForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const userErr = document.getElementById("userErr");
    const passErr = document.getElementById("passErr");

    let isValid = true;
    // Clear previous errors
    userErr.textContent = "";
    passErr.textContent = "";

    const usernameRegex = /^[A-Za-z][A-Za-z0-9_]{3,9}$/;
    // Simple validation (Replace this with actual authentication logic)
    if (username === "") {
        userErr.textContent = "Username is required";
        isValid = false;
    }
    else if(username.length < 3){
        userErr.textContent = "Username should contain atleast 3 characters."
        isValid = false;
    }
    else if (!usernameRegex.test(username)) {
        userErr.textContent = "Invalid username! Should start with a letter, max length 10, only letters, numbers, and _ allowed.";
        isValid = false;
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,12}$/;
    if (password === "") {
        passErr.textContent = "Password is required";
        isValid = false;
    }
    else if(password.length < 8){
        passErr.textContent = "Password should be atleast 8 characters."
        isValid = false;
    } 
    else if (!passwordRegex.test(password)) {
        passErr.textContent = "Password must be 8-12 characters long, contain at least one letter, one number, and one special character.";
        isValid = false;
    }

    if(!isValid){ 
        return;
    }
    else{
        fetch("http://localhost:8083/api/users/admin-users")
        .then(response => response.json())
        .then(adminUsers => {
            const matchedUser = adminUsers.find(user => user.username === username && user.password === password);
            if (matchedUser) {
                alert("Admin login successful! Redirecting to Admin Dashboard...");
                sessionStorage.setItem("isAdminLoggedIn", "true");
                sessionStorage.setItem("loggedInAdmin", JSON.stringify(matchedUser));
                sessionStorage.setItem("adminUserId", matchedUser.userId);
                window.location.href = "../dashboardPage/Admin.html";
            } else {
                alert("Invalid admin credentials!");
            }
        })
        .catch(error => {
            console.error("Error fetching admin users:", error);
            alert("Login failed. Please try again.");
        });
    }
});
