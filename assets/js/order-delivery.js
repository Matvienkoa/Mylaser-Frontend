// const deliveries = document.querySelectorAll('.delivery');
const products = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const deliveries = document.getElementById('deliveries')


// deliveries.forEach(delivery => {
//     delivery.addEventListener('click', () => {
//         localStorage.setItem('deliveryChoice', delivery.dataset.delivery);
//         window.location.href = '/order-payment.html';
//     });
// });
setQuotes()
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

function setQuotes() {
    let heights = [];
    let lengths = [];
    let widths = [];
    products.forEach(product => {
        fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product}`)
        .then((res) => res.json())
        .then((product) => {
            heights.push(parseInt(product.thickness))
            lengths.push(product.height)
            widths.push(product.width)
            localStorage.setItem('heights', JSON.stringify(heights))
            localStorage.setItem('lengths', JSON.stringify(lengths))
            localStorage.setItem('widths', JSON.stringify(widths))
        })
    })
}

async function sendInfosColis() {
    const user = await getInfosUser()
    const colisInfos = {
        user: user,
        quotes: {
            longueur: calculLength(),
            largeur: calculWidth(),
            hauteur: calculHeight(),
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
        createList(shipments.cotation.shipment.offer)
    })
}

// Calcul dimensions
function calculHeight() {
    const heights = JSON.parse(localStorage.getItem('heights'))
    let height = 0;
    for (let i = 0; i < heights.length; i++) {
        height += heights[i];
    }
    return Math.ceil(height/10)
}
function calculLength() {
    const lengths = JSON.parse(localStorage.getItem('lengths'))
    let length = 0;
    length = Math.max(...lengths)
    return Math.ceil(length/10)
}
function calculWidth() {
    const widths = JSON.parse(localStorage.getItem('widths'))
    let width = 0;
    width = Math.max(...widths)
    return Math.ceil(width/10)
}


// fetch('http://localhost:3000/api/mylaser/boxtal/')
// .then((res) => res.json())
// .then((shipments) => {
//     createList(shipments.cotation.shipment.offer)
// })

function createList(offerList) {
    offerList.forEach(offer => {


        if(offer.operator.code._text === 'COPR') {

            console.log(offer);

            const delivery = document.createElement('div');
            delivery.className = 'delivery';
            delivery.setAttribute('data-operator', offer.operator.code._text);
            delivery.setAttribute('data-service', offer.service.code._text);

            if(offer.delivery.type.code._text === 'PICKUP_POINT') {
                delivery.innerHTML =
                '<span class="delivery-title"><img src="' + offer.operator.logo._text + '" alt=""></span>' +
                '<p class="delivery-price">' + offer.price["tax-inclusive"]._text + ' €</p>' +
                '<span class="delivery-description">' +
                '<h4 class="delivery-description-title">' + offer.service.label._text +'</h4>' +
                '<p class="delivery-description-text">' + offer.delivery.label._text + '</p></span>' +
                '<span>Liste des points relais</span>'
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
                // window.location.href = '/order-payment.html';
            });
        }


    })
}



