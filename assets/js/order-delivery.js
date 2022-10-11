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
        fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
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
        fetch(`api/mylaser/cart/${cart}`)
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
                valeur: valeur,
                express: currentCart.express
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
            poids: cart.poids,
            express: cart.express
        }
    }
    const myInit = {
        method: "POST",
        body: JSON.stringify(colisInfos),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
        },
    }
    fetch('api/mylaser/boxtal/', myInit)
    .then((res) => res.json())
    .then((shipments) => {
        hideSpinner();
        createList(shipments.cotation.shipment.offer);
        
    })
}

function createList(offerList) {
    const delivery = document.createElement('div');
    delivery.className = 'delivery';
    delivery.innerHTML =
        '<span class="delivery-title"><img src="./images/logo-white.png" alt=""></span>' +
        '<p class="delivery-price">Gratuit</p>' +
        '<span class="delivery-description">' +
        "<h3 class='delivery-description-title'>Retrait à l'entrepôt</h3>" +
        "<p class='delivery-description-text'>Retirez votre commande directement à l'adresse de notre entrepôt :<br>12 Rue Louis Lumière<br>44980 Sainte-Luce-sur-Loire</p></span>"
    deliveries.appendChild(delivery)
    delivery.addEventListener('click', () => {
        sendShippingInfosCompany()
    });

    function service(offer) {
        let text = "";
        if (offer.service.code._text === 'ChronoShoptoShop') {
            text = "Retirez votre colis dans un point relais Chronopost sous 3 à 4 jours après expédition";
            return text
        }
        if (offer.service.code._text === 'CoprRelaisRelaisNat') {
            text = "Retirez votre colis dans un point relais Colis Privé sous 6 jours après expédition";
            return text
        }
        if (offer.service.code._text === 'RelaisColis') {
            text = "Retirez votre colis dans un point relais Relais Colis sous 3 à 5 jours après expédition";
            return text
        }
        if (offer.service.code._text === 'CpourToi') {
            text = "Retirez votre colis dans un point relais Mondial Relay sous 3 à 4 jours après expédition";
            return text
        }
        if (offer.service.code._text === 'ChronoRelais') {
            text = "Retirez votre colis dans un Chrono relais sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'CoprRelaisDomicileNat') {
            text = "Recevez votre colis à Domicile sans signature sous 6 jours après expédition";
            return text
        }
        if (offer.service.code._text === 'CoprRelaisSignatureNat') {
            text = "Recevez votre colis à Domicile contre signature sous 6 jours après expédition";
            return text
        }
        if (offer.service.code._text === 'EconomyAccessPoint') {
            text = "Retirez votre colis dans un point relais UPS sous 48 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'ColissimoAccess') {
            text = "Recevez votre colis à Domicile sans signature sous 48 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'ColissimoExpert') {
            text = "Recevez votre colis à Domicile contre signature sous 48 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'Chrono18') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'ChronoRelaisPickup') {
            text = "Retirez votre colis dans un Chrono relais sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'Chrono13') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'DomesticExpress') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'Chrono18Pickup') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'ExpressNationalPremium12H') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'Standard') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'ExpressSaver') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
        if (offer.service.code._text === 'ExpressStandard') {
            text = "Recevez votre colis à Domicile en express sous 24 heures après expédition";
            return text
        }
    }

    if (!offerList.length) {
        const delivery = document.createElement('div');
        delivery.className = 'delivery';
        delivery.innerHTML =
            '<span class="delivery-title"><img src="' + offerList.operator.logo._text + '" alt=""></span>' +
            '<p class="delivery-price">' + offerList.price["tax-inclusive"]._text + ' € TTC</p>' +
            '<span class="delivery-description">' +
            '<h3 class="delivery-description-title">' + offerList.service.label._text + '</h3>' +
            '<p class="delivery-description-text">' + service(offerList) + '</p></span>'
        deliveries.appendChild(delivery)
        delivery.addEventListener('click', () => {
            sendShippingInfos(offerList)
        });
    }

    if (offerList.length) {
        offerList.forEach(offer => {
            const delivery = document.createElement('div');
            delivery.className = 'delivery';
            delivery.innerHTML =
                '<span class="delivery-title"><img src="' + offer.operator.logo._text + '" alt=""></span>' +
                '<p class="delivery-price">' + offer.price["tax-inclusive"]._text + ' € TTC</p>' +
                '<span class="delivery-description">' +
                '<h3 class="delivery-description-title">' + offer.service.label._text + '</h3>' +
                '<p class="delivery-description-text">' + service(offer) + '</p></span>'
            deliveries.appendChild(delivery)
            delivery.addEventListener('click', () => {
                sendShippingInfos(offer)
            });
        })
    }
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
    fetch(`api/mylaser/cart/addshippinginfos/${cart}`, updateCart)
    .then((res) => res.json())
    .then((newCart) => {
        if (newCart.shippingType === 'HOME') {
            window.location.href = '/order-payment.html';
        } else {
            window.location.href = '/order-delivery-relay.html';
        }
    })
}

function sendShippingInfosCompany() {
    const newCart = {
        operatorCode: 'COMPANY',
        shippingType: 'COMPANY',
        operatorService: 'COMPANY',
        operatorLabel: 'COMPANY',
        operatorPriceHT: 0,
        operatorPriceTTC: 0,
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
        .then(() => {
            window.location.href = '/order-payment.html';
        })
}


