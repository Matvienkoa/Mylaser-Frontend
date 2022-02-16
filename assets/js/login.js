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
            if(data.token){
                localStorage.setItem("customer", data.token);
                window.location.href = '/account.html'
            }
        })
        .catch(function (error) {
            console.log(error)
            reject(error)
        })
    })
}