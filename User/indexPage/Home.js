function buyPlan(cost, validity, data, sms, calls) {
    if (!isLoggedIn()) {
        showLoginModal();
        return;
    }
    const url = `../planConfirmPage/PlanConfirm.html?cost=${encodeURIComponent(cost)}&validity=${encodeURIComponent(validity)}&data=${encodeURIComponent(data)}&sms=${encodeURIComponent(sms)}&calls=${encodeURIComponent(calls)}`;
    window.location.href = url;
}

function isLoggedIn() {
    return localStorage.getItem("isLoggedIn") === "true";
}

function showLoginModal() {
    let loginModal = new bootstrap.Modal(document.getElementById("loginModal"));
    loginModal.show();
}

const backendBaseUrl = "http://localhost:8083/api/users"; // your backend base URL

    // Check if mobile number exists
async function isMobileNumberRegistered(mobileNumber) {
    const response = await fetch(`${backendBaseUrl}/exists-by-mobile/${mobileNumber}`);
    const exists = await response.json();
    return exists;
}

async function validateAndRecharge() {
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    const exists = await isMobileNumberRegistered(phoneNumber);
    
    if (!(/^\d{10}$/.test(phoneNumber))) {
        // window.location.href = `../plansPage/Plans.html?phone=${phoneNumber}&quickRecharge=true`;
        alert("Please enter a valid 10-digit phone number.");
    }
    else if(phoneNumber === ""){
        alert("Please Enter Phone Number to Proceed.");
    }
    else if (!exists){
        alert("Mobile number not found in system.");
    }
    else {
        const response = await fetch(`${backendBaseUrl}/mobile/${phoneNumber}`);
        const user = await response.json();
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        sessionStorage.setItem("mobileNumber", phoneNumber);

        window.location.href = `../plansPage/Plans.html?phone=${phoneNumber}&quickRecharge=true`;
        // alert("Login successful! Redirecting to Plans page...");
        // sessionStorage.setItem("isLoggedIn", "true");
        // window.location.href = "../plansPage/Plans.html";
    }
}

/**const exists = await isMobileNumberRegistered(mobileNumber);
        if (!exists) {
            mobileErr.textContent = "Mobile number not found in system.";
            return;
        }
        else {
            const response = await fetch(`${backendBaseUrl}/mobile/${mobileNumber}`);
            const user = await response.json();
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
            
            // Reset the generatedOTP after successful login
            generatedOTP = "";
            
            alert("Login successful! Redirecting to Plans page...");
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("mobileNumber", mobileNumber);
            window.location.href = "../plansPage/Plans.html";
        }
            
        const backendBaseUrl = "http://localhost:8083/api/users"; // your backend base URL

    // Check if mobile number exists
    async function isMobileNumberRegistered(mobileNumber) {
        const response = await fetch(`${backendBaseUrl}/exists-by-mobile/${mobileNumber}`);
        const exists = await response.json();
        return exists;
    }*/
