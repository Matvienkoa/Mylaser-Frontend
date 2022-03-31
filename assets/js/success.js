const orderNumber = document.getElementById('order-number');
const session_id = new URL (location.href).searchParams.get('session_id');
const orders = document.getElementById('orders');
const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);

fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
.then((res) => res.json())
.then((user) => {
    sendEmailToCustomer(user.email);
    sendEmailToAdmin(user.email);
})

fetch(`http://localhost:3000/api/mylaser/payment/${session_id}`, {headers: {"Authorization": 'Bearer ' + token}})
.then(res => {
    if(res.ok) {
        localStorage.removeItem('currentCart');
        localStorage.removeItem('deliveryChoice');
        localStorage.removeItem('currentPrice');
        localStorage.removeItem('currentQuote');
        res.json()
        .then(number => {
            orderNumber.innerHTML = number;
            const editPayment = {
                payment: "Valid"
            };
            const myInitPayment = {
                method: "PUT",
                body: JSON.stringify(editPayment),
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                    "Authorization": 'Bearer ' + token,
                },
            };
            fetch(`http://localhost:3000/api/mylaser/order/${number}/payment`, myInitPayment)
            .then((response) => response.json())
            .catch(e => {console.error(e.error)})
        })
    }
})

function sendEmailToCustomer(mail) {
    const mailInfos = {
        email: mail,
        subject: 'Merci pour votre commande',
        text: 'Merci pour votre commande',
        html: 'Merci pour votre commande'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Bearer ' + token,
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
        subject: 'Nouvelle commande',
        text: 'Nouvelle commande',
        html: 'Nouvelle commande'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Bearer ' + token,
        },
    }
    fetch(`http://localhost:3000/api/mylaser/mail`, mailInit)
    .then((res) => {
        console.log(res)
    })
}
        
orders.addEventListener('click', () => {
    window.location.href = '/my-orders.html';
});