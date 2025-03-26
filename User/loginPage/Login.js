document.addEventListener("DOMContentLoaded", function () {
    const userForm = document.getElementById("user_form");
    const getOtpButton = document.getElementById("getOtp");
    const mobileInput = document.getElementById("mobilenumber");
    const mobileErr = document.getElementById("mobileErr");
    const otpErr = document.getElementById("otpErr");
    
    const backendBaseUrl = "http://localhost:8083/api"; // your backend base URL

    getOtpButton.addEventListener("click", async function (event) {
        const mobileNumber = mobileInput.value.trim();

        // Validate mobile number
        if (mobileNumber === "") {
            mobileErr.textContent = "Enter mobile number to get OTP.";
            return;
        } else if (!/^\d{10}$/.test(mobileNumber)) {
            mobileErr.textContent = "Invalid mobile number. Enter a 10-digit number.";
            return;
        } 
        
        // Clear any previous error messages
        mobileErr.textContent = "";
        
        
        // Send request to the backend to send OTP via Twilio
        try {
            const otpResponse = await fetch(`${backendBaseUrl}/auth/send-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile_number: "+91"+mobileNumber
                })
            });
            
            if (otpResponse.ok) {
                const responseData = await otpResponse.json();
                alert(responseData.message || "OTP sent to your mobile number.");
                
                // Clear previous OTP inputs
                document.querySelectorAll(".otp-input").forEach(input => {
                    input.value = "";
                });
                
                // Focus on first OTP input field
                document.querySelector(".otp-input").focus();
            } else {
                const errorData = await otpResponse.json();
                alert(errorData.message || "Failed to send OTP. Please try again.");
            }
        } catch (error) {
            console.error("Error sending OTP:", error);
            alert("Failed to send OTP. Please try again.");
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

        // Validate inputs
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
            otpErr.textContent = "OTP must be 6 digits.";
            isValid = false;
        } else {
            otpErr.textContent = "";
        }
    
        if(!isValid) return;
        
        // Verify OTP through Twilio
        try {
            const verifyResponse = await fetch(`${backendBaseUrl}/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile_number: "+91"+mobileNumber,
                    otp: otp
                })
            });
            
            if (verifyResponse.ok) {
                // Proceed with user login
                const loginResponse = await fetch(`${backendBaseUrl}/auth/user-login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        mobile_number: mobileNumber
                    })
                });
                
                if (loginResponse.ok) {
                    const loginData = await loginResponse.json();
                    
                    // Store authentication data securely
                    sessionStorage.setItem("accessToken", loginData.accessToken);
                    sessionStorage.setItem("userRole", loginData.role);
                    sessionStorage.setItem("lastLogin", loginData.lastLogin);
                    sessionStorage.setItem("mobileNumber", mobileNumber);

                    const userResponse = await fetch(`${backendBaseUrl}/users/mobile/${mobileNumber}`, { method: "GET" });

                    if (userResponse.ok) {
                        const userData = await userResponse.json();
                        sessionStorage.setItem("loggedInUser", JSON.stringify(userData));
                    } else {
                        console.error("Failed to fetch user details.");
                    }
                    
                    alert("Login successful! Redirecting to Plans page...");
                    window.location.href = "../plansPage/Plans.html";
                } else {
                    const errorData = await loginResponse.json();
                    otpErr.textContent = errorData.message || "Login failed. Please try again.";
                }
            } else {
                const errorData = await verifyResponse.json();
                otpErr.textContent = errorData.message || "Invalid OTP. Please try again.";
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            otpErr.textContent = "Error verifying OTP. Please try again.";
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