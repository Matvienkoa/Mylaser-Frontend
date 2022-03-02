const productsInCart = localStorage.getItem('currentCart');
const cartCircle = document.getElementById('circle-cart');

if(productsInCart) {
    let cartCircle = document.getElementById('circle-cart');
    cartCircle.classList.replace('circle-hidden', 'circle-visible');
} else {
    cartCircle.classList.replace('circle-visible', 'circle-hidden');
}