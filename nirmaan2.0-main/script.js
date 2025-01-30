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
            availableSpace: "4500 kg",
            minTemp: "-25°C",
            maxTemp: "-20°C"
        }
    },
    {
        position: { lat: 12.9783, lng: 77.6408 },
        title: "FrostBite Storage",
        temp: "-18°C",
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
        temp: "-25°C",
        availability: "55%",
        address: "JP Nagar, Bangalore",
        details: {
            compartments: 12,
            availableSpace: "6000 kg",
            minTemp: "-28°C",
            maxTemp: "-22°C"
        }
    },
    {
        position: { lat: 13.0012, lng: 77.5997 },
        title: "CryoTech Storage",
        temp: "-23°C",
        availability: "65%",
        address: "RT Nagar, Bangalore",
        details: {
            compartments: 9,
            availableSpace: "4200 kg",
            minTemp: "-25°C",
            maxTemp: "-20°C"
        }
    },
    {
        position: { lat: 12.9121, lng: 77.6446 },
        title: "Glacier Cold Chain",
        temp: "-20°C",
        availability: "40%",
        address: "BTM Layout, Bangalore",
        details: {
            compartments: 7,
            availableSpace: "3000 kg",
            minTemp: "-22°C",
            maxTemp: "-18°C"
        }
    },
    {
        position: { lat: 13.0231, lng: 77.6226 },
        title: "Snowflake Storage",
        temp: "-19°C",
        availability: "70%",
        address: "Banaswadi, Bangalore",
        details: {
            compartments: 8,
            availableSpace: "3800 kg",
            minTemp: "-22°C",
            maxTemp: "-16°C"
        }
    },
    {
        position: { lat: 12.9342, lng: 77.6047 },
        title: "PolarTech Storage",
        temp: "-22°C",
        availability: "65%",
        address: "Wilson Garden, Bangalore",
        details: {
            compartments: 10,
            availableSpace: "4800 kg",
            minTemp: "-25°C",
            maxTemp: "-18°C"
        }
    },
    {
        position: { lat: 12.9850, lng: 77.5533 },
        title: "FreezePro Solutions",
        temp: "-20°C",
        availability: "55%",
        address: "Rajajinagar, Bangalore",
        details: {
            compartments: 8,
            availableSpace: "3600 kg",
            minTemp: "-23°C",
            maxTemp: "-17°C"
        }
    },
    {
        position: { lat: 13.0098, lng: 77.5511 },
        title: "IceTech Storage",
        temp: "-18°C",
        availability: "70%",
        address: "Yeshwanthpur, Bangalore",
        details: {
            compartments: 12,
            availableSpace: "5500 kg",
            minTemp: "-20°C",
            maxTemp: "-15°C"
        }
    },
    {
        position: { lat: 12.9217, lng: 77.5936 },
        title: "CryoStore Solutions",
        temp: "-23°C",
        availability: "45%",
        address: "Basavanagudi, Bangalore",
        details: {
            compartments: 7,
            availableSpace: "3200 kg",
            minTemp: "-25°C",
            maxTemp: "-20°C"
        }
    },
    {
        position: { lat: 13.0641, lng: 77.5876 },
        title: "Arctic Zone Storage",
        temp: "-21°C",
        availability: "80%",
        address: "Hebbal, Bangalore",
        details: {
            compartments: 9,
            availableSpace: "4200 kg",
            minTemp: "-24°C",
            maxTemp: "-18°C"
        }
    },
    {
        position: { lat: 12.9957, lng: 77.5713 },
        title: "SubZero Storage",
        temp: "-20°C",
        availability: "75%",
        address: "Malleshwaram, Bangalore",
        details: {
            compartments: 11,
            availableSpace: "5200 kg",
            minTemp: "-23°C",
            maxTemp: "-17°C"
        }
    },
    {
        position: { lat: 12.9063, lng: 77.5857 },
        title: "ColdChain Express",
        temp: "-19°C",
        availability: "60%",
        address: "Banashankari, Bangalore",
        details: {
            compartments: 9,
            availableSpace: "4100 kg",
            minTemp: "-21°C",
            maxTemp: "-16°C"
        }
    },
    {
        position: { lat: 13.0294, lng: 77.6318 },
        title: "FrostGuard Facilities",
        temp: "-22°C",
        availability: "85%",
        address: "Kalyan Nagar, Bangalore",
        details: {
            compartments: 14,
            availableSpace: "6500 kg",
            minTemp: "-25°C",
            maxTemp: "-19°C"
        }
    },
    {
        position: { lat: 12.9592, lng: 77.5975 },
        title: "ChillZone Storage",
        temp: "-17°C",
        availability: "50%",
        address: "Richmond Town, Bangalore",
        details: {
            compartments: 8,
            availableSpace: "3800 kg",
            minTemp: "-20°C",
            maxTemp: "-15°C"
        }
    },
    {
        position: { lat: 13.0484, lng: 77.5873 },
        title: "PolarPeak Solutions",
        temp: "-21°C",
        availability: "70%",
        address: "Jakkur, Bangalore",
        details: {
            compartments: 10,
            availableSpace: "4700 kg",
            minTemp: "-24°C",
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

    // Add markers for all locations from additionalLocations array
    additionalLocations.forEach(storage => {
        const marker = L.marker([storage.position.lat, storage.position.lng])
            .addTo(map);

        const popupContent = `
            <div class="storage-popup">
                <h3>${storage.title}</h3>
                <p><strong>Address:</strong> ${storage.address}</p>
                <p><strong>Temperature:</strong> ${storage.temp}</p>
                <p><strong>Availability:</strong> ${storage.availability}</p>
                <p><strong>Compartments:</strong> ${storage.details.compartments} units</p>
                <button onclick="showStorageDetails('${storage.title}')" class="view-details-btn">
                    View Details
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        markers.push(marker);
    });

    displayStorageList();
}

// Update the displayStorageList function to show all locations
function displayStorageList() {
    const storageCards = document.getElementById('storageCards');
    if (storageCards) {
        storageCards.innerHTML = additionalLocations.map(storage => `
            <div class="storage-card" onclick="showStorageDetails('${storage.title}')">
                <h4>${storage.title}</h4>
                <div class="storage-info-item">
                    <span>Location:</span>
                    <span>${storage.address}</span>
                </div>
                <div class="storage-info-item">
                    <span>Temperature:</span>
                    <span>${storage.temp}</span>
                </div>
                <div class="storage-info-item">
                    <span>Availability:</span>
                    <span>${storage.availability}</span>
                </div>
                <div class="storage-info-item">
                    <span>Compartments:</span>
                    <span>${storage.details.compartments} units</span>
                </div>
                <div class="storage-info-item">
                    <span>Available Space:</span>
                    <span>${storage.details.availableSpace}</span>
                </div>
            </div>
        `).join('');
    }
}

// Update the showStorageDetails function to work with the new data structure
function showStorageDetails(storageTitle) {
    const storage = additionalLocations.find(s => s.title === storageTitle);
    if (!storage) return;

    // Show storage details
    const storageDetails = document.getElementById('storageDetails');
    if (storageDetails) {
        storageDetails.style.display = 'block';
        document.getElementById('storageName').textContent = storage.title;
        
        // Update other details
        const detailsHtml = `
            <div class="storage-details-content">
                <div class="detail-item">
                    <span class="label">Address:</span>
                    <span class="value">${storage.address}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Temperature Range:</span>
                    <span class="value">${storage.details.minTemp} to ${storage.details.maxTemp}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Available Space:</span>
                    <span class="value">${storage.details.availableSpace}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Current Availability:</span>
                    <span class="value">${storage.availability}</span>
                </div>
                <div class="detail-item">
                    <span class="label">Total Compartments:</span>
                    <span class="value">${storage.details.compartments} units</span>
                </div>
            </div>
        `;
        
        document.querySelector('.storage-details-content')?.remove();
        storageDetails.insertAdjacentHTML('beforeend', detailsHtml);
    }
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
    
    window.registrationData = {
        type: 'customer',
        email: form.querySelector('input[name="email"]').value,
        firstName: form.querySelector('input[name="firstName"]').value,
        lastName: form.querySelector('input[name="lastName"]').value,
        username: form.querySelector('input[name="username"]').value,
        password: form.querySelector('input[name="password"]').value
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

    // Generate OTP for demo
    const dummyOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Demo OTP:', dummyOTP);

    // Close loading and show OTP input
    setTimeout(() => {
        Swal.fire({
            title: 'Enter OTP',
            html: `
                <div class="otp-verification">
                    <p style="margin-bottom: 15px;">A verification code has been sent to your email</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="color: #666; margin: 0;">Demo Mode: Use OTP</p>
                        <p style="font-size: 24px; font-weight: bold; color: #FF6B6B; margin: 5px 0;">${dummyOTP}</p>
                    </div>
                    <div class="otp-container">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                    </div>
                    <div class="timer-container">
                        <span id="otpTimer" style="color: #666;">Time remaining: 30s</span>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Verify OTP',
            confirmButtonColor: '#FF6B6B',
            cancelButtonColor: '#6c757d',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            customClass: {
                popup: 'otp-popup'
            },
            didOpen: () => {
                // Set up OTP input behavior
                const otpInputs = document.querySelectorAll('.otp-digit');
                otpInputs.forEach((input, index) => {
                    input.addEventListener('keyup', (e) => {
                        if (e.key >= '0' && e.key <= '9') {
                            if (index < otpInputs.length - 1) {
                                otpInputs[index + 1].focus();
                            }
                        } else if (e.key === 'Backspace') {
                            if (index > 0) {
                                otpInputs[index - 1].focus();
                            }
                        }
                    });
                });

                // Focus first input
                otpInputs[0].focus();

                // Start timer
                let timeLeft = 30;
                const timerDisplay = document.getElementById('otpTimer');
                const timer = setInterval(() => {
                    timeLeft--;
                    if (timeLeft >= 0) {
                        timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
                    } else {
                        clearInterval(timer);
                        timerDisplay.textContent = 'OTP expired';
                        timerDisplay.style.color = '#dc3545';
                        Swal.getConfirmButton().disabled = true;
                    }
                }, 1000);
            },
            preConfirm: () => {
                const enteredOTP = Array.from(document.querySelectorAll('.otp-digit'))
                    .map(input => input.value)
                    .join('');
                if (enteredOTP === dummyOTP) {
                    return true;
                }
                Swal.showValidationMessage('Invalid OTP. Please use the demo OTP shown above.');
                return false;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'success',
                    title: 'Registration Successful',
                    text: 'You can now login with your credentials',
                    confirmButtonColor: '#FF6B6B'
                }).then(() => {
                    showLogin();
                });
            }
        });
    }, 1500);
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

    // Generate OTP for demo
    const dummyOTP = Math.floor(100000 + Math.random() * 900000).toString();
    console.log('Demo OTP:', dummyOTP);

    // Close loading and show OTP input
    setTimeout(() => {
        Swal.fire({
            title: 'Enter OTP',
            html: `
                <div class="otp-verification">
                    <p style="margin-bottom: 15px;">A verification code has been sent to your email</p>
                    <div style="background: #f8f9fa; padding: 10px; border-radius: 8px; margin-bottom: 15px;">
                        <p style="color: #666; margin: 0;">Demo Mode: Use OTP</p>
                        <p style="font-size: 24px; font-weight: bold; color: #FF6B6B; margin: 5px 0;">${dummyOTP}</p>
                    </div>
                    <div class="otp-container">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                        <input type="text" class="otp-digit" maxlength="1" pattern="[0-9]">
                    </div>
                    <div class="timer-container">
                        <span id="otpTimer" style="color: #666;">Time remaining: 30s</span>
                    </div>
                </div>
            `,
            showCancelButton: true,
            confirmButtonText: 'Verify OTP',
            confirmButtonColor: '#FF6B6B',
            cancelButtonColor: '#6c757d',
            showLoaderOnConfirm: true,
            allowOutsideClick: false,
            customClass: {
                popup: 'otp-popup'
            },
            didOpen: () => {
                // Set up OTP input behavior
                const otpInputs = document.querySelectorAll('.otp-digit');
                otpInputs.forEach((input, index) => {
                    input.addEventListener('keyup', (e) => {
                        if (e.key >= '0' && e.key <= '9') {
                            if (index < otpInputs.length - 1) {
                                otpInputs[index + 1].focus();
                            }
                        } else if (e.key === 'Backspace') {
                            if (index > 0) {
                                otpInputs[index - 1].focus();
                            }
                        }
                    });
                });

                // Focus first input
                otpInputs[0].focus();

                // Start timer
                let timeLeft = 30;
                const timerDisplay = document.getElementById('otpTimer');
                const timer = setInterval(() => {
                    timeLeft--;
                    if (timeLeft >= 0) {
                        timerDisplay.textContent = `Time remaining: ${timeLeft}s`;
                    } else {
                        clearInterval(timer);
                        timerDisplay.textContent = 'OTP expired';
                        timerDisplay.style.color = '#dc3545';
                        Swal.getConfirmButton().disabled = true;
                    }
                }, 1000);
            },
            preConfirm: () => {
                const enteredOTP = Array.from(document.querySelectorAll('.otp-digit'))
                    .map(input => input.value)
                    .join('');
                if (enteredOTP === dummyOTP) {
                    return true;
                }
                Swal.showValidationMessage('Invalid OTP. Please use the demo OTP shown above.');
                return false;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Create request card for super admin
                const requestCard = createRequestCard(window.registrationData);
                const requestsContainer = document.getElementById('coldStorageRequests');
                if (requestsContainer) {
                    requestsContainer.appendChild(requestCard);
                }

                Swal.fire({
                    icon: 'success',
                    title: 'Registration Submitted',
                    text: 'Your registration will be reviewed by the admin',
                    confirmButtonColor: '#FF6B6B'
                }).then(() => {
                    showLogin();
                });
            }
        });
    }, 1500);
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
function handleRequest(action, licenseNumber) {
    const request = registrationRequests.find(req => req.licenseNumber === licenseNumber);
    if (!request) return;

    if (action === 'approve') {
        Swal.fire({
            title: 'Approve Registration?',
            text: `Are you sure you want to approve ${request.companyName}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, Approve',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#4CAF50',
            cancelButtonColor: '#6c757d'
        }).then((result) => {
            if (result.isConfirmed) {
                // Add to registered storages
                registeredStorages.push({
                    name: request.companyName,
                    licenseNo: request.licenseNumber,
                    email: request.email,
                    status: 'active',
                    joinDate: new Date().toISOString().split('T')[0]
                });

                // Remove from requests
                const index = registrationRequests.findIndex(req => req.licenseNumber === licenseNumber);
                if (index > -1) {
                    registrationRequests.splice(index, 1);
                }

                // Update UI
                populateRegistrationRequests();
                populateSuperAdminDashboard();

                Swal.fire({
                    icon: 'success',
                    title: 'Registration Approved',
                    text: `${request.companyName} has been successfully registered`,
                    confirmButtonColor: '#4CAF50'
                });
            }
        });
    } else if (action === 'reject') {
        Swal.fire({
            title: 'Reject Registration?',
            text: 'Please provide a reason for rejection:',
            input: 'text',
            inputPlaceholder: 'Enter rejection reason',
            showCancelButton: true,
            confirmButtonText: 'Reject',
            cancelButtonText: 'Cancel',
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            inputValidator: (value) => {
                if (!value) {
                    return 'You need to provide a reason for rejection!';
                }
            }
        }).then((result) => {
            if (result.isConfirmed) {
                // Add to rejected storages
                rejectedStorages.push({
                    name: request.companyName,
                    licenseNo: request.licenseNumber,
                    email: request.email,
                    rejectionCount: 1,
                    lastRejected: new Date().toISOString().split('T')[0],
                    reason: result.value
                });

                // Remove from requests
                const index = registrationRequests.findIndex(req => req.licenseNumber === licenseNumber);
                if (index > -1) {
                    registrationRequests.splice(index, 1);
                }

                // Update UI
                populateRegistrationRequests();
                populateSuperAdminDashboard();

                Swal.fire({
                    icon: 'info',
                    title: 'Registration Rejected',
                    text: `${request.companyName}'s registration has been rejected`,
                    confirmButtonColor: '#dc3545'
                });
            }
        });
    }
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

// Add dummy data for registered cold storages
const registeredStorages = [
    {
        name: "Central Cold Storage",
        licenseNo: "CSL123456",
        email: "central@coldstorage.com",
        status: "active",
        joinDate: "2024-01-15"
    },
    {
        name: "Metro Cold Storage",
        licenseNo: "MCS789012",
        email: "metro@coldstorage.com",
        status: "active",
        joinDate: "2024-01-18"
    },
    {
        name: "Arctic Storage Solutions",
        licenseNo: "ASS345678",
        email: "arctic@storage.com",
        status: "active",
        joinDate: "2024-01-20"
    },
    {
        name: "FrostBite Storage",
        licenseNo: "FBS901234",
        email: "frost@storage.com",
        status: "suspended",
        joinDate: "2024-01-22"
    }
];

// Add dummy data for registered customers
const registeredCustomers = [
    {
        name: "John Doe",
        email: "john@example.com",
        joinDate: "2024-01-15",
        status: "active"
    },
    {
        name: "Alice Smith",
        email: "alice@example.com",
        joinDate: "2024-01-16",
        status: "active"
    },
    {
        name: "Bob Johnson",
        email: "bob@example.com",
        joinDate: "2024-01-18",
        status: "active"
    },
    {
        name: "Emma Wilson",
        email: "emma@example.com",
        joinDate: "2024-01-19",
        status: "suspended"
    },
    {
        name: "Michael Brown",
        email: "michael@example.com",
        joinDate: "2024-01-20",
        status: "active"
    }
];

// Add dummy data for rejected cold storages
const rejectedStorages = [
    {
        name: "Quick Freeze Storage",
        licenseNo: "QFS123456",
        email: "quick@freeze.com",
        rejectionCount: 2,
        lastRejected: "2024-01-25",
        reason: "Invalid license documentation"
    },
    {
        name: "Cool Chain Solutions",
        licenseNo: "CCS789012",
        email: "info@coolchain.com",
        rejectionCount: 1,
        lastRejected: "2024-01-23",
        reason: "Incomplete facility details"
    },
    {
        name: "Arctic Zone Storage",
        licenseNo: "AZS345678",
        email: "contact@arcticzone.com",
        rejectionCount: 3,
        lastRejected: "2024-01-22",
        reason: "Failed compliance check"
    },
    {
        name: "Frost Solutions",
        licenseNo: "FSL901234",
        email: "admin@frostsolutions.com",
        rejectionCount: 1,
        lastRejected: "2024-01-20",
        reason: "Missing temperature control certification"
    }
];

// Function to populate super admin dashboard
function populateSuperAdminDashboard() {
    // Populate registered cold storages
    const coldStoragesList = document.getElementById('coldStoragesList');
    if (coldStoragesList) {
        coldStoragesList.innerHTML = registeredStorages.map(storage => `
            <tr>
                <td>${storage.name}</td>
                <td>${storage.licenseNo}</td>
                <td>${storage.email}</td>
                <td><span class="status-badge ${storage.status}">${storage.status}</span></td>
                <td>
                    <button class="action-btn ${storage.status === 'active' ? 'suspend-btn' : 'activate-btn'}" 
                            onclick="toggleStorageStatus('${storage.licenseNo}')">
                        ${storage.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Populate registered customers
    const customersList = document.getElementById('customersList');
    if (customersList) {
        customersList.innerHTML = registeredCustomers.map(customer => `
            <tr>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.joinDate}</td>
                <td><span class="status-badge ${customer.status}">${customer.status}</span></td>
            </tr>
        `).join('');
    }

    // Populate rejected cold storages
    const rejectedStoragesList = document.getElementById('rejectedStoragesList');
    if (rejectedStoragesList) {
        rejectedStoragesList.innerHTML = rejectedStorages.map(storage => `
            <tr>
                <td>${storage.name}</td>
                <td>${storage.licenseNo}</td>
                <td>${storage.email}</td>
                <td>${storage.reason}</td>
                <td>
                    <span class="rejection-count" title="Total Rejections">
                        ${storage.rejectionCount}x
                    </span>
                </td>
                <td>
                    <button class="action-btn review-btn" onclick="reviewRejectedStorage('${storage.licenseNo}')">
                        Review Again
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

// Call this function when super admin logs in
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('superAdminDashboard')) {
        populateSuperAdminDashboard();
    }
});

// Add function to handle reviewing rejected storage
function reviewRejectedStorage(licenseNo) {
    const storage = rejectedStorages.find(s => s.licenseNo === licenseNo);
    if (!storage) return;

    Swal.fire({
        title: 'Review Rejected Storage',
        html: `
            <div class="review-details">
                <div class="detail-group">
                    <label>Storage Name:</label>
                    <p>${storage.name}</p>
                </div>
                <div class="detail-group">
                    <label>License Number:</label>
                    <p>${storage.licenseNo}</p>
                </div>
                <div class="detail-group">
                    <label>Email:</label>
                    <p>${storage.email}</p>
                </div>
                <div class="detail-group">
                    <label>Previous Rejections:</label>
                    <p>${storage.rejectionCount}</p>
                </div>
                <div class="detail-group">
                    <label>Last Rejection Reason:</label>
                    <p>${storage.reason}</p>
                </div>
            </div>
        `,
        showCancelButton: true,
        confirmButtonText: 'Allow New Application',
        cancelButtonText: 'Close',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#6c757d'
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                icon: 'success',
                title: 'Application Enabled',
                text: 'The storage can now submit a new application',
                confirmButtonColor: '#4CAF50'
            });
        }
    });
}

// Add dummy registration requests
const registrationRequests = [
    {
        companyName: "Central Cold Storage",
        firstName: "John",
        lastName: "Smith",
        licenseNumber: "CSL123456",
        email: "contact@centralcold.com",
        location: "Bangalore Central",
        date: "2024-01-25"
    },
    {
        companyName: "Arctic Solutions",
        firstName: "Sarah",
        lastName: "Johnson",
        licenseNumber: "ASL789012",
        email: "info@arcticsolutions.com",
        location: "Indiranagar, Bangalore",
        date: "2024-01-26"
    },
    {
        companyName: "FrostTech Storage",
        firstName: "Michael",
        lastName: "Brown",
        licenseNumber: "FTS345678",
        email: "contact@frosttech.com",
        location: "Koramangala, Bangalore",
        date: "2024-01-26"
    }
];

// Function to populate registration requests
function populateRegistrationRequests() {
    const requestsContainer = document.getElementById('coldStorageRequests');
    if (requestsContainer) {
        requestsContainer.innerHTML = registrationRequests.map(request => `
            <div class="request-card">
                <div class="request-header">
                    <h4>${request.companyName}</h4>
                    <span class="request-date">${request.date}</span>
                </div>
                <div class="request-details">
                    <p><strong>Name:</strong> ${request.firstName} ${request.lastName}</p>
                    <p><strong>License No:</strong> ${request.licenseNumber}</p>
                    <p><strong>Email:</strong> ${request.email}</p>
                    <p><strong>Location:</strong> ${request.location}</p>
                </div>
                <div class="request-actions">
                    <button class="approve-btn" onclick="handleRequest('approve', '${request.licenseNumber}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                        </svg>
                        Approve
                    </button>
                    <button class="reject-btn" onclick="handleRequest('reject', '${request.licenseNumber}')">
                        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        Reject
                    </button>
                </div>
            </div>
        `).join('');
    }
}

// Call this when the super admin dashboard loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('superAdminDashboard')) {
        populateRegistrationRequests();
        populateSuperAdminDashboard();
    }
});

// Add dummy data for stored items with expiry dates
const customerStoredItems = [
    {
        id: 1,
        name: "Frozen Fish",
        quantity: "500 kg",
        storageName: "Central Cold Storage",
        compartment: "C4",
        storageDate: "2024-01-10",
        expiryDate: "2024-02-10",
        temperature: "-22°C"
    },
    {
        id: 2,
        name: "Premium Beef",
        quantity: "300 kg",
        storageName: "Metro Cold Storage",
        compartment: "B2",
        storageDate: "2024-01-15",
        expiryDate: "2024-02-05",
        temperature: "-20°C"
    },
    {
        id: 3,
        name: "Ice Cream",
        quantity: "400 kg",
        storageName: "Arctic Storage",
        compartment: "A1",
        storageDate: "2024-01-01",
        expiryDate: "2024-02-01",
        temperature: "-25°C"
    }
];

// Function to check and show expiry alerts
function checkExpiryAlerts() {
    const today = new Date();
    const warningThreshold = 10; // Days before expiry to show warning
    
    const expiringItems = customerStoredItems.filter(item => {
        const expiryDate = new Date(item.expiryDate);
        const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        return daysUntilExpiry <= warningThreshold && daysUntilExpiry > 0;
    });

    if (expiringItems.length > 0) {
        Swal.fire({
            title: 'Priority Alert: Items Near Expiry',
            html: `
                <div class="expiry-alert">
                    <div class="alert-header">
                        <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24" 
                            style="color: #ff4444;">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        <span>The following items are approaching their expiry date:</span>
                    </div>
                    <div class="expiring-items">
                        ${expiringItems.map(item => {
                            const daysLeft = Math.ceil(
                                (new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24)
                            );
                            return `
                                <div class="expiring-item">
                                    <div class="item-header">
                                        <span class="item-name">${item.name}</span>
                                        <span class="days-left ${daysLeft <= 5 ? 'critical' : 'warning'}">
                                            ${daysLeft} days left
                                        </span>
                                    </div>
                                    <div class="item-details">
                                        <p><strong>Storage:</strong> ${item.storageName} (${item.compartment})</p>
                                        <p><strong>Quantity:</strong> ${item.quantity}</p>
                                        <p><strong>Temperature:</strong> ${item.temperature}</p>
                                        <p><strong>Expiry Date:</strong> ${item.expiryDate}</p>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `,
            icon: 'warning',
            confirmButtonText: 'Acknowledge',
            confirmButtonColor: '#FF6B6B',
            showCloseButton: true,
            width: '600px',
            customClass: {
                popup: 'expiry-alert-popup'
            }
        });
    }
}

// Add styles for the expiry alert
const styles = `
<style>
    .expiry-alert {
        text-align: left;
        padding: 1rem;
    }

    .alert-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid #eee;
        color: #ff4444;
        font-weight: 600;
    }

    .expiring-items {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .expiring-item {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid #e9ecef;
    }

    .item-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.8rem;
    }

    .item-name {
        font-weight: 600;
        font-size: 1.1rem;
        color: #2C3E50;
    }

    .days-left {
        padding: 4px 12px;
        border-radius: 20px;
        font-weight: 500;
        font-size: 0.9rem;
    }

    .days-left.warning {
        background: #fff3cd;
        color: #856404;
    }

    .days-left.critical {
        background: #f8d7da;
        color: #721c24;
    }

    .item-details {
        display: grid;
        gap: 0.5rem;
        font-size: 0.95rem;
    }

    .item-details p {
        margin: 0;
        color: #495057;
    }
</style>
`;

// Add the styles to the document
document.head.insertAdjacentHTML('beforeend', styles);

// Call this function when the customer dashboard loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('userDashboard')) {
        // Add slight delay to ensure dashboard is loaded
        setTimeout(checkExpiryAlerts, 1000);
    }
});

// Add dummy pickup requests data
const pickupRequests = [
    {
        id: "PR001",
        customerName: "John Smith",
        itemName: "Frozen Fish",
        quantity: "200 kg",
        compartment: "C4",
        requestDate: "2024-01-26",
        pickupDate: "2024-01-28",
        status: "pending",
        temperature: "-22°C",
        notes: "Require temperature verification before pickup"
    },
    {
        id: "PR002",
        customerName: "Sarah Johnson",
        itemName: "Ice Cream",
        quantity: "150 kg",
        compartment: "A1",
        requestDate: "2024-01-26",
        pickupDate: "2024-01-27",
        status: "approved",
        temperature: "-25°C",
        notes: "Early morning pickup preferred"
    },
    {
        id: "PR003",
        customerName: "Mike Brown",
        itemName: "Premium Beef",
        quantity: "300 kg",
        compartment: "B2",
        requestDate: "2024-01-25",
        pickupDate: "2024-01-29",
        status: "pending",
        temperature: "-20°C",
        notes: "Temperature sensitive item"
    }
];

// Function to populate pickup requests
function populatePickupRequests() {
    const requestsContainer = document.getElementById('pickupRequestsContainer');
    if (!requestsContainer) return;

    requestsContainer.innerHTML = `
        <div class="pickup-requests-header">
            <h3>Pickup Requests</h3>
            <div class="filter-controls">
                <select id="statusFilter" onchange="filterPickupRequests()">
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <input type="date" id="dateFilter" onchange="filterPickupRequests()">
            </div>
        </div>
        <div class="pickup-requests-list">
            ${pickupRequests.map(request => `
                <div class="pickup-request-card ${request.status}" data-id="${request.id}">
                    <div class="request-header">
                        <div class="request-id">
                            <span class="label">Request ID:</span>
                            <span class="value">${request.id}</span>
                        </div>
                        <div class="status-badge ${request.status}">
                            ${request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </div>
                    </div>
                    <div class="request-details">
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">Customer:</span>
                                <span class="value">${request.customerName}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Item:</span>
                                <span class="value">${request.itemName}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">Quantity:</span>
                                <span class="value">${request.quantity}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Compartment:</span>
                                <span class="value">${request.compartment}</span>
                            </div>
                        </div>
                        <div class="detail-row">
                            <div class="detail-item">
                                <span class="label">Pickup Date:</span>
                                <span class="value">${request.pickupDate}</span>
                            </div>
                            <div class="detail-item">
                                <span class="label">Temperature:</span>
                                <span class="value">${request.temperature}</span>
                            </div>
                        </div>
                        <div class="notes">
                            <span class="label">Notes:</span>
                            <span class="value">${request.notes}</span>
                        </div>
                    </div>
                    <div class="request-actions">
                        ${request.status === 'pending' ? `
                            <button class="action-btn approve" onclick="handlePickupRequest('${request.id}', 'approve')">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                                </svg>
                                Approve
                            </button>
                            <button class="action-btn reject" onclick="handlePickupRequest('${request.id}', 'cancel')">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                </svg>
                                Cancel
                            </button>
                        ` : request.status === 'approved' ? `
                            <button class="action-btn complete" onclick="handlePickupRequest('${request.id}', 'complete')">
                                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                                </svg>
                                Complete Pickup
                            </button>
                        ` : ''}
                        <button class="action-btn view" onclick="viewPickupDetails('${request.id}')">
                            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            View Details
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Function to handle pickup request actions
function handlePickupRequest(requestId, action) {
    const request = pickupRequests.find(req => req.id === requestId);
    if (!request) return;

    let title, text, icon;
    switch(action) {
        case 'approve':
            title = 'Approve Pickup Request?';
            text = `Are you sure you want to approve pickup request for ${request.itemName}?`;
            icon = 'question';
            break;
        case 'cancel':
            title = 'Cancel Pickup Request?';
            text = 'Please provide a reason for cancellation:';
            icon = 'warning';
            break;
        case 'complete':
            title = 'Complete Pickup?';
            text = 'Confirm that the items have been picked up:';
            icon = 'info';
            break;
    }

    Swal.fire({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
        cancelButtonText: 'Close',
        confirmButtonColor: action === 'approve' ? '#4CAF50' : '#dc3545',
        input: action === 'cancel' ? 'text' : null,
        inputPlaceholder: action === 'cancel' ? 'Enter cancellation reason' : null,
        inputValidator: action === 'cancel' ? (value) => {
            if (!value) return 'You need to provide a reason!';
        } : null
    }).then((result) => {
        if (result.isConfirmed) {
            // Update request status
            request.status = action === 'approve' ? 'approved' : 
                           action === 'cancel' ? 'cancelled' : 
                           action === 'complete' ? 'completed' : request.status;

            // Update UI
            populatePickupRequests();

            Swal.fire({
                icon: 'success',
                title: 'Updated Successfully',
                text: `Pickup request has been ${request.status}`,
                confirmButtonColor: '#4CAF50'
            });
        }
    });
}

// Function to filter pickup requests
function filterPickupRequests() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFilter = document.getElementById('dateFilter').value;

    const filteredRequests = pickupRequests.filter(request => {
        const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
        const matchesDate = !dateFilter || request.pickupDate === dateFilter;
        return matchesStatus && matchesDate;
    });

    // Update UI with filtered requests
    // ... implementation similar to populatePickupRequests but with filteredRequests
}

// Function to view detailed pickup information
function viewPickupDetails(requestId) {
    const request = pickupRequests.find(req => req.id === requestId);
    if (!request) return;

    Swal.fire({
        title: 'Pickup Request Details',
        html: `
            <div class="pickup-details">
                <div class="detail-group">
                    <label>Request ID</label>
                    <p>${request.id}</p>
                </div>
                <div class="detail-group">
                    <label>Customer Name</label>
                    <p>${request.customerName}</p>
                </div>
                <div class="detail-group">
                    <label>Item Details</label>
                    <p>${request.itemName} (${request.quantity})</p>
                </div>
                <div class="detail-group">
                    <label>Storage Information</label>
                    <p>Compartment: ${request.compartment} | Temperature: ${request.temperature}</p>
                </div>
                <div class="detail-group">
                    <label>Request Timeline</label>
                    <p>Requested: ${request.requestDate} | Pickup: ${request.pickupDate}</p>
                </div>
                <div class="detail-group">
                    <label>Status</label>
                    <p class="status ${request.status}">${request.status.toUpperCase()}</p>
                </div>
                <div class="detail-group">
                    <label>Special Notes</label>
                    <p>${request.notes}</p>
                </div>
            </div>
        `,
        width: '600px',
        confirmButtonText: 'Close',
        confirmButtonColor: '#6c757d'
    });
} 