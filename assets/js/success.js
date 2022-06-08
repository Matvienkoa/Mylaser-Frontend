const orderNumber = document.getElementById('order-number');
const session_id = new URL (location.href).searchParams.get('session_id');
const orders = document.getElementById('orders');
const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);

fetch(`http://localhost:3000/api/mylaser/payment/${session_id}`, {headers: {"Authorization": 'Bearer ' + token}})
.then(res => {
    if(res.ok) {
        localStorage.removeItem('currentCart');
        localStorage.removeItem('currentQuote');
        res.json()
        .then(number => {
            fetch(`http://localhost:3000/api/mylaser/order/number/${number}`, {headers: {"Authorization": 'Bearer ' + token}})
            .then((res) => res.json())
            .then((order) => {
                orderNumber.innerHTML = number;
                if(order.payment !== 'Valid') {
                    sendEmailToCustomer(number);
                    sendEmailToAdmin(number);
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
                            const valeur = order.priceTTC/100;
                            const relayCode = order.relayCode;

                            if(order.shippingType === 'PICKUP_POINT') {
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
                                    service: service,
                                    relayCode: relayCode,
                                    valeur: valeur,
                                }

                                const myInit = {
                                    method: "POST",
                                    body: JSON.stringify(shippingInfos),
                                    headers: {
                                        "Content-Type": "application/json; charset=utf-8"
                                    },
                                }
                                fetch('http://localhost:3000/api/mylaser/boxtal/sendshipmentpickuppoint', myInit)
                                .then((res) => res.json())
                            } else {
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
                                    service: service,
                                    valeur: valeur,
                                }

                                const myInit = {
                                    method: "POST",
                                    body: JSON.stringify(shippingInfos),
                                    headers: {
                                        "Content-Type": "application/json; charset=utf-8"
                                    },
                                }
                                fetch('http://localhost:3000/api/mylaser/boxtal/sendshipmenthome', myInit)
                                .then((res) => res.json())
                            }
                        })
                    })
                    .catch(e => {console.error(e.error)})
                }
            })
        })
    }
})

function sendEmailToCustomer(number) {
    fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((user) => {
        const mailInfos = {
            name: user.firstName,
            intro: `Nous vous remercions pour votre commande N° : ${number} sur le site de MyLaser !`,
            email: user.email,
            subject: `Confirmation de Commande N° : ${number} !`,
            instructions: `Votre commande a bien été enregistrée, vous serez rapidement informé de son état d\'avancement. Pour la retrouver : http://localhost:5501/my-order.html?order=${number}`,
            text: 'Ma Commande',
            link: `http://localhost:5501/my-order.html?order=${number}`,
            outro: 'A bientôt sur MyLaser !'
        }
        const mailInit = {
            method: "POST",
            body: JSON.stringify(mailInfos),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": 'Bearer ' + token,
            },
        }
        fetch(`http://localhost:3000/api/mylaser/mail/button`, mailInit)
    })
}

function sendEmailToAdmin(number) {
    const mailInfos = {
        name: 'MyLaser',
        intro: 'Un nouvelle commande est arrivée !',
        email: 'anthony.matvienko@westcode-dev.fr',
        subject: 'Nouvelle Commande !',
        instructions: `Vous pouvez la retrouver en cliquant ici : http://localhost:5501/admin-access-bo-order.html?order=${number}`,
        text: 'Commande',
        link: `http://localhost:5501/admin-access-bo-order.html?order=${number}`,
        outro: 'A bientôt'
    }
    const mailInit = {
        method: "POST",
        body: JSON.stringify(mailInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Bearer ' + token,
        },
    }
    fetch(`http://localhost:3000/api/mylaser/mail/button`, mailInit)
}
        
orders.addEventListener('click', () => {
    window.location.href = '/my-orders.html';
});