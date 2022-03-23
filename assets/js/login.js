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
        fetch(`http://localhost:3000/api/mylaser/auth/login`, myInit)
        .then(res => {
            if(!res.ok) {
                // Error states
                res.json().then((data) => {
                    console.log(data.message)
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
                .then(data => {
                    const token = data.token;
                    const decodedToken = jwt_decode(token);
                    if(token){
                        fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
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