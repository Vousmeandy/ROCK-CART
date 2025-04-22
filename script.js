let cart = [];

function addToCart(name, price, size, color) {
    const existingItem = cart.find(item => 
        item.name === name && item.size === size && item.color === color
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            size,
            color,
            quantity: 1
        });
    }

    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function updateQuantity(index, newQuantity) {
    if (index < 0 || index >= cart.length) return; 
    if (newQuantity < 1) {
        removeFromCart(index);
        return;
    }
    
    cart[index].quantity = newQuantity;
    updateCart();
}

function updateCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const orderSummaryElement = document.getElementById('order-summary');
    const cartTotalElement = document.getElementById('cart-total');
    
    cartItemsElement.innerHTML = '';
    orderSummaryElement.innerHTML = '';
    
    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="empty-message">Your cart is empty</p>';
        orderSummaryElement.innerHTML = '<p class="empty-message">No items</p>';
        cartTotalElement.textContent = '$0';
        
        document.querySelector('.checkout-btn').disabled = true;
        return;
    }
    
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        

        const itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        
        itemElement.innerHTML = `
            <div class="item-info">
                <h4>${item.name}</h4>
                <div class="item-details">${item.size} | ${item.color}</div>
            </div>
            <div class="item-actions">
                <div class="quantity-control">
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        cartItemsElement.appendChild(itemElement);
        

        const orderItemElement = document.createElement('div');
        orderItemElement.className = 'order-item';
        orderItemElement.innerHTML = `
            <span>${item.name} (${item.quantity}x)</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        `;
        
        orderSummaryElement.appendChild(orderItemElement);
    });
    
    cartTotalElement.textContent = `$${total.toFixed(2)}`;
    

    document.querySelector('.checkout-btn').disabled = false;
}


function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    

    if (modalId === 'confirmation-modal') {
        cart = [];
        updateCart();
    }
}


document.getElementById('payment-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const cardNumber = document.getElementById('card-number').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiry-date').value;
    const cvv = document.getElementById('cvv').value;
    
    if (!/^\d{16}$/.test(cardNumber)) {
        alert('Please enter a valid 16-digit card number');
        return;
    }
    
    if (!/^\d{3,4}$/.test(cvv)) {
        alert('Please enter a valid CVV (3 or 4 digits)');
        return;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return;
    }
    

    closeModal('payment-modal');
    openModal('address-modal');
});


document.getElementById('address-form').addEventListener('submit', function(e) {
    e.preventDefault();
    

    const requiredFields = ['street', 'city', 'state', 'zip', 'country'];
    for (const field of requiredFields) {
        if (!document.getElementById(field).value) {
            alert(`Please fill in the ${field} field`);
            return;
        }
    }
    

    showOrderConfirmation();
    closeModal('address-modal');
});

function showOrderConfirmation() {
    const finalSummary = document.getElementById('final-order-summary');
    finalSummary.innerHTML = '';
    
    let total = 0;
    

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'order-item';
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        itemElement.innerHTML = `
            <span>${item.name} (${item.quantity}x)</span>
            <span>$${itemTotal.toFixed(2)}</span>
        `;
        finalSummary.appendChild(itemElement);
    });
    

    const totalElement = document.createElement('div');
    totalElement.className = 'order-item total';
    totalElement.innerHTML = `
        <span><strong>Total</strong></span>
        <span><strong>$${total.toFixed(2)}</strong></span>
    `;
    finalSummary.appendChild(totalElement);
    
    openModal('confirmation-modal');
}


document.querySelector('.checkout-btn').addEventListener('click', function() {
    if (cart.length > 0) {
        openModal('payment-modal');
    }
});


updateCart();


document.getElementById('card-number').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    e.target.value = value;
});

document.getElementById('expiry-date').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
        value = value.substring(0, 2) + '/' + value.substring(2);
    }
    e.target.value = value;
});
