const cart = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);
const relaysList = document.getElementById('relaysList')

getMap();
// getRelays();

function getInfosUser() {
    return new Promise(resolve => {
        fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
        .then((res) => res.json())
        .then((user) => {
            console.log(user.deliveryAdresses[0])
            const adressInfos = {
                city: user.deliveryAdresses[0].city,
                postalCode: user.deliveryAdresses[0].postalCode,
                adress: user.deliveryAdresses[0].line1,

            }
            resolve(adressInfos)
        })
    })
}

function getInfosCart() {
    return new Promise(resolve => {
        fetch(`http://localhost:3000/api/mylaser/cart/${cart}`)
        .then((res) => res.json())
        .then((currentCart) => {
            console.log(currentCart)
            const operator = currentCart.operatorCode;
            resolve(operator)
        })
    })
}

// async function getRelays() {
//     const infosUser = await getInfosUser()
//     const infosCart = await getInfosCart()
//     const infosRelay = {
//         user: infosUser,
//         cart: infosCart
//     }
//     console.log(infosRelay)
//     const myInit = {
//         method: "POST",
//         body: JSON.stringify(infosRelay),
//         headers: {
//             "Content-Type": "application/json; charset=utf-8"
//         },
//     }
//     fetch('http://localhost:3000/api/mylaser/boxtal/getrelays', myInit)
//     .then((res) => res.json())
//     .then((relays) => {
//         console.log(relays.points)
//         createList(relays.points.point)
//     })
// }

// function createList(relayList) {
//     relayList.forEach(relay => {
//             console.log(relay);
//             const relayDetail = document.createElement('div');
//             relayDetail.className = 'relay';
//             relayDetail.innerHTML =
//             '<span>' + relay.name._text + '</span>'
//             relaysList.appendChild(relayDetail)
//             relayDetail.addEventListener('click', () => {
//                 sendRelayInfos(relay);
//                 window.location.href = '/order-payment.html';
//             })
//     })
// }

// function sendRelayInfos(relay) {
//     const relayCode = relay.code._text;
//     const newCart = {
//         relayCode: relayCode
//     }
//     const updateCart = {
//         method: "PUT",
//         body: JSON.stringify(newCart),
//         headers: {
//             "Content-Type": "application/json; charset=utf-8"
//         },
//     };
//     fetch(`http://localhost:3000/api/mylaser/cart/addrelayinfos/${cart}`, updateCart)
//     .then((res) => res.json())
//     .then((newCartEdit) => console.log(newCartEdit))
// }

async function getMap() {
    const infosUser = await getInfosUser()
    const infosCart = await getInfosCart()
    fetch('http://localhost:3000/api/mylaser/boxtal/gettoken')
        .then((res) => res.json())
        .then((token) => {
            var boxtalMapsIframe = new BoxtalMapsIframe("boxtal-maps-iframe");

            console.log(infosUser)
            console.log(infosCart)

            const parcelPoints = {
                accessToken : token.accessToken,
                address: {
                    street : infosUser.adress,
                    zipCode : infosUser.postalCode,
                    city : infosUser.city,
                    country : "FR"
                },
                parcelPointNetworks : [infosCart + '_NETWORK']
            };

            boxtalMapsIframe.searchParcelPoints(parcelPoints, function (parcelPoint) {
                console.log(parcelPoint)

                document.getElementById('name').innerHTML = parcelPoint.name;
                document.getElementById('adress').innerHTML = parcelPoint.location.street;
                document.getElementById('cp').innerHTML = parcelPoint.location.zipCode;
                document.getElementById('city').innerHTML = parcelPoint.location.city;
                document.getElementById('button-box').innerHTML = 
                '<input type="button" value="Valider" id="relay-button" class="primary">'

                const newCart = {
                    relayCode: parcelPoint.code
                }
                const updateCart = {
                    method: "PUT",
                    body: JSON.stringify(newCart),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8"
                    },
                };
                fetch(`http://localhost:3000/api/mylaser/cart/addrelayinfos/${cart}`, updateCart)
                .then((res) => res.json())
                .then((newCartEdit) => {
                    console.log(newCartEdit)
                    document.getElementById('relay-button').addEventListener('click', () => {
                        window.location.href = '/order-payment.html'
                    })
                })

            }, function (message) {
                // handle the error message
            });

        })
}

