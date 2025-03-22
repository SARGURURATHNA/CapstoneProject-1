document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("user_form");
    const getOtpButton = document.getElementById("getOtp");
    const mobileInput = document.getElementById("mobilenumber");
    const mobileErr = document.getElementById("mobileErr");
    const otpErr = document.getElementById("otpErr");
    
    // Variable to store the generated OTP
    let generatedOTP = "";

    const backendBaseUrl = "http://localhost:8083/api/users"; // your backend base URL

    // Check if mobile number exists
    async function isMobileNumberRegistered(mobileNumber) {
        const response = await fetch(`${backendBaseUrl}/exists-by-mobile/${mobileNumber}`);
        const exists = await response.json();
        return exists;
    }

    // Function to generate a random 6-digit OTP
    function generateOTP() {
        const digits = '0123456789';
        let OTP = '';
        
        for (let i = 0; i < 6; i++) {
            OTP += digits[Math.floor(Math.random() * 10)];
        }
        
        return OTP;
    }

    getOtpButton.addEventListener("click", async function (event) {
        const mobileNumber = mobileInput.value.trim();

        const exists = await isMobileNumberRegistered(mobileNumber);
        if (mobileNumber === "") {
            mobileErr.textContent = "Enter mobile number to get OTP.";
            return;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            mobileErr.textContent = "Invalid mobile number. Enter a 10-digit number.";
            return;
        } 
        else if (!exists) {
            mobileErr.textContent = "Mobile number not found in system.";
            return;
        }
        else {
            mobileErr.textContent = "";
            
            generatedOTP = generateOTP();

            const response = await fetch(`${backendBaseUrl}/mobile/${mobileNumber}`);
            const user = await response.json();

            const userEmail = user.email;

            // Send OTP to backend for emailing
            fetch("http://localhost:8083/api/send-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: userEmail,
                    otp: generatedOTP
                })
            })
            .then(response => response.text())
            .then(message => alert(message))
            .catch(error => console.error("Error sending OTP:", error));
                    
            // Clear previous OTP inputs
            document.querySelectorAll(".otp-input").forEach(input => {
                input.value = "";
            });
            
            // Focus on first OTP input field
            document.querySelector(".otp-input").focus();
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
        
        //Check if generated OTP exists and matches the entered OTP
        if (generatedOTP === "") {
            otpErr.textContent = "Please click 'Get OTP' first.";
            return;
        }
        
        if (otp !== generatedOTP) {
            otpErr.textContent = "Invalid OTP. Please try again.";
            return;
        }

        const exists = await isMobileNumberRegistered(mobileNumber);
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
    });
});

document.querySelectorAll('.otp-input').forEach((input, index, array) => {
    input.addEventListener('input', () => {
        // Allow only numeric input
        input.value = input.value.replace(/[^0-9]/g, '');
        
        if (input.value.length === 1) {
            if (index < array.length - 1) {
                array[index + 1].focus();
            }
        } else if (input.value.length === 0 && index > 0) {
            array[index - 1].focus();
        }
    });
    
    // Handle backspace key
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && input.value === '' && index > 0) {
            array[index - 1].focus();
        }
    });
});