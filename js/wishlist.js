// Wishlist Management
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Add to wishlist function
function toggleWishlist(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = wishlist.find(item => item.id === productId);
    
    if (existingItem) {
        wishlist = wishlist.filter(item => item.id !== productId);
        showNotification(`${product.name} removed from wishlist`);
    } else {
        wishlist.push(product);
        showNotification(`${product.name} added to wishlist!`);
    }
    
    saveWishlist();
    updateWishlistCount();
    updateWishlistButtons();
}

// Remove from wishlist function
function removeFromWishlist(productId) {
    wishlist = wishlist.filter(item => item.id !== productId);
    saveWishlist();
    updateWishlistCount();
    displayWishlist();
    updateWishlistButtons();
}

// Check if product is in wishlist
function isInWishlist(productId) {
    return wishlist.some(item => item.id === productId);
}

// Display wishlist items
function displayWishlist() {
    const wishlistItemsContainer = document.getElementById('wishlistItems');
    if (!wishlistItemsContainer) return;

    if (wishlist.length === 0) {
        wishlistItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Your wishlist is empty</p>';
        return;
    }

    wishlistItemsContainer.innerHTML = wishlist.map(item => `
        <div class="wishlist-item">
            <div class="wishlist-item-image" style="font-size: 2rem; min-width: 50px; text-align: center;">
                ${item.image}
            </div>
            <div class="wishlist-item-info">
                <div class="wishlist-item-name">${item.name}</div>
                <div class="wishlist-item-price">Rs. ${item.price}</div>
                <div style="font-size: 0.85rem; color: #999; margin-top: 5px;">${item.category}</div>
            </div>
            <button class="btn btn-primary" onclick="addToCart(${item.id})" style="padding: 8px 15px; font-size: 0.9rem;">
                <i class="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button class="remove-btn" onclick="removeFromWishlist(${item.id})">Remove</button>
        </div>
    `).join('');
}

// Update wishlist count badge
function updateWishlistCount() {
    const count = wishlist.length;
    const wishlistCountBadge = document.querySelector('.wishlist-count');
    if (wishlistCountBadge) {
        wishlistCountBadge.textContent = count;
    }
}

// Update wishlist buttons styling
function updateWishlistButtons() {
    document.querySelectorAll('.product-wishlist-btn').forEach(btn => {
        const productCard = btn.closest('.product-card');
        const productTitle = productCard.querySelector('.product-title').textContent;
        const product = products.find(p => p.name === productTitle);
        
        if (product && isInWishlist(product.id)) {
            btn.classList.add('added');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        } else {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

// Save wishlist to localStorage
function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// Move from wishlist to cart
function moveToCart(productId) {
    addToCart(productId);
    removeFromWishlist(productId);
}

// Initialize wishlist on page load
document.addEventListener('DOMContentLoaded', function() {
    updateWishlistCount();
    updateWishlistButtons();
    
    // Wishlist modal functionality
    const wishlistBtn = document.getElementById('wishlistBtn');
    const wishlistModal = document.getElementById('wishlistModal');
    
    if (wishlistBtn && wishlistModal) {
        wishlistBtn.onclick = function() {
            displayWishlist();
            wishlistModal.classList.add('show');
        };

        // Close modal
        const closeBtn = wishlistModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                wishlistModal.classList.remove('show');
            };
        }
    }
});