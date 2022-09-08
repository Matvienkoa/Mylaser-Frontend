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
        fetch(`api/mylaser/auth/login`, myInit)
        .then(res => {
            if(!res.ok) {
                // Error states
                res.json().then((data) => {
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
            password2: document.getElementById("signup-password2").value,
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
        fetch(`api/mylaser/auth/signup`, myInit)
        .then(res => {
            if(!res.ok) {
                // Error states
                res.json().then((data) => {
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
                    //Send email auto
                    sendEmailToCustomer(res.user);
                    sendEmailToAdmin();
                    //Login auto after signup
                    fetch(`api/mylaser/auth/login`, myInit)
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

function sendEmailToCustomer(user) {
    const mailInfos = {
        name: user.firstName,
        intro: 'Bienvenue chez MyLaser !',
        email: user.email,
        subject: 'Bienvenue chez MyLaser !',
        instructions: 'Votre Espace client a bien été créé. Vous pouvez désormais vous y rendre en vous connectant ici : https://dt-mylaser.com/my-account.html',
        text: 'Accéder à votre compte',
        link: 'https://dt-mylaser.com/my-account.html',
        outro: 'L\'équipe MyLaser vous remercie et a hâte de vous retrouver !'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`api/mylaser/mail/button`, mailInit)
}

function sendEmailToAdmin() {
    const mailInfos = {
        name: 'MyLaser',
        intro: 'Un nouveau compte client a été créé !',
        email: 'contact@dt-mylaser.com',
        subject: 'Nouveaux Compte Client !',
        instructions: 'Vous pouvez le retrouver sur votre espace Admin en cliquant ici : https://dt-mylaser.com/admin-access-bo.html',
        text: 'Accéder à votre espace',
        link: 'https://dt-mylaser.com/admin-access-bo.html',
        outro: 'A bientôt !'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
    }
    fetch(`api/mylaser/mail/button`, mailInit)
}