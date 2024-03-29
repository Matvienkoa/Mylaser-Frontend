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

function addBillingAdress() {
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
    };
    const myInit = {
        method: "POST",
        body: JSON.stringify(adressInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Bearer ' + token,
        },
    };
    fetch(`api/mylaser/billingadress`, myInit)
    .then(res => {
        if(!res.ok) {
            // Error states
            res.json().then((data) => {
                const boxError = document.getElementById('box-error');
                if(data.message === undefined) {
                    boxError.innerHTML = 'Une erreur est survenue, veuillez vérifier vos informations';
                } else {
                    boxError.innerHTML = data.message;
                }
                const emptyInput = document.querySelectorAll('.input');
                emptyInput.forEach(input => {
                    if(input.value === "") {
                        input.classList.add('empty');
                    };
                });
            });
        } else {
            window.location.href = '/order-adresses.html';
        };
    });
};

function cancel() {
    window.location.href = '/order-adresses.html';
};

const emptyInput = document.querySelectorAll('.input');
emptyInput.forEach(input => {
    input.addEventListener('input', () => {
        input.classList.replace('empty', 'full');
    });
});