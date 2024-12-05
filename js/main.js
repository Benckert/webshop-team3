import { getData } from "./utils.js";

const productSection = document.querySelector(".product_section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");

let filterBy = "all";
let compare;

const displayProducts = async () => {
  const allProducts = await getData();

    const productList = allProducts
    .sort(compare)
    .filter(product => filterBy !== "all" ? product.category === filterBy : true)
    .map(product =>
      `
      <article class="product">
      <img src="${product.image}" alt="">
      <div class="product_div">
      <div class="product_text">
      <h2 class="product_name">${product.title}</h2>
      <p class="product_price">$${product.price}</p>
      </div>
      <button class="product_buy">Varukorg</button>
      </div>
      </article>
      `)
    .join("");
    productSection.innerHTML = productList;
  };

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

  displayProducts();
