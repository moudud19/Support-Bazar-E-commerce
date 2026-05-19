// Products Page Functionality

let allProducts = [];
let filteredProducts = [];
const categoryParam = new URLSearchParams(window.location.search).get('category');

document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    applyDefaultCategory();
});

// Load products from data
function loadProducts() {
    if (typeof products !== 'undefined') {
        allProducts = [...products];
        filteredProducts = [...products];
        displayProducts();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Category filters
    document.querySelectorAll('input[name="category"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Price filter
    document.getElementById('priceRange').addEventListener('input', function() {
        document.getElementById('priceValue').textContent = 'Rs. ' + this.value;
        applyFilters();
    });

    // Rating filter
    document.querySelectorAll('input[name="rating"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Sort
    document.getElementById('sortBy').addEventListener('change', function() {
        sortProducts(this.value);
    });

    // Clear filters
    document.getElementById('clearFilters').addEventListener('click', clearAllFilters);

    // Search
    document.getElementById('searchBtn').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') searchProducts();
    });
}

// Apply default category from URL
function applyDefaultCategory() {
    if (categoryParam) {
        const categoryCheckbox = document.querySelector(`input[value="${categoryParam}"]`);
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
            applyFilters();
        }
    }
}

// Apply filters
function applyFilters() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => cb.value);
    const selectedRatings = Array.from(document.querySelectorAll('input[name="rating"]:checked'))
        .map(cb => parseInt(cb.value));
    const maxPrice = parseInt(document.getElementById('priceRange').value);

    filteredProducts = allProducts.filter(product => {
        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }

        // Price filter
        if (product.price > maxPrice) {
            return false;
        }

        // Rating filter
        if (selectedRatings.length > 0 && !selectedRatings.some(rating => product.rating >= rating)) {
            return false;
        }

        return true;
    });

    displayProducts();
}

// Sort products
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
    }
    displayProducts();
}

// Clear all filters
function clearAllFilters() {
    document.querySelectorAll('input[name="category"], input[name="rating"]').forEach(cb => {
        cb.checked = false;
    });
    document.getElementById('priceRange').value = 50000;
    document.getElementById('priceValue').textContent = 'Rs. 50000';
    document.getElementById('sortBy').value = 'newest';
    document.getElementById('searchInput').value = '';
    filteredProducts = [...allProducts];
    displayProducts();
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (searchTerm === '') {
        applyFilters();
        return;
    }

    filteredProducts = allProducts.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    displayProducts();
}

// Display products
function displayProducts() {
    const grid = document.getElementById('productsGrid');
    document.getElementById('productCount').textContent = filteredProducts.length;

    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p class="no-products">No products found. Try adjusting your filters.</p>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
            </div>
            <div class="product-content">
                <div class="product-category">${product.category}</div>
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">
                    ${generateStars(product.rating)}
                    <span class="rating-count">(${product.reviews} reviews)</span>
                </div>
                <div class="product-price">
                    <span class="price">Rs. ${product.price.toLocaleString()}</span>
                    ${product.originalPrice ? `<span class="original-price">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
                </div>
                <div class="product-actions">
                    <button class="btn btn-primary" onclick="addToCart(${product.id}, '${product.name}', ${product.price}, '${product.image}')">Add to Cart</button>
                    <button class="btn-wishlist" onclick="addToWishlist(${product.id}, '${product.name}', ${product.price}, '${product.image}')">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Generate star rating
function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === fullStars && hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Update cart count
document.addEventListener('cartUpdated', function() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
});

// Update wishlist count
document.addEventListener('wishlistUpdated', function() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    document.querySelector('.wishlist-count').textContent = wishlist.length;
});

// Initial update
document.dispatchEvent(new Event('cartUpdated'));
document.dispatchEvent(new Event('wishlistUpdated'));