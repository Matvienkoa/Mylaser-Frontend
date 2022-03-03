const products = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const tableBody = document.getElementById('table-body');
const tableWrapper = document.getElementById('tableWrapper');


if(token) {
    const decodedToken = jwt_decode(token);
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
    .then((res) => res.json())
    .then((user) => {
        user.orders.forEach(order => {
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
                window.location.href = `/my-order.html?order=${glass.dataset.number}`
                console.log('yo')
            })
            
        })
    })
    
} 


