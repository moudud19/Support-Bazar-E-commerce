// Order/Checkout Page - Multi-step Form Handling
let currentStep = 1;
let orderData = {
    items: [],
    shipping: {},
    payment: {}
};

document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutData();
    setupPaymentMethodToggle();
    setupShippingMethodHandlers();
    initializeCheckout();
});

function loadCheckoutData() {
    // Load cart items from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    orderData.items = cart;

    if (cart.length === 0) {
        document.body.innerHTML = '<div class="container" style="padding: 50px 0; text-align: center;"><h2>Your cart is empty</h2><p><a href="products.html" class="btn btn-primary">Continue Shopping</a></p></div>';
        return;
    }

    displayOrderSummary();
}

function displayOrderSummary() {
    const cart = orderData.items;
    const subtotal = calculateSubtotal(cart);
    const tax = subtotal * 0.05;
    const total = subtotal + tax;

    // Display in cart review step
    const cartItemsReview = document.getElementById('cartItemsReview');
    if (cartItemsReview) {
        cartItemsReview.innerHTML = cart.map(item => `
            <div class="cart-item-row">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="item-price">Rs. ${(item.price * item.quantity).toLocaleString()}</div>
            </div>
        `).join('');
    }

    // Display sidebar summary
    const sidebarItems = document.getElementById('sidebarItems');
    if (sidebarItems) {
        sidebarItems.innerHTML = cart.map(item => `
            <div class="sidebar-item">
                <span>${item.name} x${item.quantity}</span>
                <span>Rs. ${(item.price * item.quantity).toLocaleString()}</span>
            </div>
        `).join('');
    }

    updateTotals();
}

function calculateSubtotal(cart) {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateTotals() {
    const cart = orderData.items;
    const subtotal = calculateSubtotal(cart);
    const shippingCost = parseFloat(document.querySelector('input[name="shipping"]:checked')?.dataset.cost || 0);
    const tax = subtotal * 0.05;
    const total = subtotal + shippingCost + tax;

    // Update review totals
    document.getElementById('reviewSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('reviewShipping').textContent = `Rs. ${shippingCost.toLocaleString()}`;
    document.getElementById('reviewTax').textContent = `Rs. ${tax.toLocaleString()}`;
    document.getElementById('reviewTotal').textContent = `Rs. ${total.toLocaleString()}`;

    // Update sidebar totals
    document.getElementById('sidebarSubtotal').textContent = `Rs. ${subtotal.toLocaleString()}`;
    document.getElementById('sidebarShipping').textContent = `Rs. ${shippingCost.toLocaleString()}`;
    document.getElementById('sidebarTax').textContent = `Rs. ${tax.toLocaleString()}`;
    document.getElementById('sidebarTotal').textContent = `Rs. ${total.toLocaleString()}`;
}

function setupShippingMethodHandlers() {
    const shippingRadios = document.querySelectorAll('input[name="shipping"]');
    shippingRadios.forEach(radio => {
        radio.addEventListener('change', updateTotals);
    });
}

function setupPaymentMethodToggle() {
    const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    const cardForm = document.getElementById('cardPaymentForm');

    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'card') {
                cardForm.classList.remove('hidden');
            } else {
                cardForm.classList.add('hidden');
            }
        });
    });
}

function initializeCheckout() {
    updateTotals();
}

function nextStep(step) {
    // Validate current step before moving forward
    if (currentStep === 1) {
        // Cart review - no validation needed
        moveToStep(step);
    } else if (currentStep === 2) {
        // Validate shipping form
        if (validateShippingForm()) {
            saveShippingData();
            moveToStep(step);
        }
    } else if (currentStep === 3) {
        // Validate payment form
        if (validatePaymentForm()) {
            savePaymentData();
            prepareOrderReview();
            moveToStep(step);
        }
    }
}

function previousStep(step) {
    moveToStep(step);
}

function moveToStep(step) {
    // Hide current step
    document.getElementById(`cart-review`).classList.remove('active');
    document.getElementById(`shipping-info`).classList.remove('active');
    document.getElementById(`payment-info`).classList.remove('active');
    document.getElementById(`order-confirmation`).classList.remove('active');

    // Remove active class from all steps
    document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));

    // Show new step
    const stepMap = {
        1: 'cart-review',
        2: 'shipping-info',
        3: 'payment-info',
        4: 'order-confirmation'
    };

    document.getElementById(stepMap[step]).classList.add('active');
    document.getElementById(`step-${step}`).classList.add('active');

    currentStep = step;
    window.scrollTo(0, 0);
}

function validateShippingForm() {
    const form = document.getElementById('shippingForm');
    
    // Check HTML5 validation
    if (!form.checkValidity()) {
        alert('Please fill in all required fields');
        return false;
    }

    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }

    // Phone validation (simple check)
    if (phone.length < 10) {
        alert('Please enter a valid phone number');
        return false;
    }

    return true;
}

function validatePaymentForm() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

    if (paymentMethod === 'card') {
        const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
        const expiryDate = document.getElementById('expiryDate').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || cardNumber.length < 13) {
            alert('Please enter a valid card number');
            return false;
        }

        if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
            alert('Please enter expiry date in MM/YY format');
            return false;
        }

        if (!cvv || cvv.length < 3) {
            alert('Please enter a valid CVV');
            return false;
        }
    }

    return true;
}

function saveShippingData() {
    orderData.shipping = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value,
        notes: document.getElementById('notes').value,
        method: document.querySelector('input[name="shipping"]:checked').value,
        shippingCost: parseFloat(document.querySelector('input[name="shipping"]:checked').dataset.cost)
    };
}

function savePaymentData() {
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
    
    orderData.payment = {
        method: paymentMethod,
        notes: document.getElementById('orderNotes').value
    };

    if (paymentMethod === 'card') {
        orderData.payment.cardName = document.getElementById('cardName').value;
        orderData.payment.cardNumber = document.getElementById('cardNumber').value.slice(-4);
    }
}

function prepareOrderReview() {
    const { shipping, payment } = orderData;

    // Format address
    const addressText = `${shipping.firstName} ${shipping.lastName}<br>
                        ${shipping.address}<br>
                        ${shipping.city}, ${shipping.postalCode}<br>
                        ${shipping.country}<br>
                        Phone: ${shipping.phone}`;
    document.getElementById('confirmAddress').innerHTML = addressText;

    // Format shipping method
    const shippingText = shipping.method === 'standard' ? 'Standard Shipping (3-5 days)' :
                        shipping.method === 'express' ? 'Express Shipping (1-2 days)' :
                        'Overnight Shipping (Next day)';
    document.getElementById('confirmShipping').textContent = shippingText;

    // Format payment method
    const paymentText = payment.method === 'cod' ? 'Cash on Delivery' :
                       payment.method === 'card' ? `Credit/Debit Card (****${payment.cardNumber})` :
                       'Bank Transfer';
    document.getElementById('confirmPayment').textContent = paymentText;
}

function placeOrder() {
    if (!document.getElementById('agreeTerms').checked) {
        alert('Please agree to the terms and conditions');
        return;
    }

    // Generate order number
    const orderNumber = '#' + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('orderNumber').textContent = orderNumber;

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push({
        orderNumber: orderNumber,
        date: new Date().toLocaleDateString(),
        items: orderData.items,
        shipping: orderData.shipping,
        payment: orderData.payment,
        total: calculateOrderTotal()
    });
    localStorage.setItem('orders', JSON.stringify(orders));

    // Clear cart
    localStorage.removeItem('cart');

    // Show success modal
    document.getElementById('successModal').style.display = 'flex';

    // Disable place order button to prevent duplicate submissions
    document.getElementById('placeOrderBtn').disabled = true;
}

function calculateOrderTotal() {
    const subtotal = calculateSubtotal(orderData.items);
    const shippingCost = orderData.shipping.shippingCost || 0;
    const tax = subtotal * 0.05;
    return subtotal + shippingCost + tax;
}

function goToHome() {
    window.location.href = 'index.html';
}

function goBack() {
    window.history.back();
}

// Format card number input
document.addEventListener('DOMContentLoaded', function() {
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim();
        });
    }

    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            this.value = value;
        });
    }

    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function() {
            this.value = this.value.replace(/\D/g, '').slice(0, 4);
        });
    }
});
