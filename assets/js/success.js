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
            .then((response) => {
                response.json()
                fetch(`http://localhost:3000/api/mylaser/order/number/${number}`, {headers: {"Authorization": 'Bearer ' + token}})
                .then((res) => res.json())
                .then((order) => {
                    console.log(order)
                    
                    const poids = order.weight/1000;
                    const longueur = order.length/10;
                    const largeur = order.width/10;
                    const hauteur = Math.ceil(order.height);
                    const destCP = order.daPC;
                    const destCity = order.daCity;
                    const destAdress = order.daLine1 + ', ' + order.daLine2;
                    const destFN = order.daFN;
                    const destLN = order.daLN;
                    const destEmail = order.email;
                    const destTel = order.daPhone;
                    const operator = order.shippingCode;
                    const service = order.shipping;

                    const shippingInfos = {
                        poids: poids,
                        longueur: longueur,
                        largeur: largeur,
                        hauteur: hauteur,
                        destCP: destCP,
                        destCity: destCity,
                        destAdress: destAdress,
                        destFN: destFN,
                        destLN: destLN,
                        destEmail: destEmail,
                        destTel: destTel,
                        operator: operator,
                        service: service
                    }

                    console.log(shippingInfos)

                    const myInit = {
                        method: "POST",
                        body: JSON.stringify(shippingInfos),
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                    }
                    fetch('http://localhost:3000/api/mylaser/boxtal/sendshipment', myInit)
                    .then((res) => res.json())
                    .then((commande) => {
                        console.log(commande)
                    })
                })
            })
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