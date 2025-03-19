window.onload=function getQueryParams() {
    const params = new URLSearchParams(window.location.search);

    let cost = Number(params.get("cost")) || 0;
    let planDetails = {
        planId: Number(params.get("planId")),
        cost: cost,
        validity: params.get("validity"),
        data: params.get("data"),
        sms: params.get("sms"),
        calls: params.get("calls")
    };
    document.getElementById("amount").textContent = planDetails.cost;
    document.getElementById("totalAmount").textContent = planDetails.cost;
    localStorage.setItem("currentPlan", JSON.stringify(planDetails));
}


function selectPaymentMethod(element, inputId) {
    // Remove active class from all images
    document.querySelectorAll('.payment-methods img').forEach(img => img.classList.remove('active'));
    element.classList.add('active');

    // Hide all input sections and show the selected one
    document.querySelectorAll('.payment-inputs').forEach(inputDiv => inputDiv.classList.remove('active'));
    document.getElementById(inputId).classList.add('active');
}

function processPayment() {
    // Find the selected payment method by checking the active image
    let selectedMethod = document.querySelector('.payment-methods img.active');
    if (!selectedMethod) {
        alert("Please select a payment method.");
        return;
    }

    // Determine the selected method based on the image's ID
    let paymentMethod;
    if (selectedMethod.src.includes("unified-payment-interface-upi")) {
        paymentMethod = "upi";
    } else if (selectedMethod.src.includes("master-card")) {
        paymentMethod = "card";
    } else if (selectedMethod.src.includes("payment-gateway")) {
        paymentMethod = "netbanking";
    } else {
        alert("Invalid payment method selected.");
        return;
    }

    // Retrieve the entered amount
    let amountElem = document.getElementById("amount");
    if (!amountElem || amountElem.textContent.trim() === "") {
        alert("Amount is missing.");
        return;
    }
    let amount = Number(amountElem.textContent.trim());

    if (!validateInputs(paymentMethod)) {
        return;
    }
    
    let now = new Date();
    let date = now.toLocaleDateString();
    let time = now.toLocaleTimeString();
    let transactionRef = "TXN" + Math.floor(100000 + Math.random() * 900000);

    // Populate modal with transaction details
    document.getElementById("modalTransactionId").textContent = transactionRef;
    document.getElementById("modalPaymentMethod").textContent = paymentMethod.toUpperCase();
    document.getElementById("modalAmount").textContent = amount;
    document.getElementById("modalDate").textContent = date;
    document.getElementById("modalTime").textContent = time;

    saveTransaction(amount, date, transactionRef, paymentMethod);

    // Show the modal
    let modal = new bootstrap.Modal(document.getElementById('paymentSuccessModal'));
    modal.show();
}

function saveTransaction(amount, date, transactionRef, paymentMode) {

//changes
let planDetails = JSON.parse(localStorage.getItem("currentPlan"));

// Save to backend
let user = JSON.parse(sessionStorage.getItem("loggedInUser")); // assuming you store user info like this
if (!user || !user.userId) {
    console.error("User not logged in");
    return;
}

const query = `?userId=${user.userId}&planId=${planDetails.planId}&amount=${amount}&paymentMode=${paymentMode}&transactionRef=${transactionRef}`;

fetch(`http://localhost:8083/api/recharge/buy${query}`, {
    method: "POST"
})
.then(response => {
    if (!response.ok) {
        throw new Error("Failed to process recharge");
    }
    return response.json();
})
.then(data => {
    console.log("Recharge saved to backend:", data);
})
.catch(error => {
    console.error("Error saving recharge:", error);
});
}

function goToHome() {
window.location.href = "../indexPage/Home.html";
}

function validateInputs(paymentMethod) {
if (!paymentMethod) {
alert("Please select a payment method.");
return false;
}

if (paymentMethod === "upi") {
let upiId = document.getElementById("upiId").value.trim();
let upiRegex = /^[a-zA-Z0-9._]{3,49}@[a-zA-Z0-9]+$/;

if (!upiId) {
    alert("UPI ID cannot be empty.");
    return false;
}
if (!upiRegex.test(upiId)) {
    alert("Invalid UPI ID! It should start with a letter and only contain letters, numbers, @, . and _.");
    return false;
}
}

if (paymentMethod === "card") {
let cardNumber = document.getElementById("cardNumber").value.trim();
let expiryDate = document.getElementById("expirydate").value.trim();
let pin = document.getElementById("pin").value.trim();

let cardRegex = /^\d{16}$/;
let pinRegex = /^\d{4}$/;
let expiryRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;

if (!cardNumber || !expiryDate || !pin) {
    alert("All card details must be filled.");
    return false;
}
if (!cardRegex.test(cardNumber)) {
    alert("Card number must be exactly 16 digits and contain only numbers.");
    return false;
}
if (!pinRegex.test(pin)) {
    alert("PIN must be exactly 4 digits and contain only numbers.");
    return false;
}
if (!expiryRegex.test(expiryDate)) {
    alert("Expiry date must be in MM/YYYY format.");
    return false;
}
// Expiry Date Validation
let [month, year] = expiryDate.split("/").map(Number);
let expiry = new Date(year, month - 1, 1); // First day of expiry month

let today = new Date();
today.setHours(0, 0, 0, 0); // Normalize time to compare only dates
let minValidDate = new Date(today);
minValidDate.setMonth(today.getMonth() + 1); // Minimum 15 days from today

if (expiry <= today) {
    alert("Expiry date must be in the future.");
    return false;
}
if (expiry < minValidDate) {
    alert("Expiry date must be at least 1 month ahead from today.");
    return false;
}
}

if (paymentMethod === "netbanking") {
let bank = document.getElementById("bank").value.trim();
let username = document.getElementById("customerName").value.trim();
let password = document.getElementById("password").value.trim();

let usernameRegex = /^(?!.*(admin|bank|password))[a-zA-Z0-9._]{6,30}$/; 
let passwordRegex = /^^(?!.*(password|bank|welcome))(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])[A-Za-z\d@#$%^&+=!]{8,16}$/; 

if (!bank) {
    alert("Please select a bank.");
    return false;
}
if (!username) {
    alert("Username cannot be empty.");
    return false;
}
if (!usernameRegex.test(username)) {
    alert("Username should only contain letters and underscores.");
    return false;
}
if (!password) {
    alert("Password cannot be empty.");
    return false;
}
if (!passwordRegex.test(password)) {
    alert("Password should contain only letters, numbers, and special characters.");
    return false;
}
}

return true;
}

document.getElementById("expirydate").addEventListener("input", function (e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 6);
    }
    e.target.value = value;
});

