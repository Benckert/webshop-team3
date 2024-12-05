import { getData } from "./utils.js";

const productSection = document.querySelector(".product_section");


const displayProducts = async () => {
    const allProducts = await getData(); 
    console.log(allProducts);

    const productList = allProducts.map(product =>
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
        </article>`)
        .join("");
    productSection.innerHTML = productList;
}

displayProducts();