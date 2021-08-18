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
            return result;
        } catch (error){
            console.log(error);
        }
    }
}
// Display Products
class UI{

}
// local Storage
class Storage{

}

document.addEventListener('DOMContentLoaded', ()=>{
    const ui = new UI();
    const products = new Products();

    // getting all products
    products.getProducts().then(data=>console.log(data))
    console.log('hey ahmed the code master welcome back we were waiting you long time man!')
})