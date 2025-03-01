document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("user_form");
    const getOtpButton = document.getElementById("getOtp");
    const mobileInput = document.getElementById("mobilenumber");
    const mobileErr = document.getElementById("mobileErr");
    const otpErr = document.getElementById("otpErr");

    getOtpButton.addEventListener("click", function (event) {
        const mobileNumber = mobileInput.value.trim();

        if (mobileNumber === "") {
            mobileErr.textContent = "Enter mobile number to get OTP.";
            return;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            mobileErr.textContent = "Invalid mobile number. Enter a 10-digit number.";
            return;
        } else {
            mobileErr.textContent = "";
            alert("OTP sent successfully!");
            // add OTP generation logic
        }
    });

    userForm.addEventListener("submit", function (event) {
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
            alert("Login successful! Redirecting to Plans page...");
            localStorage.setItem("isLoggedIn", "true"); // Store login state
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
