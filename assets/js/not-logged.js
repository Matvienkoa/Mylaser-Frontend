if(token) {
    const decodedToken = jwt_decode(token);
    fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        if(!user) {
            window.location.href = '/login.html'
        } else {
            if(Date.now() >= decodedToken.exp*1000) {
                window.location.href = '/login.html'
            }
        }
    })
} else {
    window.location.href = '/login.html'
}