const cart = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const decodedToken = jwt_decode(token);
const relaysList = document.getElementById('relaysList')

getMap();

function getInfosUser() {
    return new Promise(resolve => {
        fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
        .then((res) => res.json())
        .then((user) => {
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
        fetch(`api/mylaser/cart/${cart}`)
        .then((res) => res.json())
        .then((currentCart) => {
            const operator = currentCart.operatorCode;
            resolve(operator)
        })
    })
}

async function getMap() {
    const infosUser = await getInfosUser()
    const infosCart = await getInfosCart()
    fetch('api/mylaser/boxtal/gettoken')
        .then((res) => res.json())
        .then((token) => {
            var boxtalMapsIframe = new BoxtalMapsIframe("boxtal-maps-iframe");
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
                fetch(`api/mylaser/cart/addrelayinfos/${cart}`, updateCart)
                .then((res) => res.json())
                .then((newCartEdit) => {
                    document.getElementById('relay-button').addEventListener('click', () => {
                        window.location.href = '/order-payment.html'
                    })
                })
            }, function (message) {
            });
        })
}

