const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');
const searchInput = document.getElementById('search-input');
const token = localStorage.getItem('customer');

let customersArray;

fetch(`api/mylaser/user`, {headers: {"Authorization": 'Bearer ' + token}})
.then((res) => res.json())
.then((users) => {
    createCustomersList(users);
    customersArray = users;
})

function createCustomersList(customerList) {
    customerList.forEach(user => {
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
}

searchInput.addEventListener("input", filterCustomers)

function filterCustomers(e) {
    tableBody.innerHTML = ""
    const searchedString = e.target.value.toLowerCase();
    const filteredArray = customersArray.filter(user => user.lastName.toLowerCase().includes(searchedString) || user.firstName.toLowerCase().includes(searchedString));
    createCustomersList(filteredArray);
};

backButton.addEventListener('click', () => window.location.href = '/admin-access-bo.html')