const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');
const token = localStorage.getItem('customer');

fetch(`http://localhost:3000/api/mylaser/user`, {headers: {"Authorization": 'Bearer ' + token}})
.then((res) => res.json())
.then((users) => {
    console.log(users);
    users.forEach(user => {
        if(user.role === 'customer') {
            const userRow = document.createElement('tr');
            userRow.className = "userRow";
            userRow.innerHTML =
            '<td>' + user.id + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + user.firstName + '</td>' +
            '<td>' + user.lastName + '</td>' +
            '<td><i class="icon solid fa-search glass" data-id=' + user.id + '></i></td>'
            tableBody.appendChild(userRow);
        }
    });
    let searchGlasses = document.querySelectorAll('.glass');
    searchGlasses.forEach(glass => {
        glass.addEventListener('click', () => {
            window.location.href = `/admin-access-bo-customer.html?customer=${glass.dataset.id}`
        })
    })
})

backButton.addEventListener('click', () => window.location.href = '/admin-access-bo.html')