const deliveries = document.querySelectorAll('.delivery');
const token = localStorage.getItem('customer');

deliveries.forEach(delivery => {
    delivery.addEventListener('click', () => {
        localStorage.setItem('deliveryChoice', delivery.dataset.delivery);
        window.location.href = '/order-payment.html';
    });
});