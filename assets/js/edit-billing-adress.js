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

if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const billingAdress = user.billingAdresses[0];
        firstName.value = billingAdress.firstName;
        lastName.value = billingAdress.lastName;
        line1.value = billingAdress.line1;
        line2.value = billingAdress.line2;
        postalCode.value = billingAdress.postalCode;
        city.value = billingAdress.city;
        country.value = billingAdress.country;
        phone.value = billingAdress.phone;
    });
};

function editBillingAdress() {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const Adress = user.billingAdresses[0];
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
        };
        const myInit = {
            method: "PUT",
            body: JSON.stringify(updateAdress),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": 'Bearer ' + token,
            },
        };
        fetch(`http://localhost:3000/api/mylaser/billingadress/${Adress.id}`, myInit)
        .then(res =>{
            if(!res.ok) {
                // Error states
                res.json().then((data) => {
                    console.log(data.message);
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
                window.location.href = '/my-adresses.html';
            };
        })
        .catch(function (error) {
            console.log(error);
        });
    });
};

function cancel() {
    window.location.href = '/my-adresses.html';
};

const emptyInput = document.querySelectorAll('.input');
emptyInput.forEach(input => {
    input.addEventListener('input', () => {
        input.classList.replace('empty', 'full');
    });
});