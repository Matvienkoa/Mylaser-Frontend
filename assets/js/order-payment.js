const products = JSON.parse(localStorage.getItem('currentCart'));
const token = localStorage.getItem('customer');
const tableBody = document.getElementById('table-body');
const tableWrapper = document.getElementById('tableWrapper');
const productPriceBox = document.getElementById('product-price');
const deliveryChoice = localStorage.getItem('deliveryChoice');
const deliveryPrice = document.getElementById('delivery-price');
const totalPrice = document.getElementById('total-price');
let productPrice = 0;
let price = 0;
const validate = document.getElementById('validate');
const CGV = document.getElementById('CGV');

// Show products details in table
if(products) {
    products.forEach(product => {
        fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product}`)
        .then((res) => res.json())
        .then((product) => {
            const productRow = document.createElement('tr');
            productRow.className = "productRow";
            productRow.innerHTML =
            '<td class="img">' + JSON.parse(product.svg) + '</td>' +
            '<td>' + (product.width).toFixed(2) + ' X ' + (product.height).toFixed(2) +'</td>' + 
            '<td>' + product.steel + '</td>' +
            '<td>' + product.thickness + ' mm</td>' +
            '<td>' + product.quantity + '</td>' +
            '<td>' + product.price + ' €</td>';
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

            // Show price for client only
            productPrice = productPrice + product.price;
            if(products.length === 1) {
                productPriceBox.innerHTML = products.length + ' Article : ' + productPrice + '€';
                localStorage.setItem('currentPrice', productPrice);
                calculTotalPrice();
            } else {
                productPriceBox.innerHTML = products.length + ' Articles : ' + productPrice + '€';
                localStorage.setItem('currentPrice', productPrice);
                calculTotalPrice();
            };
        });
    });
};

function calculTotalPrice() {
    switch(deliveryChoice) {
        case 'chronopost' :
            deliveryPrice.innerHTML = '6,90 €';
            totalPrice.innerHTML = parseFloat(localStorage.getItem('currentPrice')) + 6.90 + ' €';
        break;
        case 'colissimo' :
            deliveryPrice.innerHTML = '4,90 €';
            totalPrice.innerHTML = parseFloat(localStorage.getItem('currentPrice')) + 4.90 + ' €';
        break;
        case 'ups' :
            deliveryPrice.innerHTML = '8,90 €';
            totalPrice.innerHTML = parseFloat(localStorage.getItem('currentPrice')) + 8.90 + ' €';
        break;
    }
}

validate.addEventListener('click', () => {
    if(CGV.checked === true) {
        test();
    } else {
        document.getElementById('no-checked').classList.replace('hidden', 'visible');
    }
});

function checkAdresses() {
    return new Promise(resolve => {
        const decodedToken = jwt_decode(token);
        fetch(`http://localhost:3000/api/mylaser/user/${decodedToken.userId}`)
        .then((res) => res.json())
        .then((user) => {
            if(user.billingAdresses.length === 1 && (deliveryChoice === 'chronopost' || deliveryChoice === 'colissimo' || deliveryChoice === 'ups')) {
                console.log(user);
                const da = user.deliveryAdresses[0];
                const ba = user.billingAdresses[0];
                const order = {
                    userId: user.id,
                    shipping: deliveryChoice,
                    shippingPrice: deliveryChoice,
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
            if(user.billingAdresses.length === 0 && (deliveryChoice === 'chronopost' || deliveryChoice === 'colissimo' || deliveryChoice === 'ups')) {
                console.log(user);
                const da = user.deliveryAdresses[0];
                const order = {
                    userId: user.id,
                    shipping: deliveryChoice,
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
                "Content-Type": "application/json; charset=utf-8"
            },
        };
        fetch("http://localhost:3000/api/mylaser/order", myInit)
        .then((res) => res.json())
        .then((order) => {
            products.forEach(product => {
                fetch(`http://localhost:3000/api/mylaser/dxf/quote/${product}`)
                .then((res) => res.json())
                .then((quote) => {
                    const orderDetails = {
                        orderId: order.id,
                        quote: quote.id,
                        price: quote.price
                    };
                    console.log(orderDetails);

                    const myInit = {
                        method: "POST",
                        body: JSON.stringify(orderDetails),
                        headers: {
                            "Content-Type": "application/json; charset=utf-8"
                        },
                    };
                    fetch("http://localhost:3000/api/mylaser/orderdetails", myInit)
                    .then((res) => res.json())
                    .then((orderdetails) => {
                        console.log(orderdetails);
                        price = price + orderDetails.price;
                        const edit = {
                            price: price
                        };
                        const myInitPrice = {
                            method: "PUT",
                            body: JSON.stringify(edit),
                            headers: {
                                "Content-Type": "application/json; charset=utf-8"
                            },
                        };
                        fetch(`http://localhost:3000/api/mylaser/order/${order.id}/price`, myInitPrice)
                        .then((res) => res.json())
                        .then((order) => {
                            resolve(order)
                        })
                    });
                });
            })
        })
    })
};


 async function test() {
    const result = await checkAdresses();
    const result2 = await sendOrder(result);
    const infosOrder = {
        number: result2.number,
        price: result2.price
    }
    const myInit4 = {
        method: "POST",
        body: JSON.stringify(infosOrder),
        headers: {
            "Content-Type": "application/json; charset=utf-8"
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





