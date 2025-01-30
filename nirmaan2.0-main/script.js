function login() {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        document.getElementById('loginSection').style.display = 'none';
        document.querySelector('.superadmin-login-btn').style.display = 'none';
        if (userType === 'admin') {
            document.getElementById('adminDashboard').style.display = 'block';
        } else {
            document.getElementById('userDashboard').style.display = 'block';
            initializeMap();
        }
    } else {
        alert('Please enter both username and password');
    }
}

function logout() {
    document.getElementById('loginSection').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'none';
    document.getElementById('superAdminDashboard').style.display = 'none';
    document.querySelector('.superadmin-login-btn').style.display = 'block';
}

function showPickupRequests() {
    document.getElementById('pickupTable').style.display = 'block';
    document.getElementById('storageMonitoring').style.display = 'none';
    document.getElementById('editInventorySection').style.display = 'none';
}

function showStorageMonitoring() {
    document.getElementById('pickupTable').style.display = 'none';
    document.getElementById('storageMonitoring').style.display = 'block';
    document.getElementById('editInventorySection').style.display = 'none';
    updateCompartmentDisplay();
}

// Add these constants at the top of your file
const BANGALORE_COORDS = { lat: 12.9716, lng: 77.5946 };
const coldStorages = [
    {
        id: 1,
        name: "Central Cold Storage",
        location: { lat: 12.9716, lng: 77.5946 },
        address: "MG Road, Bangalore",
        distance: "0.5",
        temperature: "-18°C to -22°C",
        availability: "80%",
        compartments: [
            { id: "C1", temperature: -18, maxCapacity: 5000, available: true, content: "Frozen Vegetables" },
            { id: "C2", temperature: -20, maxCapacity: 3000, available: false, content: "Premium Beef" },
            { id: "C3", temperature: -15, maxCapacity: 4000, available: true, content: null },
            { id: "C4", temperature: -22, maxCapacity: 6000, available: false, content: "Frozen Fish" },
            { id: "C5", temperature: -18, maxCapacity: 4500, available: true, content: null },
            { id: "C6", temperature: -20, maxCapacity: 3500, available: false, content: "Dairy Products" },
            { id: "C7", temperature: -25, maxCapacity: 5500, available: true, content: null },
            { id: "C8", temperature: -17, maxCapacity: 4200, available: false, content: "Frozen Fruits" },
            { id: "C9", temperature: -19, maxCapacity: 3800, available: true, content: null },
            { id: "C10", temperature: -21, maxCapacity: 4800, available: false, content: "Ice Cream" },
            { id: "C11", temperature: -16, maxCapacity: 3200, available: true, content: null },
            { id: "C12", temperature: -23, maxCapacity: 5200, available: false, content: "Seafood" }
        ]
    }
];

// Add more locations for the customer map
const additionalLocations = [
    {
        position: { lat: 12.9815, lng: 77.6074 },
        title: "Metro Cold Storage",
        temp: "-20°C",
        availability: "45%",
        address: "Indiranagar, Bangalore",
        details: {
            compartments: 8,
            availableSpace: "2500 kg",
            minTemp: "-22°C",
            maxTemp: "-18°C"
        }
    },
    {
        position: { lat: 12.9622, lng: 77.5745 },
        title: "City Cold Chain",
        temp: "-15°C",
        availability: "60%",
        address: "Jayanagar, Bangalore",
        details: {
            compartments: 6,
            availableSpace: "3500 kg",
            minTemp: "-18°C",
            maxTemp: "-15°C"
        }
    },
    {
        position: { lat: 12.9552, lng: 77.6426 },
        title: "Arctic Storage Solutions",
        temp: "-22°C",
        availability: "75%",
        address: "Koramangala, Bangalore",
        details: {
            compartments: 10,
            availableSpace: "5000 kg",
            minTemp: "-25°C",
            maxTemp: "-20°C"
        }
    },
    {
        position: { lat: 12.9783, lng: 77.6408 },
        title: "FrostBite Storage",
        temp: "-19°C",
        availability: "30%",
        address: "HSR Layout, Bangalore",
        details: {
            compartments: 5,
            availableSpace: "1800 kg",
            minTemp: "-20°C",
            maxTemp: "-15°C"
        }
    },
    {
        position: { lat: 12.9349, lng: 77.6055 },
        title: "Polar Storage Hub",
        temp: "-21°C",
        availability: "55%",
        address: "JP Nagar, Bangalore",
        details: {
            compartments: 12,
            availableSpace: "4200 kg",
            minTemp: "-23°C",
            maxTemp: "-18°C"
        }
    }
];

// Update the dummyStorages to include both central and additional locations
const dummyStorages = [
    {
        position: coldStorages[0].location,
        title: coldStorages[0].name,
        temp: coldStorages[0].temperature,
        availability: coldStorages[0].availability,
        address: coldStorages[0].address
    },
    ...additionalLocations
];

let map;
let markers = [];

// Update the EmailJS configuration
const EMAIL_CONFIG = {
    serviceID: 'service_gjnmk08',
    templateID: 'template_19ct1fg',
    publicKey: 'YcZlSwXapuSoTh5j3'
};

const SUPERADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin'
};

// Add these variables at the top of your file
let generatedOTP;

function initializeMap() {
    const bangalore = [12.9716, 77.5946];
    map = L.map('map').setView(bangalore, 12);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for all cold storages
    coldStorages.forEach(storage => {
        const marker = L.marker([storage.location.lat, storage.location.lng])
            .addTo(map);

        const availableCompartments = storage.compartments.filter(c => c.available).length;
        const totalCompartments = storage.compartments.length;

        const popupContent = `
            <div class="storage-popup">
                <h3>${storage.name}</h3>
                <p><strong>Address:</strong> ${storage.address}</p>
                <p><strong>Temperature:</strong> ${storage.temperature}</p>
                <p><strong>Available Compartments:</strong> ${availableCompartments}/${totalCompartments}</p>
                <p><strong>Distance:</strong> ${storage.distance} km</p>
                <button onclick="showStorageDetails(${storage.id})" class="view-details-btn">
                    View Details
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });

    displayStorageList();
}

function displayStorageList() {
    const storageCards = document.getElementById('storageCards');
    storageCards.innerHTML = coldStorages.map(storage => {
        const availableCompartments = storage.compartments.filter(c => c.available).length;
        const totalCompartments = storage.compartments.length;
        
        return `
            <div class="storage-card" onclick="showStorageDetails(${storage.id})">
                <h4>${storage.name}</h4>
                <div class="storage-info-item">
                    <span>Location:</span>
                    <span>${storage.address}</span>
                </div>
                <div class="storage-info-item">
                    <span>Distance:</span>
                    <span>${storage.distance} km</span>
                </div>
                <div class="storage-info-item">
                    <span>Temperature:</span>
                    <span>${storage.temperature}</span>
                </div>
                <div class="storage-info-item">
                    <span>Available:</span>
                    <span>${availableCompartments} of ${totalCompartments} compartments</span>
                </div>
            </div>
        `;
    }).join('');
}

function showStorageDetails(storageId) {
    const storage = coldStorages.find(s => s.id === storageId);
    if (!storage) return;

    // Update active state in storage list
    document.querySelectorAll('.storage-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const selectedCard = document.querySelector(`.storage-card:nth-child(${storageId})`);
    if (selectedCard) {
        selectedCard.classList.add('active');
    }

    // Show storage details
    const storageDetails = document.getElementById('storageDetails');
    storageDetails.style.display = 'block';
    document.getElementById('storageName').textContent = storage.name;
    document.getElementById('storageDistance').textContent = `Distance: ${storage.distance} km`;

    // Update compartment list
    updateCompartmentList(storage);
}

function updateCompartmentList(storage) {
    const compartmentList = document.getElementById('compartmentList');
    compartmentList.innerHTML = '';

    storage.compartments.forEach(comp => {
        if (comp.available) {
            const compartmentCard = document.createElement('div');
            compartmentCard.className = 'compartment-card';
            compartmentCard.innerHTML = `
                <h6>Compartment ${comp.id}</h6>
                <p>Temperature: ${comp.temperature}°C</p>
                <p>Max Capacity: ${comp.maxCapacity} kg</p>
            `;
            compartmentCard.onclick = () => selectCompartment(comp.id);
            compartmentList.appendChild(compartmentCard);
        }
    });
}

function selectCompartment(compartmentId) {
    document.querySelectorAll('.compartment-card').forEach(card => {
        card.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    document.getElementById('selectedCompartment').value = compartmentId;
    document.getElementById('requestForm').style.display = 'block';
}

function submitRequest(event) {
    event.preventDefault();
    const compartment = document.getElementById('selectedCompartment').value;
    const capacity = document.getElementById('requestCapacity').value;
    const duration = document.getElementById('storageDuration').value;

    // Here you would typically send this data to your backend
    alert(`Request submitted for:\nCompartment: ${compartment}\nCapacity: ${capacity}kg\nDuration: ${duration} days`);
}

// Add these new functions
function showRegistration() {
    const userType = document.querySelector('input[name="userType"]:checked').value;
    document.getElementById('loginSection').style.display = 'none';
    document.querySelector('.superadmin-login-btn').style.display = 'none';
    if (userType === 'admin') {
        document.getElementById('adminRegistration').style.display = 'flex';
    } else {
        document.getElementById('customerRegistration').style.display = 'flex';
    }
}

function showLogin() {
    document.getElementById('adminRegistration').style.display = 'none';
    document.getElementById('customerRegistration').style.display = 'none';
    document.getElementById('loginSection').style.display = 'flex';
    document.querySelector('.superadmin-login-btn').style.display = 'block';
}

// Add these functions to handle form submissions
document.addEventListener('DOMContentLoaded', function() {
    // For customer registration form
    const customerForm = document.getElementById('customerRegistrationForm');
    if (customerForm) {
        customerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitCustomerRegistration(e);
        });
    }

    // For admin registration form
    const adminForm = document.getElementById('adminRegistrationForm');
    if (adminForm) {
        adminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            submitAdminRegistration(e);
        });
    }
});

// Update the submitCustomerRegistration function
function submitCustomerRegistration(event) {
    event.preventDefault();
    const form = event.target;
    
    // Store registration data
    window.registrationData = {
        type: 'customer',
        email: form.querySelector('input[name="email"]').value,
        firstName: form.querySelector('input[name="firstName"]').value,
        lastName: form.querySelector('input[name="lastName"]').value,
        username: form.querySelector('input[name="username"]').value,
        password: form.querySelector('input[name="password"]').value
    };

    // Generate and show OTP
    const dummyOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Demo OTP:', dummyOTP); // For testing

    Swal.fire({
        title: 'OTP Verification',
        html: `
            <div style="margin-bottom: 1rem;">
                <p>Demo OTP: <strong>${dummyOTP}</strong></p>
                <p>Enter the OTP to complete registration</p>
            </div>
            <input type="text" id="otpInput" class="swal2-input" placeholder="Enter 6-digit OTP">
        `,
        showCancelButton: true,
        confirmButtonText: 'Verify',
        showLoaderOnConfirm: true,
        preConfirm: () => {
            const enteredOTP = document.getElementById('otpInput').value;
            if (enteredOTP === dummyOTP) {
                return true;
            }
            Swal.showValidationMessage('Invalid OTP');
            return false;
        }
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful',
                text: 'You can now login with your credentials'
            }).then(() => {
                showLogin();
            });
        }
    });
}

// Update the submitAdminRegistration function
function submitAdminRegistration(event) {
    event.preventDefault();
    const form = event.target;
    
    window.registrationData = {
        type: 'admin',
        firstName: form.querySelector('input[name="firstName"]').value,
        lastName: form.querySelector('input[name="lastName"]').value,
        email: form.querySelector('input[name="email"]').value,
        companyName: form.querySelector('input[name="companyName"]').value,
        licenseNumber: form.querySelector('input[name="licenseNumber"]').value
    };

    // Show loading state
    Swal.fire({
        title: 'Sending OTP',
        text: 'Please wait...',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => {
            Swal.showLoading();
        }
    });

    // Send OTP
    sendOTP(window.registrationData.email);
}

// Update the sendOTP function with simpler implementation
function sendOTP(userEmail) {
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Log OTP for demo purposes
    console.log('Generated OTP:', generatedOTP);

    // Prepare template parameters
    const templateParams = {
        to_email: userEmail,
        message: `Your OTP is: ${generatedOTP}`,
        from_name: "Cold Storage Management",
        otp: generatedOTP
    };

    // Show loading state
    Swal.fire({
        title: 'Demo Mode',
        html: `
            <div style="text-align: left; padding: 15px;">
                <p>✓ Email would be sent to: ${userEmail}</p>
                <p>✓ For demo purposes, use: <strong style="color: #FF6B6B">${generatedOTP}</strong></p>
                <p style="margin-top: 10px; font-size: 12px; color: #666;">
                    In production, the OTP would be sent via email.
                </p>
            </div>
        `,
        icon: 'info',
        confirmButtonColor: '#FF6B6B'
    }).then(() => {
        // Show OTP input modal
        document.getElementById('otpModal').style.display = 'block';
        startOtpTimer();
    });

    // Optional: Actually try to send email (can be removed if not needed)
    emailjs.send(EMAIL_CONFIG.serviceID, EMAIL_CONFIG.templateID, templateParams)
        .then(function(response) {
            console.log("SUCCESS", response);
        }, function(error) {
            console.log("FAILED", error);
        });
}

// Update the verifyOTP function to be more user-friendly
function verifyOTP() {
    const otpInputs = document.querySelectorAll('.otp-digit');
    const enteredOTP = Array.from(otpInputs).map(input => input.value).join('');
    
    // For demo purposes, accept either the generated OTP or any 6-digit number
    if (!/^\d{6}$/.test(enteredOTP)) {
        Swal.fire({
            title: 'Invalid Format',
            text: 'Please enter a 6-digit number',
            icon: 'error',
            confirmButtonColor: '#FF6B6B'
        });
        return;
    }

    // Accept the OTP for demo purposes
    document.getElementById('otpModal').style.display = 'none';
    
    if (window.registrationData.type === 'customer') {
        Swal.fire({
            title: 'Registration Successful!',
            text: 'You can now login with your credentials',
            icon: 'success',
            confirmButtonColor: '#FF6B6B'
        }).then(() => {
            showLogin();
        });
    } else {
        // For admins, send to superadmin for approval
        try {
            const requestCard = createRequestCard(window.registrationData);
            const requestsContainer = document.getElementById('coldStorageRequests');
            if (requestsContainer) {
                requestsContainer.appendChild(requestCard);
                Swal.fire({
                    title: 'Registration Submitted!',
                    html: `
                        <div style="text-align: left; padding: 10px;">
                            <p>Your registration has been submitted for verification.</p>
                            <p>You will receive an email once approved.</p>
                            <p style="margin-top: 15px;"><strong>Next steps:</strong></p>
                            <ul style="list-style-type: none; padding-left: 0;">
                                <li>✓ Wait for approval email</li>
                                <li>✓ Login with provided credentials</li>
                                <li>✓ Complete your profile</li>
                            </ul>
                        </div>
                    `,
                    icon: 'info',
                    confirmButtonColor: '#FF6B6B'
                }).then(() => {
                    showLogin();
                });
            }
        } catch (error) {
            console.error('Error creating request card:', error);
            Swal.fire({
                title: 'Error',
                text: 'Failed to submit registration. Please try again.',
                icon: 'error',
                confirmButtonColor: '#FF6B6B'
            });
        }
    }
    
    // Clear temporary data
    delete window.registrationData;
}

function startOtpTimer() {
    let timeLeft = 30;
    const timerDisplay = document.getElementById('timerCount');
    const resendButton = document.getElementById('resendOtpBtn');
    
    resendButton.disabled = true;
    document.getElementById('otpTimer').style.display = 'block';
    
    const timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById('otpTimer').style.display = 'none';
            resendButton.disabled = false;
        }
    }, 1000);
}

function resendOTP() {
    if (window.registrationData && window.registrationData.email) {
        sendOTP(window.registrationData.email);
        startOtpTimer();
    }
}

// Add this to handle file upload display
document.getElementById('licensePhoto')?.addEventListener('change', function(e) {
    const fileName = e.target.files[0]?.name || 'No file chosen';
    e.target.nextElementSibling.querySelector('.upload-text').textContent = fileName;
});

// Add these functions at the end of your script.js file

function showSuperAdminLogin() {
    document.getElementById('superAdminLoginModal').style.display = 'block';
}

function closeSuperAdminLogin() {
    document.getElementById('superAdminLoginModal').style.display = 'none';
}

function loginSuperAdmin() {
    const username = document.getElementById('superAdminUsername').value;
    const password = document.getElementById('superAdminPassword').value;

    if (username === SUPERADMIN_CREDENTIALS.username && password === SUPERADMIN_CREDENTIALS.password) {
        document.getElementById('superAdminLoginModal').style.display = 'none';
        document.getElementById('loginSection').style.display = 'none';
        document.getElementById('superAdminDashboard').style.display = 'block';
        document.querySelector('.superadmin-login-btn').style.display = 'none';
    } else {
        alert('Invalid credentials');
    }
}

// Update the handleRequest function
function handleRequest(action, licenseNo) {
    const requestCard = document.querySelector(`[data-license="${licenseNo}"]`);
    const email = requestCard.querySelector('[data-email]').dataset.email;
    const companyName = requestCard.querySelector('h4').textContent;
    
    if (action === 'approve') {
        // Generate credentials
        const credentials = generateCredentials();
        
        // Add to approved cold storages list first
        const storageData = {
            name: companyName,
            licenseNo: licenseNo,
            email: email,
            status: 'Active'
        };
        
        // Add to the list
        addToApprovedStorages(storageData);

        // Send approval email
        const approvalEmailBody = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B6B;">Cold Storage Registration Approved</h2>
                <p>Dear Admin,</p>
                <p>Your cold storage registration for <strong>${companyName}</strong> has been approved.</p>
                <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                    <h3 style="color: #4ECDC4;">Your Login Credentials:</h3>
                    <p><strong>Username:</strong> ${credentials.username}</p>
                    <p><strong>Password:</strong> ${credentials.password}</p>
                </div>
                <p>Please login with these credentials and change your password upon first login.</p>
                <p>Best regards,<br>Cold Storage Management Team</p>
            </div>
        `;

        Email.send({
            Host: EMAIL_CONFIG.smtpServer,
            Port: EMAIL_CONFIG.port,
            Username: EMAIL_CONFIG.senderEmail,
            Password: EMAIL_CONFIG.smtpPassword,
            To: email,
            From: EMAIL_CONFIG.senderEmail,
            Subject: "Cold Storage Registration Approved",
            Body: approvalEmailBody
        }).then(message => {
            if (message === "OK") {
                Swal.fire({
                    title: 'Registration Approved!',
                    text: 'Credentials have been sent to the admin',
                    icon: 'success',
                    confirmButtonColor: '#FF6B6B'
                });
            } else {
                console.error('Email error:', message);
                Swal.fire({
                    title: 'Warning',
                    text: 'Approval successful but failed to send email. Please contact the admin.',
                    icon: 'warning',
                    confirmButtonColor: '#FF6B6B'
                });
            }
        });
    } else {
        // Handle rejection
        const rejectionEmailBody = `
            <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #FF6B6B;">Cold Storage Registration Update</h2>
                <p>Dear Admin,</p>
                <p>We regret to inform you that your cold storage registration for <strong>${companyName}</strong> has been rejected.</p>
                <p>Please contact support for more information.</p>
                <p>Best regards,<br>Cold Storage Management Team</p>
            </div>
        `;

        Email.send({
            Host: EMAIL_CONFIG.smtpServer,
            Port: EMAIL_CONFIG.port,
            Username: EMAIL_CONFIG.senderEmail,
            Password: EMAIL_CONFIG.smtpPassword,
            To: email,
            From: EMAIL_CONFIG.senderEmail,
            Subject: "Cold Storage Registration Status",
            Body: rejectionEmailBody
        }).then(message => {
            if (message === "OK") {
                Swal.fire({
                    title: 'Registration Rejected',
                    text: 'The admin has been notified',
                    icon: 'info',
                    confirmButtonColor: '#FF6B6B'
                });
            } else {
                console.error('Email error:', message);
                Swal.fire({
                    title: 'Warning',
                    text: 'Rejection processed but failed to send email',
                    icon: 'warning',
                    confirmButtonColor: '#FF6B6B'
                });
            }
        });
    }
    
    // Remove the request card
    requestCard.remove();
}

function toggleStorageStatus(licenseNo) {
    const btn = event.target;
    const currentStatus = btn.textContent;
    const newStatus = currentStatus === 'Suspend' ? 'Activate' : 'Suspend';
    btn.textContent = newStatus;
    
    const statusCell = btn.closest('tr').querySelector('.status-badge');
    statusCell.textContent = currentStatus === 'Suspend' ? 'Suspended' : 'Active';
    statusCell.className = `status-badge ${currentStatus === 'Suspend' ? 'suspended' : 'active'}`;
    
    // Here you would typically make an API call to update the status
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('superAdminLoginModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// Add OTP input handling
document.addEventListener('DOMContentLoaded', function() {
    const otpInputs = document.querySelectorAll('.otp-digit');
    
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                if (index < otpInputs.length - 1) {
                    otpInputs[index + 1].focus();
                }
            }
        });
        
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});

// Add this function to generate random credentials
function generateCredentials() {
    const username = 'admin_' + Math.random().toString(36).substr(2, 8);
    const password = Math.random().toString(36).substr(2, 12);
    return { username, password };
}

// Add this helper function back to create request cards
function createRequestCard(data) {
    const card = document.createElement('div');
    card.className = 'request-card';
    card.dataset.license = data.licenseNumber;
    
    card.innerHTML = `
        <div class="request-header">
            <h4>${data.companyName}</h4>
            <span class="request-date">${new Date().toISOString().split('T')[0]}</span>
        </div>
        <div class="request-details">
            <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
            <p><strong>License No:</strong> ${data.licenseNumber}</p>
            <p data-email="${data.email}"><strong>Email:</strong> ${data.email}</p>
        </div>
        <div class="request-actions">
            <button class="approve-btn" onclick="handleRequest('approve', '${data.licenseNumber}')">Approve</button>
            <button class="reject-btn" onclick="handleRequest('reject', '${data.licenseNumber}')">Reject</button>
        </div>
    `;
    
    return card;
}

// Add this function to handle approved storages
function addToApprovedStorages(storage) {
    const coldStoragesList = document.getElementById('coldStoragesList');
    
    if (!coldStoragesList) {
        console.error('Cold storages list container not found');
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${storage.name}</td>
        <td>${storage.licenseNo}</td>
        <td>${storage.email}</td>
        <td><span class="status-badge active">Active</span></td>
        <td>
            <button class="suspend-btn" onclick="toggleStorageStatus('${storage.licenseNo}')">Suspend</button>
        </td>
    `;
    
    coldStoragesList.appendChild(newRow);

    // Show success notification
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Cold Storage Added Successfully',
        showConfirmButton: false,
        timer: 1500
    });
}

// Add these functions for inventory management
function showEditInventory() {
    document.getElementById('pickupTable').style.display = 'none';
    document.getElementById('storageMonitoring').style.display = 'none';
    document.getElementById('editInventorySection').style.display = 'block';
    loadCompartments();
}

function loadCompartments() {
    const compartmentsList = document.getElementById('compartmentsList');
    const allCompartments = coldStorages[0].compartments; // Only Central Cold Storage
    
    compartmentsList.innerHTML = allCompartments.map(comp => `
        <div class="compartment-card ${comp.available ? 'available' : 'occupied'}">
            <div class="compartment-header">
                <span class="compartment-title">Compartment ${comp.id}</span>
                <span class="status-badge ${comp.available ? 'available' : 'occupied'}">
                    ${comp.available ? 'Available' : 'Occupied'}
                </span>
            </div>
            
            <div class="compartment-info">
                <div class="info-item">
                    <span class="info-label">Temperature</span>
                    <span class="info-value">${comp.temperature}°C</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Max Capacity</span>
                    <span class="info-value">${comp.maxCapacity} kg</span>
                </div>
                ${comp.content ? `
                    <div class="info-item">
                        <span class="info-label">Current Content</span>
                        <span class="info-value">${comp.content}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="compartment-actions">
                <button class="action-btn edit-btn" onclick="editCompartment('${comp.id}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                    Edit
                </button>
                <button class="action-btn delete-btn" onclick="deleteCompartment('${comp.id}')">
                    <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

function addNewCompartment(event) {
    event.preventDefault();
    const form = event.target;
    
    const newCompartment = {
        id: form.compartmentId.value,
        temperature: parseFloat(form.temperature.value),
        maxCapacity: parseFloat(form.maxCapacity.value),
        available: true
    };

    // Add to first cold storage for demo
    coldStorages[0].compartments.push(newCompartment);
    
    // Update all displays
    loadCompartments();
    updateCompartmentDisplay();
    updateCustomerView();
    
    // Show success message
    Swal.fire({
        title: 'Success!',
        text: 'New compartment has been added',
        icon: 'success',
        confirmButtonColor: '#FF6B6B'
    });
    
    form.reset();
}

function editCompartment(compartmentId) {
    const compartment = findCompartment(compartmentId);
    if (!compartment) return;
    
    Swal.fire({
        title: 'Edit Compartment',
        html: `
            <form class="edit-compartment-form">
                <div class="form-group">
                    <label for="editTemp">Temperature (°C)</label>
                    <input type="number" id="editTemp" class="swal2-input" value="${compartment.temperature}">
                </div>
                <div class="form-group">
                    <label for="editCapacity">Max Capacity (kg)</label>
                    <input type="number" id="editCapacity" class="swal2-input" value="${compartment.maxCapacity}">
                </div>
                <div class="form-group">
                    <label for="editStatus">Status</label>
                    <select id="editStatus" class="swal2-input">
                        <option value="true" ${compartment.available ? 'selected' : ''}>Available</option>
                        <option value="false" ${!compartment.available ? 'selected' : ''}>Occupied</option>
                    </select>
                </div>
                ${!compartment.available ? `
                    <div class="form-group">
                        <label for="editContent">Current Content</label>
                        <input type="text" id="editContent" class="swal2-input" value="${compartment.content || ''}">
                    </div>
                ` : ''}
            </form>
        `,
        showCancelButton: true,
        confirmButtonText: 'Save Changes',
        cancelButtonText: 'Cancel',
        confirmButtonColor: '#FF6B6B',
        cancelButtonColor: '#6c757d',
        customClass: {
            popup: 'edit-compartment-popup'
        },
        preConfirm: () => {
            return {
                temperature: parseFloat(document.getElementById('editTemp').value),
                maxCapacity: parseFloat(document.getElementById('editCapacity').value),
                available: document.getElementById('editStatus').value === 'true',
                content: document.getElementById('editStatus').value === 'true' ? 
                    null : document.getElementById('editContent')?.value
            };
        }
    }).then((result) => {
        if (result.isConfirmed) {
            updateCompartment(compartmentId, result.value);
        }
    });
}

function deleteCompartment(compartmentId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "This compartment will be permanently deleted",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            removeCompartment(compartmentId);
        }
    });
}

function findCompartment(compartmentId) {
    for (let storage of coldStorages) {
        const comp = storage.compartments.find(c => c.id === compartmentId);
        if (comp) return comp;
    }
    return null;
}

function updateCompartment(compartmentId, newData) {
    for (let storage of coldStorages) {
        const comp = storage.compartments.find(c => c.id === compartmentId);
        if (comp) {
            Object.assign(comp, newData);
            loadCompartments();
            updateStorageMonitoring();
            
            Swal.fire({
                title: 'Success!',
                text: 'Compartment has been updated',
                icon: 'success',
                confirmButtonColor: '#FF6B6B'
            });
            return;
        }
    }
}

function removeCompartment(compartmentId) {
    for (let storage of coldStorages) {
        const index = storage.compartments.findIndex(c => c.id === compartmentId);
        if (index !== -1) {
            storage.compartments.splice(index, 1);
            loadCompartments();
            updateStorageMonitoring();
            
            Swal.fire({
                title: 'Deleted!',
                text: 'Compartment has been deleted',
                icon: 'success',
                confirmButtonColor: '#FF6B6B'
            });
            return;
        }
    }
}

function updateStorageMonitoring() {
    // Update the storage monitoring display
    // This should update your existing storage monitoring UI
    showStorageMonitoring();
}

// Add this new function to keep compartments in sync
function updateCompartmentDisplay() {
    // Update the grid container in storage monitoring
    const gridContainer = document.querySelector('.grid-container');
    const allCompartments = coldStorages.flatMap(storage => 
        storage.compartments.map(comp => ({...comp, storageName: storage.name}))
    );
    
    gridContainer.innerHTML = allCompartments.map(comp => `
        <div class="compartment ${comp.available ? 'available' : 'occupied'}">
            <h5>${comp.storageName} - ${comp.id}</h5>
            ${comp.available ? `
                <p>Status: Available</p>
                <p>Temperature: ${comp.temperature}°C</p>
                <p>Max Capacity: ${comp.maxCapacity} kg</p>
            ` : `
                <p>Customer: Sample Customer</p>
                <p>Content: Sample Content</p>
                <p>Temperature: ${comp.temperature}°C</p>
                <p>Capacity: ${Math.floor(Math.random() * 40 + 60)}% Full</p>
            `}
        </div>
    `).join('');

    // Update total counts
    const totalCount = allCompartments.length;
    const occupiedCount = allCompartments.filter(comp => !comp.available).length;
    const availableCount = totalCount - occupiedCount;

    document.querySelector('.info-cards').innerHTML = `
        <div class="info-card">
            <span class="card-title">Total Compartments</span>
            <span class="card-value">${totalCount}</span>
        </div>
        <div class="info-card">
            <span class="card-title">Occupied</span>
            <span class="card-value">${occupiedCount}</span>
        </div>
        <div class="info-card">
            <span class="card-title">Available</span>
            <span class="card-value">${availableCount}</span>
        </div>
    `;
}

// Add this function to update customer view
function updateCustomerView() {
    // Update storage cards
    displayStorageList();
    
    // Update map markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    coldStorages.forEach(storage => {
        const marker = L.marker([storage.location.lat, storage.location.lng])
            .addTo(map);

        const availableCompartments = storage.compartments.filter(c => c.available).length;
        const totalCompartments = storage.compartments.length;
        const availability = Math.floor((availableCompartments / totalCompartments) * 100);

        const popupContent = `
            <div style="padding: 10px;">
                <h3 style="color: #FF6B6B; margin-bottom: 8px;">${storage.name}</h3>
                <p style="margin: 5px 0;"><strong>Temperature Range:</strong> ${storage.temperature}</p>
                <p style="margin: 5px 0;"><strong>Availability:</strong> ${availability}%</p>
                <p style="margin: 5px 0;"><strong>Compartments:</strong> ${availableCompartments} of ${totalCompartments} available</p>
                <button onclick="showStorageDetails(${storage.id})" 
                        style="background: #FF6B6B; color: white; border: none; 
                        padding: 8px 15px; border-radius: 5px; cursor: pointer;
                        margin-top: 8px;">
                    View Details
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });
}

// Update the marker popup content
function createMarkerPopup(storage) {
    return `
        <div style="padding: 15px;">
            <h3 style="color: #FF6B6B; margin-bottom: 12px; font-size: 1.2rem;">
                ${storage.title}
            </h3>
            <div style="margin: 8px 0;">
                <p style="margin: 5px 0;">
                    <strong>Location:</strong> ${storage.address}
                </p>
                <p style="margin: 5px 0;">
                    <strong>Temperature Range:</strong> ${storage.details.minTemp} to ${storage.details.maxTemp}
                </p>
                <p style="margin: 5px 0;">
                    <strong>Available Space:</strong> ${storage.details.availableSpace}
                </p>
                <p style="margin: 5px 0;">
                    <strong>Compartments:</strong> ${storage.details.compartments} units
                </p>
                <p style="margin: 5px 0;">
                    <strong>Current Availability:</strong> 
                    <span style="color: ${parseInt(storage.availability) > 50 ? '#4CAF50' : '#FF6B6B'}">
                        ${storage.availability}
                    </span>
                </p>
            </div>
            <button onclick="showStorageDetails('${storage.title}')" 
                    style="background: #FF6B6B; color: white; border: none; 
                    padding: 10px 20px; border-radius: 8px; cursor: pointer;
                    margin-top: 12px; width: 100%; font-weight: 500;
                    transition: all 0.3s ease;">
                View Details
            </button>
        </div>
    `;
} 