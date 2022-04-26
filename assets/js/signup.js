function signUp() {
    return new Promise(() => {
        const loginInfos = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value,
            password2: document.getElementById("password2").value,
            firstName: document.getElementById("firstName").value,
            lastName: document.getElementById("lastName").value
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
                res.json()
                .then((res) => {
                    //Send email auto
                    sendEmailToCustomer(res.user);
                    sendEmailToAdmin();
                    //Login auto after signup
                    fetch(`http://localhost:3000/api/mylaser/auth/login`, myInit)
                    .then(res => res.json())
                    .then(data => {
                        if(data.token){
                            localStorage.setItem("customer", data.token);
                            window.location.href = '/my-account.html'
                        }
                    })
                    .catch(function (error) {
                        console.log(error)
                    })
                })
            }
        })
    })
}

function sendEmailToCustomer(user) {
    const mailInfos = {
        name: user.firstName,
        intro: 'Bienvenue chez MyLaser !',
        email: user.email,
        subject: 'Bienvenue chez MyLaser !',
        instructions: 'Votre Espace client a bien été créé. Vous pouvez désormais vous y rendre en vous connectant ici :',
        text: 'Accéder à votre compte',
        link: 'http://localhost:5501/my-account.html',
        outro: 'L\'équipe MyLaser vous remercie et a hâte de vous retrouver !'
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

function sendEmailToAdmin() {
    const mailInfos = {
        name: 'MyLaser',
        intro: 'Un nouveau compte client a été créé !',
        email: 'matvienko.anthony@gmail.com',
        subject: 'Nouveaux Compte Client !',
        instructions: 'Vous pouvez le retrouver sur votre espace Admin en cliquant ici :',
        text: 'Accéder à votre espace',
        link: 'http://localhost:5501/admin-access-bo.html',
        outro: 'A bientôt !'
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