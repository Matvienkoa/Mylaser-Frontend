const products = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const tableBody = document.getElementById('table-body');
const tableWrapper = document.getElementById('tableWrapper');
const backButton = document.getElementById('back-button');


if(token) {
    const decodedToken = jwt_decode(token);
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        if(user.orders.length === 0) {
            document.getElementById('no-order').innerHTML = "Vous n'a pas encore passé de commande";
        } else {
            user.orders.forEach(order => {
                const date = new Date(order.createdAt);
                const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
                const orderRow = document.createElement('tr');
                orderRow.className = "orderRow";
                orderRow.innerHTML =
                '<td>' + order.number + '</td>' +
                '<td nowrap="nowrap">' + dateFormated + '</td>' +
                '<td nowrap="nowrap">' + order.price + ' €</td>' +
                '<td nowrap="nowrap">' + order.status + '</td>' +
                '<td><i class="icon solid fa-search glass" data-number=' + order.number + '></i></td>';
                tableBody.appendChild(orderRow);
            });
            let searchGlasses = document.querySelectorAll('.glass');
            searchGlasses.forEach(glass => {
                glass.addEventListener('click', () => {
                    window.location.href = `/my-order.html?order=${glass.dataset.number}`;
                });
            });
        };
    });
};

backButton.addEventListener('click', () => window.location.href = '/my-account.html');


