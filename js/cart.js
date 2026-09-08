// DOM Elements
let listProductHTML = document.querySelector('.listProduct');
let listCartHTML = document.querySelector('.listCart');
let iconCart = document.querySelector('.icon-cart');
let iconCartSpan = document.querySelector('.icon-cart span');
let body = document.querySelector('body');
let closeBtn = document.querySelector('.close');
let checkOutBtn = document.querySelector('.checkOut');
let products = [];
let cart = [];

// Initialize product data manually since you're not using a JSON file
// This matches the products in your HTML
products = [
    {
        id: 1,
        name: "Tshirt Fitness Planet",
        price: 499,
        image: "Shop/Tshirt Fitness Planet.PNG"
    },
    {
        id: 2,
        name: "Treadmill",
        price: 36999,
        image: "Shop/Treadmill.webp"
    },
    {
        id: 3,
        name: "Dumbbells",
        price: 799,
        image: "Shop/Dumbbells.webp"
    },
    {
        id: 4,
        name: "Perplexity Cap",
        price: 2199,
        image: "Shop/Perplexity cap.avif"
    },
    {
        id: 5,
        name: "Track Pant",
        price: 1199,
        image: "Shop/Trackpants.webp"
    },
    {
        id: 6,
        name: "GYM Shorts",
        price: 799,
        image: "Shop/shorts.avif"
    },
    {
        id: 7,
        name: "Exercise Bike",
        price: 35999,
        image: "Shop/cycle.avif"
    },
    {
        id: 8,
        name: "Skipping Rope",
        price: 799,
        image: "Shop/rope.avif"
    }
];

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const cartIcon = document.querySelector(".icon-cart");
    const cartTab = document.querySelector(".cartTab");
    const closeBtn = document.querySelector(".close");

    // Show cart when clicking cart icon
    cartIcon.addEventListener("click", () => {
        cartTab.classList.add("active");
    });

    // Hide cart when clicking close button
    closeBtn.addEventListener("click", () => {
        cartTab.classList.remove("active");
    });
});


// Event Listeners
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

closeBtn.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

checkOutBtn.addEventListener('click', () => {
    if(cart.length > 0) {
        alert('Thank you for your purchase!');
        cart = [];
        addCartToHTML();
        addCartToMemory();
    } else {
        alert('Your cart is empty. Add some products first!');
    }
});

// Add product data to HTML
const addDataToHTML = () => {
    // Clear existing content
    listProductHTML.innerHTML = '';
    
    // Add each product to the page
    if(products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            newProduct.dataset.id = product.id;
            newProduct.classList.add('item');
            newProduct.innerHTML = 
            `<img src="${product.image}" alt="${product.name}" class="pictur">
            <h2>${product.name}</h2>
            <div class="price">₹${product.price}</div>
            <button class="addCart">Add to Cart</button>`;
            listProductHTML.appendChild(newProduct);
        });
    }
}

// Event Listener for Add to Cart buttons
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCart')){
        let product_id = positionClick.parentElement.dataset.id;
        addToCart(product_id);
    }
});

// Add Product to Cart
const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    
    if(cart.length <= 0){
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if(positionThisProductInCart < 0){
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else{
        cart[positionThisProductInCart].quantity = cart[positionThisProductInCart].quantity + 1;
    }
    
    addCartToHTML();
    addCartToMemory();
}

// Save Cart to Local Storage
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Render Cart Items to HTML
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalPrice = 0;
    
    if(cart.length > 0){
        cart.forEach(item => {
            totalQuantity += item.quantity;
            let positionProduct = products.findIndex((value) => value.id == item.product_id);
            if(positionProduct !== -1){
                let info = products[positionProduct];
                let newItem = document.createElement('div');
                newItem.classList.add('item');
                newItem.dataset.id = item.product_id;
                
                // Calculate item total price
                let itemPrice = info.price * item.quantity;
                totalPrice += itemPrice;
                
                newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="${info.name}">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">₹${itemPrice.toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
                `;
                listCartHTML.appendChild(newItem);
            }
        });
        
        // Add total section
        let totalElement = document.createElement('div');
        totalElement.classList.add('total');
        totalElement.innerHTML = `
        <div class="total-text">Total:</div>
        <div class="total-price">₹${totalPrice.toFixed(2)}</div>
        `;
        listCartHTML.appendChild(totalElement);
    } else {
        listCartHTML.innerHTML = '<div class="empty-cart">Your cart is empty</div>';
    }
    
    iconCartSpan.innerText = totalQuantity;
}

// Event Listener for Cart Item Quantity Changes
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus') || positionClick.classList.contains('plus')){
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

// Change Cart Item Quantity
const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                cart[positionItemInCart].quantity += 1;
                break;
            
            case 'minus':
                let changeQuantity = cart[positionItemInCart].quantity - 1;
                if (changeQuantity > 0) {
                    cart[positionItemInCart].quantity = changeQuantity;
                } else {
                    cart.splice(positionItemInCart, 1);
                }
                break;
        }
    }
    addCartToHTML();
    addCartToMemory();
}

// Initialize the app
const initApp = () => {
    // Get cart data from memory
    if(localStorage.getItem('cart')){
        cart = JSON.parse(localStorage.getItem('cart'));
    }
    
    // Update product IDs to match the dataset
    let productItems = document.querySelectorAll('.listProduct .item');
    productItems.forEach((item, index) => {
        item.dataset.id = products[index].id;
    });
    
    addCartToHTML();
}

// Start the application
initApp();


/* Add this to your JavaScript to create a staggered loading effect */
document.addEventListener('DOMContentLoaded', function() {
    const items = document.querySelectorAll('.item');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
    });
});