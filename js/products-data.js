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
        image: "https://via.placeholder.com/250x200?text=Wireless+Headphones",
        description: "Experience premium sound quality with our wireless Bluetooth headphones. Features noise cancellation, 30-hour battery life, and comfortable over-ear design for all-day listening."
    },
    {
        id: 2,
        name: "Smart Watch Pro",
        category: "electronics",
        price: 5999,
        originalPrice: 8999,
        rating: 4.7,
        reviews: 95,
        image: "https://via.placeholder.com/250x200?text=Smart+Watch",
        description: "Advanced fitness tracking smartwatch with heart rate monitor, sleep tracking, GPS, and water resistance. Compatible with iOS and Android devices."
    },
    {
        id: 3,
        name: "Casual Cotton T-Shirt",
        category: "fashion",
        price: 499,
        originalPrice: 999,
        rating: 4.3,
        reviews: 256,
        image: "https://via.placeholder.com/250x200?text=Cotton+T-Shirt",
        description: "Premium quality casual cotton t-shirt perfect for everyday wear. Soft, breathable fabric with excellent durability. Available in multiple colors and sizes."
    },
    {
        id: 4,
        name: "Denim Jeans",
        category: "fashion",
        price: 1299,
        originalPrice: 2499,
        rating: 4.4,
        reviews: 187,
        image: "https://via.placeholder.com/250x200?text=Denim+Jeans",
        description: "Classic blue denim jeans with perfect fit and comfort. Made from high-quality denim fabric with reinforced stitching for long-lasting wear. Trendy and versatile design."
    },
    {
        id: 5,
        name: "Stainless Steel Cookware Set",
        category: "kitchen",
        price: 3499,
        originalPrice: 6999,
        rating: 4.6,
        reviews: 142,
        image: "https://via.placeholder.com/250x200?text=Cookware+Set",
        description: "Professional grade 5-piece stainless steel cookware set. Includes pots, pans, and lids. Non-stick coating, dishwasher safe, and suitable for all cooktops including induction."
    },
    {
        id: 6,
        name: "Coffee Maker Machine",
        category: "kitchen",
        price: 2499,
        originalPrice: 4999,
        rating: 4.5,
        reviews: 89,
        image: "https://via.placeholder.com/250x200?text=Coffee+Maker",
        description: "Automatic coffee maker with programmable timer and brew strength control. Large capacity 12-cup carafe, keeps coffee hot for hours. Compact design perfect for kitchens."
    },
    {
        id: 7,
        name: "Living Room Sofa",
        category: "home",
        price: 15999,
        originalPrice: 24999,
        rating: 4.6,
        reviews: 76,
        image: "https://via.placeholder.com/250x200?text=Living+Room+Sofa",
        description: "Comfortable 3-seater sofa with premium fabric upholstery and wooden frame. Spacious seating with built-in armrests. Perfect addition to any living room."
    },
    {
        id: 8,
        name: "Bed Sheet Set",
        category: "home",
        price: 1199,
        originalPrice: 2499,
        rating: 4.4,
        reviews: 234,
        image: "https://via.placeholder.com/250x200?text=Bed+Sheet+Set",
        description: "Soft and comfortable cotton bed sheet set for Queen size beds. Includes 2 pillowcases and 1 fitted sheet. Machine washable and fade-resistant."
    },
    {
        id: 9,
        name: "Yoga Mat",
        category: "sports",
        price: 799,
        originalPrice: 1499,
        rating: 4.5,
        reviews: 198,
        image: "https://via.placeholder.com/250x200?text=Yoga+Mat",
        description: "Non-slip yoga and exercise mat with excellent cushioning. 6mm thick mat provides comfort and support during workouts. Lightweight and portable with carrying strap."
    },
    {
        id: 10,
        name: "Dumbbells Set",
        category: "sports",
        price: 2999,
        originalPrice: 5999,
        rating: 4.6,
        reviews: 143,
        image: "https://via.placeholder.com/250x200?text=Dumbbells+Set",
        description: "Adjustable dumbbells set ranging from 5kg to 25kg. Perfect for home gym workouts. Chrome plated with ergonomic grip handles for safe and effective training."
    },
    {
        id: 11,
        name: "The Great Gatsby",
        category: "books",
        price: 299,
        originalPrice: 599,
        rating: 4.7,
        reviews: 512,
        image: "https://via.placeholder.com/250x200?text=The+Great+Gatsby",
        description: "Classic novel by F. Scott Fitzgerald. A timeless masterpiece exploring themes of love, wealth, and the American Dream. Hardcover edition with quality binding."
    },
    {
        id: 12,
        name: "JavaScript: The Good Parts",
        category: "books",
        price: 499,
        originalPrice: 999,
        rating: 4.5,
        reviews: 187,
        image: "https://via.placeholder.com/250x200?text=JavaScript+Good+Parts",
        description: "Essential guide to JavaScript programming by Douglas Crockford. Learn the best practices and core concepts. Perfect for beginners and intermediate developers."
    }
];

// Function to display products
function displayProducts(productsToDisplay = products) {
    const container = document.getElementById('featuredProducts');
    if (!container) return;
    
    container.innerHTML = productsToDisplay.map(product => `
        <div class="product-card">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">
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
                <p style="font-size: 0.85rem; color: #666; margin: 10px 0;">${product.description}</p>
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

// View product details
function viewProductDetails(productId) {
    const product = getProductById(productId);
    if (!product) return;
    
    alert(`${product.name}\n\n${product.description}\n\nPrice: Rs. ${product.price}`);
}

// Initialize featured products on page load
document.addEventListener('DOMContentLoaded', function() {
    displayProducts(products.slice(0, 6)); // Show first 6 products as featured
});