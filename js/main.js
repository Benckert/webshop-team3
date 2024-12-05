import { getData } from "./utils.js";

const productSection = document.querySelector(".product_section");
const categoryUl = document.querySelector(".category_list");

categoryUl.addEventListener("click", function (event) {
  if (event.target.tagName === "LI") {
    let filterBy = event.target.textContent.toLowerCase();
    displayProducts(filterBy);
  }
});

const displayProducts = async (filterBy) => {
  const allProducts = await getData();
  //   console.log(allProducts);

  const productList = allProducts
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

displayProducts();
