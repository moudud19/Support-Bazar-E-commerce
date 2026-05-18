// Product Data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        category: "electronics",
        price: 2999,
        originalPrice: 4999,
        rating: 4.5,
        reviews: 128,
        image: "🎧",
        description: "High-quality wireless headphones with noise cancellation"
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "electronics",
        price: 5999,
        originalPrice: 8999,
        rating: 4.7,
        reviews: 95,
        image: "⌚",
        description: "Advanced fitness tracking and health monitoring"
    },
    {
        id: 3,
        name: "Casual Cotton T-Shirt",
        category: "fashion",
        price: 499,
        originalPrice: 999,
        rating: 4.3,
        reviews: 256,
        image: "👕",
        description: "Comfortable and stylish cotton t-shirt"
    },
    {
        id: 4,
        name: "Denim Jeans",
        category: "fashion",
        price: 1299,
        originalPrice: 2499,
        rating: 4.4,
        reviews: 187,
        image: "👖",
        description: "Classic blue denim jeans for everyday wear"
    },
    {
        id: 5,
        name: "Stainless Steel Cookware Set",
        category: "kitchen",
        price: 3499,
        originalPrice: 6999,
        rating: 4.6,
        reviews: 142,
        image: "🍳",
        description: "Professional grade 5-piece cookware set"
    },
    {
        id: 6,
        name: "Coffee Maker Machine",
        category: "kitchen",
        price: 2499,
        originalPrice: 4999,
        rating: 4.5,
        reviews: 89,
        image: "☕",
        description: "Automatic coffee maker with programmable timer"
    },
    {
        id: 7,
        name: "Living Room Sofa",
        category: "home",
        price: 15999,
        originalPrice: 24999,
        rating: 4.6,
        reviews: 76,
        image: "🛋️",
        description: "Comfortable 3-seater sofa with premium fabric"
    },
    {
        id: 8,
        name: "Bed Sheet Set",
        category: "home",
        price: 1199,
        originalPrice: 2499,
        rating: 4.4,
        reviews: 234,
        image: "🛏️",
        description: "Soft cotton bed sheet set (Queen size)"
    },
    {
        id: 9,
        name: "Yoga Mat",
        category: "sports",
        price: 799,
        originalPrice: 1499,
        rating: 4.5,
        reviews: 198,
        image: "🧘",
        description: "Non-slip yoga and exercise mat"
    },
    {
        id: 10,
        name: "Dumbbells Set",
        category: "sports",
        price: 2999,
        originalPrice: 5999,
        rating: 4.6,
        reviews: 143,
        image: "🏋️",
        description: "Adjustable dumbbells set (5kg to 25kg)"
    },
    {
        id: 11,
        name: "The Great Gatsby",
        category: "books",
        price: 299,
        originalPrice: 599,
        rating: 4.7,
        reviews: 512,
        image: "📚",
        description: "Classic novel by F. Scott Fitzgerald"
    },
    {
        id: 12,
        name: "JavaScript: The Good Parts",
        category: "books",
        price: 499,
        originalPrice: 999,
        rating: 4.5,
        reviews: 187,
        image: "📖",
        description: "Essential guide to JavaScript programming"
    }
];

// Function to display products
function displayProducts(productsToDisplay = products) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                ${product.image}
                <button class="product-wishlist-btn" onclick="toggleWishlist(${product.id})" title="Add to Wishlist">
                    <i class="far fa-heart"></i>
                </button>
            </div>
            <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-title">${product.name}</h3>
                <div class="product-rating">
                    ${Array(Math.floor(product.rating)).fill('<i class="fas fa-star"></i>').join('')}
                    ${product.rating % 1 !== 0 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                    (${product.reviews})
                </div>
                <div class="product-price">
                    <span class="product-original-price">Rs. ${product.originalPrice}</span>
                    <span class="product-current-price">Rs. ${product.price}</span>
                    <span class="product-discount">-${Math.round((1 - product.price/product.originalPrice) * 100)}%</span>
                </div>
                <div class="product-actions">
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button class="view-details-btn" onclick="viewProductDetails(${product.id})">Details</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Get product by ID
function getProductById(id) {
    return products.find(p => p.id === id);
}

// Filter products by category
function filterByCategory(category) {
    if (category === 'all') {
        return products;
    }
    return products.filter(p => p.category === category);
}

// Search products
function searchProducts(query) {
    const lowerQuery = query.toLowerCase();
    return products.filter(p => 
        p.name.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery)
    );
}

// Initialize featured products on page load
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products.slice(0, 6)); // Show first 6 products as featured
});