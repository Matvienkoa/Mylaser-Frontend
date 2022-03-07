

function login() {
    return new Promise((resolve, reject) => {
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
        .then(res => res.json())
        .then(data => {
            const token = data.token;
            const decodedToken = jwt_decode(token);
            if(token){
                fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
                .then((res) => res.json())
                .then((user) => {
                    if(user.role === "customer") {
                        localStorage.setItem("customer", token);
                        window.location.href = '/account.html'
                    }
                    if(user.role === "admin") {
                        localStorage.setItem("customer", token);
                        window.location.href = '/admin-access-bo.html'
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