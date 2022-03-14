const orderNumber = document.getElementById('order-number');
const number = new URL (location.href).searchParams.get('order');
const orders = document.getElementById('orders');



orderNumber.innerHTML = number;
orders.addEventListener('click', () => {
    window.location.href = '/my-orders.html';
});
