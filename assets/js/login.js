const tokenLS = localStorage.getItem('customer');
const boxError = document.getElementById('box-error');

// Token expired - redirect to Login
if(tokenLS) {
    const tokenLSV = jwt_decode(tokenLS);
    if(Date.now() >= tokenLSV.exp*1000) {
        boxError.innerHTML = "Votre session a expirée, veuillez vous reconnecter"
    }
}

// Login
function login() {
    return new Promise(() => {
        const loginInfos = {
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
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
                .then(data => {
                    const token = data.token;
                    const decodedToken = jwt_decode(token);
                    if(token){
                        fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
                        .then((res) => res.json())
                        .then((user) => {
                            if(user.role === "customer") {
                                localStorage.setItem("customer", token);
                                window.location.href = '/my-account.html'
                            }
                            if(user.role === "admin") {
                                localStorage.setItem("customer", token);
                                window.location.href = '/admin-access-bo.html'
                            }
                        })
                        .catch(function (error) {
                            console.log(error)
                        })
                    }
                })
            }
        })
    })
}