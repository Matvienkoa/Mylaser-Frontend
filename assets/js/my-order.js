const number = new URL (location.href).searchParams.get('order');
const token = localStorage.getItem('customer');
const numberOrder = document.getElementById('number-order');
const dateOrder = document.getElementById('date-order');
const statusOrder = document.getElementById('status-order');
const tableBody = document.getElementById('table-body');
const subTotal = document.getElementById('subtotal');
const shipping = document.getElementById('shipping');
const totalPrice = document.getElementById('total-price');
const delivery = document.getElementById('delivery');
const dafn = document.getElementById('dafn');
const daln = document.getElementById('daln');
const dal1 = document.getElementById('dal1');
const dal2 = document.getElementById('dal2');
const dapc = document.getElementById('dapc');
const dacity = document.getElementById('dacity');
const dacountry = document.getElementById('dacountry');
const daphone = document.getElementById('daphone');
const bafn = document.getElementById('bafn');
const baln = document.getElementById('baln');
const bal1 = document.getElementById('bal1');
const bal2 = document.getElementById('bal2');
const bapc = document.getElementById('bapc');
const bacity = document.getElementById('bacity');
const bacountry = document.getElementById('bacountry');
const baphone = document.getElementById('baphone');

numberOrder.innerHTML = number;

fetch(`api/mylaser/order/number/${number}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((order) => {
        const decodedToken = jwt_decode(token);
        fetch(`api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
        .then((res) => res.json())
        .then((user) => {
            if(order.userId === user.id || user.role === 'admin') {
                const date = new Date(order.createdAt);
                const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
                dateOrder.innerHTML = dateFormated;
                statusOrder.innerHTML = order.status;

                if(order.express === 'yes') {
                    const expressStatut = document.createElement('p');
                    expressStatut.setAttribute('id', 'express-text')
                    expressStatut.innerHTML = 'Préparation Express - 24H';
                    const boxInfo = document.getElementById('box-infos');
                    boxInfo.appendChild(expressStatut);
                }

                if(order.discount === "yes") {
                    document.getElementById('ifDiscount').innerHTML = 'Remise de ' + order.discountAmount + '% appliquée'
                }

                subTotal.innerHTML = ((order.priceTTC-order.shippingPriceTTC)/100).toFixed(2) + ' €';
                shipping.innerHTML = (order.shippingPriceTTC/100).toFixed(2) + ' €';
                totalPrice.innerHTML = (order.priceTTC/100).toFixed(2) + ' €';
                
                if (order.shippingLabel === "COMPANY") {
                    delivery.innerHTML = "Retrait à l'entrepôt"
                } else {
                    delivery.innerHTML = order.shippingLabel;
                }
                dafn.innerHTML = order.daFN;
                daln.innerHTML = order.daLN;
                dal1.innerHTML = order.daLine1;
                dal2.innerHTML = order.daLine2;
                dapc.innerHTML = order.daPC;
                dacity.innerHTML = order.daCity;
                dacountry.innerHTML = order.daCountry;
                daphone.innerHTML = order.daPhone;
                bafn.innerHTML = order.baFN;
                baln.innerHTML = order.baLN;
                bal1.innerHTML = order.baLine1;
                bal2.innerHTML = order.baLine2;
                bapc.innerHTML = order.baPC;
                bacity.innerHTML = order.baCity;
                bacountry.innerHTML = order.baCountry;
                baphone.innerHTML = order.baPhone;

                order.orderdetails.forEach(quote => {
                    fetch(`api/mylaser/dxf/quote/${quote.quote}`)
                    .then((res) => res.json())
                    .then((quote) => {
                        const productRow = document.createElement('tr');
                        productRow.className = "productRow";
                        productRow.innerHTML =
                        '<td class="img">' + JSON.parse(quote.svg) + '</td>' +
                        '<td>' + (quote.width).toFixed(2) + ' X ' + (quote.height).toFixed(2) +' mm</td>' + 
                        '<td>' + quote.steel + '</td>' +
                        '<td>' + quote.thickness + ' mm</td>' +
                        '<td>' + quote.quantity + '</td>' +
                        '<td nowrap="nowrap">' + ((quote.price/100)*1.2).toFixed(2) + ' €</td>'
                        tableBody.appendChild(productRow);

                        let paths = document.querySelectorAll('path');
                        paths.forEach(path => {
                            path.removeAttribute('style')
                            path.setAttribute('style', 'stroke:white;stroke-width:1')
                        });
                        let circles = document.querySelectorAll('circle');
                        circles.forEach(circle => {
                            circle.removeAttribute('style')
                            circle.setAttribute('style', 'stroke:white;stroke-width:1')
                        })
                        let lines = document.querySelectorAll('line');
                        lines.forEach(line => {
                            line.removeAttribute('style')
                            line.setAttribute('style', 'stroke:white;stroke-width:1')
                        })
                        let svgs = document.querySelectorAll('svg')
                        svgs.forEach(svg => {
                            svg.removeAttribute('width')
                            svg.setAttribute('width', '100')
                            svg.removeAttribute('height')
                            svg.setAttribute('height', '100')
                        })
                    })
                });
            } else {
                window.location.href = '/my-orders.html'
            }
        })
    })

document.getElementById('back-to-orders').addEventListener('click', () => {
    window.location.href = '/my-orders.html'
})

function downloadInvoice() {
    fetch(`api/mylaser/order/number/${number}`, {headers: {"Authorization": 'Bearer ' + token}})
    .then((res) => res.json())
    .then((order) => {
        fetch(`api/mylaser/user/${order.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
        .then((res) => res.json())
        .then((user) => {
            
            const date = new Date(order.createdAt);
            const dateFormated = date.getDate() + ' / ' + (date.getMonth()+1) + ' / ' + date.getFullYear();
            
            var data = {
                // "customize": {
                //     "template": "SGVsbG8gd29ybGQh" // Must be base64 encoded html. This example contains 'Hello World!' in base64
                // },
                images: {
                    logo: 'https://i.ibb.co/RyTgcq2/logo-black.png'
                },
                sender: {
                    company: 'My Laser By DT-Systèmes',
                    address: '12 Rue Louis Lumière',
                    zip: '44980',
                    city: 'Sainte-Luce-sur-Loire',
                    country: 'France'
                    // "custom1": "custom value 1",
                    // "custom2": "custom value 2",
                    // "custom3": "custom value 3"
                },
                client: {
                    company: user.firstName + ' ' + user.lastName,
                    address: order.baLine1,
                    zip: order.baPC,
                    city: order.baCity,
                    country: order.baCountry
                    // "custom1": "custom value 1",
                    // "custom2": "custom value 2",
                    // "custom3": "custom value 3"
                },
                information: {
                    number: order.number,
                    date: dateFormated,
                    'due-date': dateFormated
                },
                products: [
                    {
                        quantity: 1,
                        description: 'Découpe métal - Commande N° : ' +  order.number,
                        'tax-rate': 20,
                        price: (order.price-order.shippingPrice)/100
                    },
                    {
                        quantity: 1,
                        description: 'Frais de Transport',
                        'tax-rate': 20,
                        price: order.shippingPrice/100
                    }
                ],
                'bottom-notice': "My Laser By DT-SYSTEMES - 12 RUE LOUIS LUMIERE - PARC D'ACTIVITES DE LA MADELEINE </br>44980 SAINTE LUCE SUR LOIRE - Email : contact@mylaser.fr - www.mylaser.fr</br>SIRET : 80523847 - APE : 3311Z - TVA Intra : FR 80 805 238 474",
                settings: {
                    currency: 'EUR',
                    locale: 'fr-FR',
                    "tax-notation": 'TVA'
                },
                translate: {
                    "invoice": "FACTURE",
                    "number": "Numéro",
                    "date": "Date",
                    "due-date": "Date d'échéance",
                    "subtotal": "Sous Total",
                    "products": "Produits",
                    "quantity": "Quantité",
                    "price": "Prix",
                    "product-total": "Total",
                    "total": "Total"
                }
            };
            easyinvoice.createInvoice(data, function(result) {
                easyinvoice.download('myInvoice.pdf', result.pdf);
            });
        })
    })
}
