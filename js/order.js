// Order/Checkout Page Functionality

let currentStep = 1;
const shippingCosts = {
    standard: 200,
    express: 500,
    overnight: 800
};

document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    updateCartCount();
    displayReviewCart();
});

function initializeCheckout() {
    // Prevent moving between steps without completing current step
    document.getElementById('shippingForm').addEventListener('change', updateOrderSummary);
    document.getElementById('paymentForm').addEventListener('change', updateOrderSummary);
    
    // Payment method selection
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            togglePaymentForm(this.value);
            updateOrderSummary();
        });
    });

    // Update sidebar on load
    updateOrderSummary();
    displayReviewCart();
}

// Display review cart step
function displayReviewCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const reviewItems = document.getElementById('reviewItems');
    
    if (cart.length === 0) {
        reviewItems.innerHTML = '<p>Your cart is empty. <a href="products.html">Continue shopping</a></p>';
        return;
    }
    
    let html = '<div class="cart-review-items">';
    cart.forEach(item => {
        html += `
            <div class="review-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Quantity: ${item.quantity}</p>
                    <p>Price: Rs. ${item.price.toLocaleString()}</p>
                </div>
                <div class="item-total">
                    <p>Rs. ${(item.price * item.quantity).toLocaleString()}</p>
                </div>
            </div>
        `;
    });
    html += '</div>';
    reviewItems.innerHTML = html;
    
    updateOrderSummary();
}

// Update order summary in sidebar
function updateOrderSummary() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Get selected shipping method
    const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
    const shippingCost = shippingMethod ? shippingCosts[shippingMethod.value] : 200;
    
    const tax = subtotal * 0.05;
    const total = subtotal + shippingCost + tax;
    
    // Update sidebar
    let itemsHtml = cart.map(item => `
        <div class="sidebar-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    
    if (document.getElementById('sidebarItems')) {
        document.getElementById('sidebarItems').innerHTML = itemsHtml;
    }
    if (document.getElementById('sidebarSubtotal')) {
        document.getElementById('sidebarSubtotal').textContent = 'Rs. ' + subtotal.toLocaleString();
    }
    if (document.getElementById('sidebarShipping')) {
        document.getElementById('sidebarShipping').textContent = 'Rs. ' + shippingCost.toLocaleString();
    }
    if (document.getElementById('sidebarTax')) {
        document.getElementById('sidebarTax').textContent = 'Rs. ' + Math.round(tax).toLocaleString();
    }
    if (document.getElementById('sidebarTotal')) {
        document.getElementById('sidebarTotal').textContent = 'Rs. ' + Math.round(total).toLocaleString();
    }
}

// Next step
function nextStep(step) {
    // Validate current step before moving
    if (currentStep === 1) {
        goToStep(step);
    } else if (currentStep === 2) {
        if (validateShippingForm()) {
            goToStep(step);
        }
    } else if (currentStep === 3) {
        if (validatePaymentForm()) {
            goToStep(step);
            displayOrderConfirmation();
        }
    }
}

// Go to specific step
function goToStep(step) {
    // Hide current step
    const currentStepEl = document.getElementById(`step${currentStep}`);
    if (currentStepEl) currentStepEl.classList.remove('active');
    
    // Show new step
    const newStepEl = document.getElementById(`step${step}`);
    if (newStepEl) newStepEl.classList.add('active');
    
    // Update progress indicator
    updateProgress(step);
    
    currentStep = step;
    
    // Scroll to top
    window.scrollTo(0, 0);
}

// Update progress indicator
function updateProgress(step) {
    document.querySelectorAll('.progress-item').forEach((item, index) => {
        if (index + 1 <= step) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

// Previous step
function previousStep(step) {
    goToStep(step);
}

// Validate shipping form
function validateShippingForm() {
    const form = document.getElementById('shippingForm');
    const fields = form.querySelectorAll('[required]');
    let isValid = true;
    
    fields.forEach(field => {
        const errorSpan = field.parentElement.querySelector('.error-message');
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                if (errorSpan) {
                    errorSpan.textContent = 'Please enter a valid email';
                    errorSpan.style.display = 'block';
                }
                isValid = false;
            } else {
                if (errorSpan) errorSpan.style.display = 'none';
            }
        } else if (field.value.trim() === '') {
            if (errorSpan) {
                errorSpan.textContent = 'This field is required';
                errorSpan.style.display = 'block';
            }
            isValid = false;
        } else {
            if (errorSpan) errorSpan.style.display = 'none';
        }
    });
    
    return isValid;
}

// Validate payment form
function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    if (paymentMethod === 'cod') {
        return true;
    } else if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;
        
        if (cardNumber.length !== 16 || !cardNumber.match(/^\d+$/)) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }
        
        if (!expiry.match(/^\d{2}\/\d{2}$/)) {
            alert('Please enter expiry date in MM/YY format');
            return false;
        }
        
        if (cvv.length !== 3 || !cvv.match(/^\d+$/)) {
            alert('Please enter a valid 3-digit CVV');
            return false;
        }
        
        return true;
    } else if (paymentMethod === 'bank') {
        const transactionRef = document.getElementById('transactionRef').value;
        if (transactionRef.trim() === '') {
            alert('Please enter transaction reference');
            return false;
        }
        return true;
    }
    
    return true;
}

// Toggle payment form visibility
function togglePaymentForm(method) {
    document.querySelectorAll('.payment-form-section').forEach(section => {
        section.classList.remove('active');
    });
    
    const form = document.getElementById(method + 'Form');
    if (form) {
        form.classList.add('active');
    }
    
    document.querySelectorAll('.payment-method').forEach(method => {
        method.classList.remove('active');
    });
    
    const activeLabel = document.querySelector(`input[value="${method}"]`).closest('.payment-method');
    if (activeLabel) {
        activeLabel.classList.add('active');
    }
}

// Display order confirmation
function displayOrderConfirmation() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Items
    let itemsHtml = cart.map(item => `
        <div class="confirm-item">
            <span>${item.name} x${item.quantity}</span>
            <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
        </div>
    `).join('');
    if (document.getElementById('confirmItems')) {
        document.getElementById('confirmItems').innerHTML = itemsHtml;
    }
    
    // Shipping address
    const form = document.getElementById('shippingForm');
    const addressHtml = `
        <p><strong>${form.firstName.value} ${form.lastName.value}</strong></p>
        <p>${form.address.value}</p>
        <p>${form.city.value}, ${form.postal.value}</p>
        <p>${form.country.value.toUpperCase()}</p>
        <p>Phone: ${form.phone.value}</p>
        <p>Email: ${form.email.value}</p>
    `;
    if (document.getElementById('confirmAddress')) {
        document.getElementById('confirmAddress').innerHTML = addressHtml;
    }
    
    // Shipping method
    const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked');
    const shippingLabel = shippingMethod.closest('label').querySelector('.shipping-name').textContent;
    const shippingTime = shippingMethod.closest('label').querySelector('.shipping-time').textContent;
    const shippingCost = shippingCosts[shippingMethod.value];
    
    const shippingHtml = `
        <p><strong>${shippingLabel}</strong></p>
        <p>${shippingTime}</p>
        <p>Cost: Rs. ${shippingCost}</p>
    `;
    if (document.getElementById('confirmShipping')) {
        document.getElementById('confirmShipping').innerHTML = shippingHtml;
    }
    
    // Payment method
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const paymentLabels = {
        'cod': 'Cash on Delivery',
        'card': 'Credit/Debit Card',
        'bank': 'Bank Transfer'
    };
    
    if (document.getElementById('confirmPayment')) {
        document.getElementById('confirmPayment').innerHTML = `<p>${paymentLabels[paymentMethod]}</p>`;
    }
    
    // Totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.05;
    const total = subtotal + shippingCost + tax;
    
    if (document.getElementById('confirmSubtotal')) {
        document.getElementById('confirmSubtotal').textContent = 'Rs. ' + subtotal.toLocaleString();
    }
    if (document.getElementById('confirmShippingCost')) {
        document.getElementById('confirmShippingCost').textContent = 'Rs. ' + shippingCost.toLocaleString();
    }
    if (document.getElementById('confirmTax')) {
        document.getElementById('confirmTax').textContent = 'Rs. ' + Math.round(tax).toLocaleString();
    }
    if (document.getElementById('confirmTotal')) {
        document.getElementById('confirmTotal').textContent = 'Rs. ' + Math.round(total).toLocaleString();
    }
}

// Place order
function placeOrder() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const form = document.getElementById('shippingForm');
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    const shippingMethod = document.querySelector('input[name="shippingMethod"]:checked').value;
    
    // Create order object
    const order = {
        orderId: 'ORD' + Date.now(),
        items: cart,
        customerInfo: {
            name: `${form.firstName.value} ${form.lastName.value}`,
            email: form.email.value,
            phone: form.phone.value,
            address: form.address.value,
            city: form.city.value,
            postal: form.postal.value,
            country: form.country.value
        },
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'confirmed'
    };
    
    // Save order to localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    
    // Show success modal
    showSuccessModal(order.orderId);
}

// Show success modal
function showSuccessModal(orderId) {
    if (document.getElementById('orderNumber')) {
        document.getElementById('orderNumber').textContent = orderId;
    }
    if (document.getElementById('successModal')) {
        document.getElementById('successModal').style.display = 'block';
    }
}

// Go to home
function goHome() {
    window.location.href = 'index.html';
}

// Go to products
function goToProducts() {
    window.location.href = 'products.html';
}

// Format card number and expiry
document.addEventListener('input', function(e) {
    if (e.target.id === 'cardNumber') {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = formattedValue;
    }
    
    if (e.target.id === 'expiry') {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2, 4);
        }
        e.target.value = value;
    }
});

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (document.querySelector('.cart-count')) {
        document.querySelector('.cart-count').textContent = count;
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }
});