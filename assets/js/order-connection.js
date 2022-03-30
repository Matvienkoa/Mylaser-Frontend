function login() {
    return new Promise((resolve, reject) => {
        const loginInfos = {
            email: document.getElementById("login-email").value,
            password: document.getElementById("login-password").value
        }
        const myInit = {
                method: "POST",
                body: JSON.stringify(loginInfos),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
        }
        fetch(`http://localhost:3000/api/mylaser/auth/login`, myInit)
        .then(res => {
            if(!res.ok) {
                // Error states
                res.json().then((data) => {
                    console.log(data.message)
                    const boxError = document.getElementById('box-error-login');
                    boxError.innerHTML = data.message;
                    const emptyInput = document.querySelectorAll('.input-login');
                    emptyInput.forEach(input => {
                        if(input.value === "") {
                            input.classList.add('empty-login')
                        }
                    })
                })
            } else {
                res.json()
                .then(data => {
                    if(data.token){
                        localStorage.setItem("customer", data.token);
                        window.location.href = '/order-adresses.html'
                    }
                })
            }
        })
        .catch(function (error) {
            console.log(error)
            reject(error)
        })
    })
}

function signUp() {
    return new Promise((resolve, reject) => {
        const loginInfos = {
            email: document.getElementById("signup-email").value,
            password: document.getElementById("signup-password").value,
            firstName: document.getElementById("signup-firstName").value,
            lastName: document.getElementById("signup-lastName").value
        }
        const myInit = {
                method: "POST",
                body: JSON.stringify(loginInfos),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
        }
        fetch(`http://localhost:3000/api/mylaser/auth/signup`, myInit)
        .then(res => {
            if(!res.ok) {
                // Error states
                res.json().then((data) => {
                    console.log(data.message)
                    const boxError = document.getElementById('box-error-signup');
                    boxError.innerHTML = data.message;
                    const emptyInput = document.querySelectorAll('.input-signup');
                    emptyInput.forEach(input => {
                        if(input.value === "") {
                            input.classList.add('empty-signup')
                        }
                    })
                })
            } else {
                res.json()
                .then((res) => {
                    console.log(res)
                    //Send email auto
                    sendEmailToCustomer(res.user.email);
                    sendEmailToAdmin(res.user.email);
                    //Login auto after signup
                    fetch(`http://localhost:3000/api/mylaser/auth/login`, myInit)
                    .then(res => res.json())
                    .then(data => {
                        if(data.token){
                            localStorage.setItem("customer", data.token);
                            window.location.href = '/order-adresses.html'
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                })
            }
        })
        .catch(function (error) {
            console.log(error)
            reject(error)
        })
    })
}

function sendEmailToCustomer(mail) {
    const mailInfos = {
        email: mail,
        subject: 'Nouveau compte',
        text: 'Votre compte a bien été créé',
        html: 'Votre compte a bien été créé'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`http://localhost:3000/api/mylaser/mail`, mailInit)
    .then((res) => {
        console.log(res)
    })
}

function sendEmailToAdmin(mail) {
    const mailInfos = {
        email: mail,
        subject: 'Nouveau compte client',
        text: 'Un nouveau compte client a été créé',
        html: 'Un nouveau compte client a été créé'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`http://localhost:3000/api/mylaser/mail`, mailInit)
    .then((res) => {
        console.log(res)
    })
}