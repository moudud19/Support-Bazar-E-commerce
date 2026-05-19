// Products Page - Filter, Sort, and Display
document.addEventListener('DOMContentLoaded', function() {
    loadProductsPage();
    setupEventListeners();
});

function setupEventListeners() {
    // Category filters
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.addEventListener('change', filterProducts);
    });

    // Price range filter
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
        priceRange.addEventListener('input', function() {
            document.getElementById('priceValue').textContent = this.value;
            filterProducts();
        });
    }

    // Sort
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', filterProducts);
    }

    // Reset filters
    const resetBtn = document.getElementById('resetFilters');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetAllFilters);
    }

    // Search
    const searchBtn = document.getElementById('searchBtn');
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function loadProductsPage() {
    // Check if products data exists
    if (typeof productsData === 'undefined') {
        console.error('Products data not loaded');
        return;
    }

    displayProducts(productsData);
}

function filterProducts() {
    // Get selected categories
    const selectedCategories = [];
    document.querySelectorAll('.category-filter:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });

    // Get price range
    const maxPrice = parseInt(document.getElementById('priceRange').value);

    // Get sort option
    const sortBy = document.getElementById('sortSelect').value;

    // Filter products
    let filtered = productsData.filter(product => {
        const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(product.category);
        const priceMatch = product.price <= maxPrice;
        return categoryMatch && priceMatch;
    });

    // Sort products
    filtered = sortProducts(filtered, sortBy);

    // Display filtered products
    displayProducts(filtered);
}

function sortProducts(products, sortBy) {
    const sorted = [...products];
    
    switch(sortBy) {
        case 'price-low':
            return sorted.sort((a, b) => a.price - b.price);
        case 'price-high':
            return sorted.sort((a, b) => b.price - a.price);
        case 'rating':
            return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        case 'newest':
        default:
            return sorted.reverse();
    }
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    const countElement = document.getElementById('productCount');

    if (!grid) return;

    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<div class="no-products"><p>No products found. Try adjusting your filters.</p></div>';
        countElement.textContent = 'Showing 0 products';
        return;
    }

    products.forEach(product => {
        const productCard = createProductCard(product);
        grid.appendChild(productCard);
    });

    countElement.textContent = `Showing ${products.length} products`;
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    const rating = product.rating ? `<div class="rating"><span class="stars">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span></div>` : '';
    
    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}">
            ${product.discount ? `<div class="discount-badge">-${product.discount}%</div>` : ''}
        </div>
        <div class="product-details">
            <h3>${product.name}</h3>
            <p class="category">${product.category}</p>
            ${rating}
            <p class="description">${product.description}</p>
            <div class="price-section">
                <span class="price">Rs. ${product.price.toLocaleString()}</span>
                ${product.originalPrice ? `<span class="original-price">Rs. ${product.originalPrice.toLocaleString()}</span>` : ''}
            </div>
            <div class="product-actions">
                <button class="btn btn-small" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Add to Cart
                </button>
                <button class="btn btn-small btn-outline" onclick="addToWishlist(${product.id})">
                    <i class="fas fa-heart"></i>
                </button>
            </div>
        </div>
    `;

    return card;
}

function resetAllFilters() {
    // Uncheck all category filters
    document.querySelectorAll('.category-filter').forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset price range
    const priceRange = document.getElementById('priceRange');
    priceRange.value = priceRange.max;
    document.getElementById('priceValue').textContent = priceRange.max;

    // Reset sort
    document.getElementById('sortSelect').value = 'newest';

    // Display all products
    displayProducts(productsData);
}

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (!searchTerm) {
        displayProducts(productsData);
        return;
    }

    const results = productsData.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );

    displayProducts(results);
}

// Get category from URL parameter
function getCategoryFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('category');
}

// Load products by category if specified
window.addEventListener('load', function() {
    const category = getCategoryFromURL();
    if (category) {
        const checkbox = document.querySelector(`input[value="${category}"]`);
        if (checkbox) {
            checkbox.checked = true;
            filterProducts();
        }
    }
});
