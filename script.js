let cart = [];
let products = [
    { name: "Laptop", price: 999.99 },
    { name: "Smartphone", price: 499.99 },
    { name: "Headphones", price: 79.99 },
    { name: "Smartwatch", price: 199.99 },
    { name: "Tablet", price: 299.99 }
];

// Function to display products
function displayProducts(productArray) {
    const productContainer = document.getElementById("product-list");
    productContainer.innerHTML = "";

    if (productArray.length === 0) {
        productContainer.innerHTML = "<p>No products found</p>";
        return;
    }

    productArray.forEach(product => {
        let productItem = document.createElement("p");
        productItem.textContent = `${product.name} - $${product.price}`;
        productContainer.appendChild(productItem);
    });
}

function addToCart(productName, price) {
    let product = cart.find(item => item.name === productName);
    if (product) {
        product.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    updateCartDisplay();
}

function updateCartDisplay() {
    let cartContainer = document.getElementById("cart");
    if (!cartContainer) return;
    cartContainer.innerHTML = "<h2>Shopping Cart</h2>";
    
    if (cart.length === 0) {
        cartContainer.innerHTML += "<p>Your cart is empty.</p>";
        return;
    }
    
    cart.forEach(item => {
        cartContainer.innerHTML += `<p>${item.name} - $${item.price} x ${item.quantity}</p>`;
    });
    cartContainer.innerHTML += `<p><strong>Total: $${calculateTotal()}</strong></p>`;
}

function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
}

document.addEventListener("DOMContentLoaded", () => {
    updateCartDisplay();
});

// Form Submission Handling for Contact Page
document.addEventListener("DOMContentLoaded", () => {
    const contactForm = document.querySelector("form");
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            alert("Thank you for contacting us! We will get back to you soon.");
            contactForm.reset();
        });
    }
});

// Search Functionality
/*document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");
    const productContainer = document.getElementById("product-list");
    
    if (searchInput && productContainer) {
        searchInput.addEventListener("input", () => {
            let query = searchInput.value.toLowerCase();
            let filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(query)
            );
            
            productContainer.innerHTML = "";
            
            if (filteredProducts.length === 0) {
                productContainer.innerHTML = "<p>No products found</p>";
            } else {
                filteredProducts.forEach(product => {
                    productContainer.innerHTML += `<p>${product.name} - $${product.price}</p>`;
                });
            }
        });
    }
});

*/

// Search Functionality
document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("search");

    // Display all products initially
    displayProducts(products);

    searchInput.addEventListener("input", () => {
        let query = searchInput.value.toLowerCase();
        let filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );

        displayProducts(filteredProducts);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const categoryFilter = document.getElementById("category");
    const sortFilter = document.getElementById("sort");
    const searchBar = document.getElementById("search-bar");
    const products = document.querySelectorAll(".product");

    function filterProducts() {
        const selectedCategory = categoryFilter.value.toLowerCase();
        const searchQuery = searchBar.value.toLowerCase();

        products.forEach(product => {
            const productCategory = product.getAttribute("data-category").toLowerCase();
            const productName = product.querySelector("h3").textContent.toLowerCase();

            if (
                (selectedCategory === "all" || selectedCategory === productCategory) &&
                (searchQuery === "" || productName.includes(searchQuery))
            ) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    }

    function sortProducts() {
        const sortValue = sortFilter.value;
        const productList = document.querySelector(".product-list");
        const productArray = Array.from(products);

        productArray.sort((a, b) => {
            const priceA = parseFloat(a.getAttribute("data-price"));
            const priceB = parseFloat(b.getAttribute("data-price"));
            return sortValue === "price-low" ? priceA - priceB : priceB - priceA;
        });

        productList.innerHTML = "";
        productArray.forEach(product => productList.appendChild(product));
    }

    categoryFilter.addEventListener("change", filterProducts);
    sortFilter.addEventListener("change", sortProducts);
    searchBar.addEventListener("keyup", filterProducts);
});

document.addEventListener("DOMContentLoaded", function () {
    const wishlistBtns = document.querySelectorAll(".wishlist-btn");
    const wishlistContainer = document.querySelector(".wishlist-list");
    const emptyWishlistMessage = document.getElementById("empty-wishlist");

    function getWishlist() {
        return JSON.parse(localStorage.getItem("wishlist")) || [];
    }

    function saveWishlist(wishlist) {
        localStorage.setItem("wishlist", JSON.stringify(wishlist));
    }

    function addToWishlist(product) {
        let wishlist = getWishlist();
        if (!wishlist.some(item => item.id === product.id)) {
            wishlist.push(product);
            saveWishlist(wishlist);
            alert(`${product.name} added to wishlist!`);
        } else {
            alert(`${product.name} is already in your wishlist.`);
        }
    }

    function loadWishlist() {
        if (!wishlistContainer) return;

        let wishlist = getWishlist();
        wishlistContainer.innerHTML = "";

        if (wishlist.length === 0) {
            emptyWishlistMessage.style.display = "block";
        } else {
            emptyWishlistMessage.style.display = "none";
        }

        wishlist.forEach(product => {
            const wishlistItem = document.createElement("div");
            wishlistItem.classList.add("wishlist-item");
            wishlistItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: $${product.price}</p>
                <button class="remove-wishlist-btn" data-id="${product.id}">Remove ❌</button>
            `;
            wishlistContainer.appendChild(wishlistItem);
        });

        document.querySelectorAll(".remove-wishlist-btn").forEach(button => {
            button.addEventListener("click", function () {
                removeFromWishlist(this.getAttribute("data-id"));
            });
        });
    }

    function removeFromWishlist(productId) {
        let wishlist = getWishlist();
        wishlist = wishlist.filter(product => product.id !== productId);
        saveWishlist(wishlist);
        loadWishlist();
    }

    wishlistBtns.forEach(button => {
        button.addEventListener("click", function () {
            const productElement = this.closest(".product");
            const product = {
                id: productElement.getAttribute("data-id"),
                name: productElement.querySelector("h3").textContent,
                price: productElement.querySelector("p").textContent.replace("Price: $", ""),
                image: productElement.querySelector("img").src
            };
            addToWishlist(product);
        });
    });

    loadWishlist();
});

