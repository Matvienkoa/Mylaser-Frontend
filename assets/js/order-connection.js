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
        .then(res => res.json())
        .then(data => {
            if(data.token){
                localStorage.setItem("customer", data.token);
                window.location.href = '/order-adresses.html'
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
        .then(res => res.json())
        .then(() => {
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
        .catch(function (error) {
            console.log(error)
            reject(error)
        })
    })
}