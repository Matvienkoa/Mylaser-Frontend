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
                    sendEmailToCustomer(res.user.email);
                    sendEmailToAdmin(res.user.email);
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