// Contact Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupFAQ();
    updateCartCount();
});

// Setup contact form
function setupContactForm() {
    const form = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Clear previous message
        formMessage.textContent = '';
        formMessage.className = 'form-message';

        // Validate form
        if (!validateContactForm()) {
            formMessage.textContent = 'Please fill in all required fields correctly';
            formMessage.className = 'form-message error';
            return;
        }

        // Get form data
        const formData = new FormData(form);
        const contactData = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            date: new Date().toISOString()
        };

        // Save to localStorage
        let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        contacts.push(contactData);
        localStorage.setItem('contacts', JSON.stringify(contacts));

        // Show success message
        formMessage.textContent = 'Thank you! Your message has been sent successfully. We will get back to you within 24 hours.';
        formMessage.className = 'form-message success';

        // Reset form
        form.reset();

        // Hide message after 5 seconds
        setTimeout(() => {
            formMessage.textContent = '';
            formMessage.className = 'form-message';
        }, 5000);
    });
}

// Validate contact form
function validateContactForm() {
    const form = document.getElementById('contactForm');
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

// Setup FAQ accordion
function setupFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    if (document.querySelector('.cart-count')) {
        document.querySelector('.cart-count').textContent = count;
    }
}

// Update wishlist count
function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    if (document.querySelector('.wishlist-count')) {
        document.querySelector('.wishlist-count').textContent = wishlist.length;
    }
}

// Initial updates
setInterval(() => {
    updateCartCount();
    updateWishlistCount();
}, 500);