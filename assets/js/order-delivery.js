// const deliveries = document.querySelectorAll('.delivery');
const cart = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const deliveries = document.getElementById('deliveries')

showSpinner();

// ----------- Spinner -----------
function showSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.classList.replace('spinner-off', 'lds-ring');
    const body = document.querySelector('body');
    body.classList.add('on');
};
function hideSpinner() {
    const spinner = document.getElementById('spinner');
    spinner.classList.replace('lds-ring', 'spinner-off');
    const body = document.querySelector('body');
    body.classList.remove('on');
};

sendInfosColis();

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
            const poids = currentCart.weight/1000;
            const valeur = currentCart.price*1.2;
            const infosShipping = {
                longueur: longueur,
                largeur: largeur,
                hauteur: hauteur,
                poids: poids,
                valeur: valeur
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
        hideSpinner();
        createList(shipments.cotation.shipment.offer);
    })
}

function createList(offerList) {
    offerList.forEach(offer => {
            const delivery = document.createElement('div');
            delivery.className = 'delivery';
            if(offer.operator.code._text === 'DHLE') {
                delivery.innerHTML =
                '<span class="delivery-title"><img src="' + offer.operator.logo._text + '" alt=""></span>' +
                '<p class="delivery-price">' + offer.price["tax-inclusive"]._text + ' € TTC</p>' +
                '<span class="delivery-description">' +
                '<h3 class="delivery-description-title">' + offer.service.label._text +'</h3>' +
                '<p class="delivery-description-text">Texte</p></span>'
            } else {
                delivery.innerHTML =
                '<span class="delivery-title"><img src="' + offer.operator.logo._text + '" alt=""></span>' +
                '<p class="delivery-price">' + offer.price["tax-inclusive"]._text + ' € TTC</p>' +
                '<span class="delivery-description">' +
                '<h3 class="delivery-description-title">' + offer.service.label._text +'</h3>' +
                '<p class="delivery-description-text">' + offer.delivery.label._text + '</p></span>'
            }
            deliveries.appendChild(delivery)
            delivery.addEventListener('click', () => {
                sendShippingInfos(offer)
                if(offer.delivery.type.code._text === 'PICKUP_POINT') {
                    window.location.href = '/order-delivery-relay.html';
                } else {
                    window.location.href = '/order-payment.html';
                }
            });
    })
}

function sendShippingInfos(offer) {
    const operatorCode = offer.operator.code._text;
    const operatorService = offer.service.code._text;
    const operatorPriceHT = offer.price["tax-exclusive"]._text;
    const operatorPriceTTC = offer.price["tax-inclusive"]._text;
    const operatorLabel = offer.operator.label._text;
    const shippingType = offer.delivery.type.code._text;

    const newCart = {
        operatorCode: operatorCode,
        operatorService: operatorService,
        operatorPriceHT: operatorPriceHT,
        operatorPriceTTC: operatorPriceTTC,
        operatorLabel: operatorLabel,
        shippingType: shippingType
    }
    const updateCart = {
        method: "PUT",
        body: JSON.stringify(newCart),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    };
    fetch(`http://localhost:3000/api/mylaser/cart/addshippinginfos/${cart}`, updateCart)
    .then((res) => res.json())
}

// INFOS API BOXTAL CONTENTS
// fetch('http://localhost:3000/api/mylaser/boxtal/')
// .then((res) => res.json())
// .then((contents) => console.log(contents))


