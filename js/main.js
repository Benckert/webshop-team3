import { getData } from "./utils.js";

const productSection = document.querySelector(".product-section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");

sortBy.value = "none";

let filterBy = "all";
let compare;
// let compare = () => NaN;

let allProducts;
let listOfProducts;
let cart = [];

async function loadProducts() {
  allProducts = await getData();
  mapProducts();
  displayProducts();
}

function mapProducts() {
  listOfProducts = allProducts.map(item => ({
    id: item.id,
    title: item.title,
    price: item.price,
    image: item.image,
    amount: 1
  }));
}

function displayProducts() {
  const productCards = allProducts
  .sort(compare)
  .filter(product => filterBy !== "all" ? product.category === filterBy : true)
  .map(product =>
    `
    <article id="item-${product.id}" class="product">
    <div class="product__img">
    <img src="${product.image}" alt="Product image">
    </div>
    <div class="product__content">
    <h2 class="product__title">${product.title}</h2>
    <div class="product__item-to-cart">
    <p class="product__price">$${product.price}</p>
    <p class="product__rating">${product.rating.rate} / 5</p>
    </div>
    <button id="cartBtn-${product.id}" class="product__add-to-cart">Add to cart</button>
    </div>
    </article>
    `)
  .join("");

  productSection.innerHTML = productCards;
}

function addToCart(index, productToAdd) {
  if (cart.includes(productToAdd)) {
    let cartIndex = cart.findIndex(item => item.id === index);
    cart[cartIndex].amount++;
    cart[cartIndex].price += cart[cartIndex].price;
  } else {
    cart.push(productToAdd);
  }
}

categoryUl.addEventListener("click", function (e) {
  if (e.target.tagName === "LI") {
    filterBy = e.target.textContent.toLowerCase();
    displayProducts();
  }
});

sortBy.addEventListener("change", function () {
  compare = sortBy.value === "highest" ? (a, b) => b.price - a.price
          : sortBy.value === "lowest" ? (a, b) => a.price - b.price
          : () => NaN;

displayProducts();
});

productSection.addEventListener("click", function (e) {
  if (e.target.tagName === "BUTTON") {
    const index = parseInt(e.target.id.slice(-1));
    const productToAdd = listOfProducts[index - 1];
    addToCart(index, productToAdd);
  }
  console.log("cart: ", cart)
});

loadProducts();
