document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    const addPropertyForm = document.getElementById('add-property-form');
    const propertyList = document.getElementById('property-list');

    // Check if we are on dashboard and not logged in
    if (window.location.pathname.includes('admin_dashboard.html')) {
        const isLoggedIn = localStorage.getItem('creovyn_admin_logged_in');
        if (!isLoggedIn) {
            window.location.href = 'admin_login.html';
            return;
        }
        loadProperties();
        loadSellRequests();
    }

    // Login Logic
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Mock Credentials
            if (username === 'admin' && password === 'admin123') {
                localStorage.setItem('creovyn_admin_logged_in', 'true');
                window.location.href = 'admin_dashboard.html';
            } else {
                document.getElementById('error-msg').style.display = 'block';
            }
        });
    }

    // Logout Logic
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('creovyn_admin_logged_in');
            window.location.href = 'admin_login.html';
        });
    }

    // Add Property Logic with Image Upload
    if (addPropertyForm) {
        const imageFileInput = document.getElementById('prop-image-file');
        const imageUrlInput = document.getElementById('prop-image-url');
        const imagePreview = document.getElementById('image-preview');
        const previewImg = document.getElementById('preview-img');
        let currentImageData = null;

        // Handle file upload
        if (imageFileInput) {
            imageFileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        currentImageData = event.target.result;
                        previewImg.src = currentImageData;
                        imagePreview.style.display = 'block';
                        imageUrlInput.value = ''; // Clear URL input
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // Handle URL input
        if (imageUrlInput) {
            imageUrlInput.addEventListener('input', (e) => {
                if (e.target.value) {
                    currentImageData = e.target.value;
                    previewImg.src = currentImageData;
                    imagePreview.style.display = 'block';
                    imageFileInput.value = ''; // Clear file input
                }
            });
        }

        // Form submission handler
        addPropertyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const editId = addPropertyForm.dataset.editId;

            // Validate that either file or URL is provided (only for new properties)
            if (!editId && !currentImageData) {
                alert('Please upload an image or provide an image URL');
                return;
            }

            if (editId) {
                // Update existing property
                let storedListings = JSON.parse(localStorage.getItem('creovyn_listings') || '[]');
                const index = storedListings.findIndex(p => p.id === parseInt(editId));

                if (index !== -1) {
                    storedListings[index] = {
                        ...storedListings[index],
                        title: document.getElementById('prop-title').value,
                        location: document.getElementById('prop-location').value,
                        price: document.getElementById('prop-price').value,
                        type: document.getElementById('prop-type').value,
                        propertySize: document.getElementById('prop-size').value,
                        facing: document.getElementById('prop-facing').value,
                        ownerName: document.getElementById('owner-name').value,
                        ownerPhone: document.getElementById('owner-phone').value,
                        image: currentImageData || storedListings[index].image, // Keep existing image if not changed
                        mapLocation: document.getElementById('prop-map').value
                    };

                    localStorage.setItem('creovyn_listings', JSON.stringify(storedListings));
                    alert('Property updated successfully!');

                    // Reset form to add mode
                    delete addPropertyForm.dataset.editId;
                    const submitBtn = addPropertyForm.querySelector('button[type="submit"]');
                    submitBtn.textContent = 'Add Property';
                    submitBtn.style.backgroundColor = '';
                }
            } else {
                // Create new property
                const newProperty = {
                    id: Date.now(),
                    title: document.getElementById('prop-title').value,
                    location: document.getElementById('prop-location').value,
                    price: document.getElementById('prop-price').value,
                    type: document.getElementById('prop-type').value,
                    propertySize: document.getElementById('prop-size').value,
                    facing: document.getElementById('prop-facing').value,
                    ownerName: document.getElementById('owner-name').value,
                    ownerPhone: document.getElementById('owner-phone').value,
                    image: currentImageData,
                    mapLocation: document.getElementById('prop-map').value,
                    sold: false
                };

                const storedListings = JSON.parse(localStorage.getItem('creovyn_listings') || '[]');
                storedListings.push(newProperty);
                localStorage.setItem('creovyn_listings', JSON.stringify(storedListings));
                alert('Property added successfully!');
            }

            addPropertyForm.reset();
            imagePreview.style.display = 'none';
            currentImageData = null;
            loadProperties();
        });
    }

    // Load Properties to Table
    function loadProperties() {
        if (!propertyList) return;

        const storedListings = JSON.parse(localStorage.getItem('creovyn_listings') || '[]');
        propertyList.innerHTML = '';

        storedListings.forEach(listing => {
            const row = document.createElement('tr');
            const statusClass = listing.sold ? 'status-sold' : 'status-available';
            const statusText = listing.sold ? 'SOLD' : 'Available';
            const soldBtnText = listing.sold ? 'Mark Available' : 'Mark as Sold';
            const soldBtnClass = listing.sold ? 'sold-btn sold' : 'sold-btn';

            row.innerHTML = `
                <td><img src="${listing.image}" alt="${listing.title}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;"></td>
                <td>${listing.title}</td>
                <td>${listing.location}</td>
                <td>${listing.price}</td>
                <td>${listing.propertySize || 'N/A'}</td>
                <td>${listing.facing || 'N/A'}</td>
                <td>${listing.type}</td>
                <td>${listing.ownerName || 'N/A'}</td>
                <td>${listing.ownerPhone || 'N/A'}</td>
                <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editProperty(${listing.id})">✏️ Edit</button>
                        <button class="${soldBtnClass}" onclick="toggleSoldStatus(${listing.id})">${soldBtnText}</button>
                        <button class="delete-btn" onclick="deleteProperty(${listing.id})">🗑️ Delete</button>
                    </div>
                </td>
            `;
            propertyList.appendChild(row);
        });
    }

    // Edit Property Function
    window.editProperty = function (id) {
        const storedListings = JSON.parse(localStorage.getItem('creovyn_listings') || '[]');
        const listing = storedListings.find(p => p.id === id);

        if (listing) {
            const imageFileInput = document.getElementById('prop-image-file');
            const imageUrlInput = document.getElementById('prop-image-url');
            const imagePreview = document.getElementById('image-preview');
            const previewImg = document.getElementById('preview-img');
            let currentImageData = listing.image;

            // Populate form with existing data
            document.getElementById('prop-title').value = listing.title;
            document.getElementById('prop-location').value = listing.location;
            document.getElementById('prop-price').value = listing.price;
            document.getElementById('prop-type').value = listing.type;
            document.getElementById('prop-size').value = listing.propertySize || '';
            document.getElementById('prop-facing').value = listing.facing || '';
            document.getElementById('owner-name').value = listing.ownerName || '';
            document.getElementById('owner-phone').value = listing.ownerPhone || '';
            document.getElementById('prop-map').value = listing.mapLocation || '';

            // Handle image
            if (listing.image) {
                previewImg.src = listing.image;
                imagePreview.style.display = 'block';

                // Set URL input if it's a URL
                if (listing.image.startsWith('http')) {
                    imageUrlInput.value = listing.image;
                }
            }

            // Change form submit behavior to update instead of create
            const form = document.getElementById('add-property-form');
            form.dataset.editId = id;

            // Change button text
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Update Property';
            submitBtn.style.backgroundColor = '#ff9800';

            // Scroll to form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    // Toggle Sold Status
    window.toggleSoldStatus = function (id) {
        let storedListings = JSON.parse(localStorage.getItem('creovyn_listings') || '[]');
        const listing = storedListings.find(p => p.id === id);

        if (listing) {
            listing.sold = !listing.sold;
            localStorage.setItem('creovyn_listings', JSON.stringify(storedListings));
            loadProperties();
            alert(`Property marked as ${listing.sold ? 'SOLD' : 'Available'}`);
        }
    };

    // Expose delete function to window
    window.deleteProperty = function (id) {
        if (confirm('Are you sure you want to delete this property?')) {
            let storedListings = JSON.parse(localStorage.getItem('creovyn_listings') || '[]');
            storedListings = storedListings.filter(p => p.id !== id);
            localStorage.setItem('creovyn_listings', JSON.stringify(storedListings));
            loadProperties();
            alert('Property deleted successfully!');
        }
    };


    // Load Sell Requests
    function loadSellRequests() {
        const sellRequestsList = document.getElementById('sell-requests-list');
        if (!sellRequestsList) return;

        const storedRequests = JSON.parse(localStorage.getItem('sellRequests') || '[]');
        sellRequestsList.innerHTML = '';

        if (storedRequests.length === 0) {
            sellRequestsList.innerHTML = '<tr><td colspan="9" style="text-align: center;">No sell requests found.</td></tr>';
            return;
        }

        storedRequests.forEach((request, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${request.name}</td>
                <td>${request.phone}</td>
                <td>${request.email || 'N/A'}</td>
                <td>${request.propertyType}</td>
                <td>${request.location}</td>
                <td>${request.size}</td>
                <td>${request.expectedPrice}</td>
                <td>${request.description || 'N/A'}</td>
                <td>${new Date(request.submittedAt).toLocaleDateString()}</td>
                <td>
                    <button class="delete-btn" onclick="deleteSellRequest(${index})">🗑️ Delete</button>
                </td>
            `;
            sellRequestsList.appendChild(row);
        });
    }

    // Delete Sell Request
    window.deleteSellRequest = function (index) {
        if (confirm('Are you sure you want to delete this request?')) {
            let storedRequests = JSON.parse(localStorage.getItem('sellRequests') || '[]');
            storedRequests.splice(index, 1);
            localStorage.setItem('sellRequests', JSON.stringify(storedRequests));
            loadSellRequests();
            alert('Request deleted successfully!');
        }
    };
});
