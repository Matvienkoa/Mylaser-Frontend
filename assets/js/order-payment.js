const cart = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const tableBody = document.getElementById('table-body');
const tableWrapper = document.getElementById('tableWrapper');
const productPriceBox = document.getElementById('product-price');
const deliveryPrice = document.getElementById('delivery-price');
const totalPrice = document.getElementById('total-price');
const validate = document.getElementById('validate');
const CGV = document.getElementById('CGV');

// Show products details in table
if(cart) {
    fetch(`http://localhost:3000/api/mylaser/cart/${cart}`)
    .then((res) => res.json())
    .then((cartNumber) => {
        console.log(cartNumber)
        cartNumber.quotes.forEach(product => {
            fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product.id}`)
            .then((res) => res.json())
            .then((product) => {
                const productRow = document.createElement('tr');
                productRow.className = "productRow";
                productRow.innerHTML =
                '<td class="img">' + JSON.parse(product.svg) + '</td>' +
                '<td>' + (product.width).toFixed(2) + ' X ' + (product.height).toFixed(2) +' mm</td>' + 
                '<td>' + product.steel + '</td>' +
                '<td>' + product.thickness + ' mm</td>' +
                '<td>' + product.quantity + '</td>' +
                '<td nowrap="nowrap">' + ((product.price/100)*1.2).toFixed(2) + ' €</td>';
                tableBody.appendChild(productRow);

                let paths = document.querySelectorAll('path');
                paths.forEach(path => {
                    path.removeAttribute('style');
                    path.setAttribute('style', 'stroke:white;stroke-width:1');
                });
                let circles = document.querySelectorAll('circle');
                circles.forEach(circle => {
                    circle.removeAttribute('style');
                    circle.setAttribute('style', 'stroke:white;stroke-width:1');
                });
                let lines = document.querySelectorAll('line');
                lines.forEach(line => {
                    line.removeAttribute('style');
                    line.setAttribute('style', 'stroke:white;stroke-width:1');
                });
                let svgs = document.querySelectorAll('svg');
                svgs.forEach(svg => {
                    svg.removeAttribute('width');
                    svg.setAttribute('width', '100');
                    svg.removeAttribute('height');
                    svg.setAttribute('height', '100');
                })
            })
        });
        productPriceBox.innerHTML = ((cartNumber.price/100)*1.2).toFixed(2) + ' €';
        deliveryPrice.innerHTML = (cartNumber.operatorPriceTTC/100).toFixed(2) + ' €';
        totalPrice.innerHTML = ((cartNumber.price/100)*1.2 + (cartNumber.operatorPriceTTC/100)).toFixed(2) + ' €';
    });
};

validate.addEventListener('click', () => {
    if(CGV.checked === true) {
        test();
    } else {
        document.getElementById('no-checked').classList.remove('hidden');
    }
});

function checkAdresses() {
    return new Promise(resolve => {
        const decodedToken = jwt_decode(token);
        fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`, {headers: {"Authorization": 'Bearer ' + token}})
        .then((res) => res.json())
        .then((user) => {
            if(user.billingAdresses.length === 1) {
                const da = user.deliveryAdresses[0];
                const ba = user.billingAdresses[0];
                const order = {
                    email: user.email,
                    userId: user.id,
                    daFN: da.firstName,
                    daLN: da.lastName,
                    daPhone: da.phone,
                    daLine1: da.line1,
                    daLine2: da.line2,
                    daCity: da.city,
                    daPC: da.postalCode,
                    daCountry: da.country,
                    baFN: ba.firstName,
                    baLN: ba.lastName,
                    baPhone: ba.phone,
                    baLine1: ba.line1,
                    baLine2: ba.line2,
                    baCity: ba.city,
                    baPC: ba.postalCode,
                    baCountry: ba.country
                };
                resolve(order)
            }
            if(user.billingAdresses.length === 0) {
                const da = user.deliveryAdresses[0];
                const order = {
                    email: user.email,
                    userId: user.id,
                    daFN: da.firstName,
                    daLN: da.lastName,
                    daPhone: da.phone,
                    daLine1: da.line1,
                    daLine2: da.line2,
                    daCity: da.city,
                    daPC: da.postalCode,
                    daCountry: da.country,
                    baFN: da.firstName,
                    baLN: da.lastName,
                    baPhone: da.phone,
                    baLine1: da.line1,
                    baLine2: da.line2,
                    baCity: da.city,
                    baPC: da.postalCode,
                    baCountry: da.country
                };
                resolve(order)
            };
        });
    })
};

function sendOrder(order) {
    return new Promise(resolve => {
        const myInit = {
            method: "POST",
            body: JSON.stringify(order),
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": 'Bearer ' + token,
            },
        };
        fetch("http://localhost:3000/api/mylaser/order", myInit)
        .then((res) => res.json())
        .then((order) => {
            fetch(`http://localhost:3000/api/mylaser/cart/${cart}`)
            .then((res) => res.json())
            .then((cartNumber) => {
                const price = cartNumber.price;
                const operatorService = cartNumber.operatorService;
                const operatorCode = cartNumber.operatorCode;
                const operatorLabel = cartNumber.operatorLabel;
                const operatorPriceHT = cartNumber.operatorPriceHT;
                const operatorPriceTTC = cartNumber.operatorPriceTTC;
                const relayCode = cartNumber.relayCode;
                const shippingType = cartNumber.shippingType;
                const length = cartNumber.length;
                const width = cartNumber.width;
                const height = cartNumber.height;
                const weight = cartNumber.weight;
                const edit = {
                    price: price,
                    operatorService: operatorService,
                    operatorCode: operatorCode,
                    operatorLabel: operatorLabel,
                    relayCode: relayCode,
                    shippingType: shippingType,
                    operatorPriceHT: operatorPriceHT,
                    operatorPriceTTC: operatorPriceTTC,
                    length: length,
                    width: width,
                    height: height,
                    weight: weight
                };
                const myInitPrice = {
                    method: "PUT",
                    body: JSON.stringify(edit),
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                        "Authorization": 'Bearer ' + token,
                    },
                };
                fetch(`http://localhost:3000/api/mylaser/order/${order.id}/price`, myInitPrice)
                .then((res) => res.json())
                .then((order) => {
                    cartNumber.quotes.forEach(product => {
                        fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product.id}`)
                        .then((res) => res.json())
                        .then((quote) => {
                            const orderDetails = {
                                orderId: order.id,
                                quote: quote.id,
                                price: quote.price
                            };
                            const myInit = {
                                method: "POST",
                                body: JSON.stringify(orderDetails),
                                headers: {
                                    "Content-Type": "application/json; charset=utf-8",
                                    "Authorization": 'Bearer ' + token,
                                },
                            };
                            fetch("http://localhost:3000/api/mylaser/orderdetails", myInit)
                            .then((res) => res.json())
                            .then((orderdetails) => {
                                console.log(orderdetails)
                            });
                        });
                    })
                    resolve(order);
                })
            })
        })
    })
};


 async function test() {
    const result = await checkAdresses();
    const result2 = await sendOrder(result);

    console.log(result)
    console.log(result2)
    const infosOrder = {
        number: result2.number,
        price: result2.priceTTC
    }
    const myInit4 = {
        method: "POST",
        body: JSON.stringify(infosOrder),
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Authorization": 'Bearer ' + token,
        },
    };
    fetch("http://localhost:3000/api/mylaser/payment", myInit4)
    .then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    })
    .then(({ url }) => {
      window.location = url
    })
    .catch(e => {
      console.error(e.error)
    })    
}





