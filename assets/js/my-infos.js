const token = localStorage.getItem('customer');
const email = document.getElementById('email');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const password = document.getElementById("new-password");
const decodedToken = jwt_decode(token);
const backButton = document.getElementById('back-button');

if(token) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
    .then((res) => res.json())
    .then((user) => {
        email.value = user.email
        firstName.value = user.firstName
        lastName.value = user.lastName
    })
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
                },
    }
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, myInit)
    .then(() => window.location.reload())
}

backButton.addEventListener('click', () => window.location.href = '/account.html')
