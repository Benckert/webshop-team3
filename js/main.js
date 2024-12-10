import { getData } from "./utils.js";

const productSection = document.querySelector(".product-section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");

sortBy.value = "none";

let filterBy = "all";
let compare;
// let compare = () => NaN;

let allProducts;

const loadProducts = async () => {
  allProducts = await getData();
  displayProducts();
  addListeners();
}

// const displayProducts = async () => {
const displayProducts = () => {
  // const allProducts = await getData();

  const productList = allProducts
  .sort(compare)
  .filter(product => filterBy !== "all" ? product.category === filterBy : true)
  .map(product =>
    `
    <article class="product">
    <div class="product__img">
        <img src="${product.image}" alt="Product image">
      </div>
      <div class="product__content">
        <h2 class="product__title">${product.title}</h2>
        <div class="product__item-to-cart">
          <p class="product__price">$${product.price}</p>
          <div id="item-${product.id}" class="product__cart-buttons">
            <button class="product__remove-from-cart" type="button">-</button>
            <span class="product__count">0</span>
            <button class="product__add-to-cart" type="button">+</button>
          </div>
        </div>
      </div>
    </article>
    `)
  .join("");
  productSection.innerHTML = productList;
};

//

function addListeners() {
  allProducts.forEach(element => {
    document.getElementById(`item-${element.id}`).addEventListener("click", count);
  })

  // document.getElementsByClassName("product__remove-from-cart")
}

function count(e) {
  if (e.target.classList.contains("product__remove-from-cart")) {
    if (parseInt(e.target.nextElementSibling.textContent) > 0)
      e.target.nextElementSibling.textContent--
  }
  if (e.target.classList.contains("product__add-to-cart")) {
    e.target.previousElementSibling.textContent++
  }
}

//

categoryUl.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    filterBy = event.target.textContent.toLowerCase();
    displayProducts();
  }
});

sortBy.addEventListener("change", function () {
compare = sortBy.value === "highest" ? (a, b) => b.price - a.price
        : sortBy.value === "lowest" ? (a, b) => a.price - b.price
        : () => NaN;

displayProducts();
});

loadProducts();
// displayProducts();
