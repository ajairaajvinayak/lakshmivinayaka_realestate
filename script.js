document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
            nav.classList.remove('active');
        }
    });

    // Featured Listings Logic
    const listingsContainer = document.getElementById('listings-container');

    // Default Listings (Mock Data)
    const defaultListings = [
        {
            id: 1,
            title: "Luxury Villa in ECR",
            location: "Chennai, Tamil Nadu",
            price: "₹2.5 Cr",
            image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Residential"
        },
        {
            id: 2,
            title: "Premium Plot near Airport",
            location: "Bengaluru, Karnataka",
            price: "₹85 Lakhs",
            image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Plot"
        },
        {
            id: 3,
            title: "3BHK Apartment in OMR",
            location: "Chennai, Tamil Nadu",
            price: "₹95 Lakhs",
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Residential"
        },
        {
            id: 4,
            title: "Commercial Space in Hosur",
            location: "Hosur, Tamil Nadu",
            price: "₹1.2 Cr",
            image: "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            type: "Commercial"
        }
    ];

    // Load listings from localStorage or use default
    function loadListings() {
        const storedListings = localStorage.getItem('creovyn_listings');
        let listings = [];

        if (storedListings) {
            listings = JSON.parse(storedListings);
        } else {
            listings = defaultListings;
            // Save default to local storage for admin to see initially
            localStorage.setItem('creovyn_listings', JSON.stringify(defaultListings));
        }

        renderListings(listings);
    }

    // Render Listings
    function renderListings(listings) {
        if (listings.length === 0) {
            listingsContainer.innerHTML = '<p>No properties found.</p>';
            return;
        }

        listingsContainer.innerHTML = '';

        listings.forEach(listing => {
            const card = document.createElement('div');
            card.className = 'listing-card';
            card.innerHTML = `
                <div class="listing-image">
                    <img src="${listing.image}" alt="${listing.title}">
                    ${listing.sold ? '<span class="status-badge sold">SOLD</span>' : ''}
                </div>
                <div class="listing-details">
                    <div class="listing-price">${listing.price}</div>
                    <h3 class="listing-title">${listing.title}</h3>
                    <div class="listing-location">
                        <span>📍</span> ${listing.location}
                    </div>
                    <button class="btn btn-outline view-details-btn" style="width: 100%" data-id="${listing.id}">View Details</button>
                </div>
            `;
            listingsContainer.appendChild(card);
        });

        // Add Event Listeners to new buttons
        document.querySelectorAll('.view-details-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.target.getAttribute('data-id'));
                const listing = listings.find(l => l.id === id);
                if (listing) {
                    openModal(listing);
                }
            });
        });
    }

    // Modal Logic
    const modal = document.getElementById('property-modal');
    const closeModal = document.querySelector('.close-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalPrice = document.getElementById('modal-price');
    const modalLocation = document.getElementById('modal-location');
    const modalType = document.getElementById('modal-type');
    const modalMap = document.getElementById('modal-map');

    // Open Modal
    function openModal(listing) {
        modalImage.src = listing.image;
        modalTitle.textContent = listing.title;
        modalPrice.textContent = listing.price;
        modalLocation.textContent = `📍 ${listing.location}`;
        modalType.textContent = `Type: ${listing.type}`;

        // Update size display
        const modalSize = document.getElementById('modal-size');
        if (modalSize) {
            modalSize.textContent = `📏 Size: ${listing.propertySize || 'N/A'}`;
        }

        // Update facing display
        const modalFacing = document.getElementById('modal-facing');
        if (modalFacing) {
            modalFacing.textContent = `🧭 Facing: ${listing.facing || 'N/A'}`;
        }

        // Map Logic
        let mapQuery = listing.mapLocation || listing.location;
        modalMap.src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

        modal.classList.add('active');
    }

    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            modal.classList.remove('active');
            modalMap.src = ''; // Stop map from playing/loading
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalMap.src = '';
        }
    });

    // Contact Popup Logic
    const contactPopup = document.getElementById('contact-popup');
    const enquireNowBtn = document.getElementById('enquire-now-btn');
    const closeContactPopup = document.querySelector('.close-contact-popup');

    if (enquireNowBtn) {
        enquireNowBtn.addEventListener('click', () => {
            contactPopup.classList.add('active');
        });
    }

    if (closeContactPopup) {
        closeContactPopup.addEventListener('click', () => {
            contactPopup.classList.remove('active');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === contactPopup) {
            contactPopup.classList.remove('active');
        }
    });

    // Sell Property Form Handler
    const sellPropertyForm = document.getElementById('sell-property-form');

    if (sellPropertyForm) {
        sellPropertyForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = {
                name: document.getElementById('seller-name').value,
                phone: document.getElementById('seller-phone').value,
                email: document.getElementById('seller-email').value,
                propertyType: document.getElementById('property-type-sell').value,
                location: document.getElementById('property-location-sell').value,
                size: document.getElementById('property-size-sell').value,
                expectedPrice: document.getElementById('expected-price').value,
                description: document.getElementById('property-description').value
            };

            // Store in localStorage (for demo purposes)
            const sellRequests = JSON.parse(localStorage.getItem('sellRequests') || '[]');
            sellRequests.push({
                ...formData,
                submittedAt: new Date().toISOString()
            });
            localStorage.setItem('sellRequests', JSON.stringify(sellRequests));

            // Show success message
            alert(`Thank you, ${formData.name}! Your property details have been submitted successfully. Our team will contact you within 24 hours at ${formData.phone}.`);

            // Reset form
            sellPropertyForm.reset();
        });
    }

    loadListings();
    // Listen for storage changes (e.g., sold status toggled from admin) and refresh listings
    window.addEventListener('storage', (e) => {
        if (e.key === 'creovyn_listings') {
            loadListings();
        }
    });
});

