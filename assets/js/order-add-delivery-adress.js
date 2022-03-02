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

function addDeliveryAdress() {
    const adressInfos = {
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
        method: "POST",
        body: JSON.stringify(adressInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    const myInit2 = {
        method: "PUT",
        body: JSON.stringify(adressInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`http://localhost:3000/api/mylaser/deliveryadress`, myInit)
    .then(() => {
        fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
        .then((res) => res.json())
        .then((user) => {
            if(adressOption.value === "yes" && user.billingAdresses.length === 1) {
                fetch(`http://localhost:3000/api/mylaser/billingadress/${user.billingAdresses[0].id}`, myInit2)
                .then(() => window.location.href = '/order-adresses.html')
            } if(adressOption.value === "yes" && user.billingAdresses.length === 0) {
                fetch(`http://localhost:3000/api/mylaser/billingadress`, myInit)
                .then(() => window.location.href = '/order-adresses.html')
                
            } if(adressOption.value === "no" && user.billingAdresses.length === 0) {
                window.location.href = '/order-add-billing-adress.html'
            } else {
                window.location.href = '/order-adresses.html'
            }
        })
    })
}

function cancel() {
    window.location.href = '/my-adresses.html'
}