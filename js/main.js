import { getData } from "./utils.js";

const productSection = document.querySelector(".product_section");
const categoryUl = document.querySelector(".category_list");
const sortBy = document.querySelector("#sort_by");


categoryUl.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    let filterBy = event.target.textContent.toLowerCase();
    displayProducts(filterBy);
  }
});

// sortBy.addEventListener("change", displayProducts(sortBy));

const displayProducts = async (filterBy) => {
  const allProducts = await getData();
  //   console.log(allProducts);
  let compare;

//   if (sortBy.value === "lowest") {
//     compare = (a, b) => a.price - b.price
// } else if (sortBy.value === "highest") {
//     compare = (a, b) => b.price - a.price
// }

  const productList = allProducts
    .sort(sortBy.value === "highest" ? (a, b) => b.price - a.price
        : sortBy.value === "lowest" ? (a, b) => a.price - b.price
        : NaN)
    .filter(product => filterBy !== "all" ? product.category === filterBy : true)
    .map(
      (product) =>
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
        </article>`
    )
    .join("");
  productSection.innerHTML = productList;
  console.log(productList);
};

displayProducts("all");
