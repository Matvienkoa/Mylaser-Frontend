const token = localStorage.getItem('customer');
const email = document.getElementById('email');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const password = document.getElementById("new-password");
const decodedToken = jwt_decode(token);
const backButton = document.getElementById('back-button');
const deleteUser = document.getElementById('confirmation-delete-user');

if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        email.value = user.email
        firstName.value = user.firstName
        lastName.value = user.lastName
    })
    .catch((error) => console.log(error));
}

function updateInfos() {
    const updateInfos = {
        email: email.value,
        firstName: firstName.value,
        lastName: lastName.value,
        password: password.value
    }
    const myInit = {
                method: "PUT",
                body: JSON.stringify(updateInfos),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": 'Bearer ' + token,
                },
    }
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, myInit)
    .then(res => {
        if(!res.ok) {
            // Error states
            res.json().then((data) => {
                const boxError = document.getElementById('box-error');
                boxError.innerHTML = data.message;
                const emptyInput = document.querySelectorAll('.input');
                emptyInput.forEach(input => {
                    if(input.value === "") {
                        input.classList.add('empty')
                    }
                })
            })
        } else {
            window.location.reload();
        }
    })
}

backButton.addEventListener('click', () => window.location.href = '/my-account.html')

function showConfirm() {
    const confirmation = document.getElementById('confirmation-delete-user');
    confirmation.classList.replace('hidden', 'visible')
}

function hideConfirm() {
    const confirmation = document.getElementById('confirmation-delete-user');
    confirmation.classList.replace('visible', 'hidden')
}

document.getElementById('yes').addEventListener('click', () => {
    deleteAccount(decodedToken.userId);
});

function deleteAccount(user) {
    fetch(`http://localhost:3000/api/mylaser/user/${user}`, {method: "DELETE", headers: {"Authorization": 'Bearer ' + token}})
    .then(() => {
        localStorage.removeItem('customer');
        window.location.href = `/index.html`;
    })
}
