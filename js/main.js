import { getData } from "./utils.js";

const productSection = document.querySelector(".product-section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");

const shoppingCart = document.getElementById("shopping-cart");
const shoppingCartBtn = document.getElementById("shopping-cart-button");


sortBy.value = "none";

let filterBy = "all";
let compare;
// let compare = () => NaN;

let allProducts;
let listOfProducts;
let cart = [];

async function loadProducts() {
  allProducts = await getData();
  if (allProducts) {
    mapProducts();
    renderProducts();
  }
}

function mapProducts() {
  listOfProducts = allProducts.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image
  }));
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
      <button id="cartBtn-${product.id}" class="product__add-to-cart">Add to cart</button>
      </div>
    </article>
    `)
  .join("");

  productSection.innerHTML = productsHTML;
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
        <p class="shopping-cart__price">$${product.price}</p>
      </div>
    </article>
    `)
  .join("");

  shoppingCart.innerHTML = cartHTML;
}

categoryUl.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    filterBy = e.target.textContent.toLowerCase();
    renderProducts();
  }
});

sortBy.addEventListener("change", function () {
  compare = sortBy.value === "highest" ? (a, b) => b.price - a.price
          : sortBy.value === "lowest" ? (a, b) => a.price - b.price
          : () => NaN;

  renderProducts();
});

productSection.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const index = parseInt(e.target.id.slice(8));
    const productToAdd = listOfProducts[index - 1];

    cart.push(productToAdd);
  }
});

shoppingCartBtn.addEventListener("click", function () {
  if (cart.length > 0) {
    renderShoppingCart();
    document.getElementById("header").style.filter = "blur(5px)";
    document.getElementById("main").style.filter = "blur(5px)";
    shoppingCart.style.display = "block";
  }
});

shoppingCart.addEventListener("click", function (e) {
  console.log(e)
})

loadProducts();
