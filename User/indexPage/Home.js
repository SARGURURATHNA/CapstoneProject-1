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


function validateAndRecharge() {
    let phoneNumber = document.getElementById("phoneNumber").value.trim();
    
    if (/^\d{10}$/.test(phoneNumber)) {
        window.location.href = `../plansPage/Plans.html?phone=${phoneNumber}&quickRecharge=true`;
    }
    else if(phoneNumber === ""){
        alert("Please Enter Phone Number to Proceed.");
    }
    else {
        alert("Please enter a valid 10-digit phone number.");
    }
}


