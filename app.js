const cartBtn = document.querySelector('.cart-btn');
const closeCartBtn = document.querySelector('.close-cart');
const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const productsDOM = document.querySelector('.products-center');

// cart
let cart = []

// getting the products

class Products{
   async getProducts(){
        try{
            const res = await fetch('products.json');
            const result = await res.json();
            let products = result.items;
            products = products.map(item=>{
                const {title,price} = item.fields;
                const {id} = item.sys;
                const image = item.fields.image.fields.file.url;
                return {title,price,id,image};
            })
            return products;
        } catch (error){
            console.log(error);
        }
    }
}
// Display Products
class UI{
    displayProducts(products){
        let result = '';
        products.forEach(item=>{
            result += `
            <!-- single product -->
            <article class="product">
                <div class="img-container">
                    <img src=${item.image} alt="product" class="product-img">
                    <button class="bag-btn" data-id=${item.id}>
                        <i class="fas fa-shopping-cart"></i>
                        add to bag
                    </button>
                </div>
                <h3>${item.title}</h3>
                <h4>$${item.price}</h4>
            </article>
            <!-- end product -->

            `
        });
        productsDOM.innerHTML +=result;
    }
}
// local Storage
class Storage{

}

document.addEventListener('DOMContentLoaded', ()=>{
    const ui = new UI();
    const products = new Products();

    // getting all products
    products.getProducts().then(products=> ui.displayProducts(products));
    console.log('hey ahmed the code master welcome back we were waiting you long time man!')
})