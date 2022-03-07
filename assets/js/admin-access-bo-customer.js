const userNumber = new URL (location.href).searchParams.get('customer');
const infos = document.getElementById('infos');
const deliveryAdress = document.getElementById('delivery-adress');
const billingAdress = document.getElementById('billing-adress');
const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');

fetch(`http://localhost:3000/api/mylaser/user/${userNumber}`)
    .then((res) => res.json())
    .then((user) => {

        console.log(user);
        const date = new Date(user.createdAt);
        const dateFormated = date.getDay() + ' / ' + date.getMonth() + ' / ' + date.getFullYear();
        
        infos.innerHTML = 
        '<p>Numéro :<span class="number">' + user.id + '</span></p>' +
        '<p>Nom :<span class="f-name">' + user.lastName + '</span></p>' +
        '<p>Prénom :<span class="l-name">' + user.firstName + '</span></p>' +
        '<p>Email :<span class="email">' + user.email + '</span></p>' +
        '<p>Inscription le :<span class="created-at">' + dateFormated + '</span></p>';

        deliveryAdress.innerHTML =
        '<h3>Adresse de Livraison</h3>' +
        '<div class="adress-details"><span class="name"><p class="marg">' + user.deliveryAdresses[0].firstName + '</p><p>' + user.deliveryAdresses[0].lastName + '</p></span>' +
        '<p>' + user.deliveryAdresses[0].line1 + '</p>' + 
        '<p>' + user.deliveryAdresses[0].line2 + '</p>' +
        '<span class="city"><p class="marg">' + user.deliveryAdresses[0].postalCode + '</p><p>' + user.deliveryAdresses[0].city + '</p></span>' +
        '<p>' + user.deliveryAdresses[0].country + '</p>' +
        '<p>' + user.deliveryAdresses[0].phone + '</p></div>';

        billingAdress.innerHTML =
        '<h3>Adresse de Facturation</h3>' +
        '<div class="adress-details"><span class="name"><p class="marg">' + user.billingAdresses[0].firstName + '</p><p>' + user.billingAdresses[0].lastName + '</p></span>' +
        '<p>' + user.billingAdresses[0].line1 + '</p>' + 
        '<p>' + user.billingAdresses[0].line2 + '</p>' +
        '<span class="city"><p class="marg">' + user.billingAdresses[0].postalCode + '</p><p>' + user.billingAdresses[0].city + '</p></span>' +
        '<p>' + user.billingAdresses[0].country + '</p>' +
        '<p>' + user.billingAdresses[0].phone + '</p></div>';

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
        })
    })

backButton.addEventListener('click', () => {
    window.location.href = '/admin-access-bo-customers.html'
})