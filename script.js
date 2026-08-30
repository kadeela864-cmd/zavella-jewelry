/* =========================================================
   ZAVELLA - MAIN JAVASCRIPT
   ========================================================= */

const WHATSAPP_NUMBER = "923237958455";
const CART_KEY = "zavellaCart";
const WISHLIST_KEY = "zavellaWishlist";


/* =========================================================
   CART FUNCTIONS
   ========================================================= */

function getCart() {

    try {

        const cart =
            JSON.parse(localStorage.getItem(CART_KEY));

        return Array.isArray(cart) ? cart : [];

    } catch (error) {

        return [];

    }

}


function saveCart(cart) {

    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );

    updateCartCount();

}


function formatPrice(price) {

    return "Rs. " +
        Number(price).toLocaleString("en-PK");

}


/* =========================================================
   UPDATE CART COUNT
   ========================================================= */

function updateCartCount() {

    const cart = getCart();

    const totalQuantity = cart.reduce(
        (total, item) =>
            total + Number(item.quantity || 1),
        0
    );


    document
        .querySelectorAll(".cart-count")
        .forEach(element => {

            element.textContent =
                totalQuantity;

        });

}


/* =========================================================
   ADD PRODUCT TO CART
   ========================================================= */

function addToCart(product) {

    const cart = getCart();


    const existingProduct =
        cart.find(
            item =>
                item.id === product.id
        );


    if (existingProduct) {

        existingProduct.quantity =
            Number(existingProduct.quantity || 1) + 1;

    } else {

        cart.push({

            id: String(product.id),

            name: product.name,

            price: Number(product.price),

            image: product.image,

            category:
                product.category || "Jewellery",

            quantity: 1

        });

    }


    saveCart(cart);


    showToast(
        product.name +
        " added to your bag."
    );

}


/* =========================================================
   PRODUCT BUTTONS
   ========================================================= */

function initializeAddToCartButtons() {

    document
        .querySelectorAll(".add-cart")
        .forEach(button => {

            button.addEventListener(
                "click",
                function(event) {

                    event.preventDefault();


                    const product = {

                        id:
                            this.dataset.productId,

                        name:
                            this.dataset.productName,

                        price:
                            Number(
                                this.dataset.productPrice
                            ),

                        image:
                            this.dataset.productImage,

                        category:
                            this.dataset.productCategory ||
                            "Jewellery"

                    };


                    addToCart(product);

                }
            );

        });

}


/* =========================================================
   SELECT PRODUCT
   ========================================================= */

function selectProduct(
    id,
    name,
    price,
    image,
    category
) {

    addToCart({

        id: id,

        name: name,

        price: price,

        image: image,

        category:
            category || "Jewellery"

    });

}


/* =========================================================
   WISHLIST
   ========================================================= */

function getWishlist() {

    try {

        const wishlist =
            JSON.parse(
                localStorage.getItem(WISHLIST_KEY)
            );

        return Array.isArray(wishlist)
            ? wishlist
            : [];

    } catch (error) {

        return [];

    }

}


function saveWishlist(wishlist) {

    localStorage.setItem(
        WISHLIST_KEY,
        JSON.stringify(wishlist)
    );

}


function toggleWishlist(
    id,
    name,
    price,
    image,
    category
) {

    const wishlist =
        getWishlist();


    const existingIndex =
        wishlist.findIndex(
            item => item.id === id
        );


    if (existingIndex !== -1) {

        wishlist.splice(
            existingIndex,
            1
        );

        saveWishlist(wishlist);

        showToast(
            name +
            " removed from wishlist."
        );

        updateWishlistButtons();

        return;

    }


    wishlist.push({

        id: String(id),

        name: name,

        price: Number(price),

        image: image,

        category:
            category || "Jewellery"

    });


    saveWishlist(wishlist);


    showToast(
        name +
        " added to wishlist."
    );


    updateWishlistButtons();

}


function updateWishlistButtons() {

    const wishlist =
        getWishlist();


    document
        .querySelectorAll(".product-wishlist")
        .forEach(button => {

            const onclickText =
                button.getAttribute("onclick") || "";


            const match =
                onclickText.match(
                    /toggleWishlist\(['"]([^'"]+)/
                );


            if (!match) {
                return;
            }


            const productId =
                match[1];


            const exists =
                wishlist.some(
                    item =>
                        item.id === productId
                );


            button.classList.toggle(
                "active",
                exists
            );


            button.innerHTML =
                exists ? "♥" : "♡";

        });

}


/* =========================================================
   SEARCH
   ========================================================= */

function initializeSearch() {

    const searchInputs =
        document.querySelectorAll(
            'input[type="search"]'
        );


    searchInputs.forEach(input => {

        input.addEventListener(
            "input",
            function() {

                const searchTerm =
                    this.value
                        .trim()
                        .toLowerCase();


                const products =
                    document.querySelectorAll(
                        ".product-card"
                    );


                products.forEach(product => {

                    const name =
                        (
                            product.dataset.name ||
                            product
                                .querySelector(
                                    ".product-name"
                                )
                                ?.textContent ||
                            ""
                        )
                            .toLowerCase();


                    const category =
                        product
                            .querySelector(
                                ".product-category"
                            )
                            ?.textContent
                            .toLowerCase() ||
                            "";


                    const matches =
                        name.includes(searchTerm) ||
                        category.includes(searchTerm);


                    product.style.display =
                        matches
                            ? ""
                            : "none";

                });

            }
        );

    });

}


/* =========================================================
   SORT PRODUCTS
   ========================================================= */

function sortProducts(sortType) {

    const grid =
        document.querySelector(
            ".product-grid"
        );


    if (!grid) {
        return;
    }


    const products =
        Array.from(
            grid.querySelectorAll(
                ".product-card"
            )
        );


    if (!sortType) {

        products.forEach(
            product =>
                grid.appendChild(product)
        );

        return;

    }


    products.sort(
        (a, b) => {

            const priceA =
                Number(
                    a.dataset.price || 0
                );

            const priceB =
                Number(
                    b.dataset.price || 0
                );


            const nameA =
                (
                    a.dataset.name || ""
                ).toLowerCase();


            const nameB =
                (
                    b.dataset.name || ""
                ).toLowerCase();


            if (sortType === "low-high") {

                return priceA - priceB;

            }


            if (sortType === "high-low") {

                return priceB - priceA;

            }


            if (sortType === "name") {

                return nameA.localeCompare(
                    nameB
                );

            }


            return 0;

        }
    );


    products.forEach(
        product =>
            grid.appendChild(product)
    );

}


/* =========================================================
   MOBILE MENU
   ========================================================= */

function initializeMobileMenu() {

    const menuButton =
        document.querySelector(
            ".mobile-menu-btn"
        );


    const nav =
        document.querySelector(
            ".main-nav"
        );


    if (!menuButton || !nav) {
        return;
    }


    menuButton.addEventListener(
        "click",
        function() {

            nav.classList.toggle(
                "mobile-open"
            );

        }
    );


    nav
        .querySelectorAll("a")
        .forEach(link => {

            link.addEventListener(
                "click",
                function() {

                    nav.classList.remove(
                        "mobile-open"
                    );

                }
            );

        });

}


/* =========================================================
   TOAST MESSAGE
   ========================================================= */

function showToast(message) {

    let toast =
        document.querySelector(".toast");


    if (!toast) {

        toast =
            document.createElement("div");

        toast.className = "toast";

        document.body.appendChild(
            toast
        );

    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.zavellaToastTimer
    );


    window.zavellaToastTimer =
        setTimeout(
            function() {

                toast.classList.remove(
                    "show"
                );

            },
            2500
        );

}


/* =========================================================
   NEWSLETTER
   ========================================================= */

function subscribeNewsletter(event) {

    event.preventDefault();


    const form =
        event.target;


    const emailInput =
        form.querySelector(
            'input[type="email"]'
        );


    if (
        !emailInput ||
        !emailInput.value.trim()
    ) {

        showToast(
            "Please enter your email."
        );

        return;

    }


    showToast(
        "Thank you for joining ZAVELLA."
    );


    form.reset();

}


/* =========================================================
   WHATSAPP QUICK CONTACT
   ========================================================= */

function openWhatsApp() {

    const url =
        "https://wa.me/" +
        WHATSAPP_NUMBER;


    window.open(
        url,
        "_blank"
    );

}


/* =========================================================
   SEND CART ORDER TO WHATSAPP
   ========================================================= */

function openWhatsAppOrder() {

    const cart =
        getCart();


    if (!cart.length) {

        showToast(
            "Your bag is empty."
        );

        return;

    }


    let subtotal = 0;

    let totalQuantity = 0;


    let message =
        "✨ *ZAVELLA JEWELLERY ORDER* ✨\n\n";


    message +=
        "Hello ZAVELLA! I would like to place an order.\n\n";


    cart.forEach(
        (item, index) => {

            const quantity =
                Number(
                    item.quantity || 1
                );


            const price =
                Number(
                    item.price || 0
                );


            const itemTotal =
                price * quantity;


            subtotal +=
                itemTotal;


            totalQuantity +=
                quantity;


            message +=
                `${index + 1}. ${item.name}\n`;

            message +=
                `Category: ${item.category || "Jewellery"}\n`;

            message +=
                `Price: ${formatPrice(price)}\n`;

            message +=
                `Quantity: ${quantity}\n`;

            message +=
                `Item Total: ${formatPrice(itemTotal)}\n\n`;

        }
    );


    const delivery =
        subtotal >= 15000
            ? 0
            : 250;


    const total =
        subtotal + delivery;


    message +=
        "------------------------------\n";


    message +=
        `Subtotal: ${formatPrice(subtotal)}\n`;


    message +=
        `Delivery: ${
            delivery === 0
                ? "FREE"
                : formatPrice(delivery)
        }\n`;


    message +=
        `TOTAL: ${formatPrice(total)}\n`;


    message +=
        `Total Items: ${totalQuantity}\n\n`;


    message +=
        "Please confirm my order and share the next steps. Thank you! 💎";


    const whatsappURL =
        "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" +
        encodeURIComponent(
            message
        );


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================================================
   CART PAGE SUPPORT
   ========================================================= */

function changeQuantity(index, change) {

    const cart =
        getCart();


    if (!cart[index]) {
        return;
    }


    const currentQuantity =
        Number(
            cart[index].quantity || 1
        );


    cart[index].quantity =
        currentQuantity + change;


    if (
        cart[index].quantity <= 0
    ) {

        cart.splice(
            index,
            1
        );

    }


    saveCart(cart);


    if (
        typeof renderCart === "function"
    ) {

        renderCart();

    }

}


function removeCartItem(index) {

    const cart =
        getCart();


    if (!cart[index]) {
        return;
    }


    const removedItem =
        cart[index];


    cart.splice(
        index,
        1
    );


    saveCart(cart);


    if (
        typeof renderCart === "function"
    ) {

        renderCart();

    }


    showToast(
        removedItem.name +
        " removed from your bag."
    );

}


/* =========================================================
   CLOSE DROPDOWNS WHEN CLICKING OUTSIDE
   ========================================================= */

document.addEventListener(
    "click",
    function(event) {

        if (
            !event.target.closest(
                ".mobile-menu-btn"
            ) &&
            !event.target.closest(
                ".main-nav"
            )
        ) {

            const nav =
                document.querySelector(
                    ".main-nav"
                );


            if (nav) {

                nav.classList.remove(
                    "mobile-open"
                );

            }

        }

    }
);


/* =========================================================
   INITIALIZE WEBSITE
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateCartCount();

        initializeAddToCartButtons();

        initializeSearch();

        initializeMobileMenu();

        updateWishlistButtons();

    }
);