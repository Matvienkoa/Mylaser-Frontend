const userNumber = new URL (location.href).searchParams.get('customer');
const token = localStorage.getItem('customer');
const infos = document.getElementById('infos');
const deliveryAdress = document.getElementById('delivery-adress');
const billingAdress = document.getElementById('billing-adress');
const tableBody = document.getElementById('table-body');
const backButton = document.getElementById('back-button');
const discountInfos = document.getElementById('discount-infos');
const discountCheckbox = document.getElementById('vip');
const addDiscount = document.getElementById('discount-button');
const amount = document.getElementById('amount');

fetch(`api/mylaser/user/${userNumber}`, {headers: {"Authorization": 'Bearer ' + token}})
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

    if(user.discount === 'no') {
        discountInfos.innerHTML = 'Pas de remise appliquée';
        discountCheckbox.checked = false;
    }
    if(user.discount === 'yes') {
        discountCheckbox.checked = true;
        discountInfos.innerHTML = `Ce client bénéficie de ${user.discountAmount} % de remise`
    }

    addDiscount.addEventListener('click', () => {
        if(discountCheckbox.checked === true && amount.value) {
            const vipInfos = {
                discount: 'yes',
                discountAmount: parseFloat(amount.value)
            }
            const myInit = {
                method: "PUT",
                body: JSON.stringify(vipInfos),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
            };
            fetch(`api/mylaser/user/vip/${user.id}`, myInit)
            .then((res) => res.json())
            .then(() => {
                window.location.reload();
            })
        }
    })

    discountCheckbox.addEventListener('change', () => {
        if(discountCheckbox.checked === false) {
            const vipInfos = {
                discount: 'no',
                discountAmount: 0
            }
            const myInit = {
                method: "PUT",
                body: JSON.stringify(vipInfos),
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
            };
            fetch(`api/mylaser/user/vip/${user.id}`, myInit)
            .then((res) => res.json())
            .then(() => {
                window.location.reload();
            })
        }
    })

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
            if(order.payment === 'Valid') {
                const date = new Date(order.createdAt)
                const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
                const orderRow = document.createElement('tr');
                orderRow.className = "orderRow";
                orderRow.innerHTML =
                '<td>' + order.number + '</td>' +
                '<td nowrap="nowrap">' + dateFormated + '</td>' +
                '<td nowrap="nowrap">' + ((order.priceTTC)/100).toFixed(2) + ' €</td>' +
                '<td nowrap="nowrap">' + order.status + '</td>' +
                '<td><i class="icon solid fa-search glass" data-number=' + order.number + '></i></td>'
                tableBody.appendChild(orderRow);
            }
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
    fetch(`api/mylaser/user/${user}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        window.location.href = `/admin-access-bo-customers.html`;
    })
}