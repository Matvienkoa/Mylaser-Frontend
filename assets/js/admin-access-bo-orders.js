const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');

fetch('http://localhost:3000/api/mylaser/order')
.then((res) => res.json())
.then((orders) => {
    orders.forEach(order => {
        const date = new Date(order.createdAt)
        const dateFormated = date.getDay() + ' / ' + date.getMonth() + ' / ' + date.getFullYear();
        const orderRow = document.createElement('tr');
        orderRow.className = "orderRow";
        orderRow.innerHTML =
        '<td>' + order.number + '</td>' +
        '<td>' + dateFormated + '</td>' +
        '<td>' + order.price + ' €</td>' +
        '<td>' + order.status + '</td>' +
        '<td><i class="icon solid fa-search glass" data-number=' + order.number + '></i></td>'
        tableBody.appendChild(orderRow);
    });
    let searchGlasses = document.querySelectorAll('.glass');
    searchGlasses.forEach(glass => {
        glass.addEventListener('click', () => {
            window.location.href = `/admin-access-bo-order.html?order=${glass.dataset.number}`
        })
    })
})

backButton.addEventListener('click', () => window.location.href = '/admin-access-bo.html')