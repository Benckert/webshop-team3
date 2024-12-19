import { getData } from "./utils.js";

const productSection = document.querySelector(".product-section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");

const shoppingCart = document.getElementById("shopping-cart");
const shoppingCartBtn = document.getElementById("shopping-cart-button");
const shoppingCartItems = document.getElementById("shopping-cart-items");

const shoppingCartQuantity = document.getElementById('items_number');
const checkoutBtn = document.querySelector('.checkout_btn');
const boughtSection = document.querySelector('.bought_section');
const backToWebshop = document.querySelector('.back_btn');

sortBy.value = "none";

let filterBy = "all";
let compare;

let allProducts;
let cart = [];

function loadLocalStorage() {
  const savedCart = localStorage.getItem("shoppingCart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
    renderShoppingCart();
    shoppingCartQuantity.textContent = cart.reduce((sum, product) => sum + product.quantity, 0);
  }
}

function saveLocalStorage() {
  localStorage.setItem("shoppingCart", JSON.stringify(cart));
}

async function loadProducts() {
  allProducts = await getData();
  if (allProducts) {
    renderProducts();
  }
}

function renderProducts() {
  const productsHTML = allProducts
    .sort(compare)
    .filter(product => filterBy !== "all" ? product.category === filterBy : true)
    .map(product =>
      `
    <article id="item-${product.id}" class="product">
      <div class="product__img-container">
        <img class="product__img" src="${product.image}" alt="Product image">
      </div>
      <div class="product__content">
        <h2 class="product__title">${product.title}</h2>
        <div class="product__item-to-cart">
          <p>$${product.price}</p>
          <p>${product.rating.rate} / 5</p>
        </div>
      <button id="cartBtn-${product.id}" class="product__add-to-cart hidden"><p>Add</p><img src="img/shopping-bag-add-svgrepo-com.svg" alt=""></button>
      </div>
    </article>
    `)
    .join("");

  productSection.innerHTML = productsHTML;

  const productCard = document.querySelectorAll('.product');

  productCard.forEach(card => {
    const productBtn = card.querySelector('.product__add-to-cart');
    card.addEventListener('mouseover', function () {
      productBtn.classList.remove('hidden')
    })
    card.addEventListener('mouseout', function () {
      productBtn.classList.add('hidden')
    })
  });
}

function renderShoppingCart() {
  let cartHTML = cart
    .sort((a, b) => a.id - b.id)
    .map(product =>
      `
    <article class="shopping-cart__product">
      <div class="shopping-cart__img-container">
        <img class="shopping-cart__img" src="${product.image}" alt="Product image">
      </div>
      
        <div class="shopping-cart__info">
          <h2 class="shopping-cart__title">${product.title}</h2>
        </div>
        <div class="shopping-cart__right">
          <p class="shopping-cart__price">$${(product.price * product.quantity).toFixed(2)}</p>
          <div class="shopping-cart__add" data-id="${product.id}">
            <p id="minus">-</p><p>${product.quantity}</p><p id="plus">+</p>
          </div>
        </div>
    </article>
    `)
    .join("");

  shoppingCartItems.innerHTML = cartHTML;

  const totalSum = document.querySelector('.total_sum');
  const sum = cart.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  totalSum.textContent = Number(sum).toFixed(2);

  const updateProduct = document.querySelectorAll('.shopping-cart__add');
  updateBasket(updateProduct)
}

function showShoppingCart() {
  document.querySelector(".shopping_cart_section").style.display = "flex";
  shoppingCart.style.display = "flex";
}

function hideShoppingCart() {
  document.querySelector(".shopping_cart_section").style.display = "none";
  shoppingCart.style.display = "none";
}

categoryUl.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    filterBy = e.target.textContent.toLowerCase();
    renderProducts();
  }
});

sortBy.addEventListener("change", function () {
  compare = sortBy.value === "lowest-price" ? (a, b) => a.price - b.price
          : sortBy.value === "highest-price" ? (a, b) => b.price - a.price
          : sortBy.value === "lowest-rating" ? (a, b) => a.rating.rate - b.rating.rate
          : sortBy.value === "highest-rating" ? (a, b) => b.rating.rate - a.rating.rate
          : (a, b) => a.id - b.id

  renderProducts();

  gtag('event', 'change_sortBy', {
    'event_category': 'sort products',
    'event_label': 'changes sorting of products',
    'value': 1,
    'debug_mode': true
  });
});

productSection.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const index = parseInt(e.target.id.slice(8));
    const productToAdd = allProducts[index - 1];

    const productData = cart.find(product => product.id === Number(index));

    if (productData) {
      productToAdd.quantity++;
    } else {
      productToAdd.quantity = 1;
      cart.push(productToAdd);
    }
    shoppingCartQuantity.textContent = cart.reduce((sum, product) => sum + product.quantity, 0);
    renderShoppingCart()
    saveLocalStorage();

    // gtag('event', 'add_to_cart', {
    //   'event_category': 'add to cart',
    //   'event_label': 'add product to cart',
    //   'value': 1,
    //   'debug_mode': true
    // });
    gtag('event', 'change_sortBy', {
      'event_category': 'sort products',
      'event_label': 'changes sorting of products',
      'value': 1,
      'debug_mode': true
    });
  }
});

function updateBasket(updateProduct) {
  updateProduct.forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (e.target.textContent == "+") {
        const productId = btn.getAttribute('data-id');
        const productData = cart.find(product => product.id === Number(productId));
        productData.quantity++;
        shoppingCartQuantity.textContent = cart.reduce((sum, product) => sum + product.quantity, 0);
        renderShoppingCart()
        saveLocalStorage();
      }
      if (e.target.textContent == "-") {
        const productId = btn.getAttribute('data-id');
        const productData = cart.find(product => product.id === Number(productId));
        productData.quantity--;
        shoppingCartQuantity.textContent = cart.reduce((sum, product) => sum + product.quantity, 0);
        if (productData.quantity === 0) {
          cart.splice(cart.indexOf(productData), 1)
        }
        renderShoppingCart()
        saveLocalStorage();
      }
    })
  });
}

shoppingCartBtn.addEventListener("click", function () {
  if (cart.length > 0) {
    showShoppingCart();

    gtag('event', 'show_cart', {
      'event_category': 'show cart',
      'event_label': 'view shopping cart',
      'value': 1,
      'debug_mode': true
    });
  }
});

shoppingCart.addEventListener("click", function (e) {
  if (e.target.id === "close-cart") {
    hideShoppingCart();
  }
});

checkoutBtn.addEventListener('click', function () {
  shoppingCart.style.display = "none";
  boughtSection.style.display = "flex";
  document.querySelector(".shopping_cart_section").style.display = "none";
  cart = [];
  shoppingCartQuantity.textContent = 0;

  renderShoppingCart();
  saveLocalStorage();

  console.log(cart)

  gtag('event', 'checkout', {
    'event_category': 'purchase',
    'event_label': 'purschase products',
    'value': 1,
    'debug_mode': true
  });
})

backToWebshop.addEventListener('click', function () {
  boughtSection.style.display = "none";
})

loadLocalStorage();
loadProducts();
