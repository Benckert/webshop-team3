import { getData } from "./utils.js";

const productSection = document.querySelector(".product-section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");

const shoppingCart = document.getElementById("shopping-cart");
const shoppingCartBtn = document.getElementById("shopping-cart-button");
const shoppingCartOverlay = document.getElementById("overlay");

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
  renderProducts();
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
  console.log("typeOf allProducts", typeof allProducts)
  console.log("allProducts: ", allProducts)
  const productsHTML = allProducts
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

  productSection.innerHTML = productsHTML;
}

function renderShoppingCart() {
  console.log("renderShoppinCart")
  let cartHTML;

  cart.sort((a, b) => a.id - b.id);
  console.log("typeOf cart ", typeof cart)
  console.log("cart: ", cart)

  cart.forEach(item => {
    console.log("typeOf item", typeof item)
    cartHTML = item
    .map(product =>
      `
      <article>
        <div>
          <img src="${product.image}" alt="Product image">
        </div>
        <div>
          <h2>${product.title}<h2>
          <p>${product.price}</p>
        </div>
      </article>
      `);

    console.log(cartHTML)
  });

  // cartHTML.join("");
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
    const index = parseInt(e.target.id.slice(-1));
    const productToAdd = listOfProducts[index - 1];
    // console.log(productToAdd)

    cart.push(productToAdd);
  }
  // console.log("cart: ", cart)
});

shoppingCartBtn.addEventListener("click", function () {
  renderShoppingCart();
  shoppingCartOverlay.style.display = "block";
});

shoppingCartOverlay.addEventListener("click", function (e) {
  console.log(e)
})

loadProducts();
