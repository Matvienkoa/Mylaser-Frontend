const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
const postalCode = document.getElementById('postalCode');
const city = document.getElementById('city');
const country = document.getElementById('country');
const phone = document.getElementById('phone');
const adressOption = document.getElementById('adress-option');

if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
    .then((res) => res.json())
    .then((user) => {
        const deliveryAdress = user.deliveryAdresses[0];
        firstName.value = deliveryAdress.firstName;
        lastName.value = deliveryAdress.lastName;
        line1.value = deliveryAdress.line1;
        line2.value = deliveryAdress.line2;
        postalCode.value = deliveryAdress.postalCode;
        city.value = deliveryAdress.city;
        country.value = deliveryAdress.country;
        phone.value = deliveryAdress.phone;
    })

}

function editDeliveryAdress() {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
    .then((res) => res.json())
    .then((user) => {
        const dAdress = user.deliveryAdresses[0];
        const bAdress = user.billingAdresses[0];
        const updateAdress = {
            firstName: firstName.value,
            lastName: lastName.value,
            line1: line1.value,
            line2: line2.value,
            postalCode: postalCode.value,
            city: city.value,
            country: country.value,
            phone: phone.value,
            userId: decodedToken.userId
        }
        const myInit = {
            method: "PUT",
            body: JSON.stringify(updateAdress),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        }
        const myInit2 = {
            method: "POST",
            body: JSON.stringify(updateAdress),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
        }
        fetch(`http://localhost:3000/api/mylaser/deliveryadress/${dAdress.id}`, myInit)
        .then(() => {
            if(adressOption.value === "yes" && user.billingAdresses.length === 1) {
                fetch(`http://localhost:3000/api/mylaser/billingadress/${bAdress.id}`, myInit)
            }
            if(adressOption.value === "yes" && user.billingAdresses.length === 0) {
                fetch(`http://localhost:3000/api/mylaser/billingadress`, myInit2)
            }
        })
        .then(() => window.location.href = '/my-adresses.html')
    })
}

function cancel() {
    window.location.href = '/my-adresses.html'
}