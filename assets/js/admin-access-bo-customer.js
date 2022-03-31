const userNumber = new URL (location.href).searchParams.get('customer');
const token = localStorage.getItem('customer');
const infos = document.getElementById('infos');
const deliveryAdress = document.getElementById('delivery-adress');
const billingAdress = document.getElementById('billing-adress');
const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');

fetch(`http://localhost:3000/api/mylaser/user/${userNumber}`, {headers: {"Authorization": 'Bearer ' + token}})
.then((res) => res.json())
.then((user) => {
    const date = new Date(user.createdAt);
    const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();

    infos.innerHTML = 
    '<p>Numéro :<span class="number">' + user.id + '</span></p>' +
    '<p>Nom :<span class="f-name">' + user.lastName + '</span></p>' +
    '<p>Prénom :<span class="l-name">' + user.firstName + '</span></p>' +
    '<p>Email :<span class="email">' + user.email + '</span></p>' +
    '<p>Inscription le :<span class="created-at">' + dateFormated + '</span></p>';

    if(user.deliveryAdresses.length === 1) {
        deliveryAdress.innerHTML =
        '<h3>Adresse de Livraison</h3>' +
        '<div class="adress-details"><p>' + user.deliveryAdresses[0].firstName + '</p>' +
        '<p>' + user.deliveryAdresses[0].lastName + '</p>' +
        '<p>' + user.deliveryAdresses[0].line1 + '</p>' + 
        '<p>' + user.deliveryAdresses[0].line2 + '</p>' +
        '<p>' + user.deliveryAdresses[0].postalCode + '</p>' +
        '<p>' + user.deliveryAdresses[0].city + '</p>' +
        '<p>' + user.deliveryAdresses[0].country + '</p>' +
        '<p>' + user.deliveryAdresses[0].phone + '</p></div>';
    } else {
        deliveryAdress.innerHTML =
        '<h3>Adresse de Livraison</h3>' +
        '<p class="no-adress">Adresse non renseignée</p>'
    }
    
    if(user.billingAdresses.length === 1) { 
        billingAdress.innerHTML =
        '<h3>Adresse de Facturation</h3>' +
        '<div class="adress-details"><p>' + user.billingAdresses[0].firstName + '</p>' +
        '<p>' + user.billingAdresses[0].lastName + '</p>' +
        '<p>' + user.billingAdresses[0].line1 + '</p>' + 
        '<p>' + user.billingAdresses[0].line2 + '</p>' +
        '<p>' + user.billingAdresses[0].postalCode + '</p>' +
        '<p>' + user.billingAdresses[0].city + '</p>' +
        '<p>' + user.billingAdresses[0].country + '</p>' +
        '<p>' + user.billingAdresses[0].phone + '</p></div>';
    } else {
        billingAdress.innerHTML =
        '<h3>Adresse de Facturation</h3>' +
        '<p class="no-adress">Adresse non renseignée</p>'
    };
    if(user.orders.length === 0) {
        document.getElementById('no-order').innerHTML = "Le client n'a pas passé de commande";
    } else {
        user.orders.forEach(order => {
            const date = new Date(order.createdAt)
            const dateFormated = date.getDay() + ' / ' + date.getMonth() + ' / ' + date.getFullYear();
            const orderRow = document.createElement('tr');
            orderRow.className = "orderRow";
            orderRow.innerHTML =
            '<td>' + order.number + '</td>' +
            '<td nowrap="nowrap">' + dateFormated + '</td>' +
            '<td nowrap="nowrap">' + order.price + ' €</td>' +
            '<td nowrap="nowrap">' + order.status + '</td>' +
            '<td><i class="icon solid fa-search glass" data-number=' + order.number + '></i></td>'
            tableBody.appendChild(orderRow);
        });
        let searchGlasses = document.querySelectorAll('.glass');
        searchGlasses.forEach(glass => {
            glass.addEventListener('click', () => {
                window.location.href = `/admin-access-bo-customer-order.html?customer=${userNumber}&order=${glass.dataset.number}`
            })
        })
    };
    const yes = document.getElementById('yes');
        yes.addEventListener('click', () => {
            deleteCustomer(user.id);
        })
});

backButton.addEventListener('click', () => {
    window.location.href = '/admin-access-bo-customers.html'
});

function showConfirm() {
    const confirmation = document.getElementById('confirmation-delete-customer');
    confirmation.classList.replace('hidden', 'visible')
}

function hideConfirm() {
    const confirmation = document.getElementById('confirmation-delete-customer');
    confirmation.classList.replace('visible', 'hidden')
}

function deleteCustomer(user) {
    fetch(`http://localhost:3000/api/mylaser/user/${user}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        window.location.href = `/admin-access-bo-customers.html`;
    })
}