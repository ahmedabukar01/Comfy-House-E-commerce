const client = contentful.createClient({
    // This is the space ID. A space is like a project folder in Contentful terms
    space: "developer_bookshelf",
    // This is the access token for this space. Normally you get both ID and the token in the Contentful web app
    accessToken: "0b7f6x59a0"
  });

// variables
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
let buttonsDOM = [];

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
                        add to cart
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
        buttonsDOM = buttons;

        buttons.forEach(button=>{
            let id = button.dataset.id;
            const inCart = cart.find(item => item.id === id);
            if(inCart){
                button.innerText = 'in Cart';
                button.disabled = true;
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
            <i class="fas fa-chevron-down" data-id=${cart.id}></i>
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
    cartLogic(){
        clearCartBtn.addEventListener('click',()=>{
            this.clearCart();
        })

        // cart functionality
        cartContent.addEventListener('click',e=>{
            if(e.target.classList.contains('remove-item')){
                let removeItem = e.target;
                let id = removeItem.dataset.id;
                this.removeItem(id);
                cartContent.removeChild(removeItem.parentElement.parentElement);

            }
            else if(e.target.classList.contains('fa-chevron-up')){
                let addAmount = e.target;
                let id = addAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount + 1;
                Storage.saveCart(cart);
                this.saveCartValues(cart);
                addAmount.nextElementSibling.innerText = tempItem.amount;
            }
            else if(e.target.classList.contains('fa-chevron-down')){
                let lowerAmount = e.target;
                let id = lowerAmount.dataset.id;
                let tempItem = cart.find(item => item.id === id);
                tempItem.amount = tempItem.amount - 1;
                
                if(tempItem.amount > 0){
                    Storage.saveCart(cart);
                    this.saveCartValues(cart);
                    lowerAmount.previousElementSibling.innerText = tempItem.amount;
                }
                else{
                    cartContent.removeChild(lowerAmount.parentElement.parentElement)
                    this.removeItem(id);
                }
            }
        })
    }
    clearCart(){
        let cartItems = cart.map(item=> item.id);
        cartItems.forEach(item=>this.removeItem(item));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
    }
    removeItem(id){
        cart = cart.filter(item => item.id !== id);
        this.saveCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"><i>add to cart`;
    }
    getSingleButton(id){
        return buttonsDOM.find(button => button.dataset.id === id);
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
        ui.cartLogic();
    })
    console.log('hey ahmed the code master welcome back we were waiting you long time man!')
})