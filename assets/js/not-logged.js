if(token) {
    const decodedToken = jwt_decode(token);
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        if(!user) {
            window.location.href = '/login.html'
        }
    })
} else {
    window.location.href = '/login.html'
}