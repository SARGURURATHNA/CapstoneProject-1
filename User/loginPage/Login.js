document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("user_form");
    const getOtpButton = document.getElementById("getOtp");
    const mobileInput = document.getElementById("mobilenumber");
    const mobileErr = document.getElementById("mobileErr");
    const otpErr = document.getElementById("otpErr");

    const backendBaseUrl = "http://localhost:8083/api/users"; // your backend base URL

    // Check if mobile number exists
    async function isMobileNumberRegistered(mobileNumber) {
        const response = await fetch(`${backendBaseUrl}/exists-by-mobile/${mobileNumber}`);
        const exists = await response.json();
        return exists;
    }

    getOtpButton.addEventListener("click",async function (event) {
        const mobileNumber = mobileInput.value.trim();

        const exists = await isMobileNumberRegistered(mobileNumber);
        if (mobileNumber === "") {
            mobileErr.textContent = "Enter mobile number to get OTP.";
            return;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            mobileErr.textContent = "Invalid mobile number. Enter a 10-digit number.";
            return;
        } 
        else  if (!exists) {
            mobileErr.textContent = "Mobile number not found in system.";
            return;
        }
        else {
            mobileErr.textContent = "";
            alert("OTP sent successfully!");
            // add OTP generation logic
        }
    });

    userForm.addEventListener("submit", async function (event) {
        event.preventDefault(); 

        const mobileNumber = mobileInput.value.trim();
        const otp = Array.from(document.querySelectorAll(".otp-input"))
        .map(input => input.value)
        .join("")
        .trim();


        let isValid = true;

        if (mobileNumber === "") {
            mobileErr.textContent = "Please enter Mobile Number.";
            isValid = false;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            mobileErr.textContent = "Please enter a valid 10-digit phone number.";
            isValid = false;
        } else {
            mobileErr.textContent = "";
        }
    
        if (otp === "") {
            otpErr.textContent = "Please enter OTP.";
            isValid = false;
        } else if (!/^\d{6}$/.test(otp)) {
            otpErr.textContent = "OTP must be a maximum of 6 digits.";
            isValid = false;
        } else {
            otpErr.textContent = "";
        }
    
        if(!isValid) return;

        const exists = await isMobileNumberRegistered(mobileNumber);
        if (!exists) {
            mobileErr.textContent = "Mobile number not found in system.";
            return;
        }
            alert("Login successful! Redirecting to Plans page...");
            sessionStorage.setItem("isLoggedIn", "true");
            sessionStorage.setItem("mobileNumber",mobileNumber);
            window.location.href = "../plansPage/Plans.html";
    });
});

document.querySelectorAll('.otp-input').forEach((input, index, array) => {
    input.addEventListener('input', () => {
      if (input.value.length === 1) {
        if (index < array.length - 1) {
          array[index + 1].focus();
        }
      } else if (input.value.length === 0 && index > 0) {
        array[index - 1].focus();
      }
    });
});
