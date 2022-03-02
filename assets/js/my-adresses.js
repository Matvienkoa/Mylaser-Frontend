const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);
const adressBox = document.getElementById('adresses');
const deleteDelivery = document.getElementById('deleteDelivery');
const editBilling = document.getElementById('editBilling');
const deleteBilling = document.getElementById('deleteBilling');
const backButton = document.getElementById('back-button');

if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
    .then((res) => res.json())
    .then((user) => {
        const deliveryAdress = user.deliveryAdresses[0]
        const billingAdress = user.billingAdresses[0]
        if(user.deliveryAdresses.length === 1) {
            const deliveryAdressDetails = document.createElement('div');
            deliveryAdressDetails.className = "deliveryAdressDetails"
            deliveryAdressDetails.innerHTML = 
            '<h3>Mon adresse de Livraison</h3>' +
            '<span class="name"><h4 class="marg">' + deliveryAdress.firstName + '</h4><h4>' + deliveryAdress.lastName + '</h4></span>' +
            '<span class="lines"><h4>' + deliveryAdress.line1 + '</h4><h4>' + deliveryAdress.line2 + '</h4></span>' +
            '<span class="city"><h4 class="marg">' + deliveryAdress.postalCode + '</h4><h4>' + deliveryAdress.city + '</h4></span>' +
            '<h4>' + deliveryAdress.country + '</h4>' +
            '<h4>' + deliveryAdress.phone + '</h4>' +
            `<span class="buttons"><input type="button" value="Modifier" id="editDelivery" data-id=${deliveryAdress.id}><input type="button" value="Supprimer" id="deleteDelivery" data-id=${deliveryAdress.id}></span>`;
            adressBox.appendChild(deliveryAdressDetails)

            const editDelivery = document.getElementById('editDelivery');
            editDelivery.addEventListener('click', () => {
                window.location.href = `/edit-delivery-adress.html`;
            })

            const deleteDelivery = document.getElementById('deleteDelivery');
            deleteDelivery.addEventListener('click', () => {
                deleteDeliveryAdress(deliveryAdress.id)
            })
        }
        if(user.deliveryAdresses.length === 0) {
            const addDeliveryAdress = document.createElement('div');
            addDeliveryAdress.className = "addDeliveryAdress";
            addDeliveryAdress.innerHTML =
            '<h3>Mon adresse de Livraison</h3>' +
            "<p>Vous n'avez pas encore enregistré d'adresse de livraison" +
            '<input type="button" value="Ajouter une adresse" id="addDelivery">';
            adressBox.appendChild(addDeliveryAdress)

            const addDelivery = document.getElementById('addDelivery');
            addDelivery.addEventListener('click', () => {
                window.location.href = `/add-delivery-adress.html`;
            })            
        }
        if(user.billingAdresses.length === 1) {
            const billingAdressDetails = document.createElement('div');
            billingAdressDetails.className = "deliveryAdressDetails"
            billingAdressDetails.innerHTML = 
            '<h3>Mon adresse de Facturation</h3>' +
            '<span class="name"><h4 class="marg">' + billingAdress.firstName + '</h4><h4>' + billingAdress.lastName + '</h4></span>' +
            '<span class="lines"><h4>' + billingAdress.line1 + '</h4><h4>' + billingAdress.line2 + '</h4></span>' +
            '<span class="city"><h4 class="marg">' + billingAdress.postalCode + '</h4><h4>' + billingAdress.city + '</h4></span>' +
            '<h4>' + billingAdress.country + '</h4>' +
            '<h4>' + billingAdress.phone + '</h4>' +
            `<span class="buttons"><input type="button" value="Modifier" id="editBilling" data-id=${billingAdress.id}><input type="button" value="Supprimer" id="deleteBilling" data-id=${billingAdress.id}></span>`;
            adressBox.appendChild(billingAdressDetails);

            const editBilling = document.getElementById('editBilling');
            editBilling.addEventListener('click', () => {
                window.location.href = `/edit-billing-adress.html`;
            })

            const deleteBilling = document.getElementById('deleteBilling');
            deleteBilling.addEventListener('click', () => {
                deleteBillingAdress(billingAdress.id)
            })
        }
        if(user.billingAdresses.length === 0) {
            const addBillingAdress = document.createElement('div');
            addBillingAdress.className = "addBillingAdress";
            addBillingAdress.innerHTML =
            '<h3>Mon adresse de Facturation</h3>' +
            "<p>Vous n'avez pas encore enregistré d'adresse de facturation" +
            '<input type="button" value="Ajouter une adresse" id="addBilling">';
            adressBox.appendChild(addBillingAdress)

            const addBilling = document.getElementById('addBilling');
            addBilling.addEventListener('click', () => {
                window.location.href = `/add-billing-adress.html`;
            })
        }
    })
}

function deleteDeliveryAdress(adressId) {
    fetch(`http://localhost:3000/api/mylaser/deliveryadress/${adressId}`, {method: "DELETE"})
    .then(() => {
        window.location.reload();
    })
}

function deleteBillingAdress(adressId) {
    fetch(`http://localhost:3000/api/mylaser/billingadress/${adressId}`, {method: "DELETE"})
    .then(() => {
        window.location.reload();
    })
}

backButton.addEventListener('click', () => window.location.href = '/account.html')


