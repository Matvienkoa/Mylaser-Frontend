const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');
const searchInput = document.getElementById('search-input');
const token = localStorage.getItem('customer');

let ordersArray;

fetch('http://localhost:3000/api/mylaser/order', {headers: {"Authorization": 'Bearer ' + token}})
.then((res) => res.json())
.then((orders) => {
    createOrderList(orders);
    ordersArray = orders;
})

function createOrderList(orderList) {
    orderList.forEach(order => {
        const date = new Date(order.createdAt)
        const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
        const orderRow = document.createElement('tr');
        orderRow.className = "orderRow";
        orderRow.innerHTML =
        '<td>' + order.number + '</td>' +
        '<td nowrap="nowrap">' + dateFormated + '</td>' +
        '<td nowrap="nowrap">' + (order.priceTTC/100).toFixed(2) + ' €</td>' +
        '<td nowrap="nowrap">' + order.status + '</td>' +
        '<td><i class="icon solid fa-search glass" data-number=' + order.number + '></i></td>';
        tableBody.appendChild(orderRow);
    });
    let searchGlasses = document.querySelectorAll('.glass');
    searchGlasses.forEach(glass => {
        glass.addEventListener('click', () => {
            window.location.href = `/admin-access-bo-order.html?order=${glass.dataset.number}`
        })
    })
}

searchInput.addEventListener("input", filterOrders)

function filterOrders(e) {
    tableBody.innerHTML = ""
    const searchedString = e.target.value.toLowerCase();
    const filteredArray = ordersArray.filter(order => order.number.toLowerCase().includes(searchedString));
    createOrderList(filteredArray);
};

backButton.addEventListener('click', () => window.location.href = '/admin-access-bo.html')