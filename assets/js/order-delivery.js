const deliveries = document.querySelectorAll('.delivery');

deliveries.forEach(delivery => {
    delivery.addEventListener('click', () => {
        localStorage.setItem('deliveryChoice', delivery.dataset.delivery);
        window.location.href = '/order-payment.html'
        console.log(delivery.dataset.delivery);
    })
});