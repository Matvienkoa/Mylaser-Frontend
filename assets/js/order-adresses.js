const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);
const adressBox = document.getElementById('adresses');


if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const deliveryAdress = user.deliveryAdresses[0];
        if(user.deliveryAdresses.length === 1 && user.billingAdresses.length === 1) {
            const deliveryAdressDetails = document.createElement('div');
            deliveryAdressDetails.className = "deliveryAdressDetails";
            deliveryAdressDetails.innerHTML = 
            '<div id="box-adress"><span class="name"><h4 class="marg">' + deliveryAdress.firstName + '</h4><h4>' + deliveryAdress.lastName + '</h4></span>' +
            '<span class="lines"><h4 class="marg">' + deliveryAdress.line1 + '</h4><h4>' + deliveryAdress.line2 + '</h4></span>' +
            '<span class="city"><h4 class="marg">' + deliveryAdress.postalCode + '</h4><h4>' + deliveryAdress.city + '</h4></span>' +
            '<h4>' + deliveryAdress.country + '</h4>' +
            '<h4>' + deliveryAdress.phone + '</h4></div>' +
            '<input type="button" value="Modifier mes adresses" id="edit-adresse">';
            adressBox.appendChild(deliveryAdressDetails);

            const editAdress = document.getElementById('edit-adresse');
            editAdress.addEventListener('click', () => {
                window.location.href = `/my-adresses.html`;
            });

            const goToDelivery = document.getElementById('box-adress');
            goToDelivery.addEventListener('click', () => {
                window.location.href = `/order-delivery.html`;
            });
        }
        if(user.deliveryAdresses.length === 1 && user.billingAdresses.length === 0) {
            const deliveryAdressDetails = document.createElement('div');
            deliveryAdressDetails.className = "deliveryAdressDetails";
            deliveryAdressDetails.innerHTML = 
            '<div id="box-adress"><span class="name"><h4 class="marg">' + deliveryAdress.firstName + '</h4><h4>' + deliveryAdress.lastName + '</h4></span>' +
            '<span class="lines"><h4 class="marg">' + deliveryAdress.line1 + '</h4><h4>' + deliveryAdress.line2 + '</h4></span>' +
            '<span class="city"><h4 class="marg">' + deliveryAdress.postalCode + '</h4><h4>' + deliveryAdress.city + '</h4></span>' +
            '<h4>' + deliveryAdress.country + '</h4>' +
            '<h4>' + deliveryAdress.phone + '</h4></div>' +
            '<span id="other-adress">Utiliser une autre adresse pour la facturation</span>' +
            '<input type="button" value="Modifier mes adresses" id="edit-adresse">';
            adressBox.appendChild(deliveryAdressDetails);

            const editAdress = document.getElementById('edit-adresse');
            editAdress.addEventListener('click', () => {
                window.location.href = `/my-adresses.html`;
            });

            const otherAdress = document.getElementById('other-adress');
            otherAdress.addEventListener('click', () => {
                window.location.href = `/order-add-billing-adress.html`;
            });

            const goToDelivery = document.getElementById('box-adress');
            goToDelivery.addEventListener('click', () => {
                window.location.href = `/order-delivery.html`;
            });
        }
        if(user.deliveryAdresses.length === 0) {
            const noDeliveryAdress = document.createElement('p');
            noDeliveryAdress.className = 'no-delivery-adress';
            noDeliveryAdress.innerHTML = 
            "Vous n'avez pas encore d'adresse enregistrée.<span id='create-adress'>Ajouter une adresse</span>";
            adressBox.appendChild(noDeliveryAdress);
            const createAdress = document.getElementById('create-adress');
            createAdress.addEventListener('click', () => {
                window.location.href = 'order-add-delivery-adress.html';
            });
        };
    });
};