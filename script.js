/**
 * CorelMarket - Interaction Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scroll effect to navbar
    const nav = document.querySelector('.glass-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.05)';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.95)';
            nav.style.boxShadow = 'none';
        }
    });

    // Cart Functionality
    const cartToggleBtns = document.querySelectorAll('#cartToggleBtn');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartOverlay = document.getElementById('cartOverlay');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartTotalPriceEl = document.getElementById('cartTotalPrice');
    const cartBadges = document.querySelectorAll('.cart-badge');
    
    // Cart state from localStorage
    let cart = JSON.parse(localStorage.getItem('doboDesignCart')) || [];

    const saveCart = () => {
        localStorage.setItem('doboDesignCart', JSON.stringify(cart));
    };

    // Helper: update all cart badges
    const updateBadges = () => {
        cartBadges.forEach(badge => {
            badge.textContent = cart.length;
            // Pop animation
            badge.classList.add('pop');
            setTimeout(() => badge.classList.remove('pop'), 300);
        });
    };

    // Helper: Build Cart DOM
    const renderCart = () => {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            if (cartTotalPriceEl) cartTotalPriceEl.textContent = '₹0';
            return;
        }

        let total = 0;
        cartItemsContainer.innerHTML = ''; // Clear container
        
        cart.forEach((item, index) => {
            total += item.price;
            
            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <button class="remove-item" data-index="${index}"><i class="ph ph-trash"></i></button>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
        
        if (cartTotalPriceEl) cartTotalPriceEl.textContent = `₹${total}`;

        // Bind remove events
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.currentTarget.getAttribute('data-index');
                cart.splice(index, 1);
                saveCart();
                updateBadges();
                renderCart();
            });
        });
    };

    // Toggle Cart Open/Close
    const openCart = () => {
        if(cartSidebar) cartSidebar.classList.add('active');
        if(cartOverlay) cartOverlay.classList.add('active');
    };

    const closeCart = () => {
        if(cartSidebar) cartSidebar.classList.remove('active');
        if(cartOverlay) cartOverlay.classList.remove('active');
    };

    cartToggleBtns.forEach(btn => btn.addEventListener('click', openCart));
    if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart);

    // Add To Cart Event Listeners
    document.querySelectorAll('.add-cart').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // Try to find the closest product card or specific product page info
            const card = e.currentTarget.closest('.product-card') || e.currentTarget.closest('.product-details-sidebar');
            
            if (card) {
                let title, price, img;

                if (card.classList.contains('product-card')) {
                    // It's a grid item (index.html)
                    title = card.querySelector('.product-title').innerText;
                    price = parseInt(card.querySelector('.product-price').innerText.replace('₹', ''));
                    img = card.querySelector('img').src;
                } else if (card.classList.contains('product-details-sidebar')) {
                    // It's a product page
                    title = card.querySelector('.product-page-title').innerText;
                    price = parseInt(card.querySelector('.product-price-large').innerText.replace('₹', '').trim());
                    // Just take the first image on the page for cart purpose if mainImage id is not around
                    const imgEl = document.getElementById('mainImage') || document.querySelector('.main-image-wrapper img');
                    img = imgEl ? imgEl.src : '';
                }

                // Push to cart array
                cart.push({ title, price, img });
                saveCart();
                updateBadges();
                renderCart();
                
                // (Removed auto-popup openCart() as requested)
            }
        });
    });

    // Initialize UI on load
    updateBadges();
    renderCart();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Toggle icon
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('ph-list');
                icon.classList.add('ph-x');
            } else {
                icon.classList.remove('ph-x');
                icon.classList.add('ph-list');
            }
        });

        // Close menu on link click
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('ph-x');
                    icon.classList.add('ph-list');
                }
            });
        });
    }
});
