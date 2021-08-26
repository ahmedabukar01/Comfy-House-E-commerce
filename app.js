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
let buttonsDom = [];

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
    getbugButtons(){
        const buttons = [...document.querySelectorAll('.bag-btn')];
        buttonsDom = buttons;

        buttons.forEach(button=>{
            let id = button.dataset.id;
            const inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = 'in Cart';
                button.target.disabled = true;
            }
            
                button.addEventListener('click',e=>{
                    e.target.innerText = 'in Cart';
                    e.target.disabled = true;
                     // get product from products
                    let cartItem = {...Storage.getProduct(id), amount:1};
                    // add product to the cart 
                    cart = [...cart, cartItem];
                    console.log(cart)
                    // save cart in local storage
                    Storage.saveCart(cart);
                    // set cart values 
                    this.saveCartValues(cart);
                    // display cart item
                    this.addToCart(cartItem);
                    // show the cart
                    this.showCart();
                    })
            
        })
    }

    saveCartValues(cart){
      let tempTotal = 0;
      let itemsTotal = 0;
      cart.map(item =>{
          tempTotal += item.price * item.amount;
          itemsTotal +=item.amount;
      })  
      
      cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
      cartItems.innerText = itemsTotal;

    }
    
    addToCart(cart){
        const div = document.createElement('div');
        div.classList.add('cart-item')
        div.innerHTML = `
        <img src=${cart.image} alt="product">
        <div>
            <h4>${cart.title}</h4>
            <h5>$ ${cart.price}</h5>
            <span class="remove-item" data-id=${cart.id}>Remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" data-id=${cart.id}></i>
            <p class="item-amount">${cart.amount}</p>
            <i class="fas fa-chevron-down" data-id${cart.id}></i>
        </div>
    </div>
        `;

        cartContent.appendChild(div);
    }
    showCart(){
        cartDOM.classList.add('showCart');
        cartOverlay.classList.add('transparentBcg');
    }
    setUpAPP(){
        cart = Storage.getCart();
        this.saveCartValues(cart);
        this.populate(cart);
        cartBtn.addEventListener('click',this.showCart);
        closeCartBtn.addEventListener('click',this.hideCart);
    }
    populate(cart){
        cart.forEach(item => this.addToCart(item))
    }
    hideCart(){
        cartDOM.classList.remove('showCart');
        cartOverlay.classList.remove('transparentBcg');
    }
}
// local Storage
class Storage{
    static saveProduct(products){
        localStorage.setItem('products',JSON.stringify(products));
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem('products'));
        return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem('cart', JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem('cart')? JSON.parse(localStorage.getItem('cart')) : [];
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    const ui = new UI();
    const products = new Products();

    // setup app
    ui.setUpAPP();
    // getting all products
    products.getProducts().then(products=> {
        ui.displayProducts(products);
        Storage.saveProduct(products);
    }).then(()=>{
        ui.getbugButtons();
    })
    console.log('hey ahmed the code master welcome back we were waiting you long time man!')
})