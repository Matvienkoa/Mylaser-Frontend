// const deliveries = document.querySelectorAll('.delivery');
const cart = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const deliveries = document.getElementById('deliveries')

sendInfosColis()

function getInfosUser() {
    return new Promise(resolve => {
        const decodedToken = jwt_decode(token);
        fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
        .then((res) => res.json())
        .then((user) => {
            const sender = {
                adress: user.deliveryAdresses[0]
            }
            resolve(sender)
        })
    })
}

function getInfosCart() {
    return new Promise(resolve => {
        fetch(`http://localhost:3000/api/mylaser/cart/${cart}`)
        .then((res) => res.json())
        .then((currentCart) => {
            const longueur = currentCart.length/10;
            const largeur = currentCart.width/10;
            const hauteur = Math.ceil(currentCart.height);
            const poids = currentCart.weight/1000
            const infosShipping = {
                longueur: longueur,
                largeur: largeur,
                hauteur: hauteur,
                poids: poids
            }
            resolve(infosShipping)
        })
    })
}

async function sendInfosColis() {
    const user = await getInfosUser()
    const cart = await getInfosCart()
    const colisInfos = {
        user: user,
        quotes: {
            longueur: cart.longueur,
            largeur: cart.largeur,
            hauteur: cart.hauteur,
            poids: cart.poids
        }
    }
    console.log(colisInfos)
    const myInit = {
        method: "POST",
        body: JSON.stringify(colisInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    }
    fetch('http://localhost:3000/api/mylaser/boxtal/', myInit)
    .then((res) => res.json())
    .then((shipments) => {
        createList(shipments.cotation.shipment.offer)
    })
}

function createList(offerList) {
    offerList.forEach(offer => {
            console.log(offer);

            const delivery = document.createElement('div');
            delivery.className = 'delivery';
            delivery.setAttribute('data-operator', offer.operator.code._text);
            delivery.setAttribute('data-service', offer.service.code._text);

            if(offer.operator.code._text === 'DHLE') {
                delivery.innerHTML =
                '<span class="delivery-title"><img src="' + offer.operator.logo._text + '" alt=""></span>' +
                '<p class="delivery-price">' + offer.price["tax-inclusive"]._text + ' €</p>' +
                '<span class="delivery-description">' +
                '<h4 class="delivery-description-title">' + offer.service.label._text +'</h4>' +
                '<p class="delivery-description-text">Texte</p></span>'
            } else {
                delivery.innerHTML =
                '<span class="delivery-title"><img src="' + offer.operator.logo._text + '" alt=""></span>' +
                '<p class="delivery-price">' + offer.price["tax-inclusive"]._text + ' €</p>' +
                '<span class="delivery-description">' +
                '<h4 class="delivery-description-title">' + offer.service.label._text +'</h4>' +
                '<p class="delivery-description-text">' + offer.delivery.label._text + '</p></span>'
            }

            deliveries.appendChild(delivery)

            delivery.addEventListener('click', () => {
                localStorage.setItem('deliveryOperator', delivery.dataset.operator);
                localStorage.setItem('deliveryService', delivery.dataset.service);
                sendShippingInfos(offer)
                window.location.href = '/order-payment.html';
            });
    })
}

function sendShippingInfos(offer) {
    const operatorCode = offer.operator.code._text;
    const operatorService = offer.operator.label._text;
    const operatorPriceHT = offer.price["tax-exclusive"]._text;
    const operatorPriceTTC = offer.price["tax-inclusive"]._text;

    const newCart = {
        operatorCode: operatorCode,
        operatorService: operatorService,
        operatorPriceHT: operatorPriceHT,
        operatorPriceTTC: operatorPriceTTC
    }

    console.log(newCart)
    const updateCart = {
        method: "PUT",
        body: JSON.stringify(newCart),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    };
    fetch(`http://localhost:3000/api/mylaser/cart/addshippinginfos/${cart}`, updateCart)
    .then((res) => res.json())
    .then((newCartEdit) => console.log(newCartEdit))
}



