let token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);
const adressBox = document.getElementById('adresses');
const deleteDelivery = document.getElementById('deleteDelivery');
const editBilling = document.getElementById('editBilling');
const deleteBilling = document.getElementById('deleteBilling');
const backButton = document.getElementById('back-button');

if(token) {
    fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const deliveryAdress = user.deliveryAdresses[0];
        const billingAdress = user.billingAdresses[0];
        if(user.deliveryAdresses.length === 1) {
            const deliveryAdressDetails = document.createElement('div');
            deliveryAdressDetails.className = "adresses-box";
            deliveryAdressDetails.innerHTML = 
            '<h3>Mon adresse de Livraison</h3>' +
            '<div class="adress-details"><span class="name"><p class="marg">' + deliveryAdress.firstName + '</p><p>' + deliveryAdress.lastName + '</p></span>' +
            '<p>' + deliveryAdress.line1 + '</p>' + 
            '<p>' + deliveryAdress.line2 + '</p>' +
            '<span class="city"><p class="marg">' + deliveryAdress.postalCode + '</p><p>' + deliveryAdress.city + '</p></span>' +
            '<p>' + deliveryAdress.country + '</p>' +
            '<p>' + deliveryAdress.phone + '</p></div>' +
            `<span class="buttons"><input type="button" value="Modifier" id="edit-delivery-button"><input type="button" value="Supprimer" id="delete-delivery-button" onclick="showConfirmDA()"></span>` +
            `<span id="confirmation-delete-da" class="hidden"><p>Supprimer cette adresse?</p><span id="confirmation-buttons-da"><input type="button" value="Oui" id="yes-da"><input type="button" value="Non" id="no-da" onclick="hideConfirmDA()"></span></span>`;
            adressBox.appendChild(deliveryAdressDetails);

            const editDelivery = document.getElementById('edit-delivery-button');
            editDelivery.addEventListener('click', () => {
                window.location.href = `/edit-delivery-adress.html`;
            });

            const deleteDelivery = document.getElementById('yes-da');
            deleteDelivery.addEventListener('click', () => {
                deleteDeliveryAdress(deliveryAdress.id);
            });
        };
        if(user.deliveryAdresses.length === 0) {
            const addDeliveryAdress = document.createElement('div');
            addDeliveryAdress.className = "addDeliveryAdress";
            addDeliveryAdress.innerHTML =
            '<h3>Mon adresse de Livraison</h3>' +
            "<p>Vous n'avez pas encore enregistré d'adresse de livraison</p>" +
            '<input type="button" value="Ajouter une adresse" id="addDelivery" class="button primary">';
            adressBox.appendChild(addDeliveryAdress);

            const addDelivery = document.getElementById('addDelivery');
            addDelivery.addEventListener('click', () => {
                window.location.href = `/add-delivery-adress.html`;
            }); 
        };
        if(user.billingAdresses.length === 1) {
            const billingAdressDetails = document.createElement('div');
            billingAdressDetails.className = "adresses-box";
            billingAdressDetails.innerHTML = 
            '<h3>Mon adresse de Facturation</h3>' +
            '<div class="adress-details"><span class="name"><p class="marg">' + billingAdress.firstName + '</p><p>' + billingAdress.lastName + '</p></span>' +
            '<p>' + billingAdress.line1 + '</p>' + 
            '<p>' + billingAdress.line2 + '</p>' +
            '<span class="city"><p class="marg">' + billingAdress.postalCode + '</p><p>' + billingAdress.city + '</p></span>' +
            '<p>' + billingAdress.country + '</p>' +
            '<p>' + billingAdress.phone + '</p></div>' +
            `<span class="buttons"><input type="button" value="Modifier" id="edit-billing-button"><input type="button" value="Supprimer" id="delete-billing-button" onclick="showConfirmBA()"></span>` +
            `<span id="confirmation-delete-ba" class="hidden"><p>Supprimer cette adresse?</p><span id="confirmation-buttons-da"><input type="button" value="Oui" id="yes-ba"><input type="button" value="Non" id="no-ba" onclick="hideConfirmBA()"></span></span>`;
            adressBox.appendChild(billingAdressDetails);

            const editBilling = document.getElementById('edit-billing-button');
            editBilling.addEventListener('click', () => {
                window.location.href = `/edit-billing-adress.html`;
            });

            const deleteBilling = document.getElementById('yes-ba');
            deleteBilling.addEventListener('click', () => {
                deleteBillingAdress(billingAdress.id);
            });
        };
        if(user.billingAdresses.length === 0) {
            const addBillingAdress = document.createElement('div');
            addBillingAdress.className = "addBillingAdress";
            addBillingAdress.innerHTML =
            '<h3>Mon adresse de Facturation</h3>' +
            "<p>Vous n'avez pas encore enregistré d'adresse de facturation</p>" +
            '<input type="button" value="Ajouter une adresse" id="addBilling" class="button primary">';
            adressBox.appendChild(addBillingAdress);

            const addBilling = document.getElementById('addBilling');
            addBilling.addEventListener('click', () => {
                window.location.href = `/add-billing-adress.html`;
            });
        };
    });
};

function showConfirmDA() {
    const confirmation = document.getElementById('confirmation-delete-da');
    confirmation.classList.replace('hidden', 'visible');
};

function hideConfirmDA() {
    const confirmation = document.getElementById('confirmation-delete-da');
    confirmation.classList.replace('visible', 'hidden');
};

function showConfirmBA() {
    const confirmation = document.getElementById('confirmation-delete-ba');
    confirmation.classList.replace('hidden', 'visible');
};

function hideConfirmBA() {
    const confirmation = document.getElementById('confirmation-delete-ba');
    confirmation.classList.replace('visible', 'hidden');
};

function deleteDeliveryAdress(adressId) {
    fetch(`api/mylaser/deliveryadress/${adressId}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        window.location.reload();
    });
};

function deleteBillingAdress(adressId) {
    fetch(`api/mylaser/billingadress/${adressId}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        window.location.reload();
    });
};

backButton.addEventListener('click', () => window.location.href = '/my-account.html');


