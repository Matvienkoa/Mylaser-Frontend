if(token) {
    const decodedToken = jwt_decode(token);
    fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        if(!user || user.role !== 'admin') {
            window.location.href = '/index.html'
        }
    })
} else {
    window.location.href = '/index.html'
}