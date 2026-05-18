// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Add to cart function
function addToCart(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart function
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

// Update cart quantity
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
        displayCart();
    }
}

// Increase quantity
function increaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += 1;
        saveCart();
        displayCart();
    }
}

// Decrease quantity
function decreaseQuantity(productId) {
    const item = cart.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
        saveCart();
        displayCart();
    }
}

// Display cart items
function displayCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Your cart is empty</p>';
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image" style="font-size: 2rem; min-width: 50px; text-align: center;">
                ${item.image}
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">Rs. ${item.price}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="decreaseQuantity(${item.id})">-</button>
                <input type="number" value="${item.quantity}" min="1" onchange="updateCartQuantity(${item.id}, this.value)" style="width: 50px; text-align: center; border: 1px solid #ddd; padding: 5px; border-radius: 3px;">
                <button class="quantity-btn" onclick="increaseQuantity(${item.id})">+</button>
            </div>
            <div style="min-width: 80px; text-align: right;">
                <div style="font-weight: bold; color: #FF6B6B;">Rs. ${item.price * item.quantity}</div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');

    updateCartSummary();
    document.getElementById('checkoutBtn').disabled = false;
}

// Update cart summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('tax').textContent = `Rs. ${Math.round(tax).toLocaleString()}`;
    document.getElementById('total').textContent = `Rs. ${Math.round(total).toLocaleString()}`;
}

// Update cart count badge
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountBadge = document.querySelector('.cart-count');
    if (cartCountBadge) {
        cartCountBadge.textContent = count;
    }
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Get cart total
function getCartTotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

// Get cart items count
function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Clear cart
function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        displayCart();
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Cart modal functionality
    const cartBtn = document.getElementById('cartBtn');
    const cartModal = document.getElementById('cartModal');
    
    if (cartBtn && cartModal) {
        cartBtn.onclick = function() {
            displayCart();
            cartModal.classList.add('show');
        };

        // Close modal
        const closeBtn = cartModal.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                cartModal.classList.remove('show');
            };
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            if (event.target === cartModal) {
                cartModal.classList.remove('show');
            }
            if (event.target === document.getElementById('wishlistModal')) {
                document.getElementById('wishlistModal').classList.remove('show');
            }
        };
    }

    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.onclick = function() {
            if (cart.length === 0) {
                alert('Your cart is empty!');
                return;
            }
            proceedToCheckout();
        };
    }
});

// Proceed to checkout
function proceedToCheckout() {
    // Store cart in sessionStorage for checkout page
    sessionStorage.setItem('checkoutCart', JSON.stringify(cart));
    window.location.href = 'checkout.html';
}