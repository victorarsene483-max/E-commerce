let cart=[];
let wishlist=[];
const productColors = {
    'Classic Denim Jacket': [
        { name: 'Blue', hex: '#3b5f8a', image: 'denim-blue.jpg' },
        { name: 'Black', hex: '#1a1a1a', image: 'denim-black.jpg' },
        { name: 'Light Wash', hex: '#8fa8c8', image: 'denim-light.jpg' }
    ],
    'Sneakers': [
        { name: 'White/Blue', hex: '#e8e8e8', image: 'sneakers-white.jpg' },
        { name: 'Black/Red', hex: '#1a1a1a', image: 'sneakers-black.jpg' },
        { name: 'Grey', hex: '#be1919', image: 'sneakers-grey.jpg' }
    ],
    'Vintage Blazer': [
        { name: 'Navy', hex: '#1e3a5f', image: 'blazer-navy.jpg' },
        { name: 'Beige', hex: '#d4c4a8', image: 'blazer-beige.jpg' },
        { name: 'Olive', hex: '#556b2f', image: 'blazer-olive.jpg' }
    ],
    'Street Cap': [
        { name: 'Red', hex: '#c41e3a', image: 'cap-red.jpg' },
        { name: 'Black', hex: '#1a1a1a', image: 'cap-black.jpg' },
        { name: 'Navy', hex: '#1e3a5f', image: 'cap-navy.jpg' }
    ],
    'Urban Backpack': [
        { name: 'Black', hex: '#1a1a1a', image: 'backpack-black.jpg' },
        { name: 'Brown', hex: '#8b4513', image: 'backpack-brown.jpg' },
        { name: 'Olive', hex: '#556b2f', image: 'backpack-olive.jpg' }
    ],
    'Floral Dress': [
        { name: 'White/Red', hex: '#f5f5f5', image: 'dress-white.jpg' },
        { name: 'Black/Pink', hex: '#1a1a1a', image: 'dress-black.jpg' },
        { name: 'Blue', hex: '#3b5f8a', image: 'dress-blue.jpg' }
    ]
};
const defaultColors = [
    { name: 'Black', hex: '#1a1a1a' },
    { name: 'White', hex: '#f5f5f5' },
    { name: 'Navy', hex: '#1e3a5f' }
];

document.addEventListener('DOMContentLoaded',()=> {
    init();
});

function init(){
    setupSearch();
    setupFilterBtns();
    setupCategoryCards();
    setupWishlistBtns();
    setupNavLinks();
    setupDropdowns();
    setupColorPalettes();
    setupBannerBtns();
    updateCartCount();
    updateCartTotal();
}


function setupColorPalettes() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const productName = card.querySelector('h3')?.textContent?.trim();
        if (!productName) return;

        const colors = productColors[productName] || defaultColors;
        const paletteContainer = document.createElement('div');
        paletteContainer.className = 'color-palette';
        paletteContainer.style.cssText = `
            display: flex;
            gap: 6px;
            margin: 8px 0;
            align-items: center;
        `;

        colors.forEach((color, idx) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.dataset.color = color.name;
            swatch.dataset.hex = color.hex;
            swatch.style.cssText = `
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: ${color.hex};
                border: 2px solid #ddd;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            `;
            if (idx === 0) {
                swatch.style.borderColor = '#121111';
                swatch.classList.add('selected');
            }
            swatch.addEventListener('mouseenter', () => {
                if (!swatch.classList.contains('selected')) {
                    swatch.style.transform = 'scale(1.2)';
                    swatch.style.borderColor = '#999';
                }
            });
            swatch.addEventListener('mouseleave', () => {
                if (!swatch.classList.contains('selected')) {
                    swatch.style.transform = 'scale(1)';
                    swatch.style.borderColor = '#ddd';
                }
            });
            swatch.addEventListener('click', (e) => {
                e.stopPropagation();
                paletteContainer.querySelectorAll('.color-swatch').forEach(s => {
                    s.classList.remove('selected');
                    s.style.borderColor = '#ddd';
                    s.style.transform = 'scale(1)';
                });
                swatch.classList.add('selected');
                swatch.style.borderColor = '#121111';
                swatch.style.transform = 'scale(1.15)';
                if (color.image) {
                    const img = card.querySelector('img');
                    if (img) {
                        if (!card.dataset.originalImage) {
                            card.dataset.originalImage = img.src;
                        }
                        applyColorOverlay(img, color.hex);
                    }
                }
                showToast(`Color: ${color.name}`);
            });
            paletteContainer.appendChild(swatch);
        });
        const addBtn = card.querySelector('.add-to-cart-btn, button');
        if (addBtn && addBtn.parentNode === card) {
            card.insertBefore(paletteContainer, addBtn);
        } else {
            const priceEl = card.querySelector('.price, [class*="price"]');
            if (priceEl) {
                priceEl.after(paletteContainer);
            } else {
                card.appendChild(paletteContainer);
            }
        }
    });
}

function applyColorOverlay(imgElement, hexColor) {
    imgElement.style.transition = 'filter 0.3s ease';
    const r = parseInt(hexColor.slice(1, 3), 16);
    const g = parseInt(hexColor.slice(3, 5), 16);
    const b = parseInt(hexColor.slice(5, 7), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    if (brightness < 80) {
        imgElement.style.filter = 'brightness(0.7) contrast(1.1)';
    } else if (brightness > 200) {
        imgElement.style.filter = 'brightness(1.1) saturate(0.9)';
    } else {
        imgElement.style.filter = `sepia(0.3) hue-rotate(${getHueRotation(r, g, b)}deg) saturate(1.2)`;
    }
}

function getHueRotation(r, g, b) {
    if (r > g && r > b) return 0;
    if (g > r && g > b) return 100;
    if (b > r && b > g) return 200;
    return 0;
}

function getSelectedColor(card) {
    const selectedSwatch = card.querySelector('.color-swatch.selected');
    return selectedSwatch ? selectedSwatch.dataset.color : 'Default';
}

function getSelectedColorHex(card) {
    const selectedSwatch = card.querySelector('.color-swatch.selected');
    return selectedSwatch ? selectedSwatch.dataset.hex : '#1a1a1a';
}


function addToCart(name, price, event) {
    let card = null;
    if (event && event.target) {
        card = event.target.closest('.product-card');
    }
    if (!card) {
        document.querySelectorAll('.product-card').forEach(c => {
            const h3 = c.querySelector('h3');
            if (h3 && h3.textContent.trim() === name) {
                card = c;
            }
        });
    }

    const color = card ? getSelectedColor(card) : 'Default';
    const colorHex = card ? getSelectedColorHex(card) : '#1a1a1a';

    const existing = cart.find(item => item.name === name && item.color === color);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ name, price, qty: 1, color, colorHex });
    }
    updateCartCount();
    updateCartTotal();
    renderCartItems();
    showToast(`${name} (${color}) added to cart!`);

    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartTotal();
    renderCartItems();
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count;
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const el = document.getElementById('cartTotal');
    if (el) el.textContent = total.toLocaleString();
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p class="cart-empty">Your cart is empty</p>';
        return;
    }

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item" style="display: flex; align-items: center; gap: 10px; padding: 12px; border-bottom: 1px solid #eee;">
            <div class="cart-item-color" style="
                width: 16px; height: 16px; border-radius: 50%; 
                background-color: ${item.colorHex}; 
                border: 2px solid #ddd; flex-shrink: 0;
            " title="${item.color}"></div>
            <div class="cart-item-details" style="flex: 1; min-width: 0;">
                <div class="cart-item-name" style="font-weight: 600; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${item.name}
                </div>
                <div style="font-size: 12px; color: #666;">
                    ${item.color} <span style="margin: 0 4px;">|</span> Qty: ${item.qty}
                </div>
            </div>
            <span class="cart-item-price" style="font-weight: 600; white-space: nowrap;">KSh ${(item.price * item.qty).toLocaleString()}</span>
            <button class="cart-item-remove" data-index="${index}" style="
                background: none; border: none; cursor: pointer; padding: 4px; color: #999;
            ">
                <i class="ti ti-x"></i>
            </button>
        </div>
    `).join('');

    container.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', () => {
            const idx = parseInt(btn.dataset.index);
            removeFromCart(idx);
        });
    });
}

function checkout() {
    if (cart.length === 0) {
        showToast('Your cart is empty');
        return;
    }
    openCheckoutModal();
}

let appliedDiscount = 0;

function openCheckoutModal() {
    const existing = document.getElementById('checkoutModal');
    if (existing) existing.remove();

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const shipping = subtotal > 5000 ? 0 : 300;
    const tax = Math.round(subtotal * 0.16);
    const total = subtotal + shipping + tax;

    const modal = document.createElement('div');
    modal.id = 'checkoutModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6); z-index: 2000;
        display: flex; align-items: center; justify-content: center;
        padding: 20px; backdrop-filter: blur(4px);
    `;
    const itemsHTML = cart.map(item => `
        <div style="display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
            <div style="width: 14px; height: 14px; border-radius: 50%; background: ${item.colorHex}; border: 1px solid #ccc;"></div>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 14px;">${item.name}</div>
                <div style="font-size: 12px; color: #666;">${item.color} x ${item.qty}</div>
            </div>
            <div style="font-weight: 600; font-size: 14px;">KSh ${(item.price * item.qty).toLocaleString()}</div>
        </div>
    `).join('');

    modal.innerHTML = `
        <div id="checkoutModalInner" style="
            background: #fff; border-radius: 16px; max-width: 900px; width: 100%;
            max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            display: grid; grid-template-columns: 1fr 1fr;
        ">
            <div style="padding: 32px; background: #f8f8f8; border-radius: 16px 0 0 16px;">
                <h2 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700;">Order Summary</h2>
                <div style="margin-bottom: 20px;">
                    ${itemsHTML}
                </div>
                <div id="checkoutTotals" style="border-top: 2px solid #ddd; padding-top: 16px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span>Subtotal</span><span>KSh ${subtotal.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span>Shipping ${shipping === 0 ? '<span style="color: #4ade80;">(Free)</span>' : ''}</span>
                        <span>KSh ${shipping.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
                        <span>Tax (16% VAT)</span><span>KSh ${tax.toLocaleString()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 2px solid #121111; font-size: 18px; font-weight: 700;">
                        <span>Total</span><span>KSh ${total.toLocaleString()}</span>
                    </div>
                </div>
                <div style="margin-top: 20px; padding: 12px; background: #fff; border-radius: 8px; border: 1px dashed #ccc;">
                    <div style="font-size: 12px; color: #666; margin-bottom: 4px;">Promo Code</div>
                    <div style="display: flex; gap: 8px;">
                        <input type="text" id="promoCodeInput" placeholder="Enter code" style="
                            flex: 1; padding: 8px 12px; border: 1px solid #ddd; border-radius: 6px; font-size: 14px;
                        ">
                        <button id="promoApplyBtn" style="
                            padding: 8px 16px; background: #121111; color: #fff; border: none;
                            border-radius: 6px; cursor: pointer; font-size: 14px; font-weight: 600;
                        ">Apply</button>
                    </div>
                    <div id="promoMessage" style="font-size: 12px; margin-top: 4px; min-height: 16px;"></div>
                </div>
            </div>

            <!-- RIGHT: Billing Form -->
            <div style="padding: 32px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0; font-size: 20px; font-weight: 700;">Billing Details</h2>
                    <button id="closeCheckoutBtn" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999; line-height: 1;">&times;</button>
                </div>

                <form id="checkoutForm">
                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</label>
                        <input type="text" name="fullName" required style="
                            width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
                            font-size: 14px; box-sizing: border-box;
                        " placeholder="First Name">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Email Address</label>
                        <input type="email" name="email" required style="
                            width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
                            font-size: 14px; box-sizing: border-box;
                        " placeholder="you@example.com">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Phone Number</label>
                        <input type="tel" name="phone" required style="
                            width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
                            font-size: 14px; box-sizing: border-box;
                        " placeholder="+254 712 345 678">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Shipping Address</label>
                        <input type="text" name="address" required style="
                            width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
                            font-size: 14px; box-sizing: border-box; margin-bottom: 8px;
                        " placeholder="Street address">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                            <input type="text" name="city" required placeholder="City" style="
                                width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
                                font-size: 14px; box-sizing: border-box;
                            ">
                            <input type="text" name="postalCode" placeholder="Postal Code" style="
                                width: 100%; padding: 10px 12px; border: 1px solid #ddd; border-radius: 8px;
                                font-size: 14px; box-sizing: border-box;
                            ">
                        </div>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="display: block; font-size: 12px; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.5px;">Payment Method</label>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <label class="payment-option" style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 2px solid #121111; border-radius: 8px; cursor: pointer; background: #fafafa;">
                                <input type="radio" name="payment" value="mpesa" checked style="accent-color: #121111;">
                                <span style="font-weight: 600; font-size: 14px;">M-Pesa</span>
                                <span style="margin-left: auto; font-size: 12px; color: #666;">Pay via M-Pesa</span>
                            </label>
                            <label class="payment-option" style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
                                <input type="radio" name="payment" value="card" style="accent-color: #121111;">
                                <span style="font-weight: 600; font-size: 14px;">Credit/Debit Card</span>
                                <span style="margin-left: auto; font-size: 12px; color: #666;">Visa / Mastercard</span>
                            </label>
                            <label class="payment-option" style="display: flex; align-items: center; gap: 10px; padding: 12px; border: 1px solid #ddd; border-radius: 8px; cursor: pointer;">
                                <input type="radio" name="payment" value="cod" style="accent-color: #121111;">
                                <span style="font-weight: 600; font-size: 14px;">Cash on Delivery</span>
                                <span style="margin-left: auto; font-size: 12px; color: #666;">Pay when you receive</span>
                            </label>
                        </div>
                    </div>

                    <button type="submit" id="checkoutSubmitBtn" style="
                        width: 100%; padding: 14px; background: #121111; color: #fff;
                        border: none; border-radius: 8px; font-size: 16px; font-weight: 700;
                        cursor: pointer; transition: all 0.2s;
                    ">
                        Complete Order - KSh ${total.toLocaleString()}
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';


    document.getElementById('closeCheckoutBtn').addEventListener('click', closeCheckoutModal);


    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeCheckoutModal();
    });

    document.getElementById('promoApplyBtn').addEventListener('click', applyPromoCode);

    document.querySelectorAll('.payment-option').forEach(label => {
        label.addEventListener('click', () => {
            document.querySelectorAll('.payment-option').forEach(l => {
                l.style.border = '1px solid #ddd';
                l.style.background = '#fff';
            });
            label.style.border = '2px solid #121111';
            label.style.background = '#fafafa';
        });
    });
    document.getElementById('checkoutForm').addEventListener('submit', processCheckout);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function applyPromoCode() {
    const input = document.getElementById('promoCodeInput');
    const message = document.getElementById('promoMessage');
    const code = input.value.trim().toUpperCase();

    const validCodes = {
        'FIRST15': 0.15,
        'EAST10': 0.10,
        'SAVE20': 0.20
    };

    if (validCodes[code]) {
        appliedDiscount = validCodes[code];
        message.innerHTML = '<span style="color: #4ade80;">Promo applied! ' + Math.round(appliedDiscount * 100) + '% off</span>';
        updateCheckoutTotals();
    } else {
        appliedDiscount = 0;
        message.innerHTML = '<span style="color: #e8521a;">Invalid promo code</span>';
        updateCheckoutTotals();
    }
}

function updateCheckoutTotals() {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Math.round(subtotal * appliedDiscount);
    const shipping = (subtotal - discount) > 5000 ? 0 : 300;
    const taxableAmount = subtotal - discount;
    const tax = Math.round(taxableAmount * 0.16);
    const total = taxableAmount + shipping + tax;

    const totalsContainer = document.getElementById('checkoutTotals');
    if (!totalsContainer) return;

    totalsContainer.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>Subtotal</span><span>KSh ${subtotal.toLocaleString()}</span>
        </div>
        ${appliedDiscount > 0 ? `
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px; color: #4ade80;">
            <span>Discount (${Math.round(appliedDiscount * 100)}%)</span><span>-KSh ${discount.toLocaleString()}</span>
        </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>Shipping ${shipping === 0 ? '<span style="color: #4ade80;">(Free)</span>' : ''}</span>
            <span>KSh ${shipping.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 14px;">
            <span>Tax (16% VAT)</span><span>KSh ${tax.toLocaleString()}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-top: 12px; padding-top: 12px; border-top: 2px solid #121111; font-size: 18px; font-weight: 700;">
            <span>Total</span><span>KSh ${total.toLocaleString()}</span>
        </div>
    `;

    const submitBtn = document.getElementById('checkoutSubmitBtn');
    if (submitBtn) submitBtn.textContent = `Complete Order - KSh ${total.toLocaleString()}`;
}

function processCheckout(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const discount = Math.round(subtotal * appliedDiscount);
    const shipping = (subtotal - discount) > 5000 ? 0 : 300;
    const tax = Math.round((subtotal - discount) * 0.16);
    const total = subtotal - discount + shipping + tax;

    const orderDetails = {
        customer: {
            name: formData.get('fullName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postalCode: formData.get('postalCode')
        },
        paymentMethod: formData.get('payment'),
        items: [...cart],
        billing: {
            subtotal,
            discount,
            shipping,
            tax,
            total
        }
    };
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Processing...';
    submitBtn.style.opacity = '0.7';

    setTimeout(() => {
        const orderNumber = 'ES-' + Date.now().toString().slice(-8);

        closeCheckoutModal();
        toggleCart();

        cart = [];
        appliedDiscount = 0;
        updateCartCount();
        updateCartTotal();
        renderCartItems();

        showToast(`Order #${orderNumber} placed! Total: KSh ${total.toLocaleString()}`);

        setTimeout(() => {
            showOrderConfirmation(orderDetails, orderNumber);
        }, 500);
    }, 1500);
}

function showOrderConfirmation(order, orderNumber) {
    const modal = document.createElement('div');
    modal.id = 'orderConfirmationModal';
    modal.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.6); z-index: 3000;
        display: flex; align-items: center; justify-content: center;
        padding: 20px;
    `;
    modal.innerHTML = `
        <div id="orderConfirmationInner" style="background: #fff; border-radius: 16px; max-width: 500px; width: 100%; padding: 40px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.25);">
            <div style="width: 60px; height: 60px; background: #4ade80; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 30px; color: #fff;">&#10003;</div>
            <h2 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 700;">Order Confirmed!</h2>
            <p style="color: #666; margin-bottom: 24px;">Thank you, ${order.customer.name}. Your order has been placed successfully.</p>
            <div style="background: #f8f8f8; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: left;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Order Number</span>
                    <span style="font-weight: 600;">#${orderNumber}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">Payment Method</span>
                    <span style="font-weight: 600; text-transform: uppercase;">${order.paymentMethod}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding-top: 12px; border-top: 1px solid #ddd; margin-top: 12px;">
                    <span style="font-weight: 700;">Total Paid</span>
                    <span style="font-weight: 700; font-size: 18px;">KSh ${order.billing.total.toLocaleString()}</span>
                </div>
            </div>
            <p style="font-size: 13px; color: #999; margin-bottom: 20px;">A confirmation email has been sent to ${order.customer.email}</p>
            <button id="continueShoppingBtn" style="
                padding: 12px 32px; background: #121111; color: #fff; border: none;
                border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer;
            ">Continue Shopping</button>
        </div>
    `;
    document.body.appendChild(modal);
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        modal.remove();
        document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
            document.body.style.overflow = '';
        }
    });
}


function copyPromoCode() {
    navigator.clipboard.writeText('FIRST15').then(()=>{
        const bar=document.querySelector('.announcement-bar');
        const original=bar.innerHTML;
        bar.innerHTML = 'Code <strong>FIRST15</strong> copied to clipboard!';
        setTimeout(() => {
            bar.innerHTML=original;
        },2000);
    });
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
}

function toggleWishlist(btn, productName) {
    btn.classList.toggle('active');
    if (btn.classList.contains('active')) {
        btn.querySelector('i').style.color = '#121111';
        if (!wishlist.includes(productName)) {
            wishlist.push(productName);
        }
        showToast('Added to wishlist');
    } else {
        btn.querySelector('i').style.color = '';
        wishlist = wishlist.filter(item => item !== productName);
        showToast('Removed from wishlist');
    }
}

function handleSearch() {
    const input = document.getElementById('searchInputNav');
    if (!input) return;
    const query = input.value.toLowerCase().trim();
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const category = card.dataset.category.toLowerCase();
        if (name.includes(query) || category.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    if (query.length > 0) {
        scrollToSection('shop');
    }
}

function setupSearch() {
    const input = document.getElementById('searchInputNav');
    if (!input) return;
    input.addEventListener('input', handleSearch);
    input.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            handleSearch();
            scrollToSection('shop');
        }
    });
}

function setupDropdowns() {
    const dropdowns = document.querySelectorAll('.nav-item.dropdown');
    dropdowns.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const menu = item.querySelector('.dropdown-menu');
            if (menu) menu.style.display = 'block';
        });
        item.addEventListener('mouseleave', () => {
            const menu = item.querySelector('.dropdown-menu');
            if (menu) menu.style.display = 'none';
        });
    });
}

function setupNavLinks() {
    const navLinks = document.querySelectorAll('.navbar-bottom .nav-item');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const category = link.textContent.trim().toLowerCase().split(' ')[0];
            if (['mens', 'womens', 'jeans', 'footwear', 'vintage', 'sale', 'brands'].includes(category)) {
                const map = {
                    'mens':     'men',
                    'womens':   'women',
                    'jeans':    'men',
                    'footwear': 'accessories',
                    'vintage':  'women',
                    'sale':     'all',
                    'brands':   'all',
                };
                filterProducts(map[category] || 'all');
                scrollToSection('shop');
            }
        });
    });
}

function copyCode() {
    navigator.clipboard.writeText('FIRST15').then(() => {
        const code = document.querySelector('.promo-code');
        const original = code.innerHTML;
        code.innerHTML = 'Copied!';
        code.style.color = '#4ade80';
        setTimeout(() => {
            code.innerHTML = original;
            code.style.color = '';
        }, 2000);
    });
}

function shopWomen() {
    filterProducts('women');
    scrollToSection('shop');
}

function shopMen() {
    filterProducts('men');
    scrollToSection('shop');
}

function setupBannerBtns() {
    const btns = document.querySelectorAll('.banner-btn-dark');
    if (btns[0]) btns[0].addEventListener('click', shopWomen);
    if (btns[1]) btns[1].addEventListener('click', shopMen);
}

function setupCategoryCards() {
    const cards = document.querySelectorAll('.category-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const category = card.querySelector('h3').textContent.toLowerCase();
            filterProducts(category);
            scrollToSection('shop');
        });
    });
}

function filterByCategory(category) {
    filterProducts(category);
    scrollToSection('shop');
}

function setupFilterBtns() {
    const btns = document.querySelectorAll('.filter-btn');
    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            btns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterProducts(btn.dataset.filter);
        });
    });
}

function filterProducts(filter) {
    const cards = document.querySelectorAll('.product-card');
    const btns = document.querySelectorAll('.filter-btn');

    btns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    cards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = 'block';
            card.style.animation = 'fadeIn 0.3s ease';
        } else {
            card.style.display = 'none';
        }
    });
}

function setupWishlistBtns() {
    const btns = document.querySelectorAll('.wishlist-btn');
    btns.forEach(btn => {
        const card = btn.closest('.product-card');
        const name = card ? card.querySelector('h3').textContent : 'Item';
        btn.addEventListener('click', () => toggleWishlist(btn, name));
    });
}

function subscribe() {
    const input = document.getElementById('emailInput');
    const email = input.value.trim();

    if (!email) {
        showToast('Please enter your email');
        return;
    }

    if (!validateEmail(email)) {
        showToast('Please enter a valid email');
        input.style.borderColor = '#e8521a';
        return;
    }
    input.style.borderColor = '#4ade80';
    input.value = '';
    showToast('Successfully subscribed!');

    setTimeout(() => {
        input.style.borderColor = '';
    }, 2000);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function smoothScroll(targetId) {
    scrollToSection(targetId);
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function showToast(message) {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}
document.addEventListener('DOMContentLoaded', () => {
    const video = document.querySelector('.hero-bg video');
    if (video) {
        video.muted = true;
        video.play().catch(err => {
            console.log('Autoplay blocked:', err);
        });
    }
});

document.addEventListener('touchstart', () => {
    const video = document.querySelector('.hero-bg video');
    if (video && video.paused) {
        video.play();
    }
}, { once: true });
