const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token)
const adressBox = document.getElementById('adresses')

if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
    .then((res) => res.json())
    .then((user) => {
        const billingAdress = user.billingAdresses[0]
        const deliveryAdress = user.deliveryAdresses[0]

        const deliveryAdressDetails = document.createElement('div');
        deliveryAdressDetails.className = "deliveryAdressDetails"
        deliveryAdressDetails.innerHTML = 
        '<h3>Mon adresse de Livraison</h3>' +
        '<span class="name"><h4 class="marg">' + deliveryAdress.firstName + '</h4><h4>' + deliveryAdress.lastName + '</h4></span>' +
        '<span class="lines"><h4>' + deliveryAdress.line1 + '</h4><h4>' + deliveryAdress.line2 + '</h4></span>' +
        '<span class="city"><h4 class="marg">' + deliveryAdress.postalCode + '</h4><h4>' + deliveryAdress.city + '</h4></span>' +
        '<h4>' + deliveryAdress.country + '</h4>' +
        '<h4>' + deliveryAdress.phone + '</h4>' +
        '<span class="buttons"><input type="button" value="Modifier"><input type="button" value="Supprimer"></span>';
        adressBox.appendChild(deliveryAdressDetails)

        const billingAdressDetails = document.createElement('div');
        billingAdressDetails.className = "deliveryAdressDetails"
        billingAdressDetails.innerHTML = 
        '<h3>Mon adresse de Facturation</h3>' +
        '<span class="name"><h4 class="marg">' + billingAdress.firstName + '</h4><h4>' + billingAdress.lastName + '</h4></span>' +
        '<span class="lines"><h4>' + billingAdress.line1 + '</h4><h4>' + billingAdress.line2 + '</h4></span>' +
        '<span class="city"><h4 class="marg">' + billingAdress.postalCode + '</h4><h4>' + billingAdress.city + '</h4></span>' +
        '<h4>' + billingAdress.country + '</h4>' +
        '<h4>' + billingAdress.phone + '</h4>' +
        '<span class="buttons"><input type="button" value="Modifier"><input type="button" value="Supprimer"></span>';
        adressBox.appendChild(billingAdressDetails)


    })
}
