
document.addEventListener("DOMContentLoaded", function () {
    const modalEl = document.getElementById("planModal");
    planModal = new bootstrap.Modal(modalEl);
    let user = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const historyContainer = document.getElementById("historyContainer");
        fetch(`http://localhost:8083/api/recharge/history?userId=${user.userId}`)
        .then(res => res.json())
        .then(history => {
            if (history.length === 0) {
                document.getElementById("historyContainer").innerHTML = "<p>No history found</p>";
                return;
            }

            // Loop over history and create HTML cards as before
            history.forEach(item => {
            const card = document.createElement("div");
            card.className = "card mb-3 p-3";
            card.innerHTML = `
                <div class="card-content">
                <h4 class="cost">₹${item.cost}</h4>
                <p class="recharge_date">${item.rechargeDate}</p>
                <button class="view-btn btn btn-primary rounded">View Details</button>
                <button class="download-btn btn btn-primary rounded">Download Invoice<span class="material-symbols-outlined">download</span></button>
                </div>

                <div class="details">
                <p><strong>Transaction Details</strong></p>
                <table class="transaction-table">
                <tr>
                    <td><strong>Transaction ID</strong></td>
                    <td id="transactionId">${item.transactionRef}</td>
                </tr>
                <tr>
                    <td><strong>Payment Mode</strong></td>
                    <td id="paymentMethod">${item.paymentMode}</td>
                </tr>
                <tr>
                    <td><strong>Payment Status</strong></td>
                    <td id="paymentMethod">${item.paymentStatus}</td>
                </tr>
                </table>

                <p style="margin-top: 30px;"><strong>Plan Details</strong></p>
                <table class="plan-table">
                    <tr>
                        <td><strong>Cost</strong></td>
                        <td id="planCost">₹${item.cost}</td>
                    </tr>
                    <tr>
                        <td><strong>Validity</strong></td>
                        <td id="planValidity">${item.validity}</td>
                    </tr>
                    <tr>
                        <td><strong>Data</strong></td>
                        <td id="planData">${item.data}</td>
                    </tr>
                    <tr>
                        <td><strong>SMS</strong></td>
                        <td id="planSms">${item.sms}</td>
                    </tr>
                    <tr>
                        <td><strong>Calls</strong></td>
                        <td id="planCalls">${item.calls}</td>
                    </tr>
                </table>
                </div>
                `;
            
            const viewBtn = card.querySelector(".view-btn");
            const details = card.querySelector(".details");

            viewBtn.addEventListener("click", function () {
                $(details).slideToggle();
            });

            const downloadBtn = card.querySelector(".download-btn");
            downloadBtn.addEventListener("click", function () {
                downloadInvoice({
                    // month,
                    cost:item.cost,
                    validity:item.validity,
                    data:item.data,
                    sms:item.sms,
                    calls:item.calls,
                    date:item.rechargeDate,
                    transactionId:item.transactionRef,
                    paymentMode:item.paymentMode,
                    paymentStatus:item.paymentStatus
                });
            });

            historyContainer.appendChild(card);
        });
    });

    fetch(`http://localhost:8083/api/recharge/current-plan/details?userId=${user.userId}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("status-badge").innerText = data.status;
            document.getElementById("current_plan_cost").innerText = `₹${data.cost}`;
            
            const expiryDate = new Date(data.expiryDate);
            const formattedDate = expiryDate.toLocaleString('default', {year:'numeric', month: 'long', day: 'numeric' });

            document.getElementById("current_plan_expiry").innerText = formattedDate;
        })
        .catch(err => {
            console.error("Error loading current plan:", err);
        });

        const viewPlanBtn = document.querySelector(".current-plan button");

        viewPlanBtn.addEventListener("click", () => {

            if (!user || !user.userId) {
                console.error("User not found in sessionStorage");
                return;
            }

            fetch(`http://localhost:8083/api/recharge/current-plan/details?userId=${user.userId}`)
                .then(res => res.json())
                .then(data => {
                    // Set the values in the modal
                    // document.getElementById("current_plan_cost").innerText = `₹${data.cost}`;
                    document.getElementById("modalCost").innerText = `₹${data.cost}`;
                    document.getElementById("modalValidity").innerText = `${data.validity} days`;
                    document.getElementById("modalData").innerText = data.data;
                    document.getElementById("modalSms").innerText = `${data.sms} SMS/day`;
                    document.getElementById("modalCalls").innerText = data.calls;
                    planModal.show();
                })
                .catch(error => {
                    console.error("Error fetching plan details:", error);
                });
        });

        modalEl.addEventListener("hidden.bs.modal", () => {
            //Clean up backdrop manually just in case
            document.querySelectorAll(".modal-backdrop").forEach(el => el.remove());
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "auto";
        });



    function downloadInvoice({cost, validity, data, sms, calls, date, transactionId, paymentMode, paymentStatus }) {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
    
        // Add Title
        doc.setFontSize(18);
        doc.text("Invoice", 90, 10);
    
        const columnStyles = {
            0: { cellWidth: 50 },
            1: { cellWidth: 100 }
        };
    
        // Transaction Details Data
        const transactionData = [
            [{ content: "Transaction Details", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fillColor: [200, 200, 200] } }],
            ["Date", date],
            ["Transaction ID", transactionId],
            ["Payment Mode", paymentMode],
            ["Payment Status", paymentStatus]
        ];
    
        // Add Transaction Details Table
        doc.autoTable({
            body: transactionData,
            startY: 20,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 20 },
            columnStyles: columnStyles // Apply uniform column widths
        });
    
        // Get the current Y position after first table and add space
        let finalY = doc.lastAutoTable.finalY + 10; 
    
        // Plan Details Data
        const planData = [
            [{ content: "Plan Details", colSpan: 2, styles: { halign: "center", fontStyle: "bold", fillColor: [200, 200, 200] } }],
            ["Cost", cost],
            ["Validity", validity],
            ["Data", data],
            ["SMS", sms],
            ["Calls", calls]
        ];
    
        // Add Plan Details Table with consistent column widths
        doc.autoTable({
            body: planData,
            startY: finalY,
            theme: "grid",
            styles: { fontSize: 10 },
            headStyles: { fillColor: [0, 102, 204], textColor: 255, fontStyle: "bold" },
            alternateRowStyles: { fillColor: [240, 240, 240] },
            margin: { left: 20, right: 20 },
            columnStyles: columnStyles // Apply same column width as first table
        });
    
        // Save the PDF
        doc.save("Invoice.pdf");
    }
    
    const storedUser = JSON.parse(sessionStorage.getItem("loggedInUser"));
    const userId = storedUser?.userId;

    if (!userId) {
        console.error("No userId found in sessionStorage.");
        return;
    }

    let selectedProfileImage = null;

    fetch(`http://localhost:8083/api/users/${userId}`)
        .then(response => response.json())
        .then(user => {
            // Populate profile
            document.getElementById("userName").textContent = user.firstName + " " + user.lastName;
            document.getElementById("mobileNumber").textContent = user.mobileNumber;
            document.getElementById("editfirstName").value = user.firstName;
            document.getElementById("editlastName").value = user.lastName;
            document.getElementById("editMobile").value = user.mobileNumber;
            document.getElementById("editalternateMobile").value = user.alternateMobile;
            document.getElementById("editDob").value = user.dob;
            document.getElementById("editEmail").value = user.email;

            const editProfilePic = document.getElementById("editProfilePic");
            const editInitialCircle = document.getElementById("editInitialCircle");

            if (user.profileImg) {
                // Show the image and hide the initial circle
                const profilePic = document.getElementById("profilePic");
                profilePic.src = user.profileImg;
                profilePic.classList.remove("d-none");
                document.getElementById("initialCircle").classList.add("d-none");
            } else {
                // No image available, show the initial circle with first letter
                document.getElementById("initialCircle").textContent = user.firstName.charAt(0);
                document.getElementById("initialCircle").classList.remove("d-none");
                document.getElementById("profilePic").classList.add("d-none");
            }

            // Assuming single address
            const address = user.addresses[0];
            if (address) {
                const fullAddress = `${address.doorNo}, ${address.street}, ${address.city}, ${address.district}, ${address.state} - ${address.pincode}`;
                document.getElementById("editAddress").value = fullAddress;
            }
        })
        .catch(error => {
            console.error("Error fetching user details:", error);
        });


        document.getElementById("profileImageContainer").addEventListener("click", function() {
            document.getElementById("profileImageUpload").click();
        });
        
        // Handle file selection
        document.getElementById("profileImageUpload").addEventListener("change", function(event) {
            const file = event.target.files[0];
            if (file) {
                // Store the file for later use
                selectedProfileImage = file;
                
                // Display the selected image
                const reader = new FileReader();
                reader.onload = function(e) {
                    const editProfilePic = document.getElementById("editProfilePic");
                    const editInitialCircle = document.getElementById("editInitialCircle");
                    
                    editProfilePic.src = e.target.result;
                    editProfilePic.classList.remove("d-none");
                    editInitialCircle.classList.add("d-none");
                };
                reader.readAsDataURL(file);
            }
        });

    // Save only email when the Save Changes button is clicked
    document.getElementById("saveChanges").addEventListener("click", function() {
        const updatedEmail = document.getElementById("editEmail").value;
    const updatedAlternateMobile = document.getElementById("editalternateMobile").value;
    
    // Create a FormData object to handle the file upload
    const formData = new FormData();
    formData.append("email", updatedEmail);
    formData.append("alternateMobile", updatedAlternateMobile);
    
    // If a new profile image was selected, add it to the form data
    if (selectedProfileImage) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const base64String = e.target.result;
            
            // Resize the image before sending
            resizeImage(base64String)
                .then(resizedImage => {
                    // Extract the base64 string (remove the data:image/xxx;base64, prefix)
                    const finalBase64 = resizedImage.split(',')[1];
                    updateUserProfile(userId, updatedEmail, updatedAlternateMobile, finalBase64);
                });
        };
        reader.readAsDataURL(selectedProfileImage);
    } else {
        // No new image selected, just update other fields
        updateUserProfile(userId, updatedEmail, updatedAlternateMobile, null);
    }

    });

    //resizing image
    function resizeImage(base64Str, maxWidth = 50, maxHeight = 50) {
        return new Promise((resolve) => {
            let img = new Image();
            img.src = base64Str;
            img.onload = () => {
                let canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;
                
                // Calculate the new dimensions
                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }
                
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                
                // Get the resized image as base64
                resolve(canvas.toDataURL('image/jpeg', 0.25));
            };
        });
    }
    
});

function updateUserProfile(userId, email, alternateMobile, profileImgBase64) {
    // Prepare the data object
    const updateData = {
        email: email,
        alternateMobile: alternateMobile
    };
    
    // Add profile image if provided
    if (profileImgBase64) {
        updateData.profileImg = profileImgBase64;
    }
    
    // Send the update request
    fetch(`http://localhost:8083/api/users/${userId}/update`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log("Profile updated successfully:", data);
        
        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById("editModal"));
        modal.hide();
        
        // Optionally refresh the page or update the displayed profile
        location.reload();
    })
    .catch(error => {
        console.error("Error updating profile:", error);
        alert("Failed to update profile. Please try again.");
    });
}

document.getElementById("editButton").addEventListener("click", function () {
    let editModal = new bootstrap.Modal(document.getElementById("editModal"));
    editModal.show();
});

document.addEventListener("DOMContentLoaded", function () {
    const viewPlanButton = document.querySelector(".current-plan button");

    viewPlanButton.addEventListener("click", function () {
        let planModal = new bootstrap.Modal(document.getElementById("planModal"));
        planModal.show();
    });
});


